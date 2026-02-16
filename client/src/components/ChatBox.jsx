import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import PropertyList from "./PropertyList";

const ChatBox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleSelectProperty = (property) => {
    setSelectedProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);

      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }

      return [...prev, property];
    });
  };

  const handleCompare = () => {
    if (selectedProperties.length < 2) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        type: "comparison_table",
        properties: selectedProperties,
        timestamp: Date.now(),
      },
    ]);

    setSelectedProperties([]);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!user) return toast("Login to send message");
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/text`,
        { chatId: selectedChat._id, prompt, isPublished },
        { headers: { Authorization: token } },
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Message */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-primary">
            {/* <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            /> */}
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="Agent Mira Logo"
                className="w-18 h-18"
              />
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-800 dark:text-white">
                  Agent Mira
                </span>
                <span className="text-xl text-purple-700 dark:text-purple-300">
                  Real Estate AI
                </span>
              </div>
            </div>
            <p className="mt-5 text-4xl sm:text-4xl text-center text-gray-400 dark:textwhite">
              Ask me anything about <span className="text-purple-700 dark:text-purple-300">Real-Estate</span>
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          // <Message key={index} message={message} />
          <Message
            key={index}
            message={message}
            selectedProperties={selectedProperties}
            onSelectProperty={handleSelectProperty}
          />
        ))}

        {/* Three Dots Loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {selectedProperties.length > 1 && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handleCompare}
            className="flex justify-center items-center p-2 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer"
          >
            Compare ({selectedProperties.length})
          </button>

          <button
            onClick={() => setSelectedProperties([])}
            className="px-4 py-2 border cursor-pointer border-gray-400 rounded-lg text-sm"
          >
            Reset
          </button>
        </div>
      )}

      {/* Prompt Input Box */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto gap-4 flex items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 flex rounded-md outline-none cursor-pointer hover:bg-gray-200 p-1 transition dark:bg-purple-800 dark:text-white dark:hover:bg-purple-900"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
        </select>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8 cursor-pointer"
            alt=""
          />
        </button>
      </form>

      {showCompare && (
        <PropertyList
          properties={selectedProperties}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};

export default ChatBox;
