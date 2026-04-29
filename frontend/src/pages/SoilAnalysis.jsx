import React, { useState, useEffect } from 'react';
import { FaSeedling, FaCheckCircle, FaLeaf } from 'react-icons/fa';
import "../style/SoilAnalysis.css";

const API = process.env.REACT_APP_API_URL;

const SoilAnalysis = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 NEW: states للترجمة
  const [translatedPlants, setTranslatedPlants] = useState([]);
  const [translatedFertilizers, setTranslatedFertilizers] = useState([]);
  const [translatedSoil, setTranslatedSoil] = useState('');

  // 🔥 NEW: cache
  const cache = {};

  const translateText = async (text, targetLang) => {
    const key = text + targetLang;
    if (cache[key]) return cache[key];

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|${targetLang}`
      );
      const data = await res.json();
      const translated = data.responseData.translatedText;
      cache[key] = translated;
      return translated;
    } catch {
      return text;
    }
  };

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
          soil_type: selectedSoilType
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
      console.log("API Response:", data);

      const result = {
        soilType: data.soil_type || data.soilType || (isArabic ? 'غير معروف' : 'Unknown'),
        plants: Array.isArray(data.plants)
          ? data.plants
          : typeof data.plants === 'string'
          ? data.plants.split(/،|,/)
          : [],
        fertilizers: Array.isArray(data.fertilizers)
          ? data.fertilizers
          : typeof data.fertilizers === 'string'
          ? data.fertilizers.split(/،|,/)
          : []
      };

      setAnalysisResult(result);

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

  // 🔥 NEW: ترجمة النتائج لما اللغة EN
  useEffect(() => {
    const translateAll = async () => {
      if (!analysisResult) return;

      if (language === 'en') {
        const plants = await Promise.all(
          analysisResult.plants.map(p => translateText(p, 'en'))
        );

        const fertilizers = await Promise.all(
          analysisResult.fertilizers.map(f => translateText(f, 'en'))
        );

        const soil = await translateText(analysisResult.soilType, 'en');

        setTranslatedPlants(plants);
        setTranslatedFertilizers(fertilizers);
        setTranslatedSoil(soil);
      } else {
        setTranslatedPlants(analysisResult.plants);
        setTranslatedFertilizers(analysisResult.fertilizers);
        setTranslatedSoil(analysisResult.soilType);
      }
    };

    translateAll();
  }, [analysisResult, language]);

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

        {analysisResult && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>{isArabic ? 'نتائج التحليل' : 'Analysis Results'}</h3>
            </div>

            <div className="soil-result-card">
              <div className="soil-type-banner">
                <h4>
                  {isArabic ? 'نوع التربة:' : 'Soil Type:'} {translatedSoil}
                </h4>
              </div>

              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h5><FaLeaf /> {isArabic ? 'المحاصيل المناسبة' : 'Suitable Crops'}</h5>
                  <div className="list">
                    {translatedPlants.length > 0 ? (
                      translatedPlants.map((plant, idx) => (
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
                    {translatedFertilizers.length > 0 ? (
                      translatedFertilizers.map((fertilizer, idx) => (
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
