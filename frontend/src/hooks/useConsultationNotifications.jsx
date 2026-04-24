// src/hooks/useConsultationNotifications.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchMyRequests, fetchExpertRequests } from "../api/consultation";

function getSeenIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {}
}

function getDismissedChatCounts(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveDismissedChatCounts(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function useConsultationNotifications(userType) {
  const [badgeCount, setBadgeCount] = useState(0);
  const pollingRef = useRef(null);

  const type = (userType || "").toString().toLowerCase();
  const seenRequestsKey = `seen_requests_${type}`;
  const dismissedChatsKey = `dismissed_chat_unread_${type}`;

  const getRequestsData = useCallback(async () => {
    if (type === "expert") {
      const data = await fetchExpertRequests();
      return Array.isArray(data) ? data : data?.results || [];
    }

    if (type === "user") {
      const data = await fetchMyRequests();
      return Array.isArray(data) ? data : data?.results || [];
    }

    return [];
  }, [type]);

  const computeBadge = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");

      if (!token || (type !== "user" && type !== "expert")) {
        setBadgeCount(0);
        return;
      }

      const arr = await getRequestsData();

      let requestNotifications = [];

      if (type === "expert") {
        requestNotifications = arr.filter((r) => r.status === "pending");
      } else {
        requestNotifications = arr.filter((r) => r.status === "accepted");
      }

      const seenRequests = getSeenIds(seenRequestsKey);

      const requestCount = requestNotifications.filter(
        (r) => !seenRequests.has(r.id)
      ).length;

      const dismissedChatCounts = getDismissedChatCounts(dismissedChatsKey);

      const chatCount = arr.reduce((total, req) => {
        const currentUnread = Number(req.unread_count || 0);
        const dismissedUnread = Number(dismissedChatCounts[req.id] || 0);

        return total + Math.max(currentUnread - dismissedUnread, 0);
      }, 0);

      setBadgeCount(requestCount + chatCount);
    } catch {
      setBadgeCount(0);
    }
  }, [type, seenRequestsKey, dismissedChatsKey, getRequestsData]);

  useEffect(() => {
    if (type !== "user" && type !== "expert") {
      setBadgeCount(0);
      return;
    }

    computeBadge();

    pollingRef.current = setInterval(() => {
      if (!document.hidden) computeBadge();
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [type, computeBadge]);

  const markAllAsSeen = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");

      if (!token || (type !== "user" && type !== "expert")) return;

      const arr = await getRequestsData();

      let requestNotifications = [];

      if (type === "expert") {
        requestNotifications = arr.filter((r) => r.status === "pending");
      } else {
        requestNotifications = arr.filter((r) => r.status === "accepted");
      }

      const seenRequests = getSeenIds(seenRequestsKey);
      requestNotifications.forEach((r) => seenRequests.add(r.id));
      saveSeenIds(seenRequestsKey, seenRequests);

      const dismissedChatCounts = getDismissedChatCounts(dismissedChatsKey);

      arr.forEach((req) => {
        const unread = Number(req.unread_count || 0);

        if (unread > 0) {
          dismissedChatCounts[req.id] = unread;
        }
      });

      saveDismissedChatCounts(dismissedChatsKey, dismissedChatCounts);

      setBadgeCount(0);
    } catch {}
  }, [type, seenRequestsKey, dismissedChatsKey, getRequestsData]);

  return {
    badgeCount,
    markAllAsSeen,
    refresh: computeBadge,
  };
}

export function useChatNotifications() {
  const [chatUnread] = useState({});

  const markChatAsSeen = useCallback(() => {
    return;
  }, []);

  return { chatUnread, markChatAsSeen };
}