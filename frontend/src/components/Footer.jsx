import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaLeaf,
  FaSeedling,
  FaGlobe,
  FaArrowRight,
  FaArrowLeft,
  FaRobot,
} from "react-icons/fa";
import "../style/Footer.css";

const Footer = ({ language = "ar" }) => {
  const isArabic = language === "ar";

  const text = {
    brand: isArabic ? "نباتي" : "Napaty",
    slogan: isArabic
      ? "شريكك الذكي في الزراعة الحديثة"
      : "Your smart partner in modern agriculture",
    description: isArabic
      ? "منصة متكاملة لمساعدة المزارعين في تحسين إنتاجية محاصيلهم من خلال تشخيص الأمراض وتحليل التربة ومعرفة مواسم الزراعة المناسبة."
      : "An integrated platform to help farmers improve crop productivity through disease diagnosis, soil analysis, and identifying suitable planting seasons.",

    quickLinks: isArabic ? "روابط أخري" : "Quick Links",
    diagnosis: isArabic ? "تشخيص الأمراض" : "Disease Diagnosis",
    soil: isArabic ? "تحليل التربة" : "Soil Analysis",
    plants: isArabic ? "النباتات والفصول" : "Plants & Seasons",
    store: isArabic ? "المتجر" : "Store",
    consultation: isArabic ? "الاستشارات" : "Consultation",
    cropRecommend: isArabic ? "اقتراح المحصول" : "Crop Recommendation",
    agriChat: isArabic ? "الشات الزراعي" : "Agricultural Chat",
    community: isArabic ? "المجتمع" : "Community", // ✅ تمت إضافة نص المجتمع هنا


    contact: isArabic ? "تواصل معنا" : "Contact Us",
    email: isArabic ? "البريد الإلكتروني" : "Email",
    phone: isArabic ? "الهاتف" : "Phone",

    services: isArabic ? "خدماتنا" : "Our Services",
    service1: isArabic ? "تحسين جودة الزراعة" : "Improve farming quality",
    service2: isArabic ? "مساعدة في اتخاذ القرار" : "Decision-making support",
    service3: isArabic ? "تجربة سهلة وحديثة" : "Easy modern experience",

    rights: isArabic
      ? "تم تصميمه بواسطة تيم نباتي 2026"
      : "Designed by Napaty Team 2026",
    madeWith: isArabic
      ? "تم تصميمه بعناية لخدمة المزارعين"
      : "Carefully designed to serve farmers",
  };

  const arrowIcon = isArabic
    ? <FaArrowLeft size={12} />
    : <FaArrowRight size={12} />;

  

  const services = [
    { icon: <FaSeedling />, label: text.service1 },
    { icon: <FaGlobe />, label: text.service2 },
    { icon: <FaLeaf />, label: text.service3 },
  ];

   const quickLinks = [
    { href: "/community", label: text.community }, // ✅ تمت إضافة رابط المجتمع هنا
    { href: "/crop-recommendation", label: text.cropRecommend },
    { href: "/agri-chat", label: text.agriChat },
  ];

  return (
    <footer className="footer" dir={isArabic ? "rtl" : "ltr"}>
      <div className="footer-blob-top" />
      <div className="footer-blob-bottom" />

      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand-header">
              <div className="footer-brand-icon">
                <FaLeaf size={24} />
              </div>
              <div>
                <h3 className="footer-brand-name">{text.brand}</h3>
                <p className="footer-brand-slogan">{text.slogan}</p>
              </div>
            </div>
            <p className="footer-description">{text.description}</p>
          </div>

          <div className="footer-section">
            <h4>{text.quickLinks}</h4>
            <ul className="footer-links-list">
              {quickLinks.map((item, index) => (
                <li key={index} className="footer-link-item">
                  <a href={item.href}>
                    <span>{item.label}</span>
                    <span className="footer-link-arrow">{arrowIcon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>{text.services}</h4>
            <div className="footer-services-list">
              {services.map((item, index) => (
                <div key={index} className="footer-service-item">
                  <div className="footer-service-icon">{item.icon}</div>
                  <span className="footer-service-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4>{text.contact}</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="footer-contact-icon"><FaEnvelope /></div>
                <div className="footer-contact-info">
                  <span className="footer-contact-label">{text.email}</span>
                  <a href="mailto:napatywebsite@gmail.com">
                    napatywebsite@gmail.com

                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon"><FaPhoneAlt /></div>
                <div className="footer-contact-info">
                  <span className="footer-contact-label">{text.phone}</span>
                  <a href="tel:01025058377">+201025058377</a>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon"><FaRobot /></div>
                <div className="footer-contact-info">
                  <span className="footer-contact-label">
                    {isArabic ? "المساعد الزراعي" : "Agri Assistant"}
                  </span>
                  <a href="/agri-chat">
                    {isArabic ? "افتح الشات الزراعي" : "Open Agri Chat"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{text.rights}</p>
          <p>{text.madeWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
