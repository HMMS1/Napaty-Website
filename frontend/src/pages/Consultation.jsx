import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  createConsultationRequest,
  fetchExpertRequests,
  fetchExperts,
  fetchMyRequests,
  updateRequestStatus,
  cancelConsultationRequest,
} from "../api/consultation";

import "../style/Consultation.css";

const timeSlots = [
  "9:00 ص - 10:00 ص",
  "10:00 ص - 11:00 ص",
  "11:00 ص - 12:00 م",
  "1:00 م - 2:00 م",
  "2:00 م - 3:00 م",
  "3:00 م - 4:00 م",
];

const formatDateTime = (value, language = "ar") => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRequestTime = (req) =>
  req.created_at ||
  req.createdAt ||
  req.timestamp ||
  req.sent_at ||
  req.time ||
  req.created ||
  null;

const ChatBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="chat-notification-badge" aria-label={`${count} رسالة جديدة`}>
      {count > 99 ? "99+" : count}
    </span>
  );
};

const ChatButton = ({ onClick, disabled, language = "ar", unreadCount = 0 }) => {
  const isArabic = language === "ar";
  return (
    <button onClick={onClick} disabled={disabled} className="btn-chat">
      <span className="btn-chat-inner">
        💬 {isArabic ? "فتح الشات" : "Open Chat"}
        <ChatBadge count={unreadCount} />
      </span>
    </button>
  );
};

function Consultation({ language = "ar" }) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  // ✅ التعديل الأساسي: قراءة التوكن مباشرة في كل render مش مرة واحدة
  const token =
    localStorage.getItem("access") || localStorage.getItem("token");

  const userType = (
    localStorage.getItem("user_type") || "user"
  ).toString().toLowerCase();

  const hiddenRequestsStorageKey = `hidden_consultation_requests_${userType}`;

  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);
  const [expertsError, setExpertsError] = useState("");

  const [selectedExpert, setSelectedExpert] = useState(null);
  const [consultationTime, setConsultationTime] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const [myReqs, setMyReqs] = useState([]);
  const [myReqLoading, setMyReqLoading] = useState(false);
  const [myReqError, setMyReqError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxType, setMessageBoxType] = useState("success");
  const [messageBoxTitle, setMessageBoxTitle] = useState("");
  const [messageBoxText, setMessageBoxText] = useState("");
  const [messageBoxAction, setMessageBoxAction] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const getHiddenRequests = useCallback(() => {
    try {
      const raw = localStorage.getItem(hiddenRequestsStorageKey);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [hiddenRequestsStorageKey]);

  const saveHiddenRequest = useCallback(
    (id) => {
      const current = getHiddenRequests();
      if (!current.includes(id)) {
        localStorage.setItem(
          hiddenRequestsStorageKey,
          JSON.stringify([...current, id])
        );
      }
    },
    [getHiddenRequests, hiddenRequestsStorageKey]
  );

  const openMessageBox = (type, title, text = "", action = null) => {
    setMessageBoxType(type);
    setMessageBoxTitle(title);
    setMessageBoxText(text);
    setMessageBoxAction(() => action);
    setShowMessageBox(true);
  };

  const closeMessageBox = () => {
    setShowMessageBox(false);
    setMessageBoxAction(null);
  };

  const openDeleteConfirm = (req, source) => {
    setRequestToDelete({ ...req, source });
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setRequestToDelete(null);
  };

  const handleDeleteRequest = useCallback(() => {
    if (!requestToDelete) return;
    const { id, source } = requestToDelete;
    if (source === "user") {
      setMyReqs((prev) => prev.filter((r) => r.id !== id));
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
    saveHiddenRequest(id);
    closeDeleteConfirm();
    openMessageBox(
      "success",
      isArabic ? "تم حذف المحادثة بنجاح" : "The chat was removed successfully"
    );
  }, [requestToDelete, saveHiddenRequest, isArabic]);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (!token || userType !== "user") return;
    (async () => {
      try {
        setExpertsLoading(true);
        setExpertsError("");
        const data = await fetchExperts();
        setExperts(Array.isArray(data) ? data : data?.results || []);
      } catch (e) {
        setExpertsError(
          isArabic ? "حصل خطأ في تحميل الخبراء" : "Error loading experts"
        );
        console.error(e);
      } finally {
        setExpertsLoading(false);
      }
    })();
  }, [token, userType, isArabic]);

  const loadMyRequests = useCallback(async () => {
    try {
      setMyReqLoading(true);
      setMyReqError("");
      const data = await fetchMyRequests();
      const arr = Array.isArray(data) ? data : data?.results || [];
      const hiddenIds = getHiddenRequests();
      setMyReqs(arr.filter((item) => !hiddenIds.includes(item.id)));
    } catch (e) {
      setMyReqError(
        isArabic ? "حصل خطأ في تحميل طلباتك" : "Error loading your requests"
      );
      console.error(e);
    } finally {
      setMyReqLoading(false);
    }
  }, [getHiddenRequests, isArabic]);

  const loadExpertRequests = useCallback(async () => {
    try {
      setReqLoading(true);
      setReqError("");
      const data = await fetchExpertRequests();
      const arr = Array.isArray(data) ? data : data?.results || [];
      const hiddenIds = getHiddenRequests();
      setRequests(arr.filter((item) => !hiddenIds.includes(item.id)));
    } catch (e) {
      setReqError(
        isArabic ? "حصل خطأ في تحميل الطلبات" : "Error loading requests"
      );
      console.error(e);
    } finally {
      setReqLoading(false);
    }
  }, [getHiddenRequests, isArabic]);

  useEffect(() => {
    if (!token || userType !== "user") return;
    loadMyRequests();
    const t = setInterval(() => {
      if (document.hidden) return;
      loadMyRequests();
    }, 10000);
    return () => clearInterval(t);
  }, [token, userType, loadMyRequests]);

  useEffect(() => {
    if (!token || userType !== "expert") return;
    loadExpertRequests();
    const t = setInterval(() => {
      if (document.hidden) return;
      loadExpertRequests();
    }, 10000);
    return () => clearInterval(t);
  }, [token, userType, loadExpertRequests]);

  if (!token) return null;

  const handleOpenChat = (requestId) => {
    navigate(`/chat/${requestId}`);
  };

  const handleCreateRequest = async () => {
    if (!selectedExpert || !consultationTime) {
      openMessageBox(
        "warning",
        isArabic ? "بيانات ناقصة" : "Missing Information",
        isArabic
          ? "يرجى اختيار خبير وميعاد الجلسة"
          : "Please choose an expert and session time"
      );
      return;
    }
    try {
      setCreating(true);
      await createConsultationRequest({
        expert_id: selectedExpert.id,
        time_slot: consultationTime,
        message: message || "",
      });
      openMessageBox(
        "success",
        isArabic
          ? "تم إرسال طلب الاستشارة بنجاح"
          : "Consultation request sent successfully"
      );
      setSelectedExpert(null);
      setConsultationTime("");
      setMessage("");
      await loadMyRequests();
    } catch (e) {
      openMessageBox(
        "error",
        isArabic
          ? "حصل خطأ أثناء إرسال الطلب"
          : "An error occurred while sending the request"
      );
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      setCancellingId(id);
      await cancelConsultationRequest(id);
      setMyReqs((prev) => prev.filter((r) => r.id !== id));
      openMessageBox(
        "success",
        isArabic ? "تم إلغاء الطلب بنجاح" : "The request was cancelled successfully"
      );
    } catch (e) {
      openMessageBox(
        "error",
        isArabic
          ? "حصل خطأ أثناء إلغاء الطلب"
          : "An error occurred while cancelling the request"
      );
      console.error(e);
    } finally {
      setCancellingId(null);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status:
                  status === "accept"
                    ? "accepted"
                    : status === "reject"
                    ? "rejected"
                    : status,
              }
            : r
        )
      );
      openMessageBox(
        "success",
        status === "accept" || status === "accepted"
          ? isArabic
            ? "تم قبول الطلب بنجاح"
            : "The request has been accepted successfully"
          : isArabic
          ? "تم رفض الطلب بنجاح"
          : "The request has been rejected successfully"
      );
    } catch (e) {
      openMessageBox(
        "error",
        isArabic
          ? "حصل خطأ أثناء تحديث الحالة"
          : "An error occurred while updating the status"
      );
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const MessageBox = () => {
    if (!showMessageBox) return null;
    const icon =
      messageBoxType === "success"
        ? "fas fa-check-circle"
        : messageBoxType === "warning"
        ? "fas fa-exclamation-triangle"
        : "fas fa-times-circle";
    const mainColor =
      messageBoxType === "success"
        ? "#198754"
        : messageBoxType === "warning"
        ? "#f59e0b"
        : "#dc2626";
    return (
      <div className="consultation-overlay">
        <div className="consultation-message-box">
          <div className={`consultation-message-icon ${messageBoxType}`}>
            <i className={icon}></i>
          </div>
          <h3 className="consultation-message-title" style={{ color: mainColor }}>
            {messageBoxTitle}
          </h3>
          {messageBoxText && (
            <p className="consultation-message-text">{messageBoxText}</p>
          )}
          <button
            onClick={() => {
              closeMessageBox();
              if (typeof messageBoxAction === "function") messageBoxAction();
            }}
            className="consultation-primary-btn"
            style={{ background: mainColor, boxShadow: `0 12px 24px ${mainColor}33` }}
          >
            {isArabic ? "حسناً" : "OK"}
          </button>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    return (
      <div className="consultation-overlay">
        <div className="consultation-message-box">
          <div className="consultation-message-icon error">
            <i className="fas fa-trash-alt"></i>
          </div>
          <h3 className="consultation-message-title" style={{ color: "#dc2626" }}>
            {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
          </h3>
          <p className="consultation-message-text">
            {isArabic
              ? "هل أنت متأكد أنك تريد حذف هذه المحادثة"
              : "Are you sure you want to remove this chat?"}
          </p>
          <div className="delete-modal-buttons">
            <button
              onClick={handleDeleteRequest}
              className="consultation-primary-btn"
              style={{ background: "#dc2626", boxShadow: "0 12px 24px rgba(220,38,38,0.22)" }}
            >
              {isArabic ? "نعم، احذف" : "Yes, Delete"}
            </button>
            <button onClick={closeDeleteConfirm} className="consultation-secondary-btn">
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteButton = ({ onClick }) => (
    <button onClick={onClick} className="btn-delete-chat">
      🗑️ {isArabic ? "حذف الشات" : "Delete Chat"}
    </button>
  );

  const CancelButton = ({ onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="btn-cancel-request">
      {disabled
        ? isArabic ? "جاري الإلغاء..." : "Cancelling..."
        : isArabic ? "إلغاء الطلب" : "Cancel Request"}
    </button>
  );

  if (userType === "expert") {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>{isArabic ? "طلبات الاستشارات" : "Consultation Requests"}</h2>
        </div>
        <div className="consultation-container">
          {reqLoading && (
            <p>{isArabic ? "جاري تحميل الطلبات..." : "Loading requests..."}</p>
          )}
          {reqError && <p style={{ color: "red" }}>{reqError}</p>}
          {!reqLoading && !reqError && requests.length === 0 && (
            <p>{isArabic ? "لا توجد طلبات حالياً" : "No requests at the moment"}</p>
          )}
          {!reqLoading &&
            !reqError &&
            requests.map((req) => {
              const reqTime = formatDateTime(getRequestTime(req), language);
              const userName =
                req.user_name ||
                req.user?.full_name ||
                req.user?.username ||
                (isArabic ? "مستخدم" : "User");
              const timeSlot = req.time_slot || "-";
              const unread = Number(req.unread_count || 0);
              return (
                <div key={req.id} className="consultation-request-card">
                  <h4>{isArabic ? "طلب من:" : "Request from:"} {userName}</h4>
                  <p><b>{isArabic ? "وقت الجلسة:" : "Session Time:"}</b> {timeSlot}</p>
                  {reqTime && (
                    <p className="muted">
                      <b>{isArabic ? "وقت الإرسال:" : "Sent At:"}</b> {reqTime}
                    </p>
                  )}
                  {req.message && (
                    <p><b>{isArabic ? "الرسالة:" : "Message:"}</b> {req.message}</p>
                  )}
                  {req.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        disabled={updatingId === req.id}
                        onClick={() => handleUpdateStatus(req.id, "accept")}
                        className="btn-accept"
                      >
                        {updatingId === req.id ? "..." : isArabic ? "قبول" : "Accept"}
                      </button>
                      <button
                        disabled={updatingId === req.id}
                        onClick={() => handleUpdateStatus(req.id, "reject")}
                        className="btn-reject"
                      >
                        {updatingId === req.id ? "..." : isArabic ? "رفض" : "Reject"}
                      </button>
                      <DeleteButton onClick={() => openDeleteConfirm(req, "expert")} />
                    </div>
                  )}
                  {req.status === "accepted" && (
                    <div className="action-buttons">
                      <ChatButton
                        language={language}
                        unreadCount={unread}
                        onClick={() => handleOpenChat(req.id)}
                      />
                      <DeleteButton onClick={() => openDeleteConfirm(req, "expert")} />
                    </div>
                  )}
                  {req.status !== "pending" && req.status !== "accepted" && (
                    <div className="action-buttons">
                      <p className="faded">
                        {isArabic ? "تم إنهاء هذا الطلب" : "This request has been processed"}
                      </p>
                      <DeleteButton onClick={() => openDeleteConfirm(req, "expert")} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <MessageBox />
        <DeleteConfirmModal />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isArabic ? "استشارة مع خبير" : "Consultation with an Expert"}</h2>
        <p>
          {isArabic
            ? "اختر خبير وحدد ميعاد الجلسة ثم انتظر موافقة الخبير"
            : "Choose an expert, select the session time, then wait for the expert's approval"}
        </p>
      </div>

      <div className="consultation-container">
        <div className="my-requests-card">
          <h3>{isArabic ? "طلباتك" : "Your Requests"}</h3>
          {myReqLoading && (
            <p>{isArabic ? "جاري تحميل طلباتك..." : "Loading your requests..."}</p>
          )}
          {myReqError && <p style={{ color: "red" }}>{myReqError}</p>}
          {!myReqLoading && !myReqError && myReqs.length === 0 ? (
            <p className="faded">
              {isArabic ? "مفيش طلبات لحد دلوقتي" : "No requests yet"}
            </p>
          ) : (
            myReqs.map((req) => {
              const reqTime = formatDateTime(getRequestTime(req), language);
              const expertName =
                req.expert_name ||
                req.expert?.full_name ||
                req.expert?.username ||
                (isArabic ? "خبير" : "Expert");
              const unread = Number(req.unread_count || 0);
              return (
                <div key={req.id} className="request-item">
                  <p><b>{isArabic ? "الخبير:" : "Expert:"}</b> {expertName}</p>
                  {req.time_slot && (
                    <p><b>{isArabic ? "ميعاد الجلسة:" : "Session Time:"}</b> {req.time_slot}</p>
                  )}
                  {reqTime && (
                    <p className="muted">
                      <b>{isArabic ? "وقت الإرسال:" : "Sent At:"}</b> {reqTime}
                    </p>
                  )}
                  <div className="action-buttons">
                    {req.status === "accepted" ? (
                      <>
                        <ChatButton
                          language={language}
                          unreadCount={unread}
                          onClick={() => handleOpenChat(req.id)}
                        />
                        <DeleteButton onClick={() => openDeleteConfirm(req, "user")} />
                      </>
                    ) : req.status === "pending" ? (
                      <>
                        <p className="faded">
                          {isArabic ? "بانتظار موافقة الخبير" : "Waiting for the expert's approval"}
                        </p>
                        <CancelButton
                          onClick={() => handleCancelRequest(req.id)}
                          disabled={cancellingId === req.id}
                        />
                      </>
                    ) : (
                      <>
                        <p className="faded">
                          {isArabic ? "تم رفض الطلب" : "The request was rejected"}
                        </p>
                        <DeleteButton onClick={() => openDeleteConfirm(req, "user")} />
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {expertsLoading && (
          <p>{isArabic ? "جاري تحميل الخبراء..." : "Loading experts..."}</p>
        )}
        {expertsError && <p style={{ color: "red" }}>{expertsError}</p>}

        {!expertsLoading && !expertsError && !selectedExpert && (
          <div className="experts-selection">
            <h3>{isArabic ? "الخبراء المتاحون" : "Available Experts"}</h3>
            <div className="experts-grid">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="expert-card"
                  onClick={() => setSelectedExpert(expert)}
                >
                  <div className="expert-info">
                    <h4>{expert.full_name || expert.name}</h4>
                    <p>{expert.specialization || (isArabic ? "خبير زراعي" : "Agricultural Expert")}</p>
                    <p>{isArabic ? "خبرة:" : "Experience:"} {expert.experience_years ?? expert.experience ?? "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!expertsLoading && !expertsError && selectedExpert && (
          <div className="booking-process">
            <h4>
              {isArabic ? "الخبير المختار:" : "Selected Expert:"}{" "}
              {selectedExpert.full_name || selectedExpert.name}
            </h4>
            <div className="time-selection">
              <h4>{isArabic ? "اختر وقت الجلسة" : "Choose Session Time"}</h4>
              <div className="time-slots">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot ${consultationTime === slot ? "selected" : ""}`}
                    onClick={() => setConsultationTime(slot)}
                    disabled={creating}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <h4>{isArabic ? "رسالة إضافية" : "Additional Message"}</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isArabic
                    ? "اكتب رسالة أو تفاصيل إضافية للخبير..."
                    : "Write a message or extra details for the expert..."
                }
                disabled={creating}
                className="consultation-textarea"
              />
            </div>
            <button
              onClick={handleCreateRequest}
              disabled={creating || !consultationTime}
              className="book-now-btn"
              style={{ marginTop: 14 }}
            >
              {creating
                ? isArabic ? "جاري إرسال الطلب..." : "Sending request..."
                : isArabic ? "إرسال طلب الاستشارة" : "Send Consultation Request"}
            </button>
            <button
              className="back-btn"
              onClick={() => {
                setSelectedExpert(null);
                setConsultationTime("");
                setMessage("");
              }}
              disabled={creating}
            >
              {isArabic ? "رجوع" : "Back"}
            </button>
          </div>
        )}
      </div>

      <MessageBox />
      <DeleteConfirmModal />
    </div>
  );
}

export default Consultation;
