import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth";

import {
  FaUser,
  FaLock,
  FaUserTie,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";
import "../style/LoginRegister.css";

const emptyForm = {
  email: "",
  password: "",
  name: "",
  location: "",
  experience: "",
  field: "",
};

const Login = ({ setUser, language = "ar" }) => {
  const navigate = useNavigate();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  const [registerStep, setResetRegisterStep] = useState(1);
  const [registerOtp, setRegisterOtp] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({ email: "", code: "", newPassword: "", confirmPassword: "" });

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxType, setMessageBoxType] = useState("success");
  const [messageBoxTitle, setMessageBoxTitle] = useState("");
  const [messageBoxText, setMessageBoxText] = useState("");

  // ✅ الجديد: لو في navigate لازم يحصل بعد OK
  const [pendingNavigate, setPendingNavigate] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [displayTab, setDisplayTab] = useState("login");

  useEffect(() => {
    setFormData({ ...emptyForm });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsForgotPassword(false);
    setResetStep(1);
    setResetRegisterStep(1);
    setRegisterOtp("");
    setResetData({ email: "", code: "", newPassword: "", confirmPassword: "" });
  }, [displayTab]);

  useEffect(() => {
    if (activeTab === displayTab) return;
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayTab(activeTab);
      setIsAnimating(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [activeTab, displayTab]);

  const userTypes = [
    { value: "user", label: isArabic ? "مستخدم" : "User", icon: <FaUser />, color: "#4CAF50" },
    { value: "expert", label: isArabic ? "خبير زراعي" : "Agricultural Expert", icon: <FaUserTie />, color: "#2196F3" },
  ];

  const openMessageBox = (type, title, text, navigateTo = null) => {
    setMessageBoxType(type);
    setMessageBoxTitle(title);
    setMessageBoxText(text);
    setShowMessageBox(true);
    // ✅ لو في navigate لازم يحصل بعد OK، احفظه
    if (navigateTo) setPendingNavigate(navigateTo);
  };

  // ✅ closeMessageBox دلوقتي بتعمل navigate لو في pending
  const closeMessageBox = () => {
    setShowMessageBox(false);
    if (pendingNavigate) {
      const path = pendingNavigate;
      setPendingNavigate(null);
      navigate(path, { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setIsForgotPassword(false);
    setResetStep(1);
    setResetRegisterStep(1);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (resetStep === 1) {
        if (!resetData.email) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter email");
          return;
        }
        const response = await fetch("https://hamzamostafa20.pythonanywhere.com/api/auth/request-reset/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetData.email }),
        });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(isArabic ? "السيرفر لا يعمل بشكل صحيح" : "Server is not responding correctly");
        }
        const data = await response.json();
        if (response.ok) {
          openMessageBox("success", isArabic ? "تم" : "Success", isArabic ? "تم إرسال الكود لبريدك الإلكتروني بنجاح" : "Code sent to your email");
          setResetStep(2);
        } else {
          openMessageBox("warning", isArabic ? "خطأ" : "Error", data.detail || (isArabic ? "حدث خطأ أثناء إرسال الكود" : "Error sending code"));
        }
      } else if (resetStep === 2) {
        if (!resetData.code) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى إدخال الكود أولاً" : "Please enter code");
          return;
        }
        setResetStep(3);
      } else if (resetStep === 3) {
        if (!resetData.newPassword || !resetData.confirmPassword) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى إدخال كلمة المرور وتأكيدها" : "Please enter and confirm password");
          return;
        }
        if (resetData.newPassword !== resetData.confirmPassword) {
          openMessageBox("warning", isArabic ? "خطأ" : "Error", isArabic ? "كلمتا المرور غير متطابقتين!" : "Passwords do not match!");
          return;
        }
        const response = await fetch("https://hamzamostafa20.pythonanywhere.com/api/auth/reset-password/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetData.email, code: resetData.code, new_password: resetData.newPassword }),
        });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(isArabic ? "حدث خطأ في السيرفر" : "Server Error");
        }
        const data = await response.json();
        if (response.ok) {
          openMessageBox("success", isArabic ? "تم بنجاح" : "Success", isArabic ? "تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول" : "Password updated successfully");
          setIsForgotPassword(false);
          setResetStep(1);
          setResetData({ email: "", code: "", newPassword: "", confirmPassword: "" });
        } else {
          openMessageBox("warning", isArabic ? "خطأ" : "Error", data.detail || (isArabic ? "الكود غير صحيح أو منتهي الصلاحية" : "Invalid code"));
          setResetStep(2);
        }
      }
    } catch (err) {
      openMessageBox("warning", isArabic ? "تفاصيل الخطأ" : "Error", err.message || (isArabic ? "تعذر الاتصال بالخادم" : "Server connection failed"));
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (displayTab === "login") {
        if (!formData.email || !formData.password) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى إدخال البريد وكلمة المرور" : "Please enter email and password");
          return;
        }
        const data = await loginRequest({ email: formData.email, password: formData.password });

        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
        if (data.token) localStorage.setItem("access", data.token);

        const savedUserType = data.user_type || data.user?.user_type || data.user?.type || "user";
        const userData = {
          ...(data.user || {}),
          full_name: data.user?.full_name || data.user?.name || "",
          name: data.user?.name || data.user?.full_name || "",
          user_type: savedUserType,
          isAuthenticated: true,
        };
        localStorage.setItem("user_type", savedUserType);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setFormData({ ...emptyForm });
        // ✅ login: navigate فوري عادي (مفيش message box قبله)
        navigate("/", { replace: true });
        return;
      }

      // Register
      if (registerStep === 1) {
        if (!formData.name || !formData.email || !formData.password) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
          return;
        }
        if (userType === "expert" && (!formData.experience || !formData.field)) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى ملء مدة الخبرة والمجال للخبير الزراعي" : "Please enter experience details");
          return;
        }
        const payload = {
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location || "",
          user_type: userType,
          ...(userType === "expert" && {
            experience_years: Number(formData.experience),
            specialization: formData.field,
          }),
        };
        const response = await fetch("https://hamzamostafa20.pythonanywhere.com/api/auth/register/request/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok) {
          openMessageBox("success", isArabic ? "تم" : "Success", isArabic ? "تم إرسال كود التفعيل لبريدك الإلكتروني" : "Activation code sent to your email");
          setResetRegisterStep(2);
        } else {
          openMessageBox("warning", isArabic ? "خطأ" : "Error", data.detail || (isArabic ? "فشل إرسال كود التفعيل" : "Failed to send code"));
        }

      } else if (registerStep === 2) {
        if (!registerOtp) {
          openMessageBox("warning", isArabic ? "تنبيه" : "Warning", isArabic ? "يرجى إدخال كود التفعيل" : "Please enter code");
          return;
        }
        const response = await fetch("https://hamzamostafa20.pythonanywhere.com/api/auth/register/verify/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, code: registerOtp }),
        });
        const data = await response.json();

        if (response.ok) {
          // ✅ مش بنعمل login تلقائي — بنرجعه لصفحة تسجيل الدخول بس
          setFormData({ ...emptyForm });
          setResetRegisterStep(1);
          setRegisterOtp("");

          openMessageBox(
            "success",
            isArabic ? "تم بنجاح" : "Success",
            isArabic ? "تم إنشاء حسابك بنجاح! سجّل دخولك الآن" : "Account created successfully! Please log in.",
            "/login" // ← بعد OK يروح لصفحة الـ login
          );
        } else {
          openMessageBox("warning", isArabic ? "خطأ" : "Error", data.detail || (isArabic ? "الكود غير صحيح" : "Invalid code"));
        }
      }
    } catch (err) {
      // ✅ لو السيرفر رجع رسالة خطأ واضحة (مش network error)
      const serverMsg = err?.response?.data?.detail
        || err?.response?.data?.non_field_errors?.[0]
        || err?.response?.data?.email?.[0]
        || err?.response?.data?.password?.[0]
        || null;

      if (serverMsg) {
        // رسالة من السيرفر — نترجمها لرسالة واضحة للمستخدم
        const isWrongCredentials =
          serverMsg.toLowerCase().includes("invalid") ||
          serverMsg.toLowerCase().includes("incorrect") ||
          serverMsg.toLowerCase().includes("no active account") ||
          serverMsg.toLowerCase().includes("wrong");

        openMessageBox(
          "warning",
          isArabic ? "خطأ في تسجيل الدخول" : "Login Failed",
          isWrongCredentials
            ? (isArabic ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Incorrect email or password")
            : serverMsg
        );
      } else {
        // network error أو السيرفر مش شغال
        openMessageBox(
          "warning",
          isArabic ? "خطأ في الاتصال" : "Connection Error",
          isArabic ? "تعذر الاتصال بالخادم، تحقق من الإنترنت" : "Could not connect to server, check your internet"
        );
      }
      console.error(err);
    }
  };

  const getResetTitle = () => {
    if (resetStep === 1) return isArabic ? "استعادة كلمة المرور" : "Reset Password";
    if (resetStep === 2) return isArabic ? "إدخال كود التحقق" : "Enter Verification Code";
    if (resetStep === 3) return isArabic ? "تعيين كلمة مرور جديدة" : "Set New Password";
  };

  return (
    <div className="login-page">
      <div className="login-container login-container-proper">
        <div className="login-header premium-header">
          <div className="logo-wrapper">
            <img src="/images/Capture.png" alt="App Logo" className="header-image" />
          </div>
          <div className="app-title">
            <div className="app-title-text">
              <h1>{isArabic ? "نباتي" : "Napaty"}</h1>
              <p className="app-subtitle"></p>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <h2>{isArabic ? "مرحباً بعودتك" : "Welcome Back"}</h2>
          <p>
            {displayTab === "login"
              ? isArabic ? "سجل الدخول لمواصلة رحلتك مع النباتات" : "Log in to continue your journey with plants"
              : isArabic ? "أنشئ حسابك وابدأ رحلتك مع نباتي" : "Create your account and start your journey with Napaty"}
          </p>
        </div>

        <div className="login-content-proper">
          <div className="tabs-container">
            <div className={`tab-slider ${activeTab === "register" ? "right" : "left"}`}></div>
            <button type="button" className={`tab-btn ${activeTab === "login" ? "active" : ""}`} onClick={() => switchTab("login")}>
              {isArabic ? "تسجيل الدخول" : "Login"}
            </button>
            <button type="button" className={`tab-btn ${activeTab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>
              {isArabic ? "إنشاء حساب" : "Create Account"}
            </button>
          </div>

          <div className={`auth-panel ${isAnimating ? "switch-out" : "switch-in"}`} key={displayTab}>
            {displayTab === "register" && registerStep === 1 && (
              <div className="user-type-section smooth-block">
                <h3>{isArabic ? "نوع الحساب" : "Account Type"}</h3>
                <div className="user-types">
                  {userTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`user-type-card ${userType === type.value ? "selected" : ""}`}
                      onClick={() => setUserType(type.value)}
                      style={{ borderColor: userType === type.value ? type.color : "" }}
                    >
                      <div className="type-icon" style={{ color: type.color }}>{type.icon}</div>
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isForgotPassword && displayTab === "login" ? (
              <form onSubmit={handleForgotPasswordSubmit} className="login-form login-form-proper smooth-block">
                <div className="form-section">
                  <h4 className="section-mini-title" style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50', fontSize: '1.1rem' }}>
                    {getResetTitle()}
                  </h4>
                  {resetStep === 1 && (
                    <div className="form-group smooth-block">
                      <label>{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                      <div className="input-with-icon">
                        <FaEnvelope className="input-icon" />
                        <input type="email" value={resetData.email} onChange={(e) => setResetData({ ...resetData, email: e.target.value })} placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"} required />
                      </div>
                    </div>
                  )}
                  {resetStep === 2 && (
                    <div className="form-group smooth-block delay-1">
                      <label>{isArabic ? "كود التحقق" : "Verification Code"}</label>
                      <div className="input-with-icon">
                        <FaLock className="input-icon" />
                        <input type="text" value={resetData.code} onChange={(e) => setResetData({ ...resetData, code: e.target.value })} placeholder={isArabic ? "أدخل الكود المرسل للإيميل" : "Enter received Code"} required />
                      </div>
                    </div>
                  )}
                  {resetStep === 3 && (
                    <>
                      <div className="form-group smooth-block delay-1">
                        <label>{isArabic ? "كلمة المرور الجديدة" : "New Password"}</label>
                        <div className="input-with-icon">
                          <FaLock className="input-icon" />
                          <input type={showPassword ? "text" : "password"} value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })} placeholder={isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password"} required minLength="6" />
                          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>
                      </div>
                      <div className="form-group smooth-block delay-2">
                        <label>{isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
                        <div className="input-with-icon">
                          <FaLock className="input-icon" />
                          <input type={showConfirmPassword ? "text" : "password"} value={resetData.confirmPassword} onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })} placeholder={isArabic ? "أعد إدخال كلمة المرور" : "Re-enter new password"} required minLength="6" />
                          <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button type="submit" className="submit-btn submit-btn-proper smooth-submit">
                  {resetStep === 1 ? (isArabic ? "إرسال الكود" : "Send Code") : resetStep === 2 ? (isArabic ? "تأكيد الكود" : "Verify Code") : (isArabic ? "حفظ كلمة المرور" : "Save Password")}
                </button>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <span className="forgot-password" style={{ cursor: "pointer", fontWeight: "600" }} onClick={() => { setIsForgotPassword(false); setResetStep(1); }}>
                    {isArabic ? "العودة لتسجيل الدخول" : "Back to Login"}
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="login-form login-form-proper">
                {displayTab === "register" ? (
                  <>
                    {registerStep === 1 ? (
                      <>
                        <div className="form-section smooth-block delay-1">
                          <h4 className="section-mini-title">{isArabic ? "بيانات الحساب الجديد" : "New Account Details"}</h4>
                          <div className="form-single-column">
                            <div className="form-group">
                              <label>{isArabic ? "الاسم الكامل" : "Full Name"}</label>
                              <div className="input-with-icon">
                                <FaUser className="input-icon" />
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"} required />
                              </div>
                            </div>
                            <div className="form-group">
                              <label>{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                              <div className="input-with-icon">
                                <FaEnvelope className="input-icon" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"} required />
                              </div>
                            </div>
                            {userType === "expert" && (
                              <>
                                <div className="form-group smooth-block delay-2">
                                  <label>{isArabic ? "مدة الخبرة (سنوات)" : "Experience (Years)"}</label>
                                  <div className="input-with-icon">
                                    <FaCalendarAlt className="input-icon" />
                                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder={isArabic ? "عدد سنوات الخبرة" : "Number of years of experience"} min="0" max="50" required />
                                  </div>
                                </div>
                                <div className="form-group smooth-block delay-3">
                                  <label>{isArabic ? "المجال التخصصي" : "Specialization"}</label>
                                  <div className="input-with-icon">
                                    <FaBriefcase className="input-icon" />
                                    <input type="text" name="field" value={formData.field} onChange={handleChange} placeholder={isArabic ? "مثال: نباتات زينة، أشجار فاكهة" : "Example: Ornamental plants"} required />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="form-section smooth-block delay-2">
                          <h4 className="section-mini-title">{isArabic ? "الأمان" : "Security"}</h4>
                          <div className="form-group">
                            <label>{isArabic ? "كلمة المرور" : "Password"}</label>
                            <div className="input-with-icon">
                              <FaLock className="input-icon" />
                              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"} required minLength="6" />
                              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="form-section smooth-block">
                        <h4 className="section-mini-title" style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>
                          {isArabic ? "تأكيد بريدك الإلكتروني" : "Verify Your Email"}
                        </h4>
                        <div className="form-group">
                          <label>{isArabic ? "كود التفعيل" : "Activation Code"}</label>
                          <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <input type="text" value={registerOtp} onChange={(e) => setRegisterOtp(e.target.value)} placeholder={isArabic ? "أدخل كود التفعيل المكون من 6 أرقام" : "Enter 6-digit code"} required />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="form-section smooth-block delay-1">
                    <h4 className="section-mini-title">{isArabic ? "تسجيل الدخول" : "Sign In"}</h4>
                    <div className="form-single-column">
                      <div className="form-group">
                        <label>{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                        <div className="input-with-icon">
                          <FaEnvelope className="input-icon" />
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"} required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{isArabic ? "كلمة المرور" : "Password"}</label>
                        <div className="input-with-icon">
                          <FaLock className="input-icon" />
                          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"} required />
                          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>
                      </div>
                      <div className="form-options">
                        <span className="forgot-password" style={{ cursor: "pointer", display: "inline-block", marginTop: "5px" }} onClick={() => setIsForgotPassword(true)}>
                          {isArabic ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className={`submit-btn ${displayTab === "login" ? "" : "submit-btn-proper"} smooth-submit`}>
                  {displayTab === "login"
                    ? (isArabic ? "تسجيل الدخول" : "Login")
                    : registerStep === 1
                    ? (isArabic ? "إرسال كود التفعيل" : "Send Code")
                    : (isArabic ? "تفعيل وإنشاء الحساب" : "Verify & Register")}
                </button>
              </form>
            )}
          </div>

          {!isForgotPassword && (registerStep === 1 || displayTab === "login") && (
            <div className="auth-footer">
              {displayTab === "login" ? (
                <p>{isArabic ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}<span onClick={() => switchTab("register")}>{isArabic ? "سجل الآن" : "Register now"}</span></p>
              ) : (
                <p>{isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}<span onClick={() => switchTab("login")}>{isArabic ? "سجل الدخول" : "Log in"}</span></p>
              )}
            </div>
          )}
        </div>
      </div>

      {showMessageBox && (
        <div className="custom-message-overlay">
          <div className="custom-message-box">
            <div className={`message-icon-wrapper ${messageBoxType}`}>
              <i className={`fas ${messageBoxType === "success" ? "fa-check-circle" : "fa-exclamation-triangle"}`}></i>
            </div>
            <h4 className={`message-title ${messageBoxType}`}>{messageBoxTitle}</h4>
            <p className="message-text">{messageBoxText}</p>
            <button className={`message-btn ${messageBoxType}`} onClick={closeMessageBox}>
              {isArabic ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
