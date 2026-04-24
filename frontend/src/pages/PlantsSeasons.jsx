import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/PlantsSeasons.css";


const CropsPage = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const plants = useMemo(() => ([
    {
      id: 1,
      name: isArabic ? "الطماطم" : "Tomato",
      img: "/images/tomato3.jpg",
      season: "Summer",
      seasonText: isArabic ? " طوال السنة " : " All year",
      modalImg: "/images/tomato3.jpg",
      method: isArabic
        ? " تُزرع البذور بعمق حوالي 1 سم أو تُنقل الشتلات مع ترك مسافة 40–60 سم بين كل نبات. تحتاج إلى شمس مباشرة من 6 إلى 8 ساعات يوميًا وري منتظم دون إفراط. يُفضل تسميدها كل أسبوعين ودعمها بعصا خشبية أثناء النمو. تبدأ الثمار في الظهور والنضج بعد حوالي 60 إلى 90 يوم. "
        : "Seeds are planted about 1 cm deep, or seedlings are transplanted with 40–60 cm spacing between plants. It needs direct sunlight for 6 to 8 hours daily and regular watering without excess. Fertilizing every two weeks is preferred, and support with a wooden stake during growth is recommended. Fruits begin to appear and ripen after about 60 to 90 days.",
      cost: isArabic
        ? "القيراط: 4,000 – 6,000 جنيه | الفدان: 100,000 – 140,000 جنيه"
        : "Qirat: 4,000 – 6,000 EGP | Feddan: 100,000 – 140,000 EGP",
      growth: isArabic ? "60 - 90 يوم" : "60 - 90 days",
      fertilizer: isArabic ? "سماد NPK متوازن" : "Balanced NPK fertilizer",
    },
    {
      id: 2,
      name: isArabic ? "الخيار" : "Cucumber",
      img: "/images/cucumber.jpg",
      season: "Spring",
      seasonText: isArabic ? "  فبراير - أكتوبر" : " February - October",
      modalImg: "/images/cucumber.jpg",
      method: isArabic
        ? "   بيتزرع بالبذور مباشرة في الأرض على عمق حوالي 2–3 سم، مع ترك مسافة مناسبة بين النباتات. يحتاج شمس جيدة وري منتظم، خصوصًا في الجو الحار، ويفضل الري بالتنقيط. كمان بيحتاج دعامة أو تعريشة لو الزراعة على خطوط أو في صوب. مدة النمو سريعة وبتكون تقريبًا من 45 إلى 60 يوم لحد أول حصاد   "
        : "It is planted directly by seeds in the soil at a depth of about 2–3 cm, leaving suitable spacing between plants. It needs good sunlight and regular watering, especially in hot weather, and drip irrigation is preferred. It also needs support or a trellis if planted in rows or greenhouses. Growth is fast and takes about 45 to 60 days until the first harvest.",
      cost: isArabic
        ? "القيراط: 3,500 – 5,000 جنيه - الفدان: 85,000 – 120,000 جنيه "
        : "Qirat: 3,500 – 5,000 EGP - Feddan: 85,000 – 120,000 EGP",
      growth: isArabic ? "60-45 يوم" : "45-60 days",
      fertilizer: isArabic ? "سماد عضوي + نيتروجين" : "Organic fertilizer + Nitrogen"
    },
    {
      id: 3,
      name: isArabic ? "الفلفل" : "Pepper",
      img: "/images/pepper.jpg",
      season: "Spring",
      seasonText: isArabic ? "طوال السنة" : "All year",
      modalImg: "/images/pepper.jpg",
      method: isArabic
        ? " بنزرع البذور في صينية شتلات لمدة 30–40 يوم، وبعد ما تكبر بننقلها للأرض مع مسافة 30–40 سم بين النباتات. يحتاج شمس 6–8 ساعات وري منتظم بدون زيادة، مع تسميد كل أسبوعين. يبدأ الحصاد بعد 70–90 يوم. "
        : "Seeds are planted in seedling trays for 30–40 days, then transplanted to the soil with 30–40 cm spacing between plants. It needs 6–8 hours of sun and regular watering without excess, with fertilization every two weeks. Harvest starts after 70–90 days.",
      cost: isArabic
        ? "القيراط: 4,000 – 5,500 جنيه - الفدان: 95,000 – 130,000 جنيه "
        : "Qirat: 4,000 – 5,500 EGP - Feddan: 95,000 – 130,000 EGP",
      growth: isArabic ? "90 - 70يوم" : "70-90 days",
      fertilizer: isArabic ? "سماد فوسفوري + بوتاسيوم" : "Phosphorus fertilizer + Potassium"
    },
    {
      id: 4,
      name: isArabic ? "الخس" : "Lettuce",
      img: "/images/lettuce3.jpg",
      season: "Spring",
      seasonText: isArabic ? "   سبتمبر إلى فبراير" : " September to February",
      modalImg: "/images/lettuce3.jpg",
      method: isArabic
        ? "بيتزرع بالبذور مباشرة أو في صينية شتلات لمدة قصيرة، وبعدها بيتنقل للأرض مع مسافة 20–30 سم بين كل نبات. يحتاج ري منتظم وشمس مناسبة، ومدة النمو سريعة تقريبًا 45–60 يوم."
        : "It is planted directly by seeds or in seedling trays for a short period, then transplanted to the soil with 20–30 cm spacing between each plant. It needs regular watering and suitable sunlight, and grows quickly in about 45–60 days.",
      cost: isArabic
        ? "القيراط: 2,500 – 3,500 جنيه - الفدان: 60,000 – 85,000 جنيه"
        : "Qirat: 2,500 – 3,500 EGP - Feddan: 60,000 – 85,000 EGP",
      growth: isArabic ? "60-45 يوم" : "45-60 days",
      fertilizer: isArabic ? "سماد نيتروجيني خفيف" : "Light nitrogen fertilizer"
    },
    {
      id: 5,
      name: isArabic ? "السبانخ" : "Spinach",
      img: "/images/Spinach.jpg",
      season: "Autumn",
      seasonText: isArabic ? "  سبتمبر إلى فبراير" : " September to February",
      modalImg: "/images/Spinach.jpg",
      method: isArabic
        ? " بتتزرع بالبذور مباشرة في الأرض بدون شتلات. بنزرع البذور في سطور مع ري منتظم، وبتحتاج شمس مناسبة أو نصف ظل. مدة النمو سريعة تقريبًا 40–50 يوم."
        : "It is planted directly by seeds in the ground without seedlings. Seeds are planted in rows with regular watering, and it needs suitable sunlight or partial shade. Growth is fast, about 40–50 days.",
      cost: isArabic
        ? "القيراط: 2,000 – 3,000 جنيه - الفدان: 50,000 – 70,000 جنيه"
        : "Qirat: 2,000 – 3,000 EGP - Feddan: 50,000 – 70,000 EGP",
      growth: isArabic ? "50-40 يوم" : "40-50 days",
      fertilizer: isArabic ? "سماد NPK متوازن" : "Balanced NPK fertilizer"
    },
    {
      id: 6,
      name: isArabic ? "البطيخ" : "Watermelon",
      img: "/images/watermelon.jpg",
      season: "Summer",
      seasonText: isArabic ? "  فبراير إلى يونيو " : " February to June ",
      modalImg: "/images/watermelon.jpg",
      method: isArabic
        ? "    يتزرع بالبذور مباشرة في الأرض على خطوط أو جور، مع ترك مسافات كبيرة بين النباتات لأن النبات بيفرش على الأرض. يحتاج شمس مباشرة وري منتظم خاصة في بداية النمو، وبعد تكوين الثمار بيقل الري شوية. مدة النمو تقريبًا 80–100 يوم.    "
        : "It is planted directly by seeds in the soil in rows or holes, leaving large spaces because the plant spreads on the ground. It needs direct sunlight and regular watering especially at the beginning of growth, then watering is reduced after fruit formation. Growth takes about 80–100 days.",
      cost: isArabic
        ? "القيراط: 3,500 – 5,000 جنيه - الفدان: 85,000 – 120,000 جنيه"
        : "Qirat: 3,500 – 5,000 EGP - Feddan: 85,000 – 120,000 EGP",
      growth: isArabic ? "100-80 يوم" : "80-100 days",
      fertilizer: isArabic ? "سماد بوتاسي عالي" : "High potassium fertilizer"
    },
    {
      id: 7,
      name: isArabic ? "الذرة" : "Corn",
      img: "/images/corn2.jpg",
      season: "Summer",
      seasonText: isArabic ? "  مارس إلى يونيو" : " March to June",
      modalImg: "/images/corn2.jpg",
      method: isArabic
        ? "بتتزرع بالحبوب مباشرة في الأرض على خطوط، مع ترك مسافة مناسبة بين الجور. تحتاج شمس قوية وري منتظم خاصة في فترة التزهير وتكوين الكيزان. مدة النمو تقريبًا 90–120 يوم."
        : "It is planted directly with grains in the soil in rows, leaving suitable spacing between holes. It needs strong sunlight and regular watering especially during flowering and ear formation. Growth takes about 90–120 days.",
      cost: isArabic
        ? "القيراط: 2,500 – 3,500 جنيه - الفدان: 60,000 – 85,000 جنيه"
        : "Qirat: 2,500 – 3,500 EGP - Feddan: 60,000 – 85,000 EGP",
      growth: isArabic ? "120-90 يوم" : "90-120 days",
      fertilizer: isArabic ? "سماد نيتروجيني + فوسفوري" : "Nitrogen + phosphorus fertilizer"
    },
    {
      id: 8,
      name: isArabic ? "الباذنجان" : "Eggplant",
      img: "/images/باذنجان.jpg",
      season: "Autumn",
      seasonText: isArabic ? " فبراير إلى أكتوبر" : " February to October",
      modalImg: "/images/باذنجان.jpg",
      method: isArabic
        ? "يفضل يبدأ بذور في صينية شتلات أو مشتل لمدة 30–40 يوم، وبعدها تتنقل الشتلات للأرض مع ترك مسافة 40–50 سم بين النباتات. يحتاج شمس مباشرة وري منتظم بدون زيادة. مدة النمو تقريبًا 70–90 يوم."
        : "It is preferable to start seeds in seedling trays or a nursery for 30–40 days, then transplant seedlings to the soil with 40–50 cm spacing between plants. It needs direct sunlight and regular watering without excess. Growth takes about 70–90 days.",
      cost: isArabic
        ? "القيراط: 3,500 – 5,000 جنيه - الفدان: 85,000 – 120,000 جنيه"
        : "Qirat: 3,500 – 5,000 EGP - Feddan: 85,000 – 120,000 EGP",
      growth: isArabic ? "90-70 يوم" : "70-90 days",
      fertilizer: isArabic ? "سماد NPK متوازن" : "Balanced NPK fertilizer"
    },
    {
      id: 9,
      name: isArabic ? "الكوسة" : "Zucchini",
      img: "/images/كوسة.jpg",
      season: "Autumn",
      seasonText: isArabic ? " فبراير إلى أكتوبر" : " February to October",
      modalImg: "/images/كوسة.jpg",
      method: isArabic
        ? "بتتزرع بالبذور مباشرة في الأرض على جور أو خطوط، مع ترك مسافة 50–60 سم بين النباتات. تحتاج شمس مباشرة وري منتظم، وبتنمو بسرعة. مدة النمو تقريبًا 40–60 يوم. "
        : "It is planted directly by seeds in the soil in holes or rows, with 50–60 cm spacing between plants. It needs direct sunlight and regular watering, and grows quickly. Growth takes about 40–60 days.",
      cost: isArabic
        ? "القيراط: 3,000 – 4,500 جنيه - الفدان: 72,000 – 108,000 جنيه"
        : "Qirat: 3,000 – 4,500 EGP - Feddan: 72,000 – 108,000 EGP",
      growth: isArabic ? "60-40 يوم" : "40-60 days",
      fertilizer: isArabic ? "سماد عضوي متحلل" : "Decomposed organic fertilizer"
    },
    {
      id: 10,
      name: isArabic ? "الجزر" : "Carrot",
      img: "/images/carrot3.jpg",
      season: "Autumn",
      seasonText: isArabic ? " سبتمبر إلى فبراير" : " September to February",
      modalImg: "/images/carrot3.jpg",
      method: isArabic
        ? "بيتزرع في تربة رملية أو طميية خفيفة ومفككة عشان الجذر ينمو بشكل مستقيم، وبيتزرع بالبذور مباشرة في الأرض على سطور، مع ري منتظم بدون زيادة. مدة النمو تقريبًا 70–90 يوم"
        : "It is planted in sandy or light loamy loose soil so the root grows straight, and seeds are planted directly in the soil in rows with regular watering without excess. Growth takes about 70–90 days.",
      cost: isArabic
        ? "القيراط: 2,500 – 3,500 جنيه - الفدان: 60,000 – 85,000 جنيه"
        : "Qirat: 2,500 – 3,500 EGP - Feddan: 60,000 – 85,000 EGP",
      growth: isArabic ? "90-70 يوم" : "70-90 days",
      fertilizer: isArabic ? "سماد بوتاسي + فوسفوري" : "Potassium + phosphorus fertilizer"
    },
    {
      id: 11,
      name: isArabic ? "البروكلي" : "Broccoli",
      img: "/images/broccoli.jpg",
      season: "Autumn",
      seasonText: isArabic ? " سبتمبر إلى فبراير" : " September to February",
      modalImg: "/images/broccoli.jpg",
      method: isArabic
        ? "يفضل يبدأ بذور في صينية شتلات أو مشتل لمدة 25–35 يوم، وبعدها تتنقل الشتلات للأرض مع ترك مسافة 40–50 سم بين النباتات. يحتاج شمس جيدة وري منتظم، ومدة النمو تقريبًا 70–90 يوم"
        : "It is preferable to start seeds in seedling trays or a nursery for 25–35 days, then transplant seedlings to the soil with 40–50 cm spacing between plants. It needs good sunlight and regular watering, and growth takes about 70–90 days.",
      cost: isArabic
        ? "القيراط: 3,000 – 4,000 جنيه - الفدان: 72,000 – 96,000 جنيه"
        : "Qirat: 3,000 – 4,000 EGP - Feddan: 72,000 – 96,000 EGP",
      growth: isArabic ? "90-70 يوم" : "70-90 days",
      fertilizer: isArabic ? "سماد نيتروجيني + كالسيوم" : "Nitrogen fertilizer + Calcium"
    },
    {
      id: 12,
      name: isArabic ? "القرنبيط" : "Cauliflower",
      img: "/images/قرنبيط.jpg",
      season: "Winter",
      seasonText: isArabic ? "سبتمبر-فبراير" : "September-February",
      modalImg: "/images/قرنبيط.jpg",
      method: isArabic
        ? "يفضل يبدأ بذور في صينية شتلات أو مشتل لمدة 25–35 يوم، وبعدها تتنقل الشتلات للأرض مع ترك مسافة 40–50 سم بين النباتات. يحتاج شمس جيدة وري منتظم، ومدة النمو تقريبًا 75–90 يوم."
        : "It is preferable to start seeds in seedling trays or a nursery for 25–35 days, then transplant seedlings to the soil with 40–50 cm spacing between plants. It needs good sunlight and regular watering, and growth takes about 75–90 days.",
      cost: isArabic
        ? "القيراط: 3,000 – 4,000 جنيه - الفدان: 72,000 – 96,000 جنيه"
        : "Qirat: 3,000 – 4,000 EGP - Feddan: 72,000 – 96,000 EGP",
      growth: isArabic ? "90-75 يوم" : "75-90 days",
      fertilizer: isArabic ? "سماد NPK + عناصر صغرى" : "NPK fertilizer + micronutrients"
    },
    {
      id: 13,
      name: isArabic ? "البصل" : "Onion",
      img: "/images/onions.jpg",
      season: "Autumn",
      seasonText: isArabic ? "سبتمبر - يناير" : "September - January",
      modalImg: "/images/onions.jpg",
      method: isArabic
        ? "بدأ بذور في مشتل أو صينية شتلات لمدة 45–60 يوم، وبعدها تتنقل الشتلات للأرض مع ترك مسافة 10–15 سم بين النباتات. يحتاج ري منتظم خصوصًا في بداية النمو، وبعد تكوين البصلة يقل الري قبل الحصاد. مدة النمو تقريبًا 120–150 يوم"
        : "Seeds are started in a nursery or seedling trays for 45–60 days, then transplanted to the soil with 10–15 cm spacing between plants. It needs regular watering especially at the beginning of growth, then watering is reduced before harvest after bulb formation. Growth takes about 120–150 days.",
      cost: isArabic
        ? "القيراط: 2,500 – 3,500 جنيه - الفدان: 60,000 – 85,000 جنيه"
        : "Qirat: 2,500 – 3,500 EGP - Feddan: 60,000 – 85,000 EGP",
      growth: isArabic ? "150-120 يوم" : "120-150 days",
      fertilizer: isArabic ? "سماد بوتاسي + كبريت" : "Potassium fertilizer + Sulfur"
    },
    {
      id: 14,
      name: isArabic ? "الثوم" : "Garlic",
      img: "/images/Garlic.jpg",
      season: "Winter",
      seasonText: isArabic ? " سبتمبر إلى يناير" : " September to January",
      modalImg: "/images/Garlic.jpg",
      method: isArabic
        ? "بيتزرع بالفصوص مباشرة في الأرض، مش بالبذور. بنفصل رأس الثوم إلى فصوص، ونزرع كل فص في التربة على عمق حوالي 3–5 سم مع ترك مسافة 10–15 سم بين النباتات. يحتاج ري منتظم في البداية، وبعد تكوين الرأس يقل الري قبل الحصاد. مدة النمو تقريبًا 120–150 يوم."
        : "It is planted directly by cloves in the soil, not by seeds. The garlic head is separated into cloves, and each clove is planted 3–5 cm deep with 10–15 cm spacing between plants. It needs regular watering at first, then watering is reduced before harvest after head formation. Growth takes about 120–150 days.",
      cost: isArabic
        ? "القيراط: 2,500 – 3,500 جنيه - الفدان: 60,000 – 85,000 جنيه"
        : "Qirat: 2,500 – 3,500 EGP - Feddan: 60,000 – 85,000 EGP",
      growth: isArabic ? "150-120 يوم" : "120-150 days",
      fertilizer: isArabic ? "سماد عضوي + كبريت" : "Organic fertilizer + Sulfur"
    },
  ]), [isArabic]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const seasons = [
    { key: 'all', label: isArabic ? 'كل الفصول' : 'All Seasons', icon: 'far fa-calendar', subText: null },
    { key: 'Spring', label: isArabic ? 'الربيع' : 'Spring', icon: 'fas fa-cloud', subText: isArabic ? 'مارس - مايو' : 'March - May' },
    { key: 'Summer', label: isArabic ? 'الصيف' : 'Summer', icon: 'fas fa-sun', subText: isArabic ? 'يونيو - أغسطس' : 'June - August' },
    { key: 'Autumn', label: isArabic ? 'الخريف' : 'Autumn', icon: 'fas fa-cloud-rain', subText: isArabic ? 'سبتمبر - نوفمبر' : 'September - November' },
    { key: 'Winter', label: isArabic ? 'الشتاء' : 'Winter', icon: 'far fa-snowflake', subText: isArabic ? 'ديسمبر - فبراير' : 'December - February' }
  ];

  const monthMap = useMemo(() => ({
    "يناير": 1,
    "فبراير": 2,
    "مارس": 3,
    "أبريل": 4,
    "ابريل": 4,
    "مايو": 5,
    "يونيو": 6,
    "يوليو": 7,
    "أغسطس": 8,
    "اغسطس": 8,
    "سبتمبر": 9,
    "أكتوبر": 10,
    "اكتوبر": 10,
    "نوفمبر": 11,
    "ديسمبر": 12,
  }), []);

  const getSeasonFromMonth = useCallback((month) => {
    if ([3, 4, 5].includes(month)) return "Spring";
    if ([6, 7, 8].includes(month)) return "Summer";
    if ([9, 10, 11].includes(month)) return "Autumn";
    return "Winter";
  }, []);

  const getMonthsInRange = useCallback((start, end) => {
    const months = [];
    let current = start;

    while (true) {
      months.push(current);
      if (current === end) break;
      current = current === 12 ? 1 : current + 1;
    }

    return months;
  }, []);

  const extractSeasonsFromText = useCallback((seasonText) => {
    const cleaned = seasonText.replace(/\s+/g, ' ').trim();

    if (cleaned.includes("طوال السنة") || cleaned.includes("All year")) {
      return ["Spring", "Summer", "Autumn", "Winter"];
    }

    const monthNames = Object.keys(monthMap).join('|');
    const regex = new RegExp(`(${monthNames}).*?(${monthNames})`);
    const match = cleaned.match(regex);

    if (!match) return [];

    const startMonth = monthMap[match[1]];
    const endMonth = monthMap[match[2]];

    if (!startMonth || !endMonth) return [];

    const months = getMonthsInRange(startMonth, endMonth);
    const seasons = [...new Set(months.map(getSeasonFromMonth))];

    return seasons;
  }, [getMonthsInRange, getSeasonFromMonth, monthMap]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter((item) => {
        const plantSeasons = extractSeasonsFromText(item.seasonText);
        return plantSeasons.includes(activeFilter);
      });
      setFilteredPlants(filtered);
    }
  }, [activeFilter, plants, extractSeasonsFromText]);

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const handleCardClick = (plant) => {
    setSelectedPlant(plant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlant(null);
  };

  return (
    <>
      <section className="container py-5 text-center">
        <h3 className="title-txt text-center text-success mb-4">
          {isArabic ? 'النباتات والفصول الزراعية' : 'Plants and Agricultural Seasons'}
        </h3>
        <h5 className="title-txt text-center text-success mb-5">
          {isArabic
            ? 'اكتشف افضل النباتات لكل فصل مع تفاصيل الزراعة والتكلفة'
            : 'Discover the best plants for each season with cultivation details and cost'}
        </h5>

        <div className="btnAll d-flex flex-wrap justify-content-center gap-3 mb-5">
          {seasons.map(season => (
            <button
              key={season.key}
              className={`btnSeason btn btn-light text-success px-5 py-3 text-center fs-5 ${activeFilter === season.key ? 'active' : ''}`}
              onClick={() => handleFilterClick(season.key)}
            >
              <i className={`${season.icon} ms-2`}></i>
              {season.label}
              {season.subText && <small className="d-block text-success">{season.subText}</small>}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredPlants.map(plant => (
            <div key={plant.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card plantCard pb-4" onClick={() => handleCardClick(plant)} style={{ cursor: 'pointer' }}>
                <img src={plant.img} className="card-img-top h-50" alt={plant.name} />
                <div className="card-body text-end text-success mt-2">
                  <h5 className="card-title">{plant.name}</h5>
                  <i className="far fa-calendar ms-2"></i>
                  <small className="text-success fs-5 mb-2">{plant.seasonText}</small>
                  <button className="moreInfo btn d-block mt-3 w-50" onClick={(e) => { e.stopPropagation(); handleCardClick(plant); }}>
                    {isArabic ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlant && (
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="myModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '550px' }}>
              <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="modal-header justify-content-between align-items-center">
                  <button type="button" className="btn-close ms-auto" onClick={handleCloseModal}></button>
                  <h4 className="modal-title text-success d-flex align-items-center gap-2">
                    <i className="fab fa-pagelines"></i>
                    <span id="modalTitle">{selectedPlant.name}</span>
                  </h4>
                </div>
                <img id="modalImg" src={selectedPlant.modalImg} className="modalImg d-flex align-self-center" alt={selectedPlant.name} style={{ height: '260px', objectFit: 'cover' }} />
                <div className="modal-body text-end">
                  <div className="p-3 mb-3 rounded" style={{ background: '#e3f8e3' }}>
                    <i className="fas fa-seedling text-success"></i>
                    <strong className="text-success">{isArabic ? 'طريقة الزراعة' : 'Cultivation Method'}</strong>
                    <p id="modalMethod" className="m-0 text-success">{selectedPlant.method}</p>
                  </div>
                  <div className="p-3 mb-3 rounded" style={{ background: '#ccf0cc' }}>
                    <i className="fas fa-dollar-sign text-success"></i>
                    <strong className="text-success">{isArabic ? 'تكلفة الزراعة' : 'Cultivation Cost'}</strong>
                    <p id="modalCost" className="m-0 text-success">{selectedPlant.cost}</p>
                  </div>
                  <div className="p-3 mb-3 rounded" style={{ background: '#e3f8e3' }}>
                    <i className="far fa-clock text-success"></i>
                    <strong className="text-success">{isArabic ? 'مدة النمو' : 'Growth Duration'}</strong>
                    <p id="modalGrowth" className="m-0 text-success">{selectedPlant.growth}</p>
                  </div>
                  <div className="text-white text-end p-2 mb-4 pe-3" style={{ backgroundColor: '#1d6421', borderRadius: '15px' }}>
                    <h4 className="fw-light m-0 soil-value py-2">{isArabic ? 'السماد الموصي به' : 'Recommended Fertilizer'}</h4>
                    <span id="modalFertilizer" className="d-block opacity-75 pb-2">{selectedPlant.fertilizer}</span>
                  </div>
                  <div className="text-white text-end p-2 mb-4 pe-3 bg-light d-flex justify-content-between">
                    <span className="opacity-75 text-success">{isArabic ? 'الموسم المناسب' : 'Suitable Season'}</span>
                    <span id="modalSeason" className="fw-light py-1 w-25 text-center" style={{ backgroundColor: '#1d6421', borderRadius: '2rem' }}>
                      {selectedPlant.seasonText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

    

      {showModal && (
        <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>
      )}
    </>
  );
};

export default CropsPage;