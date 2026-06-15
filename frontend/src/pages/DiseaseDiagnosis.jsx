import React, { useState } from "react";
import { FaCloudUploadAlt, FaImage, FaSpinner, FaCheckCircle } from "react-icons/fa";
import api from "../api/api";
import "../style/DiseaseDiagnosis.css";

const API = process.env.REACT_APP_API_URL;

const DiseaseDiagnosis = ({ language = "ar" }) => {
  const isArabic = language === "ar";

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState("7.1");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const modelOptions = ["7.1", "7.2"];

  const translateTopResult = (text) => {
    if (!text) return "";

    const map = {
      Potato: "بطاطس",
      Tomato: "طماطم",
      Grape: "عنب",
      Apple: "تفاح",
      Corn: "ذرة",
      BellPepper: "فلفل",
      Pepper: "فلفل",
      Healthy: "سليم",
      "Late Blight": "اللفحة المتأخرة",
      "Early Blight": "اللفحة المبكرة",
      "Bacterial Spot": "تبقع بكتيري",
      "Leaf Mold": "عفن الأوراق",
      "Septoria Leaf Spot": "تبقع أوراق السبتوريا",
      "Mosaic Virus": "فيروس الموزايك",
      "Yellow Leaf Curl Virus": "فيروس تجعد واصفرار الأوراق",
      Scab: "الجرب",
      "Cedar Rust": "صدأ الأرز",
      "Black Rot": "العفن الأسود",
      "Gray Leaf Spot": "تبقع الأوراق الرمادي",
      "Common Rust": "الصدأ الشائع",
      "Northern Leaf Blight": "لفحة الأوراق الشمالية",
      "Target Spot": "تبقع الهدف",
      Rust: "الصدأ",
      Mildew: "البياض الدقيقي",
    };

    return map[text] || text;
  };

  const getLocalizedMessage = (message) => {
    if (!message) {
      return isArabic ? "تم تشخيص الصورة بنجاح" : "Image diagnosed successfully";
    }

    if (typeof message === "string") {
      return message;
    }

    return isArabic
      ? message.ar || message.en || "تم تشخيص الصورة بنجاح"
      : message.en || message.ar || "Image diagnosed successfully";
  };

  const pickFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({
        success: false,
        message: isArabic
          ? "من فضلك اختار صورة فقط (JPG/PNG/WEBP)"
          : "Please select an image only (JPG/PNG/WEBP)",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setResult({
        success: false,
        message: isArabic
          ? "حجم الصورة أكبر من 10MB"
          : "Image size is larger than 10MB",
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    pickFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const resetImage = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);
    setIsModelDropdownOpen(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("model_version", selectedModel);

      const res = await api.post("/api/diagnosis/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("DIAGNOSIS RESPONSE:", res.data);

      setResult({
        success: true,
        message: getLocalizedMessage(res.data?.message),
        data: res.data,
      });
    } catch (err) {
      console.log("DIAGNOSIS ERROR:", err?.response?.data || err.message);

      const statusCode = err?.response?.status;
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.detail;

      let message = isArabic
        ? "حصل خطأ أثناء تشخيص الصورة"
        : "An error occurred while diagnosing the image";

      if (statusCode === 401) {
        message = isArabic
          ? "عليك تسجّل الدخول أولاً لتتمكن من رفع الصورة"
          : "You need to log in first to upload the image";
      } else if (statusCode === 403) {
        message = isArabic
          ? "ليس لديك صلاحية لرفع الصورة"
          : "You do not have permission to upload the image";
      } else if (backendError) {
        message = getLocalizedMessage(backendError);
      }

      setResult({
        success: false,
        message,
        status: statusCode,
        data: err?.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadedImagePath =
    result?.success
      ? result?.data?.image?.image || result?.data?.data?.image || result?.data?.image
      : null;

  const prediction =
    isArabic
      ? result?.data?.prediction?.ar || result?.data?.prediction
      : result?.data?.prediction?.en || result?.data?.prediction;

  const aiResult = result?.data?.ai_result;
  const topResults = aiResult?.raw_response?.top5?.slice(0, 4) || [];

  const treatmentPlan = isArabic
    ? result?.data?.treatment_plan?.ar
    : result?.data?.treatment_plan?.en;

  const diseaseCauses = isArabic
    ? result?.data?.disease_causes?.ar
    : result?.data?.disease_causes?.en;

  const renderTreatmentPlan = (text) => {
    if (!text) return null;

    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/#{1,4}\s*/g, "")
      .replace(/\|.*\|/g, "")
      .replace(/^[-=]{3,}$/gm, "")
      .trim();

    const steps = cleaned
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "").trim())
      .filter((l) => l.length > 0);

    return (
      <div className="treatment-grid">
        {steps.map((step, i) => (
          <div key={i} className="treatment-step">
            <span className="step-number" style={{ flexShrink: 0 }}>{i + 1}</span>
            <span className="treatment-step-text">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCauses = (text) => {
    if (!text) return null;

    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/#{1,4}\s*/g, "")
      .trim();

    const causes = cleaned
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "").trim())
      .filter((l) => l.length > 0);

    return (
      <div className="causes-list">
        {causes.map((cause, i) => (
          <div key={i} className="causes-item">
            <span className="causes-bullet" />
            <span className="causes-item-text">{cause}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isArabic ? "تشخيص أمراض النبات" : "Plant Disease Diagnosis"}</h2>
        <p>
          {isArabic
            ? "قم برفع صورة للنبات المصاب للحصول على تشخيص دقيق وخطة علاج مناسبة"
            : "Upload an image of the infected plant to get an accurate diagnosis and treatment plan"}
        </p>
      </div>

      <div className="diagnosis-container">
        <div className="upload-section">
          <div className="model-select-wrapper">
            <span className="model-select-label">Model</span>

            <div className={`custom-model-select ${isModelDropdownOpen ? "open" : ""}`}>
              <button
                type="button"
                className="custom-model-trigger"
                onClick={() => !isLoading && setIsModelDropdownOpen((prev) => !prev)}
                disabled={isLoading}
              >
                <span>{selectedModel}</span>
                <span className="custom-model-arrow">⌄</span>
              </button>

              {isModelDropdownOpen && (
                <div className="custom-model-menu">
                  {modelOptions.map((model) => (
                    <button
                      key={model}
                      type="button"
                      className={`custom-model-option ${
                        selectedModel === model ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelDropdownOpen(false);
                      }}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${
              selectedImage ? "has-image" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="image-preview">
                <img
                  src={selectedImage}
                  alt={isArabic ? "النبات المصاب" : "Infected Plant"}
                />

                <div className="image-overlay">
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={resetImage}
                    disabled={isLoading}
                  >
                    <FaImage /> {isArabic ? "تغيير الصورة" : "Change Image"}
                  </button>
                </div>
              </div>
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  disabled={isLoading}
                />

                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <h3>{isArabic ? "رفع صورة النبات" : "Upload Plant Image"}</h3>

                  <p>
                    {isArabic
                      ? "اسحب وأفلت الصورة هنا أو انقر للاختيار"
                      : "Drag and drop the image here or click to choose"}
                  </p>

                  <div className="upload-features">
                    <span>
                      {isArabic
                        ? "يدعم: JPG, PNG, WEBP"
                        : "Supports: JPG, PNG, WEBP"}
                    </span>
                    <span>
                      {isArabic ? "الحد الأقصى: 10MB" : "Maximum size: 10MB"}
                    </span>
                  </div>
                </div>
              </label>
            )}
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isLoading}
              className={`diagnose-btn ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  {isArabic ? "جاري التشخيص..." : "Diagnosing..."}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {isArabic ? "تشخيص المرض" : "Diagnose Disease"}
                </>
              )}
            </button>
          )}
        </div>

        {result && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>
                {result.success
                  ? isArabic
                    ? "تمت العملية"
                    : "Process Completed"
                  : isArabic
                  ? "حصل خطأ"
                  : "An Error Occurred"}
              </h3>
            </div>

            <div className="diagnosis-card">
              <p>
                <b>{result.message}</b>
              </p>

              {prediction && (
                <>
                  <hr />

                  <p>
                    <b>{isArabic ? "الموديل المستخدم:" : "Used Model:"}</b>{" "}
                    {selectedModel}
                  </p>

                  <p>
                    <b>{isArabic ? "النبات:" : "Plant:"}</b>{" "}
                    {prediction.plant}
                  </p>

                  <p>
                    <b>{isArabic ? "المرض:" : "Disease:"}</b>{" "}
                    {prediction.disease}
                  </p>

                  {/* ✅ نسبة الثقة - منقولة فوق أسباب المرض */}
                  {selectedModel === "7.2" && aiResult?.confidence_percent && (
                    <div className="confidence-badge-wrapper">
                      <span className="confidence-label">
                        {isArabic ? "نسبة الثقة:" : "Confidence:"}
                      </span>
                      <span className="confidence-badge">
                        {aiResult.confidence_percent}%
                      </span>
                    </div>
                  )}

                  {/* أسباب المرض المحتملة */}
                  {diseaseCauses && (
                    <div className="info-item causes-section" style={{ marginTop: "1.2rem" }}>
                      <h5>🔍 {isArabic ? "أسباب المرض المحتملة" : "Possible Disease Causes"}</h5>
                      {renderCauses(diseaseCauses)}
                    </div>
                  )}

                  {/* خطة العلاج من Groq عبر الباك */}
                  {treatmentPlan && (
                    <div className="info-item steps" style={{ marginTop: "1.2rem" }}>
                      <h5>🌿 {isArabic ? "خطة العلاج" : "Treatment Plan"}</h5>
                      {renderTreatmentPlan(treatmentPlan)}
                    </div>
                  )}

                  {selectedModel === "7.2" && topResults.length > 0 && (
                    <div className="top-predictions-box">
                      <h4>
                        {isArabic
                          ? "أقوى 4 نتائج من موديل 7.2"
                          : "Top 4 results from Model 7.2"}
                      </h4>

                      <div className="top-predictions-list">
                        {topResults.map((item, index) => {
                          const plant = item?.label?.plant || "";
                          const disease = item?.label?.disease || "";

                          return (
                            <div className="top-prediction-item" key={index}>
                              <span className="top-prediction-rank">
                                #{index + 1}
                              </span>

                              <div className="top-prediction-content">
                                <strong>
                                  {isArabic
                                    ? `${translateTopResult(plant)} - ${translateTopResult(disease)}`
                                    : `${plant} - ${disease}`}
                                </strong>

                                <small>
                                  {isArabic ? "نسبة الثقة" : "Confidence"}:{" "}
                                  {item?.confidence}%
                                </small>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {uploadedImagePath && typeof uploadedImagePath === "string" && (
                <div style={{ marginTop: 12 }}>
                  <p>
                    <b>{isArabic ? "الصورة المرفوعة:" : "Uploaded Image:"}</b>
                  </p>

                  <img
                    src={`${API}${uploadedImagePath}`}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      borderRadius: 10,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDiagnosis;
