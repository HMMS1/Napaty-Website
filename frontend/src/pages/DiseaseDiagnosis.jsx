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
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

      const status = err?.response?.status;
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.detail;

      let message = isArabic
        ? "حصل خطأ أثناء تشخيص الصورة"
        : "An error occurred while diagnosing the image";

      if (status === 401) {
        message = isArabic
          ? "عليك تسجّل الدخول أولاً لتتمكن من رفع الصورة"
          : "You need to log in first to upload the image";
      } else if (status === 403) {
        message = isArabic
          ? "ليس لديك صلاحية لرفع الصورة"
          : "You do not have permission to upload the image";
      } else if (backendError) {
        message = getLocalizedMessage(backendError);
      }

      setResult({
        success: false,
        message,
        status,
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isArabic ? "تشخيص أمراض النبات" : "Plant Disease Diagnosis"}</h2>
        <p>
          {isArabic
            ? "قم برفع صورة للنبات المصاب للحصول على تشخيص دقيق وعلاج مناسب"
            : "Upload an image of the infected plant to get an accurate diagnosis and suitable treatment"}
        </p>
      </div>

      <div className="diagnosis-container">
        <div className="upload-section">
          <div className="model-switcher">
            <span className="model-switcher-label">Model</span>

            <div className="model-tabs">
              <button
                type="button"
                className={`model-tab ${selectedModel === "7.1" ? "active" : ""}`}
                onClick={() => setSelectedModel("7.1")}
                disabled={isLoading}
              >
                7.1
              </button>

              <button
                type="button"
                className={`model-tab ${selectedModel === "7.2" ? "active" : ""}`}
                onClick={() => setSelectedModel("7.2")}
                disabled={isLoading}
              >
                7.2
              </button>
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

                  <p>
                    <b>{isArabic ? "التشخيص:" : "Diagnosis:"}</b>{" "}
                    {prediction.diagnosis}
                  </p>

                  {prediction.treatment && (
                    <p>
                      <b>{isArabic ? "العلاج:" : "Treatment:"}</b>{" "}
                      {prediction.treatment}
                    </p>
                  )}

                  {aiResult?.confidence_percent && (
                    <p>
                      <b>{isArabic ? "نسبة الثقة:" : "Confidence:"}</b>{" "}
                      {aiResult.confidence_percent}%
                    </p>
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
