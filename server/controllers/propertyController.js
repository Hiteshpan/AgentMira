import User from "../models/user.js";

// 🔥 SAVE / UNSAVE PROPERTY
export const toggleSaveProperty = async (req, res) => {
  try {
    const userId = req.user._id;
    const propertyData = req.body;

    const user = await User.findById(userId);

    const existingIndex = user.savedProperties.findIndex(
      (p) => p.propertyId === String(propertyData.id),
    );

    if (existingIndex !== -1) {
      // 🔥 REMOVE
      user.savedProperties.splice(existingIndex, 1);
      await user.save();

      return res.json({
        success: true,
        saved: false,
        message: "Property removed",
      });
    }

    // 🔥 ADD (ONLY IF NOT EXIST)
    user.savedProperties.push({
      propertyId: String(propertyData.id),
      title: propertyData.title,
      price: propertyData.price,
      location: propertyData.location,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      size_sqft: propertyData.size_sqft,
      amenities: propertyData.amenities,
      image_url: propertyData.image_url,
    });

    await user.save();

    res.json({
      success: true,
      saved: true,
      message: "Property saved",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const search = req.query.search?.toLowerCase() || "";

    let filteredProperties = user.savedProperties;

    if (search) {
      filteredProperties = user.savedProperties.filter(
        (property) =>
          property.title?.toLowerCase().includes(search) ||
          property.location?.toLowerCase().includes(search) ||
          property.amenities?.some((a) => a.toLowerCase().includes(search)),
      );
    }

    res.json({
      success: true,
      properties: filteredProperties,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
