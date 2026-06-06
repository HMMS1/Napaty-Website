import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../style/Guidepage.module.css';

// بيانات الدليل مدمج فيها الشرح المبسط للمرشد + التفاصيل التقنية الفخمة
const getGuideSteps = (isArabic) => [
  {
    id: 1,
    icon: "🔬",
    title: isArabic ? "تشخيص الأمراض بالذكاء الاصطناعي" : "AI Disease Diagnosis",
    guideText: isArabic 
      ? "أهلاً بيك يا بطل! أول ميزة عندنا هي طبيبك الزراعي. لو لقيت نباتك تعبان، صور الورقة وارفعها هنا.. عندنا نظامين للذكاء الاصطناعي هيحللوا الصورة في ثواني ويدوك العلاج المظبوط."
      : "Welcome! Our first feature is your plant doctor. Upload a picture of a sick plant, and our dual AI models will analyze it instantly and provide a treatment plan.",
    details: isArabic ? [
      { title: "نموذج 7.1 (دقة المختبرات)", desc: "مخصص للصور عالية الجودة المتصورة في معامل ومختبرات." },
      { title: "نموذج 7.2 (الوضع الحقلي)", desc: "مخصص للصور اللي بتصورها بموبايلك في الأرض أو من جوجل." },
      { title: "خطة العلاج", desc: "بمجرد التشخيص، النظام هيوفرلك خطوات العلاج والأدوية المناسبة." }
    ] : [
      { title: "Model 7.1 (Lab Precision)", desc: "For high-quality images taken in laboratories." },
      { title: "Model 7.2 (Field Mode)", desc: "For mobile or internet photos." },
      { title: "Treatment Plan", desc: "Step-by-step treatment and medication guides." }
    ],
    route: "/diagnosis",
    btnText: isArabic ? "جرب التشخيص الآن" : "Try Diagnosis Now"
  },
  {
    id: 2,
    icon: "🌱",
    title: isArabic ? "أنواع التربة والمحاصيل" : "Soil Types & Crops",
    guideText: isArabic
      ? "تاني حاجة، أرضك كنز! عشان كدا خصصنا القسم دا عشان يقولك إيه أنسب محصول تزرعه بناءً على نوع تربتك، وإيه الأسمدة اللي محتاجها عشان الإنتاج يزيد."
      : "Secondly, your land is a treasure! This section tells you the most suitable crops for your soil and the fertilizers needed for maximum yield.",
    details: isArabic ? [
      { title: "المحاصيل المناسبة", desc: "تعرف على أفضل المحاصيل التي تتأقلم مع طبيعة تربتك." },
      { title: "برامج التسميد", desc: "دليل شامل لأنواع الأسمدة والكميات الموصى بها لكل محصول." }
    ] : [
      { title: "Suitable Crops", desc: "Discover crops that adapt best to your soil." },
      { title: "Fertilization", desc: "Comprehensive guide for fertilizers and quantities." }
    ],
    route: "/soil-analysis",
    btnText: isArabic ? "اكتشف تربتك" : "Discover Soil"
  },
  {
    id: 3,
    icon: "📅",
    title: isArabic ? "دراسة الجدوى والمواسم" : "Feasibility & Seasons",
    guideText: isArabic
      ? "تالت ميزة هتوفر عليك حيرة الحسابات! هنا مش بس بنقولك تزرع إمتى وإزاي، دا إحنا بنعملك دراسة جدوى كاملة ومفصلة لزراعة الفدان من الألف للياء."
      : "The third feature saves you calculation headaches! We provide a full feasibility study for planting a feddan, from A to Z.",
    details: isArabic ? [
      { title: "دليل الزراعة", desc: "خطوات زراعة كل نبات بالتفصيل حسب موسمه." },
      { title: "تكلفة زراعة الفدان", desc: "حساب إجمالي لمتوسط التكلفة المتوقعة لزراعة مساحة فدان." },
      { title: "تفصيل التكاليف", desc: "تسعير دقيق لكل خطوة (حرث، بذور، أسمدة، وعمالة)." }
    ] : [
      { title: "Planting Guide", desc: "Detailed seasonal planting steps." },
      { title: "Cost per Feddan", desc: "Total expected cost to farm one feddan." },
      { title: "Detailed Costs", desc: "Precise pricing for plowing, seeds, labor, etc." }
    ],
    route: "/plants-seasons",
    btnText: isArabic ? "احسب تكلفتك" : "Calculate Cost"
  },
  {
    id: 4,
    icon: "🛒",
    title: isArabic ? "المتجر الزراعي المتكامل" : "Comprehensive Agri-Store",
    guideText: isArabic
      ? "رابع ميزة هي متجرك الخاص. أي أداة، أو بذرة، أو سماد هتحتاجه هتلاقيه هنا بأسعار تنافسية، وتقدر تدفع بالوسيلة اللي تريحك وتوصلك لحد المزرعة."
      : "The fourth feature is your store. Any tool, seed, or fertilizer you need is here. Pay easily and get it delivered to your farm.",
    details: isArabic ? [
      { title: "منتجات متنوعة", desc: "بذور، معدات، وأسمدة عالية الجودة." },
      { title: "دفع مرن وآمن", desc: "ادفع بكل سهولة عن طريق (InstaPay، ڤودافون كاش، أو الفيزا)." },
      { title: "توصيل سريع", desc: "نظام لوجستي يضمن وصول طلباتك بأمان وسرعة." }
    ] : [
      { title: "Diverse Products", desc: "High-quality seeds, tools, and fertilizers." },
      { title: "Flexible Payment", desc: "Pay via InstaPay, Vodafone Cash, or Visa." },
      { title: "Fast Delivery", desc: "Secure and swift delivery logistics." }
    ],
    route: "/store",
    btnText: isArabic ? "تصفح المتجر" : "Browse Store"
  },
  {
    id: 5,
    icon: "👨‍🌾",
    title: isArabic ? "استشارات الخبراء" : "Expert Consultations",
    guideText: isArabic
      ? "خامس ميزة.. لو محتاج رأي خبير تقيل، تقدر تدخل هنا تحجز جلسة مع كبار المهندسين الزراعيين. ابعت طلبك، ولما يوافق، هتبدأ معاه شات مباشر في الموقع!"
      : "Fifth... Need a senior expert's opinion? Book a session with top agricultural engineers. Send a request and start a direct chat!",
    details: isArabic ? [
      { title: "حجز الجلسات", desc: "حدد الوقت المناسب لك لإجراء الاستشارة." },
      { title: "إرسال وموافقة", desc: "أرسل طلبك للمستشار وانتظر قبول الجلسة." },
      { title: "شات مباشر", desc: "تواصل مع الخبير عبر غرفة دردشة متقدمة داخل المنصة." }
    ] : [
      { title: "Book Sessions", desc: "Choose your suitable consultation time." },
      { title: "Request System", desc: "Send your request and await approval." },
      { title: "Live Chat", desc: "Communicate via an advanced in-platform chat room." }
    ],
    route: "/consultation",
    btnText: isArabic ? "احجز استشارتك" : "Book Consultation"
  },
  {
    id: 6,
    icon: "🤖",
    title: isArabic ? "المساعد الذكي AgriChat" : "AgriChat Assistant",
    guideText: isArabic
      ? "سادس حاجة، صديقك اللي مابينامش! AgriChat دا روبوت زراعي متخصص، أسأله في أي وقت في اليوم هيرد عليك فوراً وبدقة عالية جداً."
      : "Sixth, your sleepless friend! AgriChat is an AI bot. Ask it anything anytime, and it will answer instantly and accurately.",
    details: isArabic ? [
      { title: "متوفر 24/7", desc: "جاهز للرد على استفساراتك في أي وقت ليلاً أو نهاراً." },
      { title: "خبرة متكاملة", desc: "مدرب على أضخم قواعد البيانات الزراعية لضمان دقة الإجابة." }
    ] : [
      { title: "Available 24/7", desc: "Ready to answer anytime, day or night." },
      { title: "Integrated Expertise", desc: "Trained on vast agricultural databases." }
    ],
    route: "/agri-chat",
    btnText: isArabic ? "اسأل AgriChat" : "Ask AgriChat"
  },
  {
    id: 7,
    icon: "🪨",
    title: isArabic ? "التحليل المتقدم للتربة" : "Advanced Soil Analysis",
    guideText: isArabic
      ? "الميزة السابعة صممناها عشان تناسب الكل. سواء كنت مزارع بسيط عاوز نصيحة سريعة، أو خبير زراعي معاه نتايج تحليل معملي للتربة، هنقدر نساعدك."
      : "The seventh feature suits everyone. Whether you're a simple farmer wanting quick advice, or an expert with lab results, we can help.",
    details: isArabic ? [
      { title: "طريقة المزارع البسيط", desc: "أدخل (محافظتك، نوع التربة، والموسم) والذكاء الاصطناعي هيرشحلك المحصول." },
      { title: "طريقة الخبير", desc: "أدخل نسب (النيتروجين، البوتاسيوم، الفوسفور) للحصول على تحليل معملي شديد الدقة." }
    ] : [
      { title: "Simple Farmer Mode", desc: "Input location and season for AI crop recommendations." },
      { title: "Expert Mode", desc: "Input NPK element ratios for highly precise analysis." }
    ],
    route: "/crop-recommendation",
    btnText: isArabic ? "ابدأ تحليل التربة" : "Start Soil Analysis"
  },
  {
    id: 8,
    icon: "👥",
    title: isArabic ? "مجتمع نباتي (Community)" : "Nabaty Community",
    guideText: isArabic
      ? "أخيراً وليس آخراً، أنت مش لوحدك! مجتمع نباتي بيجمع كل المزارعين. انشر صور محصولك، شارك نجاحك، وتفاعل مع بوستات غيرك عشان الكل يستفيد من خبرة بعض."
      : "Last but not least, you're not alone! Nabaty Community brings farmers together. Post photos, share successes, and interact with others.",
    details: isArabic ? [
      { title: "نشر ومشاركة", desc: "شارك يومياتك الزراعية وتحدياتك مع آلاف المستخدمين." },
      { title: "تفاعل اجتماعي", desc: "الإعجابات والتعليقات تتيح لك تبادل الآراء مع المزارعين." },
      { title: "تبادل خبرات", desc: "استفد من الأخطاء والنجاحات الحقيقية للمجتمع الزراعي." }
    ] : [
      { title: "Post & Share", desc: "Share your farming diary and challenges." },
      { title: "Social Interaction", desc: "Likes and comments let you exchange views." },
      { title: "Exchange Experience", desc: "Learn from real successes and mistakes." }
    ],
    route: "/community",
    btnText: isArabic ? "انضم للمجتمع" : "Join Community"
  }
];

// دالة تأثير الآلة الكاتبة بأسلوب احترافي
function Typewriter({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <p className={styles.typewriterText}>{displayedText}</p>;
}

export default function Guidepage({ language = "ar" }) {
  const navigate = useNavigate();
  const isArabic = language === "ar";
  const steps = getGuideSteps(isArabic);
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = steps[activeStep];

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.guidePage}>
      {/* الهيدر العلوي */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            {isArabic ? "→ رجوع للرئيسية" : "← Back Home"}
          </button>
          <div className={styles.titleArea}>
            <span className={styles.logoLeaf}>🌿</span>
            <h1 className={styles.mainTitle}>
              {isArabic ? "جولة في منصة نباتي" : "Nabaty Platform Tour"}
            </h1>
          </div>
          <div className={styles.stepCounter}>
            {activeStep + 1} / {steps.length}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        
        {/* قسم المرشد الزراعي (الأفاتار + فقاعة الكلام) */}
        <div className={styles.guideCharacterSection}>
          <div className={styles.avatarCircle}>
            👨‍🌾
          </div>
          <div className={styles.speechBubble}>
            <div className={styles.speechTail}></div>
            <h3 className={styles.guideName}>
              {isArabic ? "المهندس نباتي يوضح:" : "Eng. Nabaty Explains:"}
            </h3>
            {/* استخدام مفتاح فريد يعيد تحميل الـ Typewriter عند تغيير الخطوة */}
            <Typewriter key={currentStep.id} text={currentStep.guideText} />
          </div>
        </div>

        {/* الكارت الاحترافي لتفاصيل الميزة */}
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={styles.featureIcon}>{currentStep.icon}</span>
            <h2 className={styles.featureTitle}>{currentStep.title}</h2>
          </div>

          <div className={styles.featureDetails}>
            {currentStep.details.map((item, idx) => (
              <div key={idx} className={styles.detailItem}>
                <div className={styles.checkMark}>✓</div>
                <div>
                  <h4 className={styles.detailTitle}>{item.title}</h4>
                  <p className={styles.detailDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* خط الزمن للتنقل بين الخطوات */}
          <div className={styles.timeline}>
            {steps.map((step, idx) => (
              <div 
                key={step.id} 
                onClick={() => setActiveStep(idx)}
                className={`${styles.timelineDot} ${idx === activeStep ? styles.timelineActive : ''} ${idx < activeStep ? styles.timelineDone : ''}`}
              ></div>
            ))}
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.navButtons}>
              <button 
                className={styles.navBtnSecondary} 
                onClick={prevStep} 
                disabled={activeStep === 0}
              >
                {isArabic ? "السابق" : "Previous"}
              </button>
              <button 
                className={styles.navBtnPrimary} 
                onClick={nextStep} 
                disabled={activeStep === steps.length - 1}
              >
                {isArabic ? "التالي" : "Next"}
              </button>
            </div>
            
            <button 
              className={styles.actionBtn}
              onClick={() => navigate(currentStep.route)}
            >
              {currentStep.btnText}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
