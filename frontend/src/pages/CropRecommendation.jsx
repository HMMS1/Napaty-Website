import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSeedling,
  FaCheckCircle,
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaSun,
  FaFlask,
} from "react-icons/fa";
import { GiWheat, GiChemicalTank } from "react-icons/gi";
import { BsCalendar2WeekFill } from "react-icons/bs";
import "../style/CropRecommendation.css";

const CropRecommendation = ({ language = "ar" }) => {
  const isArabic = language === "ar";

  const [mode, setMode] = useState("basic");

  const [governorate, setGovernorate] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");

  const [advancedForm, setAdvancedForm] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    ph: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const governorates = isArabic
    ? [
        { value: "cairo", label: "القاهرة" },
        { value: "giza", label: "الجيزة" },
        { value: "alexandria", label: "الإسكندرية" },
        { value: "dakahlia", label: "الدقهلية" },
        { value: "red_sea", label: "البحر الأحمر" },
        { value: "beheira", label: "البحيرة" },
        { value: "fayoum", label: "الفيوم" },
        { value: "gharbia", label: "الغربية" },
        { value: "ismailia", label: "الإسماعيلية" },
        { value: "menoufia", label: "المنوفية" },
        { value: "minya", label: "المنيا" },
        { value: "qalyubia", label: "القليوبية" },
        { value: "new_valley", label: "الوادي الجديد" },
        { value: "suez", label: "السويس" },
        { value: "aswan", label: "أسوان" },
        { value: "assiut", label: "أسيوط" },
        { value: "beni_suef", label: "بني سويف" },
        { value: "port_said", label: "بورسعيد" },
        { value: "damietta", label: "دمياط" },
        { value: "sharqia", label: "الشرقية" },
        { value: "south_sinai", label: "جنوب سيناء" },
        { value: "kafr_sheikh", label: "كفر الشيخ" },
        { value: "matrouh", label: "مطروح" },
        { value: "luxor", label: "الأقصر" },
        { value: "qena", label: "قنا" },
        { value: "north_sinai", label: "شمال سيناء" },
        { value: "sohag", label: "سوهاج" },
      ]
    : [
        { value: "cairo", label: "Cairo" },
        { value: "giza", label: "Giza" },
        { value: "alexandria", label: "Alexandria" },
        { value: "dakahlia", label: "Dakahlia" },
        { value: "red_sea", label: "Red Sea" },
        { value: "beheira", label: "Beheira" },
        { value: "fayoum", label: "Fayoum" },
        { value: "gharbia", label: "Gharbia" },
        { value: "ismailia", label: "Ismailia" },
        { value: "menoufia", label: "Menoufia" },
        { value: "minya", label: "Minya" },
        { value: "qalyubia", label: "Qalyubia" },
        { value: "new_valley", label: "New Valley" },
        { value: "suez", label: "Suez" },
        { value: "aswan", label: "Aswan" },
        { value: "assiut", label: "Assiut" },
        { value: "beni_suef", label: "Beni Suef" },
        { value: "port_said", label: "Port Said" },
        { value: "damietta", label: "Damietta" },
        { value: "sharqia", label: "Sharqia" },
        { value: "south_sinai", label: "South Sinai" },
        { value: "kafr_sheikh", label: "Kafr El-Sheikh" },
        { value: "matrouh", label: "Matrouh" },
        { value: "luxor", label: "Luxor" },
        { value: "qena", label: "Qena" },
        { value: "north_sinai", label: "North Sinai" },
        { value: "sohag", label: "Sohag" },
      ];

  const soilTypes = [
    { value: "sandy", label: isArabic ? "تربة رملية" : "Sandy" },
    { value: "clay", label: isArabic ? "تربة طينية" : "Clay" },
    { value: "loamy", label: isArabic ? "تربة طميية" : "Loamy" },
    { value: "silty", label: isArabic ? "تربة سلتية" : "Silty" },
  ];

  const seasons = [
    { value: "summer", label: isArabic ? "الصيف" : "Summer" },
    { value: "winter", label: isArabic ? "الشتاء" : "Winter" },
    { value: "spring", label: isArabic ? "الربيع" : "Spring" },
    { value: "autumn", label: isArabic ? "الخريف" : "Autumn" },
  ];

  const cropNames = {
    wheat: isArabic ? "قمح" : "Wheat",
    barley: isArabic ? "شعير" : "Barley",
    rice: isArabic ? "أرز" : "Rice",
    corn: isArabic ? "ذرة" : "Corn",
    tomato: isArabic ? "طماطم" : "Tomato",
    cucumber: isArabic ? "خيار" : "Cucumber",
    pepper: isArabic ? "فلفل" : "Pepper",
    eggplant: isArabic ? "باذنجان" : "Eggplant",
    potato: isArabic ? "بطاطس" : "Potato",
    lettuce: isArabic ? "خس" : "Lettuce",
    spinach: isArabic ? "سبانخ" : "Spinach",
    onion: isArabic ? "بصل" : "Onion",
    garlic: isArabic ? "ثوم" : "Garlic",
    watermelon: isArabic ? "بطيخ" : "Watermelon",
    melon: isArabic ? "شمام" : "Melon",
    peanut: isArabic ? "فول سوداني" : "Peanut",
    grape: isArabic ? "عنب" : "Grape",
    mango: isArabic ? "مانجو" : "Mango",
    beans: isArabic ? "فاصوليا" : "Beans",
    sunflower: isArabic ? "عباد الشمس" : "Sunflower",
    coffee: isArabic ? "قهوة" : "Coffee",
    cotton: isArabic ? "قطن" : "Cotton",
    banana: isArabic ? "موز" : "Banana",
    coconut: isArabic ? "جوز الهند" : "Coconut",
    papaya: isArabic ? "بابايا" : "Papaya",
    orange: isArabic ? "برتقال" : "Orange",
    apple: isArabic ? "تفاح" : "Apple",
    muskmelon: isArabic ? "شمام" : "Muskmelon",
    mungbean: isArabic ? "ماش" : "Mungbean",
    mothbeans: isArabic ? "فول عثة" : "Moth Beans",
    pigeonpeas: isArabic ? "بازلاء حمام" : "Pigeon Peas",
    chickpea: isArabic ? "حمص" : "Chickpea",
    blackgram: isArabic ? "فول أسود" : "Black Gram",
    kidneybeans: isArabic ? "فاصوليا حمراء" : "Kidney Beans",
    lentil: isArabic ? "عدس" : "Lentil",
    jute: isArabic ? "جوت" : "Jute",
    maize: isArabic ? "ذرة" : "Maize",
  };

  const getGovernorateLabel = () =>
    governorates.find((g) => g.value === governorate)?.label || governorate;

  const getSoilLabel = () =>
    soilTypes.find((s) => s.value === soilType)?.label || soilType;

  const getSeasonLabel = () =>
    seasons.find((s) => s.value === season)?.label || season;

  const getCropLabel = (cropValue) => {
    if (!cropValue) return isArabic ? "غير محدد" : "Not specified";
    return cropNames[cropValue] || cropValue;
  };

  const handleAdvancedChange = (field, value) => {
    setAdvancedForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetResultAndError = () => {
    setError("");
    setResult(null);
  };

  const validateBasic = () => {
    if (!governorate || !soilType || !season) {
      setError(
        isArabic
          ? "يرجى ملء جميع الحقول أولاً"
          : "Please fill in all fields first"
      );
      return false;
    }
    return true;
  };

  const validateAdvanced = () => {
    const requiredFields = ["N", "P", "K", "temperature", "humidity", "rainfall", "ph"];
    const hasEmptyField = requiredFields.some((field) => advancedForm[field] === "");

    if (hasEmptyField) {
      setError(
        isArabic
          ? "يرجى إدخال جميع القيم المطلوبة في وضع الخبير"
          : "Please enter all required values in advanced mode"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = mode === "basic" ? validateBasic() : validateAdvanced();
    if (!isValid) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const url =
        mode === "basic"
          ? "http://127.0.0.1:8000/api/crop-recommendation/"
          : "http://127.0.0.1:8000/api/crop-recommendation-advanced/";

      const payload =
        mode === "basic"
          ? {
              governorate,
              soil_type: soilType,
              season,
            }
          : {
              N: Number(advancedForm.N),
              P: Number(advancedForm.P),
              K: Number(advancedForm.K),
              temperature: Number(advancedForm.temperature),
              humidity: Number(advancedForm.humidity),
              rainfall: Number(advancedForm.rainfall),
              ph: Number(advancedForm.ph),
            };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      console.error("Crop recommendation error:", err);
      setError(
        err.message ||
          (isArabic
            ? "حدث خطأ أثناء جلب التوصية. تأكد من الاتصال بالسيرفر."
            : "An error occurred while fetching the recommendation. Check server connection.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-page">
      <div className="crop-container">
        <div className="crop-header">
          <span className="crop-header-icon">
            <GiWheat />
          </span>
          <h2>
            {isArabic
              ? "اقتراح أفضل محصول للزراعة"
              : "Best Crop Recommendation"}
          </h2>
          <p>
            {isArabic
              ? "اختر الوضع المناسب: وضع بسيط للمزارع أو وضع متقدم للخبير الزراعي."
              : "Choose the suitable mode: simple mode for farmers or advanced mode for experts."}
          </p>
        </div>

        <div className="crop-mode-switch">
          <button
            type="button"
            className={`crop-mode-btn ${mode === "basic" ? "active" : ""}`}
            onClick={() => {
              setMode("basic");
              resetResultAndError();
            }}
          >
            <GiWheat />
            {isArabic ? "الوضع البسيط" : "Basic Mode"}
          </button>

          <button
            type="button"
            className={`crop-mode-btn ${mode === "advanced" ? "active" : ""}`}
            onClick={() => {
              setMode("advanced");
              resetResultAndError();
            }}
          >
            <FaFlask />
            {isArabic ? "وضع الخبير" : "Advanced Mode"}
          </button>
        </div>

        <div className="crop-form-card">
          <form onSubmit={handleSubmit} className="crop-form">
            {mode === "basic" ? (
              <>
                <div className="crop-field">
                  <label htmlFor="crop-governorate">
                    <span className="field-icon"><FaMapMarkerAlt /></span>
                    {isArabic ? "المحافظة" : "Governorate"}
                  </label>
                  <select
                    id="crop-governorate"
                    className="crop-select"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">
                      {isArabic ? "-- اختر المحافظة --" : "-- Select Governorate --"}
                    </option>
                    {governorates.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="crop-field">
                  <label htmlFor="crop-soil">
                    <span className="field-icon"><FaSeedling /></span>
                    {isArabic ? "نوع التربة" : "Soil Type"}
                  </label>
                  <select
                    id="crop-soil"
                    className="crop-select"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">
                      {isArabic ? "-- اختر نوع التربة --" : "-- Select Soil Type --"}
                    </option>
                    {soilTypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="crop-field">
                  <label htmlFor="crop-season">
                    <span className="field-icon"><BsCalendar2WeekFill /></span>
                    {isArabic ? "الفصل" : "Season"}
                  </label>
                  <select
                    id="crop-season"
                    className="crop-select"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">
                      {isArabic ? "-- اختر الفصل --" : "-- Select Season --"}
                    </option>
                    {seasons.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="crop-field">
                  <label htmlFor="advanced-n">
                    <span className="field-icon"><GiChemicalTank /></span>
                    {isArabic ? "النيتروجين (N)" : "Nitrogen (N)"}
                  </label>
                  <input
                    id="advanced-n"
                    type="number"
                    className="crop-input"
                    value={advancedForm.N}
                    onChange={(e) => handleAdvancedChange("N", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل قيمة N" : "Enter N value"}
                  />
                </div>

                <div className="crop-field">
                  <label htmlFor="advanced-p">
                    <span className="field-icon"><GiChemicalTank /></span>
                    {isArabic ? "الفوسفور (P)" : "Phosphorus (P)"}
                  </label>
                  <input
                    id="advanced-p"
                    type="number"
                    className="crop-input"
                    value={advancedForm.P}
                    onChange={(e) => handleAdvancedChange("P", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل قيمة P" : "Enter P value"}
                  />
                </div>

                <div className="crop-field">
                  <label htmlFor="advanced-k">
                    <span className="field-icon"><GiChemicalTank /></span>
                    {isArabic ? "البوتاسيوم (K)" : "Potassium (K)"}
                  </label>
                  <input
                    id="advanced-k"
                    type="number"
                    className="crop-input"
                    value={advancedForm.K}
                    onChange={(e) => handleAdvancedChange("K", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل قيمة K" : "Enter K value"}
                  />
                </div>

                <div className="crop-field">
                  <label htmlFor="advanced-temp">
                    <span className="field-icon"><FaTemperatureHigh /></span>
                    {isArabic ? "درجة الحرارة" : "Temperature"}
                  </label>
                  <input
                    id="advanced-temp"
                    type="number"
                    step="0.1"
                    className="crop-input"
                    value={advancedForm.temperature}
                    onChange={(e) => handleAdvancedChange("temperature", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل درجة الحرارة" : "Enter temperature"}
                  />
                </div>

                <div className="crop-field">
                  <label htmlFor="advanced-humidity">
                    <span className="field-icon"><FaTint /></span>
                    {isArabic ? "الرطوبة" : "Humidity"}
                  </label>
                  <input
                    id="advanced-humidity"
                    type="number"
                    step="0.1"
                    className="crop-input"
                    value={advancedForm.humidity}
                    onChange={(e) => handleAdvancedChange("humidity", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل الرطوبة" : "Enter humidity"}
                  />
                </div>

                <div className="crop-field">
                  <label htmlFor="advanced-rainfall">
                    <span className="field-icon"><FaCloudRain /></span>
                    {isArabic ? "الأمطار" : "Rainfall"}
                  </label>
                  <input
                    id="advanced-rainfall"
                    type="number"
                    step="0.1"
                    className="crop-input"
                    value={advancedForm.rainfall}
                    onChange={(e) => handleAdvancedChange("rainfall", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل الأمطار" : "Enter rainfall"}
                  />
                </div>

                <div className="crop-field crop-field-wide">
                  <label htmlFor="advanced-ph">
                    <span className="field-icon"><GiChemicalTank /></span>
                    {isArabic ? "درجة الحموضة pH" : "pH"}
                  </label>
                  <input
                    id="advanced-ph"
                    type="number"
                    step="0.1"
                    className="crop-input"
                    value={advancedForm.ph}
                    onChange={(e) => handleAdvancedChange("ph", e.target.value)}
                    disabled={loading}
                    placeholder={isArabic ? "أدخل قيمة pH" : "Enter pH value"}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="crop-error">
                <span className="crop-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="crop-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="crop-loading-spinner"
                    style={{ width: 20, height: 20, borderWidth: 3 }}
                  ></span>
                  {isArabic ? "جاري التحليل..." : "Analyzing..."}
                </>
              ) : (
                <>
                  {mode === "basic" ? (
                    <GiWheat className="btn-icon" />
                  ) : (
                    <FaFlask className="btn-icon" />
                  )}
                  {isArabic ? "اقترح المحصول" : "Recommend Crop"}
                </>
              )}
            </button>
          </form>
        </div>

        {loading && (
          <div className="crop-loading">
            <div className="crop-loading-spinner"></div>
            <p>
              {isArabic
                ? "جاري تحليل البيانات وإيجاد أفضل محصول..."
                : "Analyzing data to find the best crop..."}
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="crop-result-card">
            <div className="crop-result-header">
              <span className="crop-result-header-icon">
                <FaCheckCircle />
              </span>
              <h3>{isArabic ? "نتيجة التوصية" : "Recommendation Result"}</h3>
            </div>

            <div className="crop-result-name-wrapper">
              <span className="crop-result-label">
                {isArabic ? "المحصول الأفضل" : "Best Recommended Crop"}
              </span>
              <p className="crop-result-name">
                {getCropLabel(result.recommended_crop)}
              </p>
            </div>

            {mode === "basic" ? (
              <div className="crop-result-details">
                <span className="crop-result-tag">
                  <FaMapMarkerAlt /> {getGovernorateLabel()}
                </span>
                <span className="crop-result-tag">
                  <FaSeedling /> {getSoilLabel()}
                </span>
                <span className="crop-result-tag">
                  <BsCalendar2WeekFill /> {getSeasonLabel()}
                </span>
              </div>
            ) : (
              <div className="crop-result-mode-note">
                <FaFlask />
                <span>
                  {isArabic
                    ? "تم إنشاء التوصية باستخدام وضع الخبير والبيانات العلمية المتقدمة"
                    : "The recommendation was generated using advanced expert mode inputs"}
                </span>
              </div>
            )}

            {result.recommended_crops && result.recommended_crops.length > 0 && (
              <div className="crop-result-extra">
                <h4>{isArabic ? "أفضل البدائل المناسبة" : "Top Suitable Alternatives"}</h4>
                <div className="crop-top-list">
                  {result.recommended_crops.map((item, index) => (
                    <div className="crop-top-card" key={`${item.crop}-${index}`}>
                      <div className="crop-top-rank">#{index + 1}</div>
                      <div className="crop-top-info">
                        <div className="crop-top-name">{getCropLabel(item.crop)}</div>
                        <div className="crop-top-probability">
                          {isArabic ? "نسبة التوافق" : "Match"}: {item.probability}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.input_used && (
              <div className="crop-result-extra">
                <h4>
                  {isArabic
                    ? "القيم المستخدمة في التحليل"
                    : "Values used in analysis"}
                </h4>

                <div className="crop-result-details">
                  {result.input_used.N !== undefined && (
                    <span className="crop-result-tag">
                      <GiChemicalTank />
                      N: {result.input_used.N}
                    </span>
                  )}

                  {result.input_used.P !== undefined && (
                    <span className="crop-result-tag">
                      <GiChemicalTank />
                      P: {result.input_used.P}
                    </span>
                  )}

                  {result.input_used.K !== undefined && (
                    <span className="crop-result-tag">
                      <GiChemicalTank />
                      K: {result.input_used.K}
                    </span>
                  )}

                  {result.input_used.temperature !== undefined && (
                    <span className="crop-result-tag">
                      <FaTemperatureHigh />
                      {isArabic ? "الحرارة" : "Temperature"}: {result.input_used.temperature}
                    </span>
                  )}

                  {result.input_used.humidity !== undefined && (
                    <span className="crop-result-tag">
                      <FaTint />
                      {isArabic ? "الرطوبة" : "Humidity"}: {result.input_used.humidity}
                    </span>
                  )}

                  {result.input_used.rainfall !== undefined && (
                    <span className="crop-result-tag">
                      <FaCloudRain />
                      {isArabic ? "الأمطار" : "Rainfall"}: {result.input_used.rainfall}
                    </span>
                  )}

                  {result.input_used.ph !== undefined && (
                    <span className="crop-result-tag">
                      <GiChemicalTank />
                      pH: {result.input_used.ph}
                    </span>
                  )}

                  {result.input_used.sunlight !== undefined && (
                    <span className="crop-result-tag">
                      <FaSun />
                      {isArabic ? "ساعات الشمس" : "Sunlight"}: {result.input_used.sunlight}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;