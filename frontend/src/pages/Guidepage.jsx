import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/GuidePage.module.css";

const getGuideData = (isArabic) => [
  {
    id: 1,
    emoji: "🔬",
    color: "#16a34a",
    bg: "#dcfce7",
    title: isArabic ? "تشخيص الأمراض" : "Disease Diagnosis",
    route: "/diagnosis",
    lines: isArabic
      ? [
          "ارفع صورة نباتك...",
          "الذكاء الاصطناعي بيحللها على طول!",
          "وبيقولك اسم المرض والعلاج المناسب.",
          "جرّبها دلوقتي، سهلة جداً! 🌿",
        ]
      : [
          "Upload a photo of your plant...",
          "Our AI analyzes it instantly!",
          "It tells you the disease and treatment.",
          "Try it now, it's super easy! 🌿",
        ],
  },
  {
    id: 2,
    emoji: "🤖",
    color: "#7c3aed",
    bg: "#ede9fe",
    title: isArabic ? "AgriChat" : "AgriChat",
    route: "/agri-chat",
    lines: isArabic
      ? [
          "عندك سؤال زراعي؟",
          "اسأل AgriChat في أي وقت!",
          "بيرد بدقة وبسرعة على أي سؤال.",
          "زي ما يكون خبير زراعي جنبك دايماً 🤖",
        ]
      : [
          "Got an agricultural question?",
          "Ask AgriChat anytime!",
          "It answers accurately and instantly.",
          "Like having an expert by your side 🤖",
        ],
  },
  {
    id: 3,
    emoji: "🌱",
    color: "#059669",
    bg: "#d1fae5",
    title: isArabic ? "توصية المحاصيل" : "Crop Recommendation",
    route: "/crop-recommendation",
    lines: isArabic
      ? [
          "أدخل بيانات تربتك والمنطقة...",
          "النظام بيحلل كل العوامل!",
          "وبيقولك أنسب المحاصيل لأرضك.",
          "قرارات زراعية أذكى بخطوة واحدة 🌾",
        ]
      : [
          "Enter your soil data and region...",
          "The system analyzes all factors!",
          "It recommends the best crops for you.",
          "Smarter farming decisions in one step 🌾",
        ],
  },
  {
    id: 4,
    emoji: "🪨",
    color: "#b45309",
    bg: "#fef3c7",
    title: isArabic ? "تحليل التربة" : "Soil Analysis",
    route: "/soil-analysis",
    lines: isArabic
      ? [
          "عندك نتايج تحليل تربة؟",
          "أدخلها هنا وهنفسرها ليك!",
          "pH، معادن، رطوبة... كل حاجة.",
          "وبنديك توصيات التسميد الصح 🪨",
        ]
      : [
          "Got soil analysis results?",
          "Enter them here and we'll interpret them!",
          "pH, minerals, moisture... everything.",
          "We give you the right fertilization tips 🪨",
        ],
  },
  {
    id: 5,
    emoji: "📅",
    color: "#0284c7",
    bg: "#e0f2fe",
    title: isArabic ? "مواسم النباتات" : "Plant Seasons",
    route: "/plants-seasons",
    lines: isArabic
      ? [
          "تقويم زراعي شامل...",
          "بيقولك إمتى تزرع وإمتى تحصد!",
          "لكل نبات موسمه الصح.",
          "مفيش حاجة تتزرع في غير وقتها 📅",
        ]
      : [
          "A comprehensive agricultural calendar...",
          "Tells you when to plant and harvest!",
          "Every plant has its right season.",
          "Nothing planted at the wrong time 📅",
        ],
  },
  {
    id: 6,
    emoji: "👥",
    color: "#0f766e",
    bg: "#ccfbf1",
    title: isArabic ? "المجتمع والاستشارة" : "Community & Consultation",
    route: "/community",
    lines: isArabic
      ? [
          "انضم لمجتمع المزارعين!",
          "شارك تجاربك واسأل الخبراء.",
          "احجز استشارة مع متخصص زراعي.",
          "مش هتحس إنك بتزرع لوحدك 👐",
        ]
      : [
          "Join the farming community!",
          "Share your experiences, ask experts.",
          "Book a consultation with a specialist.",
          "You'll never feel like farming alone 👐",
        ],
  },
  {
    id: 7,
    emoji: "🛒",
    color: "#dc2626",
    bg: "#fee2e2",
    title: isArabic ? "المتجر الزراعي" : "Agricultural Store",
    route: "/store",
    lines: isArabic
      ? [
          "كل اللي محتاجه في مكان واحد!",
          "بذور، أسمدة، أدوات زراعية...",
          "بسعر مناسب وتوصيل سريع.",
          "المتجر الزراعي اللي هيفرق معاك 🛒",
        ]
      : [
          "Everything you need in one place!",
          "Seeds, fertilizers, farming tools...",
          "Great prices and fast delivery.",
          "The agricultural store that makes a difference 🛒",
        ],
  },
];

function TypingText({ lines, color, onDone }) {
  const [displayed, setDisplayed] = useState([""]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed([""]);
    setLineIdx(0);
    setCharIdx(0);
    setDone(false);
  }, [lines]);

  useEffect(() => {
    if (done) return;
    const currentLine = lines[lineIdx] || "";

    if (charIdx < currentLine.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed((prev) => {
          const copy = [...prev];
          copy[lineIdx] = currentLine.slice(0, charIdx + 1);
          return copy;
        });
        setCharIdx((c) => c + 1);
      }, 28);
    } else {
      if (lineIdx < lines.length - 1) {
        timerRef.current = setTimeout(() => {
          setLineIdx((l) => l + 1);
          setCharIdx(0);
          setDisplayed((prev) => [...prev, ""]);
        }, 420);
      } else {
        setDone(true);
        onDone && setTimeout(onDone, 600);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [charIdx, lineIdx, lines, done, onDone]);

  return (
    <div className={styles.typingBox}>
      {displayed.map((line, i) => (
        <p key={i} className={styles.typingLine} style={{ color: i === displayed.length - 1 && !done ? color : "#1e293b" }}>
          {line}
          {i === displayed.length - 1 && !done && (
            <span className={styles.cursor} style={{ background: color }} />
          )}
        </p>
      ))}
    </div>
  );
}

export default function GuidePage({ language = "ar" }) {
  const navigate = useNavigate();
  const isArabic = language === "ar";
  const guide = getGuideData(isArabic);

  const [active, setActive] = useState(0);
  const [typing, setTyping] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoRef = useRef(null);
  const current = guide[active];

  const goTo = (idx) => {
    setActive(idx);
    setTyping(true);
    setAutoPlay(false);
    clearTimeout(autoRef.current);
  };

  const handleDone = () => {
    if (!autoPlay) return;
    autoRef.current = setTimeout(() => {
      setActive((a) => {
        const next = (a + 1) % guide.length;
        setTyping(true);
        return next;
      });
    }, 1200);
  };

  useEffect(() => {
    return () => clearTimeout(autoRef.current);
  }, []);

  useEffect(() => {
    setTyping(true);
  }, [active]);

  return (
    <div className={styles.page}>
      {/* هيدر */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          {isArabic ? "→ رجوع" : "← Back"}
        </button>
        <h1 className={styles.pageTitle}>
          {isArabic ? "دليل المنصة" : "Platform Guide"}
        </h1>
        <span />
      </div>

      <div className={styles.layout}>
        {/* قائمة جانبية */}
        <div className={styles.sidebar}>
          {guide.map((item, i) => (
            <button
              key={item.id}
              className={`${styles.sideItem} ${i === active ? styles.sideItemActive : ""}`}
              style={i === active ? { borderColor: item.color, background: item.bg } : {}}
              onClick={() => goTo(i)}
            >
              <span className={styles.sideEmoji}>{item.emoji}</span>
              <span className={styles.sideTitle}>{item.title}</span>
              {i === active && <span className={styles.activeDot} style={{ background: item.color }} />}
            </button>
          ))}
        </div>

        {/* المحتوى الرئيسي */}
        <div className={styles.main}>
          {/* الشخصية */}
          <div className={styles.characterArea} style={{ "--accent": current.color }}>
            <div className={styles.characterWrap}>
              {/* جسم الشخصية */}
              <div className={styles.character}>
                <div className={styles.charHead} style={{ background: current.bg, borderColor: current.color }}>
                  <span className={styles.charEmoji}>{current.emoji}</span>
                </div>
                <div className={styles.charBody} style={{ background: current.color }}>
                  <div className={styles.charArm} style={{ background: current.color }} />
                  <div className={`${styles.charArm} ${styles.charArmRight}`} style={{ background: current.color }} />
                </div>
                <div className={styles.charLegs}>
                  <div className={styles.charLeg} style={{ background: current.color }} />
                  <div className={styles.charLeg} style={{ background: current.color }} />
                </div>
              </div>

              {/* فقاعة الكلام */}
              <div className={styles.bubble} style={{ borderColor: current.color }}>
                <div className={styles.bubbleTail} style={{ borderTopColor: current.color }} />
                {typing && (
                  <TypingText
                    key={active}
                    lines={current.lines}
                    color={current.color}
                    onDone={handleDone}
                  />
                )}
              </div>
            </div>

            {/* اسم الميزة */}
            <div className={styles.featureName} style={{ color: current.color, background: current.bg }}>
              {current.title}
            </div>

            {/* أزرار */}
            <div className={styles.btnRow}>
              <button
                className={styles.tryBtn}
                style={{ background: current.color }}
                onClick={() => navigate(current.route)}
              >
                {isArabic ? "جرّبها دلوقتي ←" : "Try it now →"}
              </button>
              <button
                className={styles.autoBtn}
                onClick={() => {
                  setAutoPlay((p) => !p);
                  if (!autoPlay) setTyping(true);
                }}
                style={{ borderColor: current.color, color: current.color }}
              >
                {autoPlay
                  ? isArabic ? "⏸ إيقاف التشغيل التلقائي" : "⏸ Pause auto"
                  : isArabic ? "▶ تشغيل تلقائي" : "▶ Auto play"}
              </button>
            </div>
          </div>

          {/* نقاط التنقل */}
          <div className={styles.dots}>
            {guide.map((item, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                style={i === active ? { background: item.color, width: "28px" } : {}}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* التالي / السابق */}
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => goTo((active - 1 + guide.length) % guide.length)}
            >
              {isArabic ? "→ السابق" : "← Prev"}
            </button>
            <span className={styles.counter}>
              {active + 1} / {guide.length}
            </span>
            <button
              className={styles.navBtn}
              style={{ background: current.color, color: "#fff", border: "none" }}
              onClick={() => goTo((active + 1) % guide.length)}
            >
              {isArabic ? "← التالي" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
