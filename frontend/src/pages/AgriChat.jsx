import React, { useEffect, useRef, useState } from "react";
import {
  FaSeedling,
  FaPaperPlane,
  FaLeaf,
  FaRobot,
  FaUser,
  FaTrashAlt,
  FaComments,
} from "react-icons/fa";
import { MdAgriculture } from "react-icons/md";
import "../style/AgriChat.css";

const AgriChat = ({ language = "ar" }) => {
  const isArabic = language === "ar";
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 🔥 API URL
  const API = process.env.REACT_APP_API_URL;

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: isArabic
        ? "مرحبًا، أنا مساعدك الزراعي. اسألني عن المحاصيل، التربة، الري، التسميد، أو أمراض النبات."
        : "Hello, I am your agricultural assistant. Ask me about crops, soil, irrigation, fertilization, or plant diseases.",
      time: getCurrentTime(),
    },
  ]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  const quickQuestions = isArabic
    ? [
        "ما أفضل محصول للتربة الرملية؟",
        "كيف أعرف أن التربة تحتاج تسميد؟",
        "ما أعراض نقص النيتروجين في النبات؟",
        "كم مرة أروي محصول الطماطم؟",
      ]
    : [
        "What is the best crop for sandy soil?",
        "How do I know the soil needs fertilization?",
        "What are the symptoms of nitrogen deficiency?",
        "How often should I irrigate tomatoes?",
      ];

  const formatBotReply = (data) => {
    if (!data) {
      return isArabic
        ? "لم يصل رد من الخادم."
        : "No response was received from the server.";
    }

    if (typeof data.reply === "string" && data.reply.trim()) {
      return data.reply;
    }

    if (typeof data.response === "string" && data.response.trim()) {
      return data.response;
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data.answer === "string" && data.answer.trim()) {
      return data.answer;
    }

    if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
      return data.recommendations
        .map(
          (item, index) =>
            `${index + 1}. ${item.crop || item.name || "Crop"}${
              item.probability !== undefined ? ` - ${item.probability}%` : ""
            }`
        )
        .join("\n");
    }

    return isArabic
      ? "تم استلام الرد لكن بصيغة غير متوقعة."
      : "The response was received in an unexpected format.";
  };

  const sendMessage = async (customMessage = null) => {
    const textToSend = (customMessage || message).trim();
    if (!textToSend || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: getCurrentTime(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    setIsSending(true);

    try {
      const response = await fetch(`${API}/api/agri-chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            (isArabic
              ? "حدث خطأ أثناء الاتصال بالخادم."
              : "An error occurred while connecting to the server.")
        );
      }

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: formatBotReply(data),
        time: getCurrentTime(),
      };

      setChatMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        sender: "bot",
        text:
          error.message ||
          (isArabic
            ? "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى."
            : "An error occurred while sending the message. Please try again."),
        time: getCurrentTime(),
      };

      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 1,
        sender: "bot",
        text: isArabic
          ? "تم بدء محادثة جديدة. اسألني أي شيء متعلق بالزراعة."
          : "A new conversation has started. Ask me anything related to agriculture.",
        time: getCurrentTime(),
      },
    ]);
    setMessage("");
    setIsTyping(false);
    setIsSending(false);
  };

  return (
    <div className="agri-chat-page page-container">
      <div className="container">
        <div className="agri-chat-wrapper">
          <div className="agri-chat-header">
            <div className="agri-chat-header-icon">
              <MdAgriculture />
            </div>

            <div className="agri-chat-header-text">
              <h2>
                {isArabic
                  ? "المساعد الزراعي الذكي"
                  : "Smart Agricultural Assistant"}
              </h2>
              <p>
                {isArabic
                  ? "اسأل عن التربة، المحاصيل، الري، التسميد، والآفات الزراعية"
                  : "Ask about soil, crops, irrigation, fertilization, and agricultural pests"}
              </p>
            </div>

            <button
              type="button"
              className="agri-chat-clear-btn"
              onClick={clearChat}
            >
              <FaTrashAlt />
              <span>{isArabic ? "محادثة جديدة" : "New Chat"}</span>
            </button>
          </div>

          <div className="agri-chat-layout">
            <div className="agri-chat-sidebar">
              <div className="agri-chat-side-card">
                <div className="agri-chat-side-title">
                  <FaComments />
                  <h3>{isArabic ? "اقتراحات سريعة" : "Quick Prompts"}</h3>
                </div>

                <div className="agri-chat-quick-list">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      className="agri-chat-quick-btn"
                      onClick={() => sendMessage(question)}
                      disabled={isSending}
                    >
                      <FaLeaf />
                      <span>{question}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="agri-chat-side-card">
                <div className="agri-chat-side-title">
                  <FaSeedling />
                  <h3>{isArabic ? "مجال المساعد" : "Assistant Scope"}</h3>
                </div>

                <ul className="agri-chat-scope-list">
                  <li>{isArabic ? "اقتراح المحاصيل" : "Crop recommendations"}</li>
                  <li>{isArabic ? "تحليل التربة" : "Soil guidance"}</li>
                  <li>{isArabic ? "الري والتسميد" : "Irrigation and fertilization"}</li>
                  <li>{isArabic ? "أعراض الأمراض والآفات" : "Diseases and pests symptoms"}</li>
                </ul>
              </div>
            </div>

            <div className="agri-chat-main">
              <div className="agri-chat-box">
                <div className="agri-chat-messages" ref={messagesContainerRef}>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`agri-chat-message ${
                        msg.sender === "user" ? "user-message" : "bot-message"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <>
                          <div className="agri-chat-avatar">
                            <FaUser />
                          </div>

                          <div className="agri-chat-bubble-wrap">
                            <div className="agri-chat-bubble">
                              <p>{msg.text}</p>
                            </div>
                            <span className="agri-chat-time">{msg.time}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="agri-chat-bubble-wrap">
                            <div className="agri-chat-bubble">
                              <p>{msg.text}</p>
                            </div>
                            <span className="agri-chat-time">{msg.time}</span>
                          </div>

                          <div className="agri-chat-avatar">
                            <FaRobot />
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="agri-chat-message bot-message">
                      <div className="agri-chat-bubble-wrap">
                        <div className="agri-chat-bubble typing-bubble">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>

                      <div className="agri-chat-avatar">
                        <FaRobot />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef}></div>
                </div>

                <form className="agri-chat-input-area" onSubmit={handleSubmit}>
                  <div className="agri-chat-input-wrap">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isArabic
                          ? "اكتب سؤالك الزراعي هنا..."
                          : "Write your agriculture question here..."
                      }
                      className="agri-chat-input"
                      rows="1"
                      disabled={isSending}
                    />
                  </div>

                  <button
                    type="submit"
                    className="agri-chat-send-btn"
                    disabled={isSending || !message.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriChat;
