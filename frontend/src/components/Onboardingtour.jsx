import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OnboardingTour.css";

const steps = {
  ar: [
    {
      emoji: "🔬",
      title: "تشخيص الأمراض",
      desc: "ارفع صورة نباتك وهنحدد المرض والعلاج فوراً بالذكاء الاصطناعي",
      route: "/diagnosis",
    },
    {
      emoji: "🤖",
      title: "AgriChat",
      desc: "اسأل أي سؤال زراعي وهتلاقي إجابة دقيقة على طول",
      route: "/agri-chat",
    },
    {
      emoji: "🌱",
      title: "توصية المحاصيل",
      desc: "أدخل بيانات تربتك وهنقولك أنسب المحاصيل لأرضك",
      route: "/crop-recommendation",
    },
    {
      emoji: "🪨",
      title: "تحليل التربة",
      desc: "حلل نتايج تربتك واعرف توصيات التسميد المناسبة",
      route: "/soil-analysis",
    },
    {
      emoji: "📅",
      title: "مواسم النباتات",
      desc: "تقويم زراعي يخبرك إمتى تزرع وإمتى تحصد",
      route: "/plants-seasons",
    },
    {
      emoji: "👥",
      title: "المجتمع والاستشارة",
      desc: "تواصل مع مزارعين وخبراء زراعيين من كل مكان",
      route: "/community",
    },
  ],
  en: [
    {
      emoji: "🔬",
      title: "Disease Diagnosis",
      desc: "Upload a photo of your plant and we'll identify the disease and treatment instantly using AI",
      route: "/diagnosis",
    },
    {
      emoji: "🤖",
      title: "AgriChat",
      desc: "Ask any agricultural question and get an accurate answer instantly",
      route: "/agri-chat",
    },
    {
      emoji: "🌱",
      title: "Crop Recommendation",
      desc: "Enter your soil data and we'll tell you the best crops for your land",
      route: "/crop-recommendation",
    },
    {
      emoji: "🪨",
      title: "Soil Analysis",
      desc: "Analyze your soil results and get the right fertilization recommendations",
      route: "/soil-analysis",
    },
    {
      emoji: "📅",
      title: "Plant Seasons",
      desc: "An agricultural calendar that tells you when to plant and when to harvest",
      route: "/plants-seasons",
    },
    {
      emoji: "👥",
      title: "Community & Consultation",
      desc: "Connect with farmers and agricultural experts from everywhere",
      route: "/community",
    },
  ],
};

export default function OnboardingTour({ language = "ar" }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();
  const isArabic = language === "ar";
  const list = steps[language] || steps.ar;
  const current = list[step];
  const total = list.length;

  useEffect(() => {
    if (localStorage.getItem("showTour") === "true") {
      setVisible(true);
    }
  }, []);

  const close = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.removeItem("showTour");
      setVisible(false);
    }, 300);
  };

  const next = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const goTo = () => {
    close();
    setTimeout(() => navigate(current.route), 320);
  };

  if (!visible) return null;

  return (
    <div className={`onb-overlay ${exiting ? "onb-exit" : "onb-enter"}`}>
      <div className={`onb-card ${exiting ? "onb-card-exit" : "onb-card-enter"}`}>

        {/* زر إغلاق */}
        <button className="onb-close" onClick={close} aria-label="إغلاق">✕</button>

        {/* هيدر */}
        <div className="onb-header">
          <span className="onb-emoji">{current.emoji}</span>
          <div className="onb-badge">
            {isArabic ? `${step + 1} من ${total}` : `${step + 1} of ${total}`}
          </div>
        </div>

        {/* المحتوى */}
        <div className="onb-body" key={step}>
          <h2 className="onb-title">{current.title}</h2>
          <p className="onb-desc">{current.desc}</p>
        </div>

        {/* شريط التقدم */}
        <div className="onb-dots">
          {list.map((_, i) => (
            <button
              key={i}
              className={`onb-dot ${i === step ? "onb-dot-active" : ""}`}
              onClick={() => setStep(i)}
              aria-label={`الخطوة ${i + 1}`}
            />
          ))}
        </div>

        {/* أزرار */}
        <div className="onb-actions">
          <button
            className="onb-btn-secondary"
            onClick={prev}
            disabled={step === 0}
          >
            {isArabic ? "السابق" : "Back"}
          </button>

          <button className="onb-btn-outline" onClick={goTo}>
            {isArabic ? "جرّبها دلوقتي" : "Try it now"}
          </button>

          <button className="onb-btn-primary" onClick={next}>
            {step === total - 1
              ? isArabic ? "ابدأ الآن 🚀" : "Get Started 🚀"
              : isArabic ? "التالي" : "Next"}
          </button>
        </div>

        {/* skip */}
        <button className="onb-skip" onClick={close}>
          {isArabic ? "تخطي الجولة" : "Skip tour"}
        </button>
      </div>
    </div>
  );
}
