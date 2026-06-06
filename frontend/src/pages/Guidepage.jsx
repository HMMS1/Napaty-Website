import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../style/Guidepage.module.css';

const getFeaturesData = (isArabic) => [
  {
    id: "diagnosis",
    icon: "🔬",
    title: isArabic ? "تشخيص الأمراض بالذكاء الاصطناعي" : "AI Disease Diagnosis",
    subtitle: isArabic ? "اكتشف أمراض نباتاتك بدقة متناهية واحصل على خطة علاج فورية" : "Accurately discover plant diseases and get instant treatment plans.",
    details: isArabic ? [
      { title: "نموذج 7.1 (الدقة الفائقة)", desc: "مخصص للصور عالية الجودة الملتقطة داخل المختبرات والمعامل." },
      { title: "نموذج 7.2 (الوضع الحقلي)", desc: "مخصص للصور الملتقطة بكاميرا الهاتف المحمول أو من الإنترنت مباشرة." },
      { title: "خطة العلاج المتكاملة", desc: "بمجرد تحديد المرض، سيوفر لك النظام خطوات علاجية وأدوية مقترحة للقضاء عليه." }
    ] : [
      { title: "Model 7.1 (High Precision)", desc: "For high-quality images taken in laboratories." },
      { title: "Model 7.2 (Field Mode)", desc: "For images captured via mobile camera or internet." },
      { title: "Comprehensive Treatment", desc: "Provides effective treatment steps and recommended medications once diagnosed." }
    ],
    route: "/diagnosis",
    btnText: isArabic ? "ابدأ التشخيص الآن" : "Start Diagnosis"
  },
  {
    id: "soil-crops",
    icon: "🌱",
    title: isArabic ? "أنواع التربة والمحاصيل" : "Soil Types & Crops",
    subtitle: isArabic ? "دليلك الشامل لمعرفة المحاصيل التي تزدهر في أرضك" : "Your guide to knowing which crops thrive in your land.",
    details: isArabic ? [
      { title: "المحاصيل المناسبة", desc: "تعرف على أفضل المحاصيل التي تناسب طبيعة تربتك لضمان أعلى إنتاجية." },
      { title: "برامج التسميد", desc: "اكتشف أنواع الأسمدة المناسبة لكل تربة والكميات الموصى بها." }
    ] : [
      { title: "Suitable Crops", desc: "Find the best crops suited for your soil nature for maximum yield." },
      { title: "Fertilization Programs", desc: "Discover appropriate fertilizers and recommended quantities." }
    ],
    route: "/soil-analysis", // يمكنك تغيير المسار حسب الرابط الفعلي
    btnText: isArabic ? "اكتشف أرضك" : "Discover Your Land"
  },
  {
    id: "seasons",
    icon: "📅",
    title: isArabic ? "النباتات والفصول (دراسة الجدوى)" : "Plant Seasons & Feasibility",
    subtitle: isArabic ? "دليل الزراعة الموسمي مع حساب دقيق لتكاليفك" : "Seasonal planting guide with accurate cost breakdown.",
    details: isArabic ? [
      { title: "طريقة الزراعة", desc: "خطوات تفصيلية لزراعة كل نبات من البذرة وحتى الحصاد." },
      { title: "تكلفة زراعة الفدان", desc: "حساب شامل لإجمالي التكلفة المتوقعة لزراعة مساحة فدان كامل." },
      { title: "التكلفة التفصيلية", desc: "تسعير دقيق لكل خطوة يقوم بها المزارع (حرث، بذور، عمالة، أسمدة)." }
    ] : [
      { title: "Planting Method", desc: "Detailed steps from seed to harvest for each plant." },
      { title: "Cost per Feddan", desc: "Comprehensive calculation of the expected total cost per feddan." },
      { title: "Detailed Cost Breakdown", desc: "Precise pricing for every farming step (plowing, seeds, labor, etc.)." }
    ],
    route: "/plants-seasons",
    btnText: isArabic ? "تصفح التقويم الزراعي" : "Browse Calendar"
  },
  {
    id: "store",
    icon: "🛒",
    title: isArabic ? "المتجر الزراعي المتكامل" : "Comprehensive Agri-Store",
    subtitle: isArabic ? "كل ما تحتاجه لزراعتك في مكان واحد وبطرق دفع متعددة" : "Everything you need for farming in one place with multiple payment methods.",
    details: isArabic ? [
      { title: "منتجات وأدوات", desc: "مجموعة واسعة من البذور، الأسمدة، والمعدات الزراعية عالية الجودة." },
      { title: "طرق دفع مرنة", desc: "ادفع بكل سهولة عبر (InstaPay، ڤودافون كاش، بطاقات الفيزا، وغيرها)." },
      { title: "توصيل سريع", desc: "شحن آمن وسريع لمنتجاتك حتى باب مزرعتك." }
    ] : [
      { title: "Products & Tools", desc: "A wide range of seeds, fertilizers, and high-quality equipment." },
      { title: "Flexible Payments", desc: "Pay easily via InstaPay, Vodafone Cash, Visa, and more." },
      { title: "Fast Delivery", desc: "Safe and fast shipping directly to your farm." }
    ],
    route: "/store",
    btnText: isArabic ? "تسوق الآن" : "Shop Now"
  },
  {
    id: "consultation",
    icon: "👨‍🌾",
    title: isArabic ? "استشارات الخبراء" : "Expert Consultations",
    subtitle: isArabic ? "تواصل مباشرة مع نخبة من المهندسين الزراعيين" : "Communicate directly with top agricultural engineers.",
    details: isArabic ? [
      { title: "حجز المواعيد", desc: "اختر الوقت المناسب لك لإجراء الجلسة الاستشارية." },
      { title: "نظام الطلبات", desc: "أرسل طلبك للمستشار وانتظر الموافقة للبدء." },
      { title: "محادثة مباشرة", desc: "تواصل في بيئة دردشة (Chat) احترافية داخل المنصة مدعومة بإرسال الصور." }
    ] : [
      { title: "Book Appointments", desc: "Choose a suitable time for your consultation session." },
      { title: "Request System", desc: "Send your request to the expert and wait for approval." },
      { title: "Live Chat", desc: "Communicate in a professional chat environment within the platform." }
    ],
    route: "/consultation",
    btnText: isArabic ? "احجز استشارتك" : "Book Consultation"
  },
  {
    id: "agri-chat",
    icon: "🤖",
    title: isArabic ? "المساعد الذكي (AgriChat)" : "AgriChat Assistant",
    subtitle: isArabic ? "مستشارك الزراعي الآلي المتاح على مدار الساعة" : "Your automated agricultural advisor available 24/7.",
    details: isArabic ? [
      { title: "إجابات فورية", desc: "احصل على ردود دقيقة وسريعة لأي استفسار زراعي يخطر ببالك." },
      { title: "متوفر 24/7", desc: "لا توجد أوقات عمل محددة، نحن هنا لمساعدتك في أي وقت، ليلاً أو نهاراً." }
    ] : [
      { title: "Instant Answers", desc: "Get fast and accurate replies to any agricultural question." },
      { title: "Available 24/7", desc: "No specific working hours; we are here to help anytime." }
    ],
    route: "/agri-chat",
    btnText: isArabic ? "اسأل AgriChat" : "Ask AgriChat"
  },
  {
    id: "smart-soil",
    icon: "🪨",
    title: isArabic ? "التحليل المتقدم للتربة" : "Advanced Soil Analysis",
    subtitle: isArabic ? "حلول ذكية للمزارعين البُسطاء والخبراء المتخصصين" : "Smart solutions for both simple farmers and specialized experts.",
    details: isArabic ? [
      { title: "طريقة المزارع البسيط", desc: "أدخل (المحافظة، نوع التربة، الفصل الطقسي) وسيرشح لك الذكاء الاصطناعي أفضل محصول." },
      { title: "طريقة الخبير الزراعي", desc: "تحليل دقيق يعتمد على إدخال نسب (النيتروجين، الفوسفور، البوتاسيوم - NPK) لنتائج شديدة الدقة." }
    ] : [
      { title: "Simple Farmer Mode", desc: "Input (Governorate, Soil Type, Season) to get AI crop recommendations." },
      { title: "Expert Mode", desc: "Accurate analysis based on NPK element ratios for highly precise results." }
    ],
    route: "/crop-recommendation",
    btnText: isArabic ? "ابدأ التحليل" : "Start Analysis"
  },
  {
    id: "community",
    icon: "👥",
    title: isArabic ? "مجتمع نباتي (Community)" : "Nabaty Community",
    subtitle: isArabic ? "منصتك الاجتماعية للتواصل وتبادل الخبرات الزراعية" : "Your social platform to connect and share farming experiences.",
    details: isArabic ? [
      { title: "مشاركة التجارب", desc: "انشر صور محاصيلك وشارك نجاحاتك وتحدياتك مع الآخرين." },
      { title: "تفاعل مستمر", desc: "تفاعل مع منشورات المزارعين الآخرين بالإعجابات والتعليقات." },
      { title: "تبادل المعرفة", desc: "تعلم من خبرات مجتمع كامل يسعى للارتقاء بالزراعة." }
    ] : [
      { title: "Share Experiences", desc: "Post photos of your crops and share your successes and challenges." },
      { title: "Continuous Interaction", desc: "Interact with other farmers' posts through likes and comments." },
      { title: "Knowledge Exchange", desc: "Learn from the experiences of a community striving to elevate agriculture." }
    ],
    route: "/community",
    btnText: isArabic ? "انضم للمجتمع" : "Join Community"
  }
];

export default function Guidepage({ language = "ar" }) {
  const navigate = useNavigate();
  const isArabic = language === "ar";
  const features = getFeaturesData(isArabic);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fade, setFade] = useState(false);

  const activeFeature = features[activeIdx];

  // تأثير لتغيير المحتوى بنعومة
  const handleTabChange = (idx) => {
    if (idx === activeIdx) return;
    setFade(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFade(false);
    }, 250);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.guideWrapper}>
      {/* الهيدر العلوي */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            {isArabic ? "→ العودة" : "← Back"}
          </button>
          <div className={styles.titleArea}>
            <span className={styles.logoLeaf}>🌿</span>
            <h1 className={styles.mainTitle}>
              {isArabic ? "دليل منصة نباتي" : "Nabaty Platform Guide"}
            </h1>
          </div>
          <div className={styles.spacer}></div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className={styles.container}>
        {/* القائمة الجانبية */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>
            {isArabic ? "المميزات والخدمات" : "Features & Services"}
          </h3>
          <nav className={styles.navList}>
            {features.map((feature, idx) => (
              <button
                key={feature.id}
                onClick={() => handleTabChange(idx)}
                className={`${styles.navItem} ${idx === activeIdx ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>{feature.icon}</span>
                <span className={styles.navText}>{feature.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* مساحة العرض الرئيسية */}
        <main className={styles.contentArea}>
          <div className={`${styles.displayCard} ${fade ? styles.fadeOut : styles.fadeIn}`}>
            
            {/* عنوان البطاقة */}
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>{activeFeature.icon}</div>
              <div>
                <h2 className={styles.cardTitle}>{activeFeature.title}</h2>
                <p className={styles.cardSubtitle}>{activeFeature.subtitle}</p>
              </div>
            </div>

            {/* تفاصيل الميزة */}
            <div className={styles.cardBody}>
              <h4 className={styles.detailsHeading}>
                {isArabic ? "كيف تعمل هذه الميزة؟" : "How does it work?"}
              </h4>
              <div className={styles.detailsGrid}>
                {activeFeature.details.map((detail, i) => (
                  <div key={i} className={styles.detailBox}>
                    <div className={styles.detailBoxHeader}>
                      <span className={styles.checkIcon}>✓</span>
                      <h5 className={styles.detailTitle}>{detail.title}</h5>
                    </div>
                    <p className={styles.detailDesc}>{detail.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* زر التوجيه */}
            <div className={styles.cardFooter}>
              <button 
                className={styles.actionBtn}
                onClick={() => navigate(activeFeature.route)}
              >
                {activeFeature.btnText}
                <span className={styles.actionIcon}>{isArabic ? "←" : "→"}</span>
              </button>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
