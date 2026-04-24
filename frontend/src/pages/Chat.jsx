import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSend, FiUser } from "react-icons/fi";
import {
  fetchMyRequests,
  fetchExpertRequests,
  fetchRequestMessages,
  sendRequestMessage,
} from "../api/consultation";
import { useChatNotifications } from "../hooks/useConsultationNotifications";
import "../style/Chat.css";

export default function Chat({ language = "ar" }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();
  const { requestId } = useParams();

  const token = useMemo(
    () => localStorage.getItem("access") || localStorage.getItem("token"),
    []
  );

  const userType = useMemo(() => {
    const t = localStorage.getItem("user_type") || "user";
    return String(t).toLowerCase().trim();
  }, []);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const myEmail = useMemo(
    () => (currentUser?.email || "").toLowerCase().trim(),
    [currentUser]
  );

  const myDisplayName = useMemo(
    () =>
      currentUser?.full_name ||
      currentUser?.name ||
      currentUser?.username ||
      (isArabic ? "حسابي" : "My Account"),
    [currentUser, isArabic]
  );

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const [requestInfo, setRequestInfo] = useState({
    userName: "",
    expertName: "",
  });

  const messagesContainerRef = useRef(null);
  const lastMessagesCountRef = useRef(0);

  const currentRequestList = useMemo(
    () => (requestId ? [{ id: requestId }] : []),
    [requestId]
  );

  const { markChatAsSeen } = useChatNotifications(currentRequestList);

  useEffect(() => {
    if (requestId && token) {
      markChatAsSeen(requestId);
    }
  }, [requestId, token, markChatAsSeen]);

  const playMessageSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(650, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.18
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
    } catch (e) {
      console.warn("Sound failed:", e);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  const extractSenderEmail = useCallback(
    (m) =>
      (
        m.sender_email ||
        m.sender?.email ||
        m.sender_username ||
        m.sender?.username ||
        m.sender_name ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim(),
    []
  );

  const isMine = useCallback(
    (m) => {
      if (!myEmail) return false;

      const senderEmail = extractSenderEmail(m);

      if (senderEmail && senderEmail.includes("@")) {
        return senderEmail === myEmail;
      }

      const myId = currentUser?.id;
      const senderId = m.sender_id || m.sender?.id;

      if (myId && senderId && Number(myId) === Number(senderId)) {
        return true;
      }

      return false;
    },
    [myEmail, currentUser, extractSenderEmail]
  );

  const extractNameFromMessage = useCallback(
    (m) =>
      m.sender_name ||
      m.sender?.full_name ||
      m.sender?.name ||
      m.sender?.username ||
      null,
    []
  );

  const getSenderTitle = useCallback(
    (m) => {
      if (isMine(m)) return myDisplayName;

      const extracted = extractNameFromMessage(m);
      if (extracted) return extracted;

      if (userType === "user") {
        return requestInfo.expertName || (isArabic ? "الخبير" : "Expert");
      }

      return requestInfo.userName || (isArabic ? "المستخدم" : "User");
    },
    [
      isMine,
      myDisplayName,
      extractNameFromMessage,
      userType,
      requestInfo,
      isArabic,
    ]
  );

  const getSenderRole = useCallback(
    (m) => {
      if (isMine(m)) return "me";
      if (userType === "user") return "expert";
      return "user";
    },
    [isMine, userType]
  );

  const getSenderRoleLabel = useCallback(
    (role) => {
      if (role === "me") return isArabic ? "أنت" : "You";
      if (role === "expert") return isArabic ? "خبير" : "Expert";
      return isArabic ? "مستخدم" : "User";
    },
    [isArabic]
  );

  const formatMessageTime = useCallback(
    (dateValue) => {
      if (!dateValue) return "";

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return String(dateValue).slice(11, 16);
      }

      return date.toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    [isArabic]
  );

  const loadRequestInfo = useCallback(async () => {
    try {
      const data =
        userType === "expert"
          ? await fetchExpertRequests()
          : await fetchMyRequests();

      const arr = Array.isArray(data) ? data : data?.results || [];
      const req = arr.find((x) => String(x.id) === String(requestId));

      if (!req) return;

      setRequestInfo({
        userName:
          req.user_name ||
          req.user?.full_name ||
          req.user?.username ||
          (isArabic ? "مستخدم" : "User"),
        expertName:
          req.expert_name ||
          req.expert?.full_name ||
          req.expert?.username ||
          (isArabic ? "خبير" : "Expert"),
      });
    } catch (e) {
      console.error("loadRequestInfo error:", e);
    }
  }, [userType, requestId, isArabic]);

  const loadMessages = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);

      const data = await fetchRequestMessages(requestId);
      const arr = Array.isArray(data) ? data : data?.results || [];

      const previousCount = lastMessagesCountRef.current;
      const newCount = arr.length;

      setMessages(arr);
      lastMessagesCountRef.current = newCount;

      if (previousCount && newCount > previousCount) {
        const lastMessage = arr[arr.length - 1];
        if (lastMessage && !isMine(lastMessage)) {
          playMessageSound();
        }
      }

      scrollToBottom();
      markChatAsSeen(requestId);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.detail || e?.response?.data || e.message;

      setErr(
        isArabic
          ? `مش قادر أجيب الرسائل (${status || "?"})\n${JSON.stringify(msg)}`
          : `Unable to load messages (${status || "?"})\n${JSON.stringify(msg)}`
      );

      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    requestId,
    isArabic,
    scrollToBottom,
    markChatAsSeen,
    isMine,
    playMessageSound,
  ]);

  const send = useCallback(async () => {
    if (!text.trim() || sending) return;

    try {
      setErr("");
      setSending(true);

      await sendRequestMessage(requestId, text.trim());

      playMessageSound();
      setText("");

      await loadMessages();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.detail || e?.response?.data || e.message;

      setErr(
        isArabic
          ? `مش قادر أرسل الرسالة (${status || "?"})\n${JSON.stringify(msg)}`
          : `Unable to send message (${status || "?"})\n${JSON.stringify(msg)}`
      );

      console.error(e);
    } finally {
      setSending(false);
    }
  }, [text, sending, requestId, loadMessages, isArabic, playMessageSound]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!requestId) return;

    loadRequestInfo();
    loadMessages();

    let timer = null;

    const startPolling = () => {
      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        if (!document.hidden) loadMessages();
      }, 8000);
    };

    startPolling();

    const onVisibilityChange = () => {
      if (!document.hidden) {
        loadMessages();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [token, requestId, navigate, loadRequestInfo, loadMessages]);

  if (!token) return null;

  return (
    <div className="page-container chat-page">
      <div className="page-header chat-page-header">
        <h2>{isArabic ? "المحادثة" : "Chat"}</h2>
      </div>

      <div className="consultation-container chat-container">
        {loading && messages.length === 0 && (
          <p className="chat-loading-text">
            {isArabic ? "جاري تحميل الرسائل..." : "Loading messages..."}
          </p>
        )}

        {err && <p className="chat-error-text">{err}</p>}

        <div className="chat-panel">
          <div className="chat-messages-wrapper" ref={messagesContainerRef}>
            {messages.length === 0 && !loading ? (
              <p className="chat-empty-text">
                {isArabic ? "لا توجد رسائل بعد" : "No messages yet"}
              </p>
            ) : (
              messages.map((m, i) => {
                const mine = isMine(m);
                const title = getSenderTitle(m);
                const role = getSenderRole(m);
                const roleLabel = getSenderRoleLabel(role);
                const body = m.message || m.text || m.content || "";

                return (
                  <div
                    key={m.id || i}
                    className={`chat-message-row ${mine ? "mine" : "other"}`}
                  >
                    <div
                      className={`chat-bubble ${
                        mine ? "mine" : "other"
                      } role-${role}`}
                    >
                      <div className="chat-sender-line">
                        <span className={`chat-sender-icon role-${role}`}>
                          <FiUser />
                        </span>

                        <span className="chat-sender-name">{title}</span>

                        <span className={`chat-sender-role role-${role}`}>
                          {roleLabel}
                        </span>
                      </div>

                      <div className="chat-bubble-body">{body}</div>

                      <div className="chat-message-footer">
                        <span className="chat-message-time">
                          {formatMessageTime(m.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="chat-compose-box">
            <input
              className="chat-compose-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isArabic ? "اكتب رسالتك هنا..." : "Type your message..."
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={sending}
            />

            <button
              className="chat-send-btn"
              onClick={send}
              disabled={sending || !text.trim()}
              type="button"
              title={isArabic ? "إرسال" : "Send"}
            >
              {sending ? (
                <span className="chat-send-loader"></span>
              ) : (
                <>
                  <FiSend />
                  <span>{isArabic ? "إرسال" : "Send"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}