// src/pages/Header.js
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaFlask,
  FaShoppingCart,
  FaComments,
  FaCalendarAlt,
  FaSignOutAlt,
  FaHome,
  FaChevronDown,
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { useConsultationNotifications } from "../hooks/useConsultationNotifications";
import "../style/Header.css";

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const NotificationBadge = memo(({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span className="nav-notification-badge" aria-label={`${count} إشعار`}>
      {count > 99 ? "99+" : count}
    </span>
  );
});

NotificationBadge.displayName = "NotificationBadge";

const Header = ({ user, setUser, language = "ar", setLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isArabic = language === "ar";

  const storedUser = useMemo(() => safeParseUser(), [user]);

  const displayName =
    user?.full_name ||
    user?.name ||
    storedUser?.full_name ||
    storedUser?.name ||
    (isArabic ? "المستخدم" : "User");

  const isEnglishName = useMemo(
    () => /^[A-Za-z\s]+$/.test(displayName),
    [displayName]
  );

  const greeting = isArabic ? (isEnglishName ? "Hi" : "مرحباً") : "Hi";

  const isLoggedIn = useMemo(
    () =>
      !!user ||
      !!localStorage.getItem("access") ||
      !!localStorage.getItem("user"),
    [user]
  );

  const userType = useMemo(
    () => (localStorage.getItem("user_type") || "user").toString().toLowerCase(),
    [user]
  );

  const { badgeCount, markAllAsSeen } = useConsultationNotifications(
    isLoggedIn ? userType : null
  );

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    ["access", "refresh", "user_type", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );

    setShowMenu(false);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate, setUser]);

  const handleProtectedNavigation = useCallback(
    async (e, path, requiresAuth = false) => {
      if (requiresAuth && !isLoggedIn) {
        e.preventDefault();
        navigate("/login", { replace: true });
        return;
      }

      if (path === "/consultation" && isLoggedIn) {
        await markAllAsSeen();
      }
    },
    [isLoggedIn, markAllAsSeen, navigate]
  );

  const toggleLanguage = useCallback(() => {
    if (!setLanguage) return;

    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  }, [language, setLanguage]);

  const navItems = useMemo(
    () => [
      {
        path: "/welcome",
        icon: <FaHome />,
        label: isArabic ? "الرئيسية" : "Home",
        requiresAuth: false,
      },
      {
        path: "/diagnosis",
        icon: <MdLocalHospital />,
        label: isArabic ? "تشخيص الأمراض" : "Disease Diagnosis",
        requiresAuth: false,
      },
      {
        path: "/soil-analysis",
        icon: <FaFlask />,
        label: isArabic ? "انواع التربة" : "Soil Types",
        requiresAuth: false,
      },
      {
        path: "/plants-seasons",
        icon: <FaCalendarAlt />,
        label: isArabic ? "النباتات والفصول" : "Plants & Seasons",
        requiresAuth: false,
      },
      {
        path: "/store",
        icon: <FaShoppingCart />,
        label: isArabic ? "المتجر" : "Store",
        requiresAuth: true,
      },
      {
        path: "/consultation",
        icon: <FaComments />,
        label: isArabic ? "استشارة الخبراء" : "Expert Consultation",
        requiresAuth: true,
        showBadge: isLoggedIn,
      },
    ],
    [isArabic, isLoggedIn]
  );

  return (
    <header className="header">
      <div className="container">
        <div className="logo-section">
          <img
            src="/images/Capture.png"
            alt={isArabic ? "نباتي" : "Napaty"}
            className="header-logo-image"
            width="50"
            height="50"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <h1>{isArabic ? "نباتي" : "Napaty"}</h1>
        </div>

        <nav className="nav-menu" aria-label={isArabic ? "القائمة الرئيسية" : "Main navigation"}>
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={(e) =>
                    handleProtectedNavigation(e, item.path, item.requiresAuth)
                  }
                  className={[
                    location.pathname === item.path ? "active" : "",
                    item.requiresAuth && !isLoggedIn ? "requires-auth" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="nav-icon-wrapper">
                    {item.icon}
                    {item.showBadge && <NotificationBadge count={badgeCount} />}
                  </span>

                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-actions">
          <button className="lang-toggle-btn" onClick={toggleLanguage} type="button">
            {isArabic ? "EN" : "AR"}
          </button>

          {isLoggedIn ? (
            <>
              <button
                className="user-menu-btn"
                onClick={() => setShowMenu((p) => !p)}
                type="button"
                aria-expanded={showMenu}
              >
                <FaChevronDown className="chevron-icon" />
                <span>
                  {greeting} {displayName}
                </span>
                <FaUser />
              </button>

              {showMenu && (
                <div className="user-dropdown">
                  <button className="logout-btn" onClick={handleLogout} type="button">
                    <FaSignOutAlt />
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser />
              {isArabic ? "تسجيل الدخول" : "Login"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
