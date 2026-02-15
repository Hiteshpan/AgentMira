import Chat from "../models/Chat.js";
import openai from "../configs/openai.js";
import { filterProperties } from "../services/propertyService.js";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // const extractionPrompt = `
    //   You are a real estate filter extractor.

    //   Extract filters from the following user query.

    //   Return ONLY valid JSON in this format:

    //   {
    //     "location": string | null,
    //     "maxPrice": number | null,
    //     "bedrooms": number | null,
    //     "bathrooms": number | null,
    //     "minSize": number | null,
    //     "amenities": string[] | []
    //   }

    //   If a field is not mentioned, return null or empty array.

    //   User Query: "${prompt}"
    //   `;

    const extractionPrompt = `
      You are a real estate assistant.
      
      Your job is to extract property search filters ONLY if the query is related to buying, renting, or searching for real estate.
      
      If the user query is NOT related to real estate, respond ONLY with this exact JSON:
      
      {
        "notRealEstate": true
      }
      
      Otherwise, extract filters and return ONLY valid JSON in this format:
      
      {
        "location": string | null,
        "maxPrice": number | null,
        "bedrooms": number | null,
        "bathrooms": number | null,
        "minSize": number | null,
        "amenities": string[] | []
      }
      
      If a field is not mentioned, return null or empty array.
      
      User Query: "${prompt}"
      `;

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: extractionPrompt }],
    });

    let filters = {};
    let reply = {};

    try {
      filters = JSON.parse(choices[0].message.content);
    } catch (err) {
      filters = {};
    }

    if (filters.notRealEstate) {
      reply = {
        role: "assistant",
        content:
          "I can only assist with real estate related queries like buying, renting, or searching for properties.",
        timestamp: Date.now(),
      };

      chat.messages.push(reply);
      await chat.save();

      return res.json({ success: true, reply });
    }

    // if (!filters.location) {
    //   const reply = {
    //     role: "assistant",
    //     content: "Which location are you looking for?",
    //     timestamp: Date.now(),
    //   };

    //   return res.json({ success: true, reply });
    // }

    const filteredProperties = filterProperties(filters);

    if (filteredProperties.length === 0) {
      reply = {
        role: "assistant",
        content:
          "No properties found matching your criteria. Try adjusting filters.",
        timestamp: Date.now(),
      };
    } else {
      reply = {
        role: "assistant",
        type: "property_cards",
        properties: filteredProperties,
        timestamp: Date.now(),
      };
    }

    console.log("choices:", choices);
    console.log("filters:", filters);

    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
