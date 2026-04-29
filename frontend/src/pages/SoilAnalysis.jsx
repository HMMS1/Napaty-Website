import React, { useState } from 'react';
import { FaSeedling, FaCheckCircle, FaLeaf } from 'react-icons/fa';
import "../style/SoilAnalysis.css";

const API = process.env.REACT_APP_API_URL;

const SoilAnalysis = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentResult = analysisResult?.translations?.[language]
    ? {
        soilType: analysisResult.translations[language].soil_type,
        plants: analysisResult.translations[language].plants,
        fertilizers: analysisResult.translations[language].fertilizers,
      }
    : analysisResult;

  const soilTypes = [
    {
      id: 'sandy',
      name: isArabic ? 'تربة رملية' : 'Sandy Soil',
      description: isArabic ? 'حبيبات كبيرة، تصريف مائي سريع' : 'Large particles, fast drainage'
    },
    {
      id: 'clay',
      name: isArabic ? 'تربة طينية' : 'Clay Soil',
      description: isArabic ? 'حبيبات دقيقة، تحتفظ بالماء' : 'Fine particles, retains water'
    },
    {
      id: 'loamy',
      name: isArabic ? 'تربة طميية' : 'Loamy Soil',
      description: isArabic ? 'مزيج متوازن، أفضل للزراعة' : 'Balanced mix, best for farming'
    },
    {
      id: 'silty',
      name: isArabic ? 'تربة سلتية' : 'Silty Soil',
      description: isArabic ? 'حبيبات متوسطة، خصبة' : 'Medium particles, fertile'
    }
  ];

  const handleSoilTypeChange = (soilId) => {
    setSelectedSoilType(soilId);
  };

  const handleAnalysis = async (e) => {
    if (e) e.preventDefault();

    if (!selectedSoilType) {
      alert(isArabic ? 'يرجى اختيار نوع التربة' : 'Please select a soil type');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API}/api/soil/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_type: selectedSoilType,
          language: language
        }),
      });

      if (response.status === 401) {
        alert(
          isArabic
            ? 'لازم تخلي ال API AllowAny في Django'
            : 'You need to make the API AllowAny in Django'
        );
        return;
      }

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();

      setAnalysisResult({
        soilType: data.soil_type || data.soilType || (isArabic ? 'غير معروف' : 'Unknown'),
        plants: Array.isArray(data.plants) ? data.plants : [],
        fertilizers: Array.isArray(data.fertilizers) ? data.fertilizers : [],
        translations: data.translations || null
      });

    } catch (error) {
      console.error(error);
      alert(
        isArabic
          ? 'حصل خطأ في الاتصال بالسيرفر. تأكد أن Django يعمل على بورت 8000'
          : 'A server connection error occurred. Make sure Django is running on port 8000'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          {isArabic
            ? 'تحليل التربة وتوصية المحاصيل'
            : 'Soil Analysis and Crop Recommendation'}
        </h2>
        <p>
          {isArabic
            ? 'اختر نوع التربة للحصول على توصيات الزراعة المناسبة'
            : 'Choose soil type to get suitable farming recommendations'}
        </p>
      </div>

      <div className="analysis-container">
        <div className="soil-selection-section">
          <h3 className="section-title">
            <FaSeedling /> {isArabic ? 'اختر نوع التربة' : 'Choose Soil Type'}
          </h3>

          <div className="soil-types-grid">
            {soilTypes.map((soil) => (
              <label key={soil.id} className="soil-type-label">
                <input
                  type="radio"
                  name="soilType"
                  checked={selectedSoilType === soil.id}
                  onChange={() => handleSoilTypeChange(soil.id)}
                  className="soil-radio"
                />
                <div className="soil-type-card">
                  <div className="radio-circle"></div>
                  <div className="soil-content">
                    <h4>{soil.name}</h4>
                    <p>{soil.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="analysis-actions">
            <button
              type="button"
              onClick={(e) => handleAnalysis(e)}
              disabled={!selectedSoilType || isLoading}
              className={`analyze-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {isArabic ? 'جاري التحليل...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {isArabic ? 'المحاصيل والأسمدة المناسبة' : 'Suitable Crops and Fertilizers'}
                </>
              )}
            </button>
          </div>
        </div>

        {currentResult && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>{isArabic ? 'نتائج التحليل' : 'Analysis Results'}</h3>
            </div>

            <div className="soil-result-card">
              <div className="soil-type-banner">
                <h4>
                  {isArabic ? 'نوع التربة:' : 'Soil Type:'} {currentResult.soilType}
                </h4>
              </div>

              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h5><FaLeaf /> {isArabic ? 'المحاصيل المناسبة' : 'Suitable Crops'}</h5>
                  <div className="list">
                    {currentResult.plants.length > 0 ? (
                      currentResult.plants.map((plant, idx) => (
                        <div key={idx} className="list-item">
                          <span>•</span> {plant}
                        </div>
                      ))
                    ) : (
                      <p>{isArabic ? 'لا توجد بيانات' : 'No data available'}</p>
                    )}
                  </div>
                </div>

                <div className="recommendation-card">
                  <h5>{isArabic ? 'الأسمدة المناسبة' : 'Suitable Fertilizers'}</h5>
                  <div className="list">
                    {currentResult.fertilizers.length > 0 ? (
                      currentResult.fertilizers.map((fertilizer, idx) => (
                        <div key={idx} className="list-item">
                          <span>•</span> {fertilizer}
                        </div>
                      ))
                    ) : (
                      <p>{isArabic ? 'لا توجد بيانات' : 'No data available'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilAnalysis;
