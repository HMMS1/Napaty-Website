import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSeedling,
  FaLeaf,
  FaTint,
  FaBug,
  FaUserTie,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "../style/Welcome.module.css";

function Welcome({ language = "ar" }) {
  const navigate = useNavigate();
  const isArabic = language === "ar";

  const handleGetStarted = () => {
    navigate("/login");
  };

  const text = {
    heroTitle: isArabic ? "مرحباً بك في" : "Welcome to",
    brand: isArabic ? "نباتي" : "Napaty",
    platformTitle: isArabic
      ? "المنصة الزراعية الذكية لكل ما يحتاجه المزارع العصري"
      : "The smart agricultural platform for everything modern farmers need",
    description: isArabic
      ? "حلول زراعية متكاملة مدعومة بالذكاء الاصطناعي لتشخيص الأمراض، تحليل التربة، استكشاف المواسم، والتواصل مع الخبراء في تجربة احترافية متكاملة."
      : "Integrated AI-powered agricultural solutions for disease diagnosis, soil analysis, seasonal guidance, and direct expert consultation in one premium experience.",
    start: isArabic ? "ابدأ الآن" : "Get Started",
    explore: isArabic ? "اكتشف خدماتنا" : "Explore Services",
    services: isArabic ? "خدمات مصممة لخدمتك" : "Services Designed for You",
    steps: isArabic ? "ابدأ في 3 خطوات فقط" : "Start in Just 3 Steps",
    cta: isArabic ? "جاهز لنقلة نوعية في رحلتك الزراعية؟" : "Ready to transform your agricultural journey?",
    ctaDesc: isArabic
      ? "ابدأ الآن واستفد من أدوات ذكية وتجربة استخدام راقية تساعدك في اتخاذ قرارات زراعية أفضل."
      : "Start now and benefit from smart tools and a refined experience that helps you make better agricultural decisions.",
    loginNow: isArabic ? "سجل الدخول الآن" : "Login Now",
  };

  const features = [
    {
      icon: <FaLeaf />,
      title: isArabic ? "تشخيص الأمراض النباتية" : "Plant Disease Diagnosis",
      description: isArabic
        ? "ارفع صورة النبات واحصل على تشخيص سريع ودقيق."
        : "Upload a plant image and get fast, accurate diagnosis.",
    },
    {
      icon: <FaTint />,
      title: isArabic ? "تحليل التربة" : "Soil Analysis",
      description: isArabic
        ? "افهم نوع التربة وخصائصها لتحسين الزراعة."
        : "Understand your soil type and properties to improve cultivation.",
    },
    {
      icon: <FaSeedling />,
      title: isArabic ? "النباتات والفصول" : "Plants & Seasons",
      description: isArabic
        ? "اعرف أفضل النباتات المناسبة لكل موسم."
        : "Discover the best plants for each season.",
    },
    {
      icon: <FaShoppingCart />,
      title: isArabic ? "المتجر الزراعي" : "Agricultural Store",
      description: isArabic
        ? "تسوق احتياجاتك الزراعية بسهولة وثقة."
        : "Shop agricultural essentials with ease and confidence.",
    },
    {
      icon: <FaUserTie />,
      title: isArabic ? "استشارات الخبراء" : "Expert Consultation",
      description: isArabic
        ? "تواصل مع خبراء متخصصين لاتخاذ القرار الصحيح."
        : "Connect with specialists to make the right decisions.",
    },
    {
      icon: <FaBug />,
      title: isArabic ? "مكافحة الآفات" : "Pest Control",
      description: isArabic
        ? "تعرف على أفضل طرق الوقاية والعلاج."
        : "Learn the best methods for pest prevention and treatment.",
    },
  ];

  const statistics = [
    { number: "10,000+", label: isArabic ? "مزارع نشط" : "Active Farmers" },
    { number: "500+", label: isArabic ? "خبير زراعي" : "Agricultural Experts" },
    { number: "50,000+", label: isArabic ? "تشخيص مكتمل" : "Completed Diagnoses" },
    { number: "95%", label: isArabic ? "رضا المستخدمين" : "User Satisfaction" },
  ];

  const steps = [
    {
      number: "1",
      title: isArabic ? "أنشئ حسابك" : "Create Your Account",
      description: isArabic
        ? "ابدأ بتسجيل الدخول للوصول إلى جميع الأدوات."
        : "Sign in to access all platform tools.",
    },
    {
      number: "2",
      title: isArabic ? "اختر الخدمة" : "Choose a Service",
      description: isArabic
        ? "حدد الخدمة المناسبة حسب احتياجك الزراعي."
        : "Select the service that fits your agricultural needs.",
    },
    {
      number: "3",
      title: isArabic ? "احصل على النتائج" : "Get Smart Results",
      description: isArabic
        ? "استفد من التحليلات والتوصيات لتحسين قراراتك."
        : "Benefit from insights and recommendations to improve decisions.",
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne}></div>
        <div className={styles.heroGlowTwo}></div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>
              {isArabic ? "حلول زراعية ذكية" : "Smart Agricultural Solutions"}
            </span>

            <h1 className={styles.title}>
              {text.heroTitle} <span className={styles.highlight}>{text.brand}</span>
            </h1>

            <h2 className={styles.subtitle}>{text.platformTitle}</h2>

            <p className={styles.description}>{text.description}</p>

            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn} onClick={handleGetStarted}>
                {text.start}
                <span className={styles.btnIcon}>
                  <FaArrowLeft />
                </span>
              </button>

              <button className={styles.secondaryBtn}>
                {text.explore}
              </button>
            </div>

            <div className={styles.miniStats}>
              {statistics.slice(0, 3).map((stat, index) => (
                <div key={index} className={styles.miniStatItem}>
                  <h4>{stat.number}</h4>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageRing}></div>
              <img
                src="/images/Capture.png"
                alt="hero"
                className={styles.heroImage}
              />
              <div className={styles.floatingCardTop}>
                <span>{isArabic ? "  تشخيص ذكي" : "Intelligent diagnosis"}</span>
              </div>
              <div className={styles.floatingCardBottom}>
                <span>{isArabic ? "نتائج أدق" : "Better Results"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {statistics.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <h3 className={styles.statNum}>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>
            {isArabic ? "خدماتنا" : "Our Services"}
          </span>
          <h2 className={styles.sectionTitle}>{text.services}</h2>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>
            {isArabic ? "خطوات بسيطة" : "Simple Process"}
          </span>
          <h2 className={styles.sectionTitle}>{text.steps}</h2>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>{text.cta}</h2>
          <p className={styles.ctaDesc}>{text.ctaDesc}</p>
          <button className={styles.primaryBtn} onClick={handleGetStarted}>
            {text.loginNow}
            <span className={styles.btnIcon}>
              <FaArrowLeft />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Welcome;