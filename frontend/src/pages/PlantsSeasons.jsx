import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/PlantsSeasons.css";

const CropsPage = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const formatMoney = useCallback((value) => {
    return `${Number(value).toLocaleString(isArabic ? 'ar-EG' : 'en-US')} ${isArabic ? 'جنيه' : 'EGP'}`;
  }, [isArabic]);

  const plants = useMemo(() => ([
    {
      id: 1,
      name: isArabic ? "الطماطم" : "Tomato",
      img: "/images/tomato3.jpg",
      season: "Summer",
      seasonText: isArabic ? "طوال السنة" : "All year",
      modalImg: "/images/tomato3.jpg",
      growth: isArabic ? "60 - 90 يوم" : "60 - 90 days",
      fertilizer: isArabic ? "سماد عضوي + NPK + كالسيوم وبوتاسيوم" : "Organic manure + NPK + calcium and potassium",
      totalCost: 125000,
      cost: isArabic ? "متوسط تكلفة الفدان: 125,000 جنيه تقريبًا" : "Average cost per feddan: about 125,000 EGP",
      method: isArabic
        ? "تبدأ زراعة الطماطم بتجهيز الأرض جيدًا بالحرث والتنعيم والتخطيط، ثم اختيار شتلات قوية وخالية من الأمراض. تُنقل الشتلات للأرض على مسافات مناسبة، ثم يتم الري بعد الشتل مباشرة بدون تغريق. خلال النمو يتم التسميد على دفعات، ومتابعة الحشرات والأمراض، ثم دعم النباتات عند الحاجة. يبدأ الحصاد تدريجيًا بعد اكتمال حجم ولون الثمار."
        : "Tomato cultivation starts with plowing, leveling, and preparing rows, then selecting healthy disease-free seedlings. Seedlings are transplanted with proper spacing and watered immediately without waterlogging. During growth, fertilizers are applied in doses, pests and diseases are monitored, plants are supported when needed, and harvesting starts gradually when fruits reach the right size and color.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث الأرض مرتين، تكسير القلاقيل، تسوية التربة، وتخطيط الفدان إلى خطوط مناسبة لتسهيل الزراعة والتهوية." : "Plow twice, break clods, level the soil, and make proper rows for planting and ventilation." },
        { title: isArabic ? "اختيار الشتلات" : "Seedling selection", text: isArabic ? "اختيار شتلات عمر 25–35 يوم، ساقها قوي، لونها أخضر، وخالية من الذبول أو الإصابات الفطرية." : "Choose 25–35 day seedlings with strong stems, green color, and no wilting or fungal infection." },
        { title: isArabic ? "الشتل في الأرض" : "Transplanting", text: isArabic ? "نقل الشتلات على الخطوط مع ترك 40–60 سم بين النباتات، وتثبيت الجذر جيدًا بدون دفن زائد للساق." : "Transplant seedlings on rows with 40–60 cm spacing and firm the roots without burying the stem too deeply." },
        { title: isArabic ? "الري والمتابعة" : "Irrigation follow-up", text: isArabic ? "ري خفيف بعد الشتل مباشرة، ثم انتظام الري حسب حرارة الجو ورطوبة التربة مع تجنب التغريق." : "Light watering after transplanting, then regular irrigation according to temperature and soil moisture while avoiding waterlogging." },
        { title: isArabic ? "التسميد أثناء النمو" : "Fertilization", text: isArabic ? "إضافة نيتروجين في بداية النمو، ثم فوسفور وبوتاسيوم وكالسيوم أثناء التزهير والعقد لتقوية الثمار." : "Apply nitrogen early, then phosphorus, potassium, and calcium during flowering and fruit setting." },
        { title: isArabic ? "المكافحة والدعم" : "Protection and support", text: isArabic ? "متابعة الذبابة البيضاء والمن والأمراض الفطرية، وربط النباتات أو تدعيمها عند زيادة الحمل الثمري." : "Monitor whiteflies, aphids, and fungal diseases, and support plants when fruit load increases." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "يبدأ الحصاد بعد 60–90 يوم، ويكون على دفعات حسب درجة النضج المطلوبة للسوق." : "Harvest starts after 60–90 days in several pickings according to market ripeness." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "شتلات أو بذور معتمدة" : "Certified seedlings or seeds", amount: 22000, details: isArabic ? "شراء شتلات قوية أو بذور جيدة من مصدر موثوق." : "Buying strong seedlings or good seeds from a trusted source." },
        { id: 2, title: isArabic ? "تجهيز الأرض والعمالة" : "Land preparation and labor", amount: 15000, details: isArabic ? "حرث، تخطيط، تنظيف حشائش، ومصاريف عمالة الزراعة." : "Plowing, row making, weed cleaning, and planting labor." },
        { id: 3, title: isArabic ? "سماد عضوي قبل الزراعة" : "Organic manure before planting", amount: 18000, details: isArabic ? "إضافة سماد بلدي/كمبوست متحلل لتحسين التربة." : "Adding decomposed manure or compost to improve soil." },
        { id: 4, title: isArabic ? "أسمدة معدنية ومغذيات" : "Mineral fertilizers and nutrients", amount: 32000, details: isArabic ? "NPK، كالسيوم، بوتاسيوم، وعناصر صغرى خلال الموسم." : "NPK, calcium, potassium, and micronutrients during the season." },
        { id: 5, title: isArabic ? "مبيدات ومكافحة" : "Pesticides and protection", amount: 18000, details: isArabic ? "مكافحة الحشرات والأمراض الفطرية عند الحاجة." : "Insect and fungal disease protection when needed." },
        { id: 6, title: isArabic ? "دعامات وحصاد ونقل" : "Support, harvest, and transport", amount: 20000, details: isArabic ? "خيوط/دعامات، عمالة جمع، وفرز ونقل أولي." : "Stakes/strings, picking labor, sorting, and basic transport." }
      ]
    },
    {
      id: 2,
      name: isArabic ? "الخيار" : "Cucumber",
      img: "/images/Cucumber.jpg",
      season: "Spring",
      seasonText: isArabic ? "فبراير - أكتوبر" : "February - October",
      modalImg: "/images/Cucumber.jpg",
      growth: isArabic ? "45 - 60 يوم" : "45 - 60 days",
      fertilizer: isArabic ? "سماد عضوي + نيتروجين + بوتاسيوم" : "Organic manure + nitrogen + potassium",
      totalCost: 105000,
      cost: isArabic ? "متوسط تكلفة الفدان: 105,000 جنيه تقريبًا" : "Average cost per feddan: about 105,000 EGP",
      method: isArabic ? "الخيار محصول سريع ويحتاج انتظام في الخدمة. يتم تجهيز الأرض وتخطيطها، ثم زراعة البذور مباشرة على عمق مناسب. بعد الإنبات تتم الخف والترقيع، ثم متابعة الري بدون تغريق. يحتاج النبات إلى تسميد منتظم، وتعريشة أو خيوط في الزراعة الرأسية، ومتابعة مستمرة للبياض الدقيقي والذبابة البيضاء. يبدأ الجمع بعد فترة قصيرة ويستمر على دفعات متقاربة." : "Cucumber is a fast crop that needs regular care. The land is prepared and ridged, seeds are sown directly at the proper depth, then thinning and gap filling are done after germination. Irrigation must be regular without waterlogging. Fertilization, trellising when needed, and protection against powdery mildew and whiteflies are important. Harvesting starts quickly and continues in frequent pickings.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتنعيم التربة وتخطيطها إلى خطوط أو مصاطب مناسبة لجذور الخيار السطحية." : "Plow, soften, and ridge the soil for cucumber's shallow roots." },
        { title: isArabic ? "زراعة البذور" : "Seed sowing", text: isArabic ? "زراعة البذور مباشرة على عمق 2–3 سم، مع ترك مسافة مناسبة بين الجور." : "Sow seeds directly 2–3 cm deep with suitable spacing between holes." },
        { title: isArabic ? "الخف والترقيع" : "Thinning and gap filling", text: isArabic ? "بعد الإنبات يتم ترك النباتات الأقوى وتعويض الجور الغائبة لضمان كثافة مناسبة." : "After germination, keep the strongest plants and refill missing hills." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "ري منتظم بكميات خفيفة خاصة وقت التزهير وتكوين الثمار، مع تجنب جفاف التربة." : "Regular light irrigation, especially during flowering and fruiting, while avoiding soil dryness." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "نيتروجين في البداية لتنشيط النمو، ثم بوتاسيوم لتحسين جودة الثمار." : "Nitrogen early for vegetative growth, then potassium for fruit quality." },
        { title: isArabic ? "التعريش والمكافحة" : "Trellising and protection", text: isArabic ? "استخدام خيوط أو تعريشة عند الحاجة، ومتابعة البياض الدقيقي والمن والذبابة البيضاء." : "Use strings or trellis when needed and monitor powdery mildew, aphids, and whiteflies." },
        { title: isArabic ? "الجمع" : "Picking", text: isArabic ? "يبدأ الجمع بعد 45–60 يوم ويُفضل تكراره كل يومين للحفاظ على الجودة." : "Picking starts after 45–60 days and is repeated every two days for quality." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور خيار جيدة" : "Good cucumber seeds", amount: 18000, details: isArabic ? "تقاوي مناسبة للعروة والصنف المطلوب." : "Seeds suitable for the season and variety." },
        { id: 2, title: isArabic ? "تجهيز الأرض والعمالة" : "Land preparation and labor", amount: 14000, details: isArabic ? "حرث، تخطيط، وزراعة البذور." : "Plowing, ridging, and seed sowing labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 15000, details: isArabic ? "كمبوست أو سماد بلدي متحلل قبل الزراعة." : "Compost or decomposed manure before planting." },
        { id: 4, title: isArabic ? "أسمدة NPK وبوتاسيوم" : "NPK and potassium fertilizers", amount: 26000, details: isArabic ? "دفعات تسميد طوال الموسم لتحسين النمو والإنتاج." : "Fertilizer doses throughout the season." },
        { id: 5, title: isArabic ? "تعريشة أو خيوط" : "Trellis or strings", amount: 12000, details: isArabic ? "خيوط ودعامات حسب طريقة الزراعة." : "Strings and supports according to the system." },
        { id: 6, title: isArabic ? "مكافحة وجمع ونقل" : "Protection, picking, and transport", amount: 20000, details: isArabic ? "مبيدات عند الحاجة + عمالة جمع متكرر." : "Pesticides when needed plus repeated picking labor." }
      ]
    },
    {
      id: 3,
      name: isArabic ? "الفلفل" : "Pepper",
      img: "/images/pepper.jpg",
      season: "Spring",
      seasonText: isArabic ? "طوال السنة" : "All year",
      modalImg: "/images/pepper.jpg",
      growth: isArabic ? "70 - 90 يوم" : "70 - 90 days",
      fertilizer: isArabic ? "فوسفور + بوتاسيوم + كالسيوم" : "Phosphorus + potassium + calcium",
      totalCost: 115000,
      cost: isArabic ? "متوسط تكلفة الفدان: 115,000 جنيه تقريبًا" : "Average cost per feddan: about 115,000 EGP",
      method: isArabic ? "يبدأ الفلفل غالبًا في صواني شتلات، ثم تنقل الشتلات بعد تقويتها إلى الأرض. يحتاج إلى تربة جيدة الصرف ومسافات مناسبة حتى لا تزيد الرطوبة بين النباتات. يتم الري بانتظام بدون زيادة، والتسميد على دفعات خاصة البوتاسيوم والكالسيوم. تتم متابعة الأمراض الفطرية والفيروسية والحشرات، ثم يبدأ الحصاد عند وصول الثمار للحجم المناسب." : "Pepper usually starts in seedling trays, then hardened seedlings are transplanted to the field. It needs well-drained soil and proper spacing to reduce humidity between plants. Irrigation is regular without excess, fertilization is applied in doses especially potassium and calcium, pests and diseases are monitored, and harvesting starts when fruits reach market size.",
      cultivationSteps: [
        { title: isArabic ? "إنتاج الشتلات" : "Seedling production", text: isArabic ? "زراعة البذور في صواني شتلات 30–40 يوم حتى تصبح الشتلة قوية وصالحة للنقل." : "Start seeds in trays for 30–40 days until seedlings are strong enough." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتنعيم وتخطيط الأرض، مع تحسين الصرف لأن الفلفل حساس لزيادة المياه." : "Plow, level, and ridge the land while improving drainage." },
        { title: isArabic ? "الشتل" : "Transplanting", text: isArabic ? "نقل الشتلات على مسافة 30–40 سم بين النباتات مع تثبيت الجذور جيدًا." : "Transplant seedlings with 30–40 cm spacing and firm roots well." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "ري منتظم بكميات معتدلة، وتجنب التعطيش الشديد أو التغريق." : "Regular moderate irrigation, avoiding severe drought or waterlogging." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "التركيز على الفوسفور بعد الشتل، ثم البوتاسيوم والكالسيوم أثناء التزهير وتكوين الثمار." : "Focus on phosphorus after transplanting, then potassium and calcium during flowering and fruiting." },
        { title: isArabic ? "المكافحة" : "Protection", text: isArabic ? "متابعة المن والذبابة البيضاء والأمراض الفيروسية والفطرية والرش عند ظهور الإصابة." : "Monitor aphids, whiteflies, viral and fungal diseases and spray when needed." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "يبدأ الحصاد بعد 70–90 يوم ويتم الجمع حسب اللون والحجم المطلوب." : "Harvest starts after 70–90 days according to required color and size." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور وشتلات" : "Seeds and seedlings", amount: 24000, details: isArabic ? "بذور جيدة أو شتلات جاهزة قوية." : "Good seeds or strong ready seedlings." },
        { id: 2, title: isArabic ? "تجهيز الأرض والشتل" : "Land preparation and transplanting", amount: 16000, details: isArabic ? "حرث وتخطيط وعمالة نقل الشتلات." : "Plowing, ridging, and transplanting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 15000, details: isArabic ? "تحسين التربة قبل الزراعة." : "Soil improvement before planting." },
        { id: 4, title: isArabic ? "أسمدة ومغذيات" : "Fertilizers and nutrients", amount: 30000, details: isArabic ? "فوسفور، بوتاسيوم، كالسيوم، وعناصر صغرى." : "Phosphorus, potassium, calcium, and micronutrients." },
        { id: 5, title: isArabic ? "مكافحة أمراض وحشرات" : "Disease and pest control", amount: 18000, details: isArabic ? "رش وقائي وعلاجي حسب الإصابة." : "Preventive and curative spraying." },
        { id: 6, title: isArabic ? "عمالة جمع وفرز" : "Picking and sorting labor", amount: 12000, details: isArabic ? "جمع الثمار على دفعات وفرزها." : "Picking in batches and sorting." }
      ]
    },
    {
      id: 4,
      name: isArabic ? "الخس" : "Lettuce",
      img: "/images/lettuce3.jpg",
      season: "Spring",
      seasonText: isArabic ? "سبتمبر إلى فبراير" : "September to February",
      modalImg: "/images/lettuce3.jpg",
      growth: isArabic ? "45 - 60 يوم" : "45 - 60 days",
      fertilizer: isArabic ? "نيتروجين خفيف + سماد عضوي" : "Light nitrogen + organic manure",
      totalCost: 75000,
      cost: isArabic ? "متوسط تكلفة الفدان: 75,000 جنيه تقريبًا" : "Average cost per feddan: about 75,000 EGP",
      method: isArabic ? "الخس يحتاج تربة ناعمة وجيدة الصرف، ويزرع بالبذور أو الشتلات حسب النظام. يتم تجهيز الأرض جيدًا لأن الجذور سطحية، ثم الزراعة على مسافات صغيرة نسبيًا. يحتاج رطوبة منتظمة بدون تغريق، وتسميد نيتروجيني خفيف لتحسين النمو الورقي. تتم مكافحة الحشائش والحشرات، ثم الحصاد عند اكتمال حجم الرؤوس أو الأوراق." : "Lettuce needs soft, well-drained soil and can be grown from seeds or seedlings. The soil must be well prepared because roots are shallow. It needs regular moisture without waterlogging and light nitrogen fertilization for leaf growth. Weeds and insects are controlled, then harvesting is done when heads or leaves reach proper size.",
      cultivationSteps: [
        { title: isArabic ? "تنعيم التربة" : "Soil softening", text: isArabic ? "تنعيم وتسوية التربة جيدًا لأن بذور وجذور الخس صغيرة وسطحية." : "Soften and level soil because lettuce seeds and roots are small and shallow." },
        { title: isArabic ? "الزراعة" : "Planting", text: isArabic ? "زراعة بذور أو شتلات مع ترك 20–30 سم بين النباتات حسب الصنف." : "Sow seeds or transplant seedlings with 20–30 cm spacing." },
        { title: isArabic ? "الخف" : "Thinning", text: isArabic ? "إزالة النباتات الضعيفة لتقليل التزاحم وتحسين حجم الأوراق." : "Remove weak plants to reduce crowding and improve leaf size." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "الحفاظ على رطوبة ثابتة بدون تغريق حتى لا يحدث عفن أو اصفرار." : "Keep steady moisture without waterlogging to avoid rot or yellowing." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "إضافة نيتروجين خفيف على دفعات صغيرة لدعم النمو الورقي." : "Apply light nitrogen in small doses to support leaf growth." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "الحصاد بعد 45–60 يوم حسب الحجم المطلوب، ويفضل في الصباح." : "Harvest after 45–60 days according to size, preferably in the morning." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور أو شتلات" : "Seeds or seedlings", amount: 14000, details: isArabic ? "تقاوي أو شتلات مناسبة للعروة الشتوية." : "Seeds or seedlings suitable for the cool season." },
        { id: 2, title: isArabic ? "تجهيز الأرض والزراعة" : "Land preparation and planting", amount: 12000, details: isArabic ? "تنعيم، تسوية، تخطيط، وعمالة زراعة." : "Softening, leveling, row making, and planting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 12000, details: isArabic ? "إضافة كمبوست أو سماد متحلل." : "Adding compost or decomposed manure." },
        { id: 4, title: isArabic ? "أسمدة ورقية/نيتروجين" : "Nitrogen and foliar feed", amount: 15000, details: isArabic ? "دفعات خفيفة لتحسين النمو الورقي." : "Light doses to improve leaf growth." },
        { id: 5, title: isArabic ? "مكافحة وحشائش" : "Protection and weed control", amount: 10000, details: isArabic ? "إزالة حشائش ومكافحة بسيطة عند الحاجة." : "Weeding and light protection when needed." },
        { id: 6, title: isArabic ? "حصاد وتعبئة" : "Harvesting and packing", amount: 12000, details: isArabic ? "عمالة تقطيع، تنظيف، وتعبئة." : "Cutting, cleaning, and packing labor." }
      ]
    },
    {
      id: 5,
      name: isArabic ? "السبانخ" : "Spinach",
      img: "/images/Spinach.jpg",
      season: "Autumn",
      seasonText: isArabic ? "سبتمبر إلى فبراير" : "September to February",
      modalImg: "/images/Spinach.jpg",
      growth: isArabic ? "40 - 50 يوم" : "40 - 50 days",
      fertilizer: isArabic ? "سماد عضوي + NPK خفيف" : "Organic manure + light NPK",
      totalCost: 60000,
      cost: isArabic ? "متوسط تكلفة الفدان: 60,000 جنيه تقريبًا" : "Average cost per feddan: about 60,000 EGP",
      method: isArabic ? "السبانخ تزرع بالبذور مباشرة في أرض ناعمة ورطبة. يتم نثر البذور أو زراعتها في سطور ثم تغطيتها بطبقة خفيفة من التربة. بعد الإنبات تتم إزالة الحشائش وتنظيم الكثافة. يحتاج المحصول إلى رطوبة منتظمة وتسميد خفيف حتى لا تصبح الأوراق خشنة. الحصاد يكون سريعًا بقص الأوراق عند وصولها للحجم المناسب." : "Spinach is sown directly in soft moist soil. Seeds are broadcast or sown in rows then lightly covered. After germination, weeds are removed and density is adjusted. It needs regular moisture and light fertilization to keep leaves tender. Harvesting is quick by cutting leaves when they reach proper size.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز تربة ناعمة" : "Soft soil preparation", text: isArabic ? "تنعيم وتسوية الأرض جيدًا حتى تنتظم البذور الصغيرة في الإنبات." : "Soften and level the soil for uniform germination." },
        { title: isArabic ? "نثر أو تسطير البذور" : "Broadcasting or row sowing", text: isArabic ? "زراعة البذور في سطور أو نثرها ثم تغطيتها بطبقة خفيفة." : "Sow in rows or broadcast and cover lightly." },
        { title: isArabic ? "الخف وإزالة الحشائش" : "Thinning and weeding", text: isArabic ? "تنظيم كثافة النبات وإزالة الحشائش المنافسة مبكرًا." : "Adjust plant density and remove competing weeds early." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "المحافظة على رطوبة منتظمة بدون تجمع مياه حول الجذور." : "Maintain regular moisture without water accumulation." },
        { title: isArabic ? "التسميد الخفيف" : "Light fertilization", text: isArabic ? "إضافة جرعات خفيفة من السماد لدعم نمو الأوراق بدون إجهاد." : "Apply light fertilizer doses to support leaf growth." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "قص الأوراق بعد 40–50 يوم مع الحفاظ على جودة ونظافة المنتج." : "Cut leaves after 40–50 days while keeping produce clean." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور سبانخ" : "Spinach seeds", amount: 10000, details: isArabic ? "شراء تقاوي جيدة بنسبة إنبات عالية." : "Buying good seeds with high germination." },
        { id: 2, title: isArabic ? "تجهيز الأرض والزراعة" : "Land preparation and sowing", amount: 10000, details: isArabic ? "تنعيم وتسوية ونثر/تسطير البذور." : "Softening, leveling, and sowing." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 10000, details: isArabic ? "كمبوست أو سماد متحلل قبل الزراعة." : "Compost or decomposed manure before planting." },
        { id: 4, title: isArabic ? "أسمدة خفيفة" : "Light fertilizers", amount: 12000, details: isArabic ? "جرعات NPK أو نيتروجين خفيف." : "Light NPK or nitrogen doses." },
        { id: 5, title: isArabic ? "حشائش ومكافحة بسيطة" : "Weeding and light protection", amount: 8000, details: isArabic ? "تنظيف الحشائش ومكافحة عند الضرورة." : "Weed cleaning and protection if needed." },
        { id: 6, title: isArabic ? "حصاد وربط" : "Harvesting and bunching", amount: 10000, details: isArabic ? "عمالة قص الأوراق وتجميعها." : "Labor for cutting and bunching leaves." }
      ]
    },
    {
      id: 6,
      name: isArabic ? "البطيخ" : "Watermelon",
      img: "/images/watermelon.jpg",
      season: "Summer",
      seasonText: isArabic ? "فبراير إلى يونيو" : "February to June",
      modalImg: "/images/watermelon.jpg",
      growth: isArabic ? "80 - 100 يوم" : "80 - 100 days",
      fertilizer: isArabic ? "سماد عضوي + بوتاسيوم عالي" : "Organic manure + high potassium",
      totalCost: 110000,
      cost: isArabic ? "متوسط تكلفة الفدان: 110,000 جنيه تقريبًا" : "Average cost per feddan: about 110,000 EGP",
      method: isArabic ? "البطيخ يحتاج أرض جيدة الصرف ومساحات واسعة لأن النبات مفترش. يتم تجهيز الجور أو الخطوط، ثم زراعة البذور مباشرة. بعد الإنبات يتم الخف وترك النباتات القوية. يحتاج تسميدًا جيدًا خاصة البوتاسيوم أثناء تكوين الثمار. يتم تنظيم الري حسب مرحلة النمو وتقليله نسبيًا قرب النضج لتحسين الطعم. الحصاد يكون عند اكتمال النضج وظهور العلامات المعروفة." : "Watermelon needs well-drained soil and wide spacing because vines spread. Holes or rows are prepared, then seeds are sown directly. After germination, thinning is done to keep strong plants. Fertilization is important, especially potassium during fruit formation. Irrigation is managed by growth stage and reduced near maturity for better taste. Harvesting is done when maturity signs appear.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الجور والخطوط" : "Preparing holes and rows", text: isArabic ? "عمل جور أو خطوط بمسافات واسعة تناسب انتشار عروش البطيخ." : "Make wide holes or rows suitable for vine spread." },
        { title: isArabic ? "زراعة البذور" : "Seed sowing", text: isArabic ? "وضع البذور مباشرة في الجور وتغطيتها بطبقة مناسبة من التربة." : "Place seeds directly in holes and cover with suitable soil." },
        { title: isArabic ? "الخف" : "Thinning", text: isArabic ? "بعد الإنبات يتم ترك أقوى نباتين تقريبًا في الجورة حسب الكثافة المطلوبة." : "After germination, keep the strongest plants per hole according to density." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "إضافة سماد عضوي أولًا ثم بوتاسيوم وفوسفور أثناء التزهير وتكوين الثمار." : "Apply organic manure first, then potassium and phosphorus during flowering and fruiting." },
        { title: isArabic ? "تنظيم الري" : "Irrigation management", text: isArabic ? "زيادة الري في النمو وبداية تكوين الثمار، وتقليله قرب النضج لتحسين السكر." : "Increase irrigation during growth and fruiting, reduce near maturity for sweetness." },
        { title: isArabic ? "المكافحة والحصاد" : "Protection and harvest", text: isArabic ? "متابعة الحشرات والأمراض، ثم الحصاد عند جفاف المحلاق وتغير صوت الثمرة." : "Monitor pests and diseases, then harvest when maturity signs appear." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور بطيخ" : "Watermelon seeds", amount: 20000, details: isArabic ? "تقاوي هجين أو صنف مناسب للعروة." : "Hybrid or suitable variety seeds." },
        { id: 2, title: isArabic ? "تجهيز الأرض والجور" : "Land and hole preparation", amount: 15000, details: isArabic ? "حرث، تخطيط، وتجهيز جور الزراعة." : "Plowing, row making, and hole preparation." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 18000, details: isArabic ? "إضافة سماد متحلل قبل الزراعة." : "Adding decomposed manure before planting." },
        { id: 4, title: isArabic ? "أسمدة بوتاسيوم وفوسفور" : "Potassium and phosphorus fertilizers", amount: 28000, details: isArabic ? "تغذية الثمار وتحسين الحجم والجودة." : "Feeding fruits and improving size and quality." },
        { id: 5, title: isArabic ? "مكافحة أمراض وحشرات" : "Pest and disease control", amount: 14000, details: isArabic ? "متابعة البياض والحشرات والرش عند الحاجة." : "Monitoring mildew and insects with spraying when needed." },
        { id: 6, title: isArabic ? "حصاد وفرز ونقل" : "Harvest, sorting, and transport", amount: 15000, details: isArabic ? "عمالة جمع وفرز ونقل أولي." : "Harvest labor, sorting, and basic transport." }
      ]
    },
    {
      id: 7,
      name: isArabic ? "الذرة" : "Corn",
      img: "/images/corn2.jpg",
      season: "Summer",
      seasonText: isArabic ? "مارس إلى يونيو" : "March to June",
      modalImg: "/images/corn2.jpg",
      growth: isArabic ? "90 - 120 يوم" : "90 - 120 days",
      fertilizer: isArabic ? "نيتروجين + فوسفور" : "Nitrogen + phosphorus",
      totalCost: 72000,
      cost: isArabic ? "متوسط تكلفة الفدان: 72,000 جنيه تقريبًا" : "Average cost per feddan: about 72,000 EGP",
      method: isArabic ? "تزرع الذرة مباشرة بالحبوب في أرض مخططة. بعد الإنبات يتم الترقيع والخف لضبط عدد النباتات. تحتاج إلى تسميد نيتروجيني واضح على دفعات، خصوصًا قبل النمو السريع وقبل التزهير. انتظام الري مهم في التزهير وتكوين الكيزان. تتم مقاومة الحشائش مبكرًا، ثم الحصاد عند جفاف الكيزان أو حسب الغرض من الزراعة." : "Corn is sown directly in ridged soil. After germination, gap filling and thinning adjust plant density. Nitrogen fertilization is important in doses, especially before rapid growth and flowering. Regular irrigation is important during flowering and ear formation. Weeds are controlled early, and harvesting is done when ears dry or according to purpose.",
      cultivationSteps: [
        { title: isArabic ? "تخطيط الأرض" : "Row preparation", text: isArabic ? "حرث وتخطيط الأرض في خطوط منتظمة تناسب الزراعة والتهوية." : "Plow and make regular rows for planting and ventilation." },
        { title: isArabic ? "زراعة الحبوب" : "Grain sowing", text: isArabic ? "زراعة الحبوب مباشرة في جور على مسافات مناسبة." : "Sow grains directly in holes with suitable spacing." },
        { title: isArabic ? "الترقيع والخف" : "Gap filling and thinning", text: isArabic ? "تعويض الجور الغائبة وترك نبات قوي في كل مكان حسب الكثافة." : "Fill missing holes and keep strong plants according to density." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "إضافة نيتروجين على دفعات وفوسفور لدعم الجذور والنمو." : "Apply nitrogen in doses and phosphorus for roots and growth." },
        { title: isArabic ? "الري في المراحل الحساسة" : "Irrigation at critical stages", text: isArabic ? "الاهتمام بالري وقت التزهير وتكوين الكيزان لأنه يؤثر مباشرة على الإنتاج." : "Focus on irrigation during flowering and ear formation." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "الحصاد بعد 90–120 يوم حسب الصنف والاستخدام." : "Harvest after 90–120 days depending on variety and use." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "تقاوي ذرة" : "Corn seeds", amount: 12000, details: isArabic ? "حبوب تقاوي جيدة للصنف المطلوب." : "Good certified seeds." },
        { id: 2, title: isArabic ? "حرث وتخطيط وزراعة" : "Plowing, rows, and sowing", amount: 12000, details: isArabic ? "تجهيز الأرض وعمالة الزراعة." : "Land preparation and planting labor." },
        { id: 3, title: isArabic ? "أسمدة نيتروجينية" : "Nitrogen fertilizers", amount: 20000, details: isArabic ? "أهم بند في تغذية الذرة على دفعات." : "Main feeding item for corn in doses." },
        { id: 4, title: isArabic ? "فوسفور وعناصر صغرى" : "Phosphorus and micronutrients", amount: 10000, details: isArabic ? "دعم الجذور والتزهير." : "Supporting roots and flowering." },
        { id: 5, title: isArabic ? "مكافحة حشائش وآفات" : "Weed and pest control", amount: 9000, details: isArabic ? "تنظيف حشائش ومكافحة عند الحاجة." : "Weeding and protection when needed." },
        { id: 6, title: isArabic ? "حصاد ونقل" : "Harvest and transport", amount: 9000, details: isArabic ? "عمالة جمع ونقل المحصول." : "Harvest labor and crop transport." }
      ]
    },
    {
      id: 8,
      name: isArabic ? "الباذنجان" : "Eggplant",
      img: "/images/باذنجان.jpg",
      season: "Autumn",
      seasonText: isArabic ? "فبراير إلى أكتوبر" : "February to October",
      modalImg: "/images/باذنجان.jpg",
      growth: isArabic ? "70 - 90 يوم" : "70 - 90 days",
      fertilizer: isArabic ? "NPK متوازن + بوتاسيوم" : "Balanced NPK + potassium",
      totalCost: 105000,
      cost: isArabic ? "متوسط تكلفة الفدان: 105,000 جنيه تقريبًا" : "Average cost per feddan: about 105,000 EGP",
      method: isArabic ? "الباذنجان يبدأ غالبًا بشتلات في مشتل أو صواني، ثم ينقل للأرض بعد تجهيزها. يحتاج مسافات جيدة لأنه نبات قوي النمو. يتم الري باعتدال، والتسميد بنظام منتظم لدعم النمو والتزهير. من المهم متابعة العناكب والمن والذبابة البيضاء والأمراض الفطرية. الحصاد يكون متكررًا عند وصول الثمار للحجم المناسب قبل تصلب البذور." : "Eggplant usually starts as nursery seedlings, then is transplanted after land preparation. It needs good spacing because it grows strongly. Irrigation is moderate and fertilization is regular to support growth and flowering. Mites, aphids, whiteflies, and fungal diseases must be monitored. Harvesting is repeated when fruits reach proper size before seeds harden.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الشتلات" : "Seedling preparation", text: isArabic ? "إنتاج شتلات قوية عمر 30–40 يوم وخالية من الإصابات." : "Produce strong 30–40 day seedlings free from infection." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتسميد عضوي وتخطيط الأرض قبل الشتل." : "Plow, add organic manure, and ridge before transplanting." },
        { title: isArabic ? "الشتل" : "Transplanting", text: isArabic ? "نقل الشتلات على مسافة 40–50 سم بين النباتات." : "Transplant seedlings with 40–50 cm spacing." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "ري منتظم بدون تغريق لتجنب مشاكل الجذور." : "Regular irrigation without waterlogging to avoid root problems." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "NPK متوازن ثم زيادة البوتاسيوم وقت التزهير والإثمار." : "Balanced NPK then more potassium during flowering and fruiting." },
        { title: isArabic ? "المكافحة والحصاد" : "Protection and harvest", text: isArabic ? "متابعة الآفات ثم جمع الثمار على دفعات قبل كبر البذور." : "Monitor pests then pick fruits in batches before seeds mature." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "شتلات باذنجان" : "Eggplant seedlings", amount: 20000, details: isArabic ? "شتلات قوية مناسبة للعروة." : "Strong seedlings for the season." },
        { id: 2, title: isArabic ? "تجهيز الأرض والشتل" : "Land prep and transplanting", amount: 15000, details: isArabic ? "حرث وتخطيط وعمالة شتل." : "Plowing, ridging, and transplanting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 16000, details: isArabic ? "إضافة سماد متحلل لتحسين التربة." : "Adding decomposed manure." },
        { id: 4, title: isArabic ? "أسمدة ومغذيات" : "Fertilizers and nutrients", amount: 28000, details: isArabic ? "NPK وبوتاسيوم وعناصر صغرى." : "NPK, potassium, and micronutrients." },
        { id: 5, title: isArabic ? "مكافحة آفات" : "Pest control", amount: 16000, details: isArabic ? "متابعة ورش حسب الإصابة." : "Monitoring and spraying when needed." },
        { id: 6, title: isArabic ? "جمع وفرز" : "Picking and sorting", amount: 10000, details: isArabic ? "عمالة جمع على دفعات." : "Repeated picking labor." }
      ]
    },
    {
      id: 9,
      name: isArabic ? "الكوسة" : "Zucchini",
      img: "/images/كوسة.jpg",
      season: "Autumn",
      seasonText: isArabic ? "فبراير إلى أكتوبر" : "February to October",
      modalImg: "/images/كوسة.jpg",
      growth: isArabic ? "40 - 60 يوم" : "40 - 60 days",
      fertilizer: isArabic ? "سماد عضوي + بوتاسيوم" : "Organic manure + potassium",
      totalCost: 90000,
      cost: isArabic ? "متوسط تكلفة الفدان: 90,000 جنيه تقريبًا" : "Average cost per feddan: about 90,000 EGP",
      method: isArabic ? "الكوسة محصول سريع يزرع بالبذور مباشرة في جور أو خطوط. تحتاج الأرض إلى تجهيز جيد وسماد عضوي قبل الزراعة. بعد الإنبات يتم الخف وترك النباتات القوية. يحتاج النبات إلى ري منتظم وتسميد على دفعات، ومتابعة البياض الدقيقي والحشرات. يبدأ الحصاد سريعًا ويجب جمع الثمار صغيرة نسبيًا للحفاظ على الجودة." : "Zucchini is a fast crop sown directly in holes or rows. The land needs good preparation and organic manure before sowing. After germination, thinning keeps strong plants. It needs regular irrigation, fertilizer doses, and monitoring for powdery mildew and insects. Harvest starts quickly and fruits are picked relatively small for quality.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الجور" : "Hole preparation", text: isArabic ? "تجهيز جور أو خطوط مع إضافة سماد عضوي متحلل." : "Prepare holes or rows with decomposed manure." },
        { title: isArabic ? "زراعة البذور" : "Seed sowing", text: isArabic ? "زراعة البذور مباشرة في الجور على عمق مناسب." : "Sow seeds directly at a suitable depth." },
        { title: isArabic ? "الخف" : "Thinning", text: isArabic ? "ترك أقوى النباتات بعد اكتمال الإنبات." : "Keep the strongest plants after germination." },
        { title: isArabic ? "الري والتسميد" : "Irrigation and fertilization", text: isArabic ? "ري منتظم وتسميد نيتروجين وبوتاسيوم حسب مرحلة النمو." : "Regular irrigation and nitrogen/potassium fertilization by stage." },
        { title: isArabic ? "المكافحة" : "Protection", text: isArabic ? "متابعة البياض الدقيقي والذبابة البيضاء والمن." : "Monitor powdery mildew, whiteflies, and aphids." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "جمع الثمار بعد 40–60 يوم وهي صغيرة وطازجة." : "Harvest after 40–60 days while fruits are young and fresh." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور كوسة" : "Zucchini seeds", amount: 16000, details: isArabic ? "تقاوي جيدة ومناسبة للزراعة." : "Good suitable seeds." },
        { id: 2, title: isArabic ? "تجهيز وزراعة" : "Preparation and sowing", amount: 13000, details: isArabic ? "حرث، جور، وعمالة زراعة." : "Plowing, holes, and sowing labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 15000, details: isArabic ? "كمبوست أو سماد بلدي متحلل." : "Compost or decomposed manure." },
        { id: 4, title: isArabic ? "أسمدة معدنية" : "Mineral fertilizers", amount: 23000, details: isArabic ? "نيتروجين وبوتاسيوم وعناصر صغرى." : "Nitrogen, potassium, and micronutrients." },
        { id: 5, title: isArabic ? "مكافحة" : "Protection", amount: 13000, details: isArabic ? "رش عند ظهور إصابة." : "Spraying when infection appears." },
        { id: 6, title: isArabic ? "جمع متكرر" : "Repeated picking", amount: 10000, details: isArabic ? "عمالة جمع وفرز متكرر." : "Repeated picking and sorting labor." }
      ]
    },
    {
      id: 10,
      name: isArabic ? "الجزر" : "Carrot",
      img: "/images/carrot3.jpg",
      season: "Autumn",
      seasonText: isArabic ? "سبتمبر إلى فبراير" : "September to February",
      modalImg: "/images/carrot3.jpg",
      growth: isArabic ? "70 - 90 يوم" : "70 - 90 days",
      fertilizer: isArabic ? "بوتاسيوم + فوسفور" : "Potassium + phosphorus",
      totalCost: 72000,
      cost: isArabic ? "متوسط تكلفة الفدان: 72,000 جنيه تقريبًا" : "Average cost per feddan: about 72,000 EGP",
      method: isArabic ? "الجزر يحتاج تربة خفيفة ومفككة حتى ينمو الجذر مستقيمًا. يتم تنعيم التربة جيدًا وإزالة الكتل والحجارة. تزرع البذور مباشرة في سطور سطحية، ثم يتم الخف بعد الإنبات لتوفير مسافة للجذور. يحتاج ريًا منتظمًا حتى لا يتشقق الجذر، وتسميدًا متوازنًا بدون زيادة نيتروجين. الحصاد يكون عند وصول الجذور للحجم المناسب." : "Carrot needs light loose soil so roots grow straight. The soil is finely prepared and stones or clods are removed. Seeds are sown directly in shallow rows, then thinning gives roots enough space. Irrigation must be regular to avoid cracking, and fertilization should be balanced without excess nitrogen. Harvesting is done when roots reach proper size.",
      cultivationSteps: [
        { title: isArabic ? "تنعيم التربة" : "Fine soil preparation", text: isArabic ? "تفكيك التربة وإزالة القلاقيل والحجارة حتى لا يتشوه الجذر." : "Loosen soil and remove stones or clods to prevent root deformation." },
        { title: isArabic ? "زراعة البذور" : "Seed sowing", text: isArabic ? "زراعة البذور في سطور سطحية وتغطيتها بطبقة خفيفة." : "Sow seeds in shallow rows and cover lightly." },
        { title: isArabic ? "الخف" : "Thinning", text: isArabic ? "تخفيف النباتات بعد الإنبات حتى تتوفر مساحة لتكوين الجذور." : "Thin after germination to give roots space." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "رطوبة منتظمة لتجنب التشقق أو التفرع." : "Regular moisture to avoid cracking or branching." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "استخدام فوسفور وبوتاسيوم مع تقليل النيتروجين الزائد." : "Use phosphorus and potassium while avoiding excess nitrogen." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "اقتلاع الجذور بعد 70–90 يوم حسب الحجم المطلوب." : "Pull roots after 70–90 days according to size." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "بذور جزر" : "Carrot seeds", amount: 14000, details: isArabic ? "تقاوي جيدة ومتجانسة." : "Good uniform seeds." },
        { id: 2, title: isArabic ? "تنعيم وتجهيز الأرض" : "Fine land preparation", amount: 15000, details: isArabic ? "تجهيز دقيق للتربة لتجنب تشوه الجذور." : "Fine preparation to avoid root deformation." },
        { id: 3, title: isArabic ? "سماد عضوي متحلل" : "Decomposed manure", amount: 12000, details: isArabic ? "تحسين التربة قبل الزراعة." : "Improve soil before sowing." },
        { id: 4, title: isArabic ? "فوسفور وبوتاسيوم" : "Phosphorus and potassium", amount: 15000, details: isArabic ? "تغذية تكوين الجذور." : "Feeding root formation." },
        { id: 5, title: isArabic ? "حشائش ومكافحة" : "Weeding and protection", amount: 8000, details: isArabic ? "تنظيف الحشائش وحماية المحصول." : "Weed cleaning and crop protection." },
        { id: 6, title: isArabic ? "حصاد وتنظيف" : "Harvest and cleaning", amount: 8000, details: isArabic ? "اقتلاع، تنظيف، وفرز الجذور." : "Pulling, cleaning, and sorting roots." }
      ]
    },
    {
      id: 11,
      name: isArabic ? "البروكلي" : "Broccoli",
      img: "/images/broccoli.jpg",
      season: "Autumn",
      seasonText: isArabic ? "سبتمبر إلى فبراير" : "September to February",
      modalImg: "/images/broccoli.jpg",
      growth: isArabic ? "70 - 90 يوم" : "70 - 90 days",
      fertilizer: isArabic ? "نيتروجين + كالسيوم + عناصر صغرى" : "Nitrogen + calcium + micronutrients",
      totalCost: 85000,
      cost: isArabic ? "متوسط تكلفة الفدان: 85,000 جنيه تقريبًا" : "Average cost per feddan: about 85,000 EGP",
      method: isArabic ? "البروكلي يفضل زراعته شتلات في الجو المعتدل أو البارد. يتم تجهيز الأرض وإضافة سماد عضوي، ثم نقل الشتلات على مسافات مناسبة. يحتاج ريًا منتظمًا وتسميدًا يدعم النمو الورقي وتكوين الرأس. يجب متابعة ديدان الأوراق والمن. الحصاد يكون عند تكوين رأس متماسك قبل تفتح البراعم الصفراء." : "Broccoli is best grown from seedlings in mild or cool weather. The land is prepared with organic manure, then seedlings are transplanted with proper spacing. It needs regular irrigation and fertilization to support leaves and head formation. Leaf worms and aphids must be monitored. Harvesting is done when the head is firm before yellow buds open.",
      cultivationSteps: [
        { title: isArabic ? "إنتاج الشتلات" : "Seedling production", text: isArabic ? "تجهيز شتلات عمر 25–35 يوم قوية ومتجانسة." : "Prepare strong uniform 25–35 day seedlings." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتخطيط وإضافة سماد عضوي متحلل." : "Plow, ridge, and add decomposed manure." },
        { title: isArabic ? "الشتل" : "Transplanting", text: isArabic ? "الشتل على مسافة 40–50 سم بين النباتات." : "Transplant with 40–50 cm spacing." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "الحفاظ على رطوبة ثابتة خاصة أثناء تكوين الرأس." : "Keep steady moisture during head formation." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "إضافة نيتروجين وكالسيوم وعناصر صغرى لتحسين جودة الرأس." : "Apply nitrogen, calcium, and micronutrients for head quality." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "قطع الرأس عندما يكون متماسكًا وقبل تفتح البراعم." : "Cut the head when firm before buds open." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "شتلات بروكلي" : "Broccoli seedlings", amount: 16000, details: isArabic ? "شتلات جيدة وموحدة." : "Good uniform seedlings." },
        { id: 2, title: isArabic ? "تجهيز وشتل" : "Preparation and transplanting", amount: 14000, details: isArabic ? "تجهيز الأرض وعمالة الشتل." : "Land preparation and transplanting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 14000, details: isArabic ? "إضافة كمبوست أو سماد متحلل." : "Adding compost or decomposed manure." },
        { id: 4, title: isArabic ? "أسمدة ومغذيات" : "Fertilizers and nutrients", amount: 22000, details: isArabic ? "نيتروجين، كالسيوم، وعناصر صغرى." : "Nitrogen, calcium, and micronutrients." },
        { id: 5, title: isArabic ? "مكافحة ديدان وحشرات" : "Worm and pest control", amount: 10000, details: isArabic ? "مكافحة ديدان الأوراق والمن." : "Leaf worm and aphid control." },
        { id: 6, title: isArabic ? "حصاد وتعبئة" : "Harvesting and packing", amount: 9000, details: isArabic ? "قطع الرؤوس وتعبئتها." : "Cutting and packing heads." }
      ]
    },
    {
      id: 12,
      name: isArabic ? "القرنبيط" : "Cauliflower",
      img: "/images/قرنبيط.jpg",
      season: "Winter",
      seasonText: isArabic ? "سبتمبر-فبراير" : "September-February",
      modalImg: "/images/قرنبيط.jpg",
      growth: isArabic ? "75 - 90 يوم" : "75 - 90 days",
      fertilizer: isArabic ? "NPK + عناصر صغرى" : "NPK + micronutrients",
      totalCost: 85000,
      cost: isArabic ? "متوسط تكلفة الفدان: 85,000 جنيه تقريبًا" : "Average cost per feddan: about 85,000 EGP",
      method: isArabic ? "القرنبيط يزرع غالبًا بالشتلات في الأجواء المعتدلة والباردة. يتم تجهيز الأرض جيدًا وإضافة سماد عضوي، ثم الشتل على مسافات تسمح بتكوين رؤوس كبيرة. يحتاج رطوبة منتظمة وتسميد متوازن، مع الاهتمام بالعناصر الصغرى. تتم مكافحة ديدان الأوراق والحشرات، ثم يحصد عند اكتمال حجم الرأس قبل التفكك أو الاصفرار." : "Cauliflower is usually grown from seedlings in mild and cool weather. Land is prepared with organic manure, then seedlings are transplanted with spacing that allows large heads. It needs regular moisture, balanced fertilization, and micronutrients. Leaf worms and insects are controlled, then harvesting is done when the head reaches full size before loosening or yellowing.",
      cultivationSteps: [
        { title: isArabic ? "تجهيز الشتلات" : "Seedling preparation", text: isArabic ? "إنتاج شتلات قوية عمر 25–35 يوم." : "Prepare strong 25–35 day seedlings." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتسميد عضوي وتخطيط الأرض قبل الزراعة." : "Plow, add organic manure, and ridge the land." },
        { title: isArabic ? "الشتل" : "Transplanting", text: isArabic ? "ترك مسافة مناسبة بين النباتات لتكوين رأس جيد." : "Keep suitable spacing for good head formation." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "انتظام الرطوبة خصوصًا أثناء تكوين الرأس." : "Maintain regular moisture during head formation." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "تسميد متوازن مع عناصر صغرى لتحسين اللون والحجم." : "Balanced fertilization with micronutrients for color and size." },
        { title: isArabic ? "الحصاد" : "Harvesting", text: isArabic ? "الحصاد عند اكتمال الرأس وقبل التفكك." : "Harvest when the head is full before loosening." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "شتلات قرنبيط" : "Cauliflower seedlings", amount: 15000, details: isArabic ? "شتلات موحدة وخالية من الأمراض." : "Uniform disease-free seedlings." },
        { id: 2, title: isArabic ? "تجهيز وشتل" : "Preparation and transplanting", amount: 14000, details: isArabic ? "حرث وتخطيط وعمالة شتل." : "Plowing, ridging, and transplanting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 14000, details: isArabic ? "كمبوست أو سماد بلدي متحلل." : "Compost or decomposed manure." },
        { id: 4, title: isArabic ? "NPK وعناصر صغرى" : "NPK and micronutrients", amount: 23000, details: isArabic ? "تغذية الرأس وتحسين الجودة." : "Feeding the head and improving quality." },
        { id: 5, title: isArabic ? "مكافحة" : "Protection", amount: 10000, details: isArabic ? "ديدان وحشرات وأمراض حسب الحاجة." : "Worms, insects, and diseases as needed." },
        { id: 6, title: isArabic ? "حصاد وتعبئة" : "Harvesting and packing", amount: 9000, details: isArabic ? "قطع الرؤوس وتعبئتها." : "Cutting and packing heads." }
      ]
    },
    {
      id: 13,
      name: isArabic ? "البصل" : "Onion",
      img: "/images/onions.jpg",
      season: "Autumn",
      seasonText: isArabic ? "سبتمبر - يناير" : "September - January",
      modalImg: "/images/onions.jpg",
      growth: isArabic ? "120 - 150 يوم" : "120 - 150 days",
      fertilizer: isArabic ? "بوتاسيوم + كبريت + فوسفور" : "Potassium + sulfur + phosphorus",
      totalCost: 78000,
      cost: isArabic ? "متوسط تكلفة الفدان: 78,000 جنيه تقريبًا" : "Average cost per feddan: about 78,000 EGP",
      method: isArabic ? "البصل يبدأ من بذور في مشتل أو شتلات جاهزة، ثم ينقل للأرض المستديمة. يتم تجهيز الأرض جيدًا وتخطيطها، ثم الشتل بمسافات صغيرة. يحتاج انتظام الري في البداية، ثم تقليل الري قبل الحصاد حتى تجف الأبصال جيدًا. يتم التسميد بالبوتاسيوم والكبريت والفوسفور، ومتابعة التربس والأمراض الفطرية. الحصاد يكون بعد رقاد العرش وجفافه نسبيًا." : "Onion starts from nursery seeds or ready seedlings, then is transplanted to the field. Land is prepared and ridged, then seedlings are transplanted with small spacing. Irrigation is regular early, then reduced before harvest so bulbs dry well. Fertilization includes potassium, sulfur, and phosphorus, with monitoring of thrips and fungal diseases. Harvesting is done after tops fall and dry partially.",
      cultivationSteps: [
        { title: isArabic ? "إنتاج أو شراء الشتلات" : "Seedling production or purchase", text: isArabic ? "استخدام شتلات بصل قوية عمر 45–60 يوم." : "Use strong 45–60 day onion seedlings." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتخطيط الأرض وتجهيزها للشتل المنتظم." : "Plow and ridge the land for regular transplanting." },
        { title: isArabic ? "الشتل" : "Transplanting", text: isArabic ? "الشتل بمسافة 10–15 سم تقريبًا بين النباتات." : "Transplant with about 10–15 cm spacing." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "انتظام الري في النمو ثم تقليله قبل الحصاد لتجفيف الأبصال." : "Regular irrigation during growth, then reduce before harvest to dry bulbs." },
        { title: isArabic ? "التسميد والمكافحة" : "Fertilization and protection", text: isArabic ? "إضافة بوتاسيوم وكبريت ومتابعة التربس والأمراض." : "Add potassium and sulfur and monitor thrips and diseases." },
        { title: isArabic ? "الحصاد والتجفيف" : "Harvesting and curing", text: isArabic ? "الحصاد بعد رقاد العرش ثم تجفيف الأبصال وفرزها." : "Harvest after top fall, then cure and sort bulbs." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "شتلات أو بذور بصل" : "Onion seedlings or seeds", amount: 16000, details: isArabic ? "شتلات جاهزة أو إنتاج مشتل." : "Ready seedlings or nursery production." },
        { id: 2, title: isArabic ? "تجهيز الأرض والشتل" : "Land prep and transplanting", amount: 14000, details: isArabic ? "حرث وتخطيط وعمالة شتل." : "Plowing, ridging, and transplanting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 10000, details: isArabic ? "تحسين التربة قبل الزراعة." : "Improving soil before planting." },
        { id: 4, title: isArabic ? "بوتاسيوم وكبريت وفوسفور" : "Potassium, sulfur, phosphorus", amount: 18000, details: isArabic ? "تغذية تكوين الأبصال." : "Feeding bulb formation." },
        { id: 5, title: isArabic ? "مكافحة التربس والأمراض" : "Thrips and disease control", amount: 10000, details: isArabic ? "رش ومتابعة حسب الإصابة." : "Spraying and monitoring as needed." },
        { id: 6, title: isArabic ? "حصاد وتجفيف وفرز" : "Harvest, curing, and sorting", amount: 10000, details: isArabic ? "عمالة جمع وتجفيف وفرز." : "Labor for harvest, curing, and sorting." }
      ]
    },
    {
      id: 14,
      name: isArabic ? "الثوم" : "Garlic",
      img: "/images/Garlic.jpg",
      season: "Winter",
      seasonText: isArabic ? "سبتمبر إلى يناير" : "September to January",
      modalImg: "/images/Garlic.jpg",
      growth: isArabic ? "120 - 150 يوم" : "120 - 150 days",
      fertilizer: isArabic ? "سماد عضوي + كبريت + بوتاسيوم" : "Organic manure + sulfur + potassium",
      totalCost: 85000,
      cost: isArabic ? "متوسط تكلفة الفدان: 85,000 جنيه تقريبًا" : "Average cost per feddan: about 85,000 EGP",
      method: isArabic ? "الثوم يزرع بالفصوص وليس بالبذور. يتم اختيار رؤوس سليمة ثم تفصيصها قبل الزراعة. تجهز الأرض جيدًا وتزرع الفصوص على عمق 3–5 سم مع مسافات مناسبة. يحتاج انتظام الري في البداية، ثم يقل قبل الحصاد. التسميد بالكبريت والبوتاسيوم مهم لتكوين الرؤوس. الحصاد يكون عند اصفرار وجفاف جزء كبير من الأوراق، ثم يتم التجفيف والفرز." : "Garlic is planted by cloves, not seeds. Healthy bulbs are selected and separated before planting. Land is prepared well and cloves are planted 3–5 cm deep with suitable spacing. Irrigation is regular early and reduced before harvest. Sulfur and potassium fertilization is important for bulb formation. Harvesting is done when many leaves yellow and dry, then bulbs are cured and sorted.",
      cultivationSteps: [
        { title: isArabic ? "اختيار الفصوص" : "Clove selection", text: isArabic ? "اختيار رؤوس سليمة كبيرة وتفصيصها إلى فصوص صالحة للزراعة." : "Choose healthy large bulbs and separate suitable cloves." },
        { title: isArabic ? "تجهيز الأرض" : "Land preparation", text: isArabic ? "حرث وتنعيم وتخطيط الأرض مع إضافة سماد عضوي." : "Plow, soften, ridge, and add organic manure." },
        { title: isArabic ? "زراعة الفصوص" : "Clove planting", text: isArabic ? "زراعة الفصوص على عمق 3–5 سم وترك 10–15 سم بين النباتات." : "Plant cloves 3–5 cm deep with 10–15 cm spacing." },
        { title: isArabic ? "الري" : "Irrigation", text: isArabic ? "انتظام الري في البداية وتقليله قبل الحصاد لتجفيف الرؤوس." : "Regular irrigation early, reduced before harvest to dry bulbs." },
        { title: isArabic ? "التسميد" : "Fertilization", text: isArabic ? "إضافة كبريت وبوتاسيوم وجرعات نيتروجين معتدلة." : "Apply sulfur, potassium, and moderate nitrogen doses." },
        { title: isArabic ? "الحصاد والتجفيف" : "Harvesting and curing", text: isArabic ? "الحصاد عند جفاف الأوراق ثم تجفيف الرؤوس وفرزها." : "Harvest when leaves dry, then cure and sort bulbs." }
      ],
      costSteps: [
        { id: 1, title: isArabic ? "فصوص ثوم للزراعة" : "Garlic cloves for planting", amount: 22000, details: isArabic ? "شراء رؤوس/فصوص سليمة للزراعة." : "Buying healthy bulbs/cloves for planting." },
        { id: 2, title: isArabic ? "تجهيز الأرض والزراعة" : "Land prep and planting", amount: 14000, details: isArabic ? "حرث وتخطيط وعمالة زراعة الفصوص." : "Plowing, ridging, and clove planting labor." },
        { id: 3, title: isArabic ? "سماد عضوي" : "Organic manure", amount: 12000, details: isArabic ? "كمبوست أو سماد متحلل قبل الزراعة." : "Compost or decomposed manure before planting." },
        { id: 4, title: isArabic ? "كبريت وبوتاسيوم وأسمدة" : "Sulfur, potassium, fertilizers", amount: 18000, details: isArabic ? "تغذية تكوين الرؤوس وتحسين الجودة." : "Feeding bulb formation and quality." },
        { id: 5, title: isArabic ? "مكافحة حشائش وأمراض" : "Weed and disease control", amount: 9000, details: isArabic ? "تنظيف حشائش ومتابعة الأمراض." : "Weeding and disease monitoring." },
        { id: 6, title: isArabic ? "حصاد وتجفيف وفرز" : "Harvest, curing, and sorting", amount: 10000, details: isArabic ? "عمالة جمع وتجفيف وفرز الرؤوس." : "Labor for harvest, curing, and sorting bulbs." }
      ] },

   {
  id: 15,
  name: isArabic ? "البطاطس" : "Potato",
  img: "images/potato.jpg",
  season: "Winter",
  seasonText: isArabic ? "منتصف أكتوبر - نوفمبر" : "Mid October - November",
  modalImg: "images/potato.jpg",

  growth: isArabic ? "90 - 120 يوم" : "90 - 120 days",
  fertilizer: isArabic ? "NPK + بوتاسيوم + كالسيوم" : "NPK + Potassium + Calcium",

  totalCost: 27000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 25,000 - 30,000 جنيه"
    : "Average cost per feddan: 25,000 - 30,000 EGP",

  method: isArabic
    ? "البطاطس من أهم المحاصيل الشتوية في مصر، وتحتاج إلى تربة جيدة التهوية ويفضل الأراضي الرملية أو الطميية الخفيفة. يتم تجهيز الأرض جيدًا بالحرث والتسوية، ثم تقطيع التقاوي وتركها لتجف قبل الزراعة. تُزرع الدرنات على عمق مناسب مع الاهتمام بالري المنتظم دون تغريق، ويُضاف السماد على مراحل خلال النمو حتى الوصول إلى حجم مناسب للدرنات."
    : "Potatoes are one of the most important winter crops in Egypt. They require well-aerated soil, preferably sandy or light loamy soil. The land is prepared through plowing and leveling, then seed tubers are cut and left to dry before planting. Tubers are planted at proper depth with regular irrigation and staged fertilization until maturity.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      text: isArabic
        ? "حرث الأرض مرتين أو ثلاث مرات وتنعيمها جيدًا مع تسوية السطح."
        : "Plow the land 2–3 times and level it properly."
    },
    {
      title: isArabic ? "تقطيع التقاوي" : "Seed cutting",
      text: isArabic
        ? "تقطيع درنات البطاطس إلى قطع تحتوي على عيون وتركها لتجف يومين."
        : "Cut seed tubers into pieces with eyes and let them dry for 2 days."
    },
    {
      title: isArabic ? "الزراعة" : "Planting",
      text: isArabic
        ? "زراعة الدرنات على عمق 10–15 سم وبين كل نبات 25–30 سم."
        : "Plant tubers at 10–15 cm depth with 25–30 cm spacing."
    },
    {
      title: isArabic ? "الري" : "Irrigation",
      text: isArabic
        ? "الري المنتظم كل 5–7 أيام مع تجنب التغريق."
        : "Irrigate every 5–7 days without overwatering."
    },
    {
      title: isArabic ? "التسميد" : "Fertilization",
      text: isArabic
        ? "إضافة NPK على دفعات خلال فترة النمو."
        : "Apply NPK fertilizers in stages during growth."
    },
    {
      title: isArabic ? "الحصاد" : "Harvesting",
      text: isArabic
        ? "يتم الحصاد بعد اصفرار الأوراق وجفافها."
        : "Harvest when leaves turn yellow and dry."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "تقاوي البطاطس" : "Seed tubers",
      amount: 13000,
      details: isArabic
        ? "شراء تقاوي بطاطس معتمدة عالية الجودة."
        : "شراء درنات بطاطس عالية الجودة"
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 4000,
      details: isArabic
        ? "حرث وتسوية الأرض."
        : "Plowing and leveling"
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي" : "Organic manure",
      amount: 3000,
      details: isArabic
        ? "إضافة سماد بلدي متحلل."
        : "Organic manure"
    },
    {
      id: 4,
      title: isArabic ? "أسمدة كيميائية" : "Fertilizers",
      amount: 4000,
      details: isArabic
        ? "NPK + عناصر صغرى."
        : "NPK + micronutrients"
    },
    {
      id: 5,
      title: isArabic ? "مبيدات" : "Pesticides",
      amount: 1500,
      details: isArabic
        ? "مكافحة الآفات والأمراض."
        : "Pest control"
    },
    {
      id: 6,
      title: isArabic ? "عمالة وري" : "Labor & irrigation",
      amount: 1500,
      details: isArabic
        ? "تكاليف العمالة والري."
        : "Labor and irrigation costs"
    }
  ]
},

{
  id: 16,
  name: isArabic ? "القمح" : "Wheat",
  img: "images/Wheat.jpg",
  season: "Winter",
  seasonText: isArabic ? "نوفمبر - ديسمبر" : "November - December",
  modalImg: "images/Wheat.jpg",

  growth: isArabic ? "150 - 180 يوم" : "150 - 180 days",
  fertilizer: isArabic ? "نيتروجين + فوسفور + بوتاسيوم" : "Nitrogen + Phosphorus + Potassium",

  totalCost: 9500,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 9,000 - 10,000 جنيه"
    : "Average cost per feddan: 9,000 - 10,000 EGP",

  method: isArabic
    ? "القمح من أهم المحاصيل الاستراتيجية في مصر، ويزرع في الأراضي الطميية الثقيلة والخفيفة. يتم تجهيز الأرض جيدًا بالحرث والتسوية ثم زراعة التقاوي إما نثرًا أو بالتسطير. يحتاج القمح إلى ري منتظم في المراحل الأولى ثم تقليل الري قبل الحصاد. كما يتم إضافة الأسمدة النيتروجينية على دفعات لضمان نمو جيد وزيادة الإنتاج."
    : "Wheat is one of the most important strategic crops in Egypt. It is grown in both heavy and light clay soils. The land is prepared through plowing and leveling, and seeds are sown either by broadcasting or drilling. Wheat requires regular irrigation in early stages, then reduced watering before harvest. Nitrogen fertilizers are applied in stages to ensure good growth and higher yield.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      text: isArabic
        ? "حرث الأرض جيدًا مرتين أو أكثر مع تسويتها."
        : "Plow the land 2 or more times and level it properly."
    },
    {
      title: isArabic ? "زراعة التقاوي" : "Sowing",
      text: isArabic
        ? "زراعة البذور نثرًا أو بالتسطير بمعدل مناسب."
        : "Sow seeds by broadcasting or drilling at proper rate."
    },
    {
      title: isArabic ? "الري" : "Irrigation",
      text: isArabic
        ? "الري المنتظم خاصة في بداية النمو."
        : "Regular irrigation especially in early growth."
    },
    {
      title: isArabic ? "التسميد" : "Fertilization",
      text: isArabic
        ? "إضافة الأسمدة النيتروجينية على دفعات."
        : "Apply nitrogen fertilizers in stages."
    },
    {
      title: isArabic ? "مكافحة الحشائش" : "Weed control",
      text: isArabic
        ? "إزالة الحشائش أو استخدام مبيدات مناسبة."
        : "Remove weeds or use herbicides."
    },
    {
      title: isArabic ? "الحصاد" : "Harvesting",
      text: isArabic
        ? "يتم الحصاد عند اصفرار السنابل وجفافها."
        : "Harvest when spikes turn yellow and dry."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "تقاوي القمح" : "Seeds",
      amount: 3200,
      details: isArabic
        ? "شراء بذور قمح معتمدة."
        : "Certified wheat seeds"
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 1500,
      details: isArabic
        ? "حرث وتسوية الأرض."
        : "Plowing and leveling"
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي" : "Organic manure",
      amount: 1500,
      details: isArabic
        ? "إضافة سماد بلدي."
        : "Organic manure"
    },
    {
      id: 4,
      title: isArabic ? "أسمدة كيميائية" : "Fertilizers",
      amount: 2000,
      details: isArabic
        ? "نيتروجين + فوسفور."
        : "Nitrogen + phosphorus"
    },
    {
      id: 5,
      title: isArabic ? "مبيدات" : "Pesticides",
      amount: 700,
      details: isArabic
        ? "مكافحة الحشائش والآفات."
        : "Weed and pest control"
    },
    {
      id: 6,
      title: isArabic ? "عمالة وري" : "Labor & irrigation",
      amount: 600,
      details: isArabic
        ? "تكاليف العمالة والري."
        : "Labor and irrigation costs"
    }
  ]
},


{
  id: 17,
  name: isArabic ? "الموز" : "Banana",
  img: "images/banana2.jpg",
  season: "Spring",
  seasonText: isArabic ? "فبراير - أبريل" : "February - April",
  modalImg: "images/banana2.jpg",

  growth: isArabic ? "10 - 12 شهر لأول إنتاج" : "10 - 12 months for first harvest",
  fertilizer: isArabic ? "نيتروجين عالي + بوتاسيوم + عناصر صغرى" : "High nitrogen + potassium + micronutrients",

  totalCost: 170000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 150,000 - 180,000 جنيه (سنة التأسيس)"
    : "Average cost per feddan: 150,000 - 180,000 EGP (first year)",

  method: isArabic
    ? "الموز من المحاصيل الشرهة جدًا للمياه والعناصر الغذائية، ويحتاج إلى تربة جيدة الصرف ويفضل الأراضي الرملية أو الطميية الخفيفة. يتم تجهيز الأرض بعمق كبير وإضافة كميات كبيرة من السماد العضوي، ثم زراعة الخلفات (الفسائل) على مسافات واسعة. يحتاج النبات إلى ري منتظم بكميات كبيرة، ويتم اختيار خلفة واحدة قوية لكل نبات لضمان إنتاج جيد، مع إزالة باقي الخلفات الزائدة."
    : "Banana is a heavy feeder crop requiring large amounts of water and nutrients. It prefers well-drained sandy or light loamy soils. The land is deeply prepared and enriched with organic manure, then offshoots are planted with wide spacing. The plant requires heavy irrigation, and only one strong offshoot is kept per plant to ensure good production.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز الأرض العميق" : "Deep land preparation",
      text: isArabic
        ? "حرث الأرض بعمق كبير مع إضافة سماد عضوي بكميات كبيرة."
        : "Deep plowing with large amounts of organic manure."
    },
    {
      title: isArabic ? "زراعة الخلفات" : "Planting offshoots",
      text: isArabic
        ? "زراعة خلفات سليمة وخالية من الأمراض على مسافات 3×3 متر."
        : "Plant healthy offshoots at 3x3 meter spacing."
    },
    {
      title: isArabic ? "الري الغزير المنتظم" : "Heavy irrigation",
      text: isArabic
        ? "الري بكميات كبيرة وبانتظام لأن النبات يستهلك مياه كثيرة."
        : "Frequent heavy irrigation due to high water demand."
    },
    {
      title: isArabic ? "اختيار خلفة واحدة" : "Offshoot selection",
      text: isArabic
        ? "ترك خلفة واحدة قوية لكل نبات وإزالة الباقي."
        : "Keep one strong offshoot and remove others."
    },
    {
      title: isArabic ? "التسميد المستمر" : "Continuous fertilization",
      text: isArabic
        ? "إضافة النيتروجين والبوتاسيوم على مراحل."
        : "Apply nitrogen and potassium in stages."
    },
    {
      title: isArabic ? "الحصاد" : "Harvesting",
      text: isArabic
        ? "يتم الحصاد بعد اكتمال نمو السباطة."
        : "Harvest when the bunch is fully developed."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "خلفات الموز" : "Banana offshoots",
      amount: 55000,
      details: isArabic
        ? "شراء خلفات جيدة ومعتمدة."
        : "شراء فسائل موز عالية الجودة"
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 30000,
      details: isArabic
        ? "حرث عميق وتسوية."
        : "Deep plowing and leveling"
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي" : "Organic manure",
      amount: 30000,
      details: isArabic
        ? "كميات كبيرة من السماد البلدي."
        : "Large organic manure quantities"
    },
    {
      id: 4,
      title: isArabic ? "أسمدة كيميائية" : "Fertilizers",
      amount: 25000,
      details: isArabic
        ? "نيتروجين + بوتاسيوم."
        : "Nitrogen and potassium"
    },
    {
      id: 5,
      title: isArabic ? "مكافحة" : "Pesticides",
      amount: 15000,
      details: isArabic
        ? "مكافحة الحشرات والأمراض."
        : "Pest control"
    },
    {
      id: 6,
      title: isArabic ? "عمالة وري" : "Labor & irrigation",
      amount: 15000,
      details: isArabic
        ? "تكاليف الري والعمالة."
        : "Labor and irrigation costs"
    }
  ]
},

{
  id: 18,
  name: isArabic ? "الفراولة" : "Strawberry",
  img: "images/strawberry.jpg",
  season: "Autumn",
  seasonText: isArabic ? "سبتمبر - أكتوبر" : "September - October",
  modalImg: "images/strawberry.jpg",

  growth: isArabic ? "75 - 100 يوم لبدء الجمع" : "75 - 100 days to start harvesting",
  fertilizer: isArabic
    ? "سماد عضوي + NPK + كالسيوم + بوتاسيوم + عناصر صغرى"
    : "Organic manure + NPK + calcium + potassium + micronutrients",

  totalCost: 145000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 130,000 - 160,000 جنيه حسب نوع الشتلات ونظام الري"
    : "Average cost per feddan: 130,000 - 160,000 EGP depending on seedlings and irrigation system",

  method: isArabic
    ? "الفراولة محصول عالي القيمة لكنه حساس جدًا، ويحتاج تجهيز دقيق قبل الزراعة. تبدأ الزراعة بتجهيز الأرض وعمل مصاطب مرتفعة لتحسين الصرف، ثم تركيب شبكة تنقيط لأن انتظام الري مهم جدًا. بعد ذلك يتم فرد الملش البلاستيك لحماية الثمار وتقليل الحشائش، ثم زراعة الشتلات في فتحات منتظمة. خلال الموسم تحتاج الفراولة إلى تسميد متوازن، خاصة الكالسيوم والبوتاسيوم لتحسين جودة الثمار، مع متابعة مستمرة للأعفان والبياض الدقيقي والحشرات. يبدأ الحصاد عادة بعد حوالي 75 إلى 100 يوم ويستمر على دفعات."
    : "Strawberry is a high-value but sensitive crop that requires careful preparation. Cultivation starts with land preparation and raised beds for better drainage, followed by drip irrigation installation because water consistency is essential. Plastic mulch is then applied to protect fruits and reduce weeds, and seedlings are planted in regular holes. During the season, strawberries require balanced fertilization, especially calcium and potassium for fruit quality, with continuous monitoring for rots, powdery mildew, and pests. Harvest usually starts after about 75 to 100 days and continues in multiple pickings.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز الأرض والمصاطب" : "Land and bed preparation",
      text: isArabic
        ? "حرث الأرض وتنعيمها جيدًا، ثم عمل مصاطب مرتفعة بعرض مناسب لتحسين الصرف وتقليل ملامسة الثمار للتربة."
        : "Plow and soften the soil, then form raised beds to improve drainage and reduce fruit contact with soil."
    },
    {
      title: isArabic ? "تركيب شبكة التنقيط" : "Drip irrigation setup",
      text: isArabic
        ? "تركيب خراطيم تنقيط على المصاطب لضمان وصول المياه بانتظام للجذور بدون تغريق."
        : "Install drip lines on beds to deliver water evenly to roots without waterlogging."
    },
    {
      title: isArabic ? "فرد الملش البلاستيك" : "Plastic mulch installation",
      text: isArabic
        ? "تغطية المصاطب بملش بلاستيك أسود أو فضي لتقليل الحشائش وحماية الثمار من التعفن."
        : "Cover beds with black or silver plastic mulch to reduce weeds and protect fruits from rot."
    },
    {
      title: isArabic ? "تجهيز وزراعة الشتلات" : "Seedling preparation and transplanting",
      text: isArabic
        ? "اختيار شتلات سليمة، وتطهير الجذور عند الحاجة، ثم زراعتها في فتحات الملش مع بقاء قلب الشتلة فوق سطح التربة."
        : "Select healthy seedlings, disinfect roots when needed, then plant through mulch holes while keeping the crown above soil level."
    },
    {
      title: isArabic ? "التسميد وبرنامج التغذية" : "Fertilization program",
      text: isArabic
        ? "إضافة NPK على دفعات، مع التركيز على الكالسيوم لتقليل تشوه الثمار والبوتاسيوم لتحسين الحجم والطعم."
        : "Apply NPK in doses, focusing on calcium to reduce fruit deformities and potassium to improve size and taste."
    },
    {
      title: isArabic ? "المكافحة والمتابعة" : "Protection and monitoring",
      text: isArabic
        ? "متابعة البياض الدقيقي والأعفان والعنكبوت الأحمر والمن، والرش عند ظهور الإصابة فقط لتقليل التكلفة."
        : "Monitor powdery mildew, rots, red spider mites, and aphids, spraying only when infection appears to reduce cost."
    },
    {
      title: isArabic ? "الجمع والفرز" : "Harvesting and sorting",
      text: isArabic
        ? "جمع الثمار الناضجة على دفعات متقاربة، ثم فرز الثمار السليمة واستبعاد التالفة قبل التعبئة."
        : "Pick ripe fruits frequently, then sort healthy fruits and remove damaged ones before packing."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "شتلات فراولة جيدة" : "Quality strawberry seedlings",
      amount: 55000,
      details: isArabic
        ? "أكبر بند تكلفة غالبًا؛ يشمل شراء شتلات قوية مناسبة للعروة وخالية من الأمراض."
        : "Usually the biggest cost item; includes strong disease-free seedlings suitable for the season."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض والمصاطب" : "Land and raised beds preparation",
      amount: 14000,
      details: isArabic
        ? "حرث، تنعيم، تسوية، تخطيط، وعمل مصاطب مرتفعة مناسبة للزراعة."
        : "Plowing, softening, leveling, row planning, and forming raised planting beds."
    },
    {
      id: 3,
      title: isArabic ? "شبكة ري بالتنقيط" : "Drip irrigation system",
      amount: 18000,
      details: isArabic
        ? "خراطيم تنقيط ومستلزمات توصيل وصيانة بسيطة لضمان انتظام الري."
        : "Drip lines, fittings, and basic maintenance to ensure regular irrigation."
    },
    {
      id: 4,
      title: isArabic ? "ملش بلاستيك وتثبيت" : "Plastic mulch and installation",
      amount: 12000,
      details: isArabic
        ? "تغطية المصاطب بالملش لتقليل الحشائش وحماية الثمار وتحسين جودة الإنتاج."
        : "Covering beds with mulch to reduce weeds, protect fruits, and improve production quality."
    },
    {
      id: 5,
      title: isArabic ? "سماد عضوي قبل الزراعة" : "Organic manure before planting",
      amount: 13000,
      details: isArabic
        ? "كمبوست أو سماد بلدي متحلل لتحسين خصوبة التربة قبل الشتل."
        : "Compost or decomposed manure to improve soil fertility before transplanting."
    },
    {
      id: 6,
      title: isArabic ? "أسمدة ومغذيات خلال الموسم" : "Season fertilizers and nutrients",
      amount: 22000,
      details: isArabic
        ? "NPK، كالسيوم، بوتاسيوم، وأحماض أو عناصر صغرى حسب حالة النبات."
        : "NPK, calcium, potassium, acids, or micronutrients depending on plant condition."
    },
    {
      id: 7,
      title: isArabic ? "مكافحة أمراض وحشرات" : "Disease and pest control",
      amount: 14000,
      details: isArabic
        ? "مبيدات فطرية وحشرية عند الحاجة ضد الأعفان والبياض والعنكبوت الأحمر."
        : "Fungicides and insecticides when needed against rots, mildew, and red spider mites."
    },
    {
      id: 8,
      title: isArabic ? "جمع وفرز وتعبئة" : "Picking, sorting, and packing",
      amount: 12000,
      details: isArabic
        ? "عمالة جمع متكرر، فرز الثمار، وعبوات بسيطة للتسويق."
        : "Repeated picking labor, fruit sorting, and basic packaging for marketing."
    }
  ]
},

{
  id: 19,
  name: isArabic ? "البنجر" : "Beetroot",
  img: "images/beetroot.png",
  season: "Autumn",
  seasonText: isArabic ? "أغسطس - نوفمبر" : "August - November",
  modalImg: "images/beetroot.png",

  growth: isArabic ? "90 - 120 يوم" : "90 - 120 days",
  fertilizer: isArabic
    ? "سماد عضوي + فوسفور + بوتاسيوم + نيتروجين خفيف"
    : "Organic manure + phosphorus + potassium + light nitrogen",

  totalCost: 52000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 45,000 - 60,000 جنيه حسب نوع التقاوي والخدمة"
    : "Average cost per feddan: 45,000 - 60,000 EGP depending on seed type and field service",

  method: isArabic
    ? "البنجر من المحاصيل الجذرية التي تحتاج إلى تربة ناعمة ومفككة حتى تنمو الجذور بشكل منتظم بدون تشوهات. يتم تجهيز الأرض جيدًا بالحرث والتنعيم وإزالة القلاقيل، ثم زراعة البذور في سطور أو خطوط على عمق بسيط. بعد الإنبات يتم الخف لترك مسافة مناسبة بين النباتات، لأن الزحام يقلل حجم الجذور. يحتاج البنجر إلى ري منتظم بدون تغريق، وتسميد متوازن مع الاهتمام بالبوتاسيوم لتحسين جودة الجذور."
    : "Beetroot is a root crop that needs soft, loose soil so roots can grow uniformly without deformation. The land is well plowed, softened, and cleared of clods, then seeds are sown in rows at shallow depth. After germination, thinning is done to leave proper spacing between plants because overcrowding reduces root size. Beetroot needs regular irrigation without waterlogging and balanced fertilization, especially potassium, to improve root quality.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز تربة ناعمة" : "Fine soil preparation",
      text: isArabic
        ? "حرث الأرض وتنعيمها جيدًا وإزالة القلاقيل والحجارة لأن البنجر محصول جذري يتأثر بأي عوائق في التربة."
        : "Plow and soften the soil well, removing clods and stones because beetroot roots are affected by soil obstacles."
    },
    {
      title: isArabic ? "تخطيط الأرض" : "Row layout",
      text: isArabic
        ? "تقسيم الأرض إلى سطور أو خطوط منتظمة بمسافات مناسبة لتسهيل الخف والعزيق والري."
        : "Divide the land into regular rows with proper spacing to make thinning, weeding, and irrigation easier."
    },
    {
      title: isArabic ? "زراعة البذور" : "Seed sowing",
      text: isArabic
        ? "زراعة البذور على عمق 1.5–2 سم تقريبًا، مع تغطية خفيفة حتى لا يتأخر الإنبات."
        : "Sow seeds at about 1.5–2 cm depth with light covering to avoid delayed germination."
    },
    {
      title: isArabic ? "الخف بعد الإنبات" : "Thinning after germination",
      text: isArabic
        ? "بعد ظهور 3–4 أوراق يتم إزالة النباتات الزائدة وترك مسافة 10–15 سم بين النباتات لتكوين جذور جيدة."
        : "After 3–4 leaves appear, remove extra plants and leave 10–15 cm spacing for good root formation."
    },
    {
      title: isArabic ? "الري المنتظم" : "Regular irrigation",
      text: isArabic
        ? "الحفاظ على رطوبة ثابتة للتربة بدون تغريق، لأن الجفاف يسبب خشونة الجذور والتغريق يسبب أعفان."
        : "Maintain steady soil moisture without waterlogging, as drought makes roots rough and excess water causes rot."
    },
    {
      title: isArabic ? "التسميد المتوازن" : "Balanced fertilization",
      text: isArabic
        ? "استخدام فوسفور في البداية لتنشيط الجذور، ثم بوتاسيوم لتحسين الحجم والجودة، مع نيتروجين خفيف بدون زيادة."
        : "Use phosphorus early for root development, then potassium for size and quality, with light nitrogen without excess."
    },
    {
      title: isArabic ? "الحصاد والفرز" : "Harvesting and sorting",
      text: isArabic
        ? "يتم الحصاد عندما تصل الجذور للحجم المناسب، ثم تُفرز الجذور السليمة وتُزال الأوراق الزائدة قبل التسويق."
        : "Harvest when roots reach market size, then sort healthy roots and remove extra leaves before marketing."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "تقاوي البنجر" : "Beetroot seeds",
      amount: 9000,
      details: isArabic
        ? "شراء بذور جيدة بنسبة إنبات عالية، ويفضل اختيار صنف مناسب للسوق والحجم المطلوب."
        : "Buying good seeds with high germination, preferably a variety suitable for the market and desired root size."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز وتنعيم الأرض" : "Land preparation and softening",
      amount: 9500,
      details: isArabic
        ? "حرث، تنعيم، تسوية، وإزالة القلاقيل لتقليل تشوه الجذور."
        : "Plowing, softening, leveling, and removing clods to reduce root deformation."
    },
    {
      id: 3,
      title: isArabic ? "زراعة وخف وعزيق" : "Sowing, thinning, and weeding",
      amount: 6500,
      details: isArabic
        ? "عمالة زراعة البذور، ثم خف النباتات الزائدة وتنظيف الحشائش في بداية النمو."
        : "Labor for seed sowing, thinning extra plants, and early weed cleaning."
    },
    {
      id: 4,
      title: isArabic ? "سماد عضوي قبل الزراعة" : "Organic manure before planting",
      amount: 8000,
      details: isArabic
        ? "كمبوست أو سماد بلدي متحلل لتحسين بناء التربة وتهوية منطقة الجذور."
        : "Compost or decomposed manure to improve soil structure and root-zone aeration."
    },
    {
      id: 5,
      title: isArabic ? "أسمدة فوسفور وبوتاسيوم" : "Phosphorus and potassium fertilizers",
      amount: 11000,
      details: isArabic
        ? "فوسفور لتقوية الجذور، وبوتاسيوم لتحسين حجم وجودة الجذر."
        : "Phosphorus for root strength and potassium to improve root size and quality."
    },
    {
      id: 6,
      title: isArabic ? "ري ومتابعة رطوبة" : "Irrigation and moisture follow-up",
      amount: 4500,
      details: isArabic
        ? "تنظيم الري طوال الموسم لتجنب تشقق أو خشونة الجذور."
        : "Managing irrigation throughout the season to avoid root cracking or roughness."
    },
    {
      id: 7,
      title: isArabic ? "مكافحة أمراض وحشرات" : "Disease and pest control",
      amount: 5000,
      details: isArabic
        ? "مكافحة أعفان الجذور والحشرات عند ظهور الإصابة، بدون رش زائد لتقليل التكلفة."
        : "Control root rots and insects when infection appears, without excessive spraying to reduce cost."
    },
    {
      id: 8,
      title: isArabic ? "حصاد وفرز ونقل" : "Harvesting, sorting, and transport",
      amount: 6500,
      details: isArabic
        ? "عمالة تقليع الجذور، فرزها، وتنظيفها ونقلها للسوق."
        : "Labor for pulling roots, sorting, cleaning, and transporting to market."
    }
  ]
},

{
  id: 20,
  name: isArabic ? "اليوسفي" : "Tangerine",
  img: "images/tangerine.jpg",
  season: "Spring",
  seasonText: isArabic ? "فبراير - مارس" : "February - March",
  modalImg: "images/tangerine.jpg",

  growth: isArabic ? "3 - 4 سنوات لبدء الإنتاج التجاري" : "3 - 4 years to start commercial production",
  fertilizer: isArabic
    ? "سماد عضوي + فوسفور + بوتاسيوم + نيتروجين + عناصر صغرى"
    : "Organic manure + phosphorus + potassium + nitrogen + micronutrients",

  totalCost: 115000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 100,000 - 130,000 جنيه في سنة التأسيس"
    : "Average cost per feddan: 100,000 - 130,000 EGP in the establishment year",

  method: isArabic
    ? "اليوسفي من أشجار الموالح التي تحتاج إلى تخطيط جيد من البداية لأنها تبقى في الأرض لسنوات طويلة. تبدأ الزراعة باختيار شتلات مطعومة وسليمة من مشتل موثوق، ثم تجهيز الجور وإضافة السماد العضوي والسوبر فوسفات قبل الغرس. يفضل تركيب ري بالتنقيط لتوفير مياه منتظمة بدون تغريق. بعد الزراعة يتم تثبيت الشتلات وحمايتها من الرياح، ثم يتم الاهتمام بالتسميد التدريجي والتقليم الخفيف ومكافحة الحشرات مثل المن والحشرة القشرية والذبابة البيضاء."
    : "Tangerine is a citrus tree that requires careful planning because it stays in the field for many years. Cultivation starts with selecting healthy grafted seedlings from a trusted nursery, then preparing planting holes with organic manure and superphosphate before planting. Drip irrigation is preferred to provide regular water without waterlogging. After planting, seedlings are supported and protected from wind, then gradual fertilization, light pruning, and pest control are managed.",

  cultivationSteps: [
    {
      title: isArabic ? "اختيار الشتلات المطعومة" : "Selecting grafted seedlings",
      text: isArabic
        ? "شراء شتلات يوسفي مطعومة على أصل قوي وخالية من التصمغ أو الحشرات، لأن جودة الشتلة تحدد نجاح البستان لسنوات."
        : "Buy grafted tangerine seedlings on strong rootstock, free from gummosis or pests, because seedling quality affects the orchard for years."
    },
    {
      title: isArabic ? "تحديد المسافات وتخطيط البستان" : "Spacing and orchard layout",
      text: isArabic
        ? "تحديد أماكن الأشجار بمسافات مناسبة غالبًا 4×5 أو 5×5 متر حسب الصنف ونظام الخدمة لضمان تهوية وضوء جيد."
        : "Mark tree locations with suitable spacing, usually 4x5 or 5x5 meters depending on variety and management system, to ensure good light and airflow."
    },
    {
      title: isArabic ? "تجهيز الجور" : "Planting hole preparation",
      text: isArabic
        ? "حفر جور واسعة وخلط التربة الخارجة بسماد عضوي متحلل وسوبر فوسفات، ثم تركها فترة قصيرة قبل الزراعة."
        : "Dig wide holes and mix excavated soil with decomposed manure and superphosphate, then leave it for a short period before planting."
    },
    {
      title: isArabic ? "غرس الشتلات" : "Planting seedlings",
      text: isArabic
        ? "غرس الشتلة بحيث تكون منطقة التطعيم أعلى من سطح التربة، ثم الردم والضغط الخفيف حول الجذور بدون دفن التطعيم."
        : "Plant seedlings with the graft union above soil level, then backfill and gently firm the soil around roots without burying the graft."
    },
    {
      title: isArabic ? "تركيب الري بالتنقيط" : "Drip irrigation installation",
      text: isArabic
        ? "تركيب نقاطات حول كل شجرة لتوفير ري منتظم، مع زيادة عدد النقاطات تدريجيًا مع كبر حجم الشجرة."
        : "Install drip emitters around each tree for regular irrigation, increasing emitter number gradually as the tree grows."
    },
    {
      title: isArabic ? "التسميد في سنة التأسيس" : "First-year fertilization",
      text: isArabic
        ? "استخدام جرعات خفيفة مقسمة من النيتروجين والبوتاسيوم والعناصر الصغرى، وعدم المبالغة في السماد حتى لا تحترق الجذور."
        : "Use light split doses of nitrogen, potassium, and micronutrients, avoiding excessive fertilization to prevent root burn."
    },
    {
      title: isArabic ? "التقليم والحماية" : "Pruning and protection",
      text: isArabic
        ? "إزالة الأفرع الضعيفة أسفل منطقة التطعيم، وتثبيت الشتلة بدعامة، ومتابعة المن والحشرة القشرية والذبابة البيضاء."
        : "Remove weak shoots below the graft union, support the seedling with a stake, and monitor aphids, scale insects, and whiteflies."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "شتلات يوسفي مطعومة" : "Grafted tangerine seedlings",
      amount: 38000,
      details: isArabic
        ? "شراء شتلات مطعومة من مشتل موثوق، وهذا بند أساسي لأن الشتلات الضعيفة تسبب خسارة كبيرة لاحقًا."
        : "Buying grafted seedlings from a trusted nursery; this is essential because weak seedlings cause major losses later."
    },
    {
      id: 2,
      title: isArabic ? "تخطيط البستان وتجهيز الجور" : "Orchard layout and hole preparation",
      amount: 14000,
      details: isArabic
        ? "تحديد أماكن الأشجار، حفر الجور، وخلط التربة قبل الغرس."
        : "Marking tree positions, digging holes, and mixing soil before planting."
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي وسوبر فوسفات" : "Organic manure and superphosphate",
      amount: 18000,
      details: isArabic
        ? "إضافة سماد بلدي متحلل وسوبر فوسفات داخل الجور لتحسين نمو الجذور في البداية."
        : "Adding decomposed manure and superphosphate in holes to improve early root growth."
    },
    {
      id: 4,
      title: isArabic ? "شبكة ري بالتنقيط" : "Drip irrigation system",
      amount: 22000,
      details: isArabic
        ? "خراطيم، نقاطات، وصلات، ومستلزمات تشغيل لتوفير مياه منتظمة للأشجار."
        : "Drip lines, emitters, fittings, and operating supplies to provide regular water to trees."
    },
    {
      id: 5,
      title: isArabic ? "عمالة الغرس والتثبيت" : "Planting and staking labor",
      amount: 8000,
      details: isArabic
        ? "عمالة نقل الشتلات، الغرس، الردم، وتثبيت الشتلات بدعامات عند الحاجة."
        : "Labor for moving seedlings, planting, backfilling, and staking when needed."
    },
    {
      id: 6,
      title: isArabic ? "تسميد سنة التأسيس" : "First-year fertilization",
      amount: 10000,
      details: isArabic
        ? "جرعات نيتروجين وبوتاسيوم وعناصر صغرى خلال السنة الأولى بدون مبالغة."
        : "Nitrogen, potassium, and micronutrient doses during the first year without excess."
    },
    {
      id: 7,
      title: isArabic ? "مكافحة آفات الموالح" : "Citrus pest control",
      amount: 9000,
      details: isArabic
        ? "مكافحة المن والحشرة القشرية والذبابة البيضاء والأمراض الفطرية عند ظهور الإصابة."
        : "Control of aphids, scale insects, whiteflies, and fungal diseases when infection appears."
    },
    {
      id: 8,
      title: isArabic ? "متابعة وخدمة أول سنة" : "First-year maintenance",
      amount: 6000,
      details: isArabic
        ? "عزيق خفيف، إزالة حشائش، تقليم بسيط، ومتابعة نمو الشتلات."
        : "Light hoeing, weed removal, simple pruning, and seedling growth follow-up."
    }
  ]
},
{
  id: 21,
  name: isArabic ? "العنب" : "Grapes",
  img: "images/Grapes.webp",
  season: "Winter",
  seasonText: isArabic ? "ديسمبر - يناير" : "December - January",
  modalImg: "images/Grapes.webp",

  growth: isArabic ? "2 - 3 سنوات لبدء الإنتاج" : "2 - 3 years to start production",
  fertilizer: isArabic
    ? "سماد عضوي + بوتاسيوم عالي + نيتروجين متوازن + عناصر صغرى"
    : "Organic manure + high potassium + balanced nitrogen + micronutrients",

  totalCost: 135000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 120,000 - 150,000 جنيه في سنة التأسيس"
    : "Average cost per feddan: 120,000 - 150,000 EGP (establishment year)",

  method: isArabic
    ? "العنب من المحاصيل المعمرة التي تعتمد بشكل كبير على نظام التربية والدعامات. تبدأ الزراعة باختيار شتلات قوية، ثم تجهيز الأرض جيدًا وزراعة الشتلات على مسافات منتظمة. يتم إنشاء نظام تعريشة (سلك وخشب أو خرسانة) لرفع النبات وتنظيم النمو. يحتاج العنب إلى تقليم سنوي مهم جدًا لتنظيم الإنتاج، بالإضافة إلى برنامج تسميد يعتمد بشكل كبير على البوتاسيوم لتحسين جودة الثمار."
    : "Grapes are perennial crops that rely heavily on training systems and support structures. Cultivation starts with selecting strong seedlings, preparing the land, and planting at proper spacing. A trellis system (wires with wooden or concrete posts) is built to support plant growth. Grapes require essential annual pruning to regulate production, along with a fertilization program focused on potassium to improve fruit quality.",

  cultivationSteps: [
    {
      title: isArabic ? "اختيار الشتلات" : "Selecting seedlings",
      text: isArabic
        ? "اختيار شتلات عنب قوية وخالية من الأمراض من مصدر موثوق."
        : "Select strong, disease-free grape seedlings from a trusted source."
    },
    {
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      text: isArabic
        ? "حرث الأرض وتنعيمها وإضافة سماد عضوي قبل الزراعة."
        : "Plow and prepare the soil with organic manure before planting."
    },
    {
      title: isArabic ? "زراعة الشتلات" : "Planting",
      text: isArabic
        ? "زراعة الشتلات على مسافات 2×3 أو 2.5×3 متر حسب النظام."
        : "Plant seedlings at spacing of 2x3 or 2.5x3 meters depending on system."
    },
    {
      title: isArabic ? "إنشاء التعريشة" : "Trellis installation",
      text: isArabic
        ? "تركيب أعمدة وأسلاك لرفع النبات وتنظيم النمو."
        : "Install poles and wires to support and train plant growth."
    },
    {
      title: isArabic ? "التقليم السنوي" : "Annual pruning",
      text: isArabic
        ? "تقليم الأفرع القديمة لتشجيع نمو جديد وتحسين الإنتاج."
        : "Prune old branches to encourage new growth and better yield."
    },
    {
      title: isArabic ? "التسميد والري" : "Fertilization & irrigation",
      text: isArabic
        ? "تسميد متوازن مع التركيز على البوتاسيوم، وري منتظم حسب المناخ."
        : "Balanced fertilization focusing on potassium and regular irrigation."
    },
    {
      title: isArabic ? "الحصاد" : "Harvesting",
      text: isArabic
        ? "جمع العناقيد عند اكتمال النضج."
        : "Harvest grape clusters when fully ripe."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "شتلات العنب" : "Grape seedlings",
      amount: 30000,
      details: isArabic
        ? "شراء شتلات جيدة ومناسبة للصنف المطلوب."
        : "شراء شتلات عالية الجودة"
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 12000,
      details: isArabic
        ? "حرث وتسوية الأرض."
        : "Plowing and leveling"
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي" : "Organic manure",
      amount: 15000,
      details: isArabic
        ? "تحسين خصوبة التربة قبل الزراعة."
        : "Improve soil fertility"
    },
    {
      id: 4,
      title: isArabic ? "نظام التعريشة" : "Trellis system",
      amount: 40000,
      details: isArabic
        ? "أعمدة وأسلاك لتربية العنب."
        : "Poles and wires for training"
    },
    {
      id: 5,
      title: isArabic ? "أسمدة كيميائية" : "Fertilizers",
      amount: 15000,
      details: isArabic
        ? "بوتاسيوم + عناصر صغرى."
        : "Potassium and micronutrients"
    },
    {
      id: 6,
      title: isArabic ? "مكافحة" : "Pesticides",
      amount: 12000,
      details: isArabic
        ? "مكافحة البياض الدقيقي والحشرات."
        : "Control powdery mildew and pests"
    },
    {
      id: 7,
      title: isArabic ? "عمالة وصيانة" : "Labor & maintenance",
      amount: 11000,
      details: isArabic
        ? "تقليم وصيانة التعريشة."
        : "Pruning and maintenance"
    }
  ]
},

// ================== المانجو ==================
{
  id: 22,
  name: isArabic ? "المانجو" : "Mango",
  img: "images/mango.jpg",
  season: "Spring",
  seasonText: isArabic ? "فبراير - أبريل" : "February - April",
  modalImg: "images/mango.jpg",

  growth: isArabic ? "3 - 5 سنوات لبدء الإنتاج التجاري" : "3 - 5 years to start commercial production",
  fertilizer: isArabic
    ? "سماد عضوي + NPK متوازن + بوتاسيوم عالي وقت الإثمار + عناصر صغرى (حديد وزنك)"
    : "Organic manure + balanced NPK + high potassium during fruiting + micronutrients (Fe & Zn)",

  totalCost: 125000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 110,000 - 140,000 جنيه في سنة التأسيس"
    : "Average cost per feddan: 110,000 - 140,000 EGP (establishment year)",

  method: isArabic
    ? "المانجو من الأشجار المعمرة التي تحتاج تخطيط طويل المدى، وتختلف إدارتها عن باقي المحاصيل لأنها تعتمد على تكوين هيكل شجري قوي في السنوات الأولى. تبدأ الزراعة باختيار شتلات مطعومة من أصناف جيدة، ثم تجهيز الأرض وحفر الجور وإضافة السماد العضوي. يتم غرس الشتلات على مسافات واسعة لضمان التهوية وتقليل الأمراض. خلال السنوات الأولى يتم التركيز على بناء الشجرة بالتقليم الخفيف وليس الإنتاج. التسميد يكون متوازن في البداية ثم يزداد البوتاسيوم مع بداية الإثمار. كما تحتاج الأشجار إلى مكافحة دورية للأمراض مثل البياض الدقيقي والعفن."
    : "Mango is a perennial tree that requires long-term planning and differs from seasonal crops. It focuses on building a strong tree structure in early years. Cultivation starts by selecting grafted seedlings from good varieties, then preparing land and planting holes with organic manure. Trees are planted with wide spacing for good aeration. During early years, the focus is on tree formation through light pruning rather than fruiting. Fertilization is balanced initially, then potassium increases during fruiting. Trees also require regular disease control such as powdery mildew and rot.",

  cultivationSteps: [
    {
      title: isArabic ? "اختيار الشتلات المطعومة" : "Selecting grafted seedlings",
      text: isArabic
        ? "اختيار شتلات مانجو مطعومة من صنف معروف وخالية من الأمراض لضمان إنتاج مستقر."
        : "Choose grafted mango seedlings from a known variety and free from diseases."
    },
    {
      title: isArabic ? "تحديد المسافات" : "Spacing",
      text: isArabic
        ? "زراعة الأشجار على مسافات واسعة (5×5 أو 6×6 متر) لتقليل التزاحم وتحسين التهوية."
        : "Plant trees at wide spacing (5x5 or 6x6 meters) to reduce crowding and improve airflow."
    },
    {
      title: isArabic ? "تجهيز الجور" : "Hole preparation",
      text: isArabic
        ? "حفر جور عميقة وخلط التربة بالسماد العضوي قبل الزراعة."
        : "Dig deep holes and mix soil with organic manure before planting."
    },
    {
      title: isArabic ? "غرس الشتلات" : "Planting",
      text: isArabic
        ? "غرس الشتلات مع تثبيتها جيدًا وحمايتها من الرياح."
        : "Plant seedlings firmly and protect them from wind."
    },
    {
      title: isArabic ? "تكوين الشجرة" : "Tree training",
      text: isArabic
        ? "تقليم خفيف لتشكيل الشجرة في السنوات الأولى بدل التركيز على الإنتاج."
        : "Light pruning to shape the tree during early years instead of focusing on yield."
    },
    {
      title: isArabic ? "التسميد التدريجي" : "Gradual fertilization",
      text: isArabic
        ? "تسميد متوازن ثم زيادة البوتاسيوم مع بداية الإثمار."
        : "Balanced fertilization, then increasing potassium during fruiting."
    },
    {
      title: isArabic ? "المكافحة" : "Protection",
      text: isArabic
        ? "مكافحة البياض الدقيقي والعفن والحشرات حسب الحاجة."
        : "Control powdery mildew, rot, and pests when needed."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "شتلات المانجو" : "Mango seedlings",
      amount: 42000,
      details: isArabic
        ? "شراء شتلات مطعومة من صنف جيد مثل عويس أو زبدة."
        : "Buying grafted seedlings of good varieties like Owais or Zebda."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 13000,
      details: isArabic
        ? "حرث وتسوية الأرض قبل الزراعة."
        : "Plowing and leveling the land."
    },
    {
      id: 3,
      title: isArabic ? "حفر الجور" : "Digging holes",
      amount: 9000,
      details: isArabic
        ? "حفر الجور وتجهيزها للزراعة."
        : "Digging planting holes."
    },
    {
      id: 4,
      title: isArabic ? "سماد عضوي" : "Organic manure",
      amount: 16000,
      details: isArabic
        ? "تحسين التربة قبل الزراعة."
        : "Improving soil fertility."
    },
    {
      id: 5,
      title: isArabic ? "شبكة ري بالتنقيط" : "Drip irrigation",
      amount: 20000,
      details: isArabic
        ? "تركيب نظام ري مناسب للأشجار."
        : "Installing irrigation system."
    },
    {
      id: 6,
      title: isArabic ? "أسمدة كيميائية" : "Fertilizers",
      amount: 13000,
      details: isArabic
        ? "NPK + عناصر صغرى."
        : "NPK and micronutrients."
    },
    {
      id: 7,
      title: isArabic ? "مكافحة" : "Pesticides",
      amount: 7000,
      details: isArabic
        ? "مكافحة الأمراض والحشرات."
        : "Disease and pest control."
    },
    {
      id: 8,
      title: isArabic ? "عمالة وصيانة" : "Labor & maintenance",
      amount: 5000,
      details: isArabic
        ? "تقليم وخدمة الأشجار."
        : "Pruning and maintenance."
    }
  ]
},

// ================== الاناناس ==================
{
  id: 23,
  name: isArabic ? "الأناناس" : "Pineapple",
  img: "images/pinapple3.png",
  season: "Spring",
  seasonText: isArabic ? "مارس - أبريل" : "March - April",
  modalImg: "images/pinapple.jpg",

  growth: isArabic ? "18 - 24 شهر للإثمار" : "18 - 24 months for fruiting",
  fertilizer: isArabic
    ? "سماد عضوي خفيف + نيتروجين + بوتاسيوم + عناصر صغرى"
    : "Light organic manure + nitrogen + potassium + micronutrients",

  totalCost: 95000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 80,000 - 110,000 جنيه حسب مصدر الشتلات وطريقة الزراعة"
    : "Average cost per feddan: 80,000 - 110,000 EGP depending on planting material and system",

  method: isArabic
    ? "الأناناس محصول استوائي يحتاج حرارة وضوء قوي وتربة خفيفة جيدة الصرف، لذلك لا يناسب الأراضي الثقيلة أو الأماكن المعرضة للصقيع. يزرع غالبًا باستخدام التيجان أو الخلفات وليس بالبذور. قبل الزراعة يتم تجهيز الأرض جيدًا ورفع المصاطب لتحسين الصرف، ثم تترك التيجان أو الخلفات لتجف فترة قصيرة حتى لا تتعفن بعد الزراعة. يحتاج النبات إلى ري خفيف ومنتظم بدون ركود مياه، وتسميد تدريجي لأن نموه بطيء نسبيًا. أهم نقطة في زراعته هي الدفء والصرف الجيد، لأن البرودة أو زيادة المياه تسبب ضعف النمو وتعفن الجذور."
    : "Pineapple is a tropical crop that needs heat, strong sunlight, and light well-drained soil, so it is not suitable for heavy soils or frost-prone areas. It is usually planted using crowns or suckers, not seeds. Before planting, the land is prepared and raised beds are formed to improve drainage. Crowns or suckers are left to dry briefly to reduce rotting after planting. Pineapple needs light regular irrigation without standing water and gradual fertilization because growth is relatively slow. The most important factors are warmth and good drainage, as cold or excess water causes weak growth and root rot.",

  cultivationSteps: [
    {
      title: isArabic ? "اختيار التيجان أو الخلفات" : "Selecting crowns or suckers",
      text: isArabic
        ? "استخدام تيجان أناناس سليمة أو خلفات قوية وخالية من العفن، لأن جودة الجزء المزروع تؤثر مباشرة على نسبة النجاح."
        : "Use healthy pineapple crowns or strong suckers free from rot, because planting material quality directly affects success rate."
    },
    {
      title: isArabic ? "تجفيف الجزء المزروع" : "Drying planting material",
      text: isArabic
        ? "ترك التاج أو الخلفة يومين تقريبًا في مكان ظل وجيد التهوية قبل الزراعة لتقليل احتمالية التعفن."
        : "Leave crowns or suckers for about two days in a shaded, well-ventilated place before planting to reduce rotting risk."
    },
    {
      title: isArabic ? "تجهيز تربة خفيفة ومصاطب" : "Light soil and bed preparation",
      text: isArabic
        ? "تجهيز تربة رملية أو خفيفة وعمل مصاطب مرتفعة لتحسين صرف المياه حول الجذور."
        : "Prepare sandy or light soil and form raised beds to improve water drainage around the roots."
    },
    {
      title: isArabic ? "الزراعة على عمق بسيط" : "Shallow planting",
      text: isArabic
        ? "غرس قاعدة التاج أو الخلفة في التربة بعمق بسيط مع تثبيت النبات جيدًا بدون دفن القلب."
        : "Plant the base of the crown or sucker shallowly and firm it well without burying the central crown."
    },
    {
      title: isArabic ? "الري الخفيف المنتظم" : "Light regular irrigation",
      text: isArabic
        ? "الري بكميات خفيفة ومنتظمة، مع تجنب تجمع المياه تمامًا لأن جذور الأناناس حساسة للتعفن."
        : "Irrigate lightly and regularly, avoiding standing water completely because pineapple roots are sensitive to rot."
    },
    {
      title: isArabic ? "التسميد البطيء" : "Gradual fertilization",
      text: isArabic
        ? "إضافة جرعات صغيرة من النيتروجين والبوتاسيوم والعناصر الصغرى على فترات، لأن النبات نموه بطيء ولا يتحمل الزيادة المفاجئة."
        : "Apply small doses of nitrogen, potassium, and micronutrients gradually because the plant grows slowly and does not tolerate sudden excess fertilization."
    },
    {
      title: isArabic ? "الحماية من البرودة والحشائش" : "Cold and weed protection",
      text: isArabic
        ? "حماية النباتات من الصقيع والرياح الباردة، مع إزالة الحشائش لأنها تنافس النبات خلال فترة نموه الطويلة."
        : "Protect plants from frost and cold winds, and remove weeds because they compete with the plant during its long growth period."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "تيجان أو خلفات أناناس" : "Pineapple crowns or suckers",
      amount: 28000,
      details: isArabic
        ? "شراء تيجان أو خلفات سليمة بكثافة زراعة مناسبة للفدان، وهو أهم بند لأن النبات لا يزرع عادة بالبذور."
        : "Buying healthy crowns or suckers at suitable planting density per feddan; this is the key item because pineapple is usually not grown from seeds."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز التربة والمصاطب" : "Soil and raised bed preparation",
      amount: 12000,
      details: isArabic
        ? "حرث وتنعيم التربة وعمل مصاطب مرتفعة لتحسين الصرف وتقليل تعفن الجذور."
        : "Plowing, softening soil, and forming raised beds to improve drainage and reduce root rot."
    },
    {
      id: 3,
      title: isArabic ? "سماد عضوي خفيف" : "Light organic manure",
      amount: 9000,
      details: isArabic
        ? "إضافة كمبوست أو سماد متحلل بكميات معتدلة لتحسين التربة بدون زيادة رطوبة أو ملوحة."
        : "Adding compost or decomposed manure in moderate amounts to improve soil without increasing moisture or salinity."
    },
    {
      id: 4,
      title: isArabic ? "ري بالتنقيط أو ري خفيف منظم" : "Drip or controlled light irrigation",
      amount: 17000,
      details: isArabic
        ? "تجهيز خراطيم تنقيط أو نظام ري بسيط منتظم لأن الأناناس لا يتحمل التغريق."
        : "Preparing drip lines or a simple controlled irrigation system because pineapple cannot tolerate waterlogging."
    },
    {
      id: 5,
      title: isArabic ? "أسمدة نيتروجين وبوتاسيوم" : "Nitrogen and potassium fertilizers",
      amount: 12000,
      details: isArabic
        ? "جرعات صغيرة ومتكررة من النيتروجين والبوتاسيوم لدعم النمو الخضري وجودة الثمرة."
        : "Small repeated doses of nitrogen and potassium to support vegetative growth and fruit quality."
    },
    {
      id: 6,
      title: isArabic ? "عناصر صغرى ومنشطات نمو" : "Micronutrients and growth stimulants",
      amount: 6000,
      details: isArabic
        ? "رش أو إضافة عناصر صغرى عند الحاجة خاصة في الأراضي الرملية الفقيرة."
        : "Applying micronutrients when needed, especially in poor sandy soils."
    },
    {
      id: 7,
      title: isArabic ? "حماية ومكافحة أعفان" : "Protection and rot control",
      amount: 7000,
      details: isArabic
        ? "مكافحة أعفان الجذور والحشرات البسيطة عند ظهور الإصابة، مع متابعة الصرف باستمرار."
        : "Controlling root rots and minor pests when infection appears, with continuous drainage monitoring."
    },
    {
      id: 8,
      title: isArabic ? "عمالة زراعة ومتابعة طويلة" : "Planting labor and long-term follow-up",
      amount: 4000,
      details: isArabic
        ? "عمالة تجهيز التيجان والزراعة وإزالة الحشائش والمتابعة خلال فترة النمو الطويلة."
        : "Labor for preparing crowns, planting, weeding, and follow-up during the long growth period."
    }
  ]
},

// ================== الفول ==================
{
  id: 24,
  name: isArabic ? "الفول الأخضر" : "Fava Beans",
  img: "images/greenBeens1.png",
  season: "Winter",
  seasonText: isArabic ? "أكتوبر - نوفمبر" : "October - November",
  modalImg: "images/greenBeens1.png",

  growth: isArabic ? "100 - 120 يوم" : "100 - 120 days",
  fertilizer: isArabic
    ? "فوسفور + بوتاسيوم + بكتيريا العقد الجذرية"
    : "Phosphorus + potassium + nitrogen-fixing bacteria",

  totalCost: 13500,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 12,000 - 15,000 جنيه"
    : "Average cost per feddan: 12,000 - 15,000 EGP",

  method: isArabic
    ? "الفول الأخضر من المحاصيل البقولية التي تساهم في تحسين خصوبة التربة عن طريق تثبيت النيتروجين الجوي في الجذور، لذلك لا يحتاج إلى كميات كبيرة من الأسمدة النيتروجينية. يفضل زراعته في تربة طميية جيدة الصرف. يتم تجهيز الأرض جيدًا ثم زراعة البذور في جور أو سطور. يحتاج إلى ري منتظم بدون تغريق، مع الاهتمام بإضافة الفوسفور في بداية الزراعة لتحفيز تكوين الجذور. من أهم المشاكل التي تواجهه المن والتبقعات الفطرية، لذلك يجب المتابعة المستمرة."
    : "Fava beans are legume crops that improve soil fertility by fixing atmospheric nitrogen in their roots, so they do not require large amounts of nitrogen fertilizers. They prefer well-drained loamy soil. The land is prepared, then seeds are planted in hills or rows. They need regular irrigation without waterlogging, and phosphorus is important early for root development. Common issues include aphids and fungal leaf spots, requiring continuous monitoring.",

  cultivationSteps: [
    {
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      text: isArabic
        ? "حرث الأرض جيدًا وتسويتها، مع ترك قوام مناسب للتربة لسهولة إنبات البذور."
        : "Plow and level the land properly, ensuring suitable soil texture for seed germination."
    },
    {
      title: isArabic ? "زراعة البذور" : "Seed planting",
      text: isArabic
        ? "زراعة البذور في جور أو سطور بعمق 3–5 سم، مع ترك مسافات مناسبة بين النباتات."
        : "Plant seeds in hills or rows at 3–5 cm depth with proper spacing."
    },
    {
      title: isArabic ? "تلقيح البذور بالبكتيريا" : "Seed inoculation",
      text: isArabic
        ? "معاملة البذور ببكتيريا العقد الجذرية قبل الزراعة لتحسين تثبيت النيتروجين."
        : "Treat seeds with nitrogen-fixing bacteria before planting to enhance nitrogen fixation."
    },
    {
      title: isArabic ? "الري المنتظم" : "Regular irrigation",
      text: isArabic
        ? "الري كل 7–10 أيام حسب التربة، مع تجنب التغريق خاصة في بداية النمو."
        : "Irrigate every 7–10 days depending on soil, avoiding waterlogging especially early."
    },
    {
      title: isArabic ? "التسميد بالفوسفور" : "Phosphorus fertilization",
      text: isArabic
        ? "إضافة الفوسفور في بداية الزراعة لتقوية الجذور وتحسين النمو."
        : "Apply phosphorus early to strengthen roots and improve growth."
    },
    {
      title: isArabic ? "مكافحة المن والأمراض" : "Pest and disease control",
      text: isArabic
        ? "مراقبة المن والتبقعات الفطرية والرش عند ظهور الإصابة فقط."
        : "Monitor aphids and fungal spots and spray only when infection appears."
    },
    {
      title: isArabic ? "الحصاد" : "Harvesting",
      text: isArabic
        ? "جمع القرون الخضراء عند اكتمال الحجم وقبل الجفاف."
        : "Harvest green pods when fully grown before drying."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "تقاوي الفول" : "Seeds",
      amount: 4500,
      details: isArabic
        ? "شراء بذور فول بلدي أو محسنة بنسبة إنبات عالية."
        : "Buying high-germination fava bean seeds."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض" : "Land preparation",
      amount: 2500,
      details: isArabic
        ? "حرث وتسوية الأرض قبل الزراعة."
        : "Plowing and leveling the land."
    },
    {
      id: 3,
      title: isArabic ? "بكتيريا العقد الجذرية" : "Rhizobium bacteria",
      amount: 800,
      details: isArabic
        ? "معاملة البذور لتحسين تثبيت النيتروجين."
        : "Seed treatment to improve nitrogen fixation."
    },
    {
      id: 4,
      title: isArabic ? "سماد فوسفاتي" : "Phosphorus fertilizer",
      amount: 2200,
      details: isArabic
        ? "تحفيز نمو الجذور في بداية الزراعة."
        : "Enhancing root development early."
    },
    {
      id: 5,
      title: isArabic ? "ري ومياه" : "Irrigation",
      amount: 1500,
      details: isArabic
        ? "تكلفة الري طوال الموسم."
        : "Irrigation cost throughout the season."
    },
    {
      id: 6,
      title: isArabic ? "مكافحة" : "Pesticides",
      amount: 1200,
      details: isArabic
        ? "مكافحة المن والأمراض الفطرية."
        : "Control aphids and fungal diseases."
    },
    {
      id: 7,
      title: isArabic ? "عمالة" : "Labor",
      amount: 800,
      details: isArabic
        ? "زراعة وخدمة المحصول."
        : "Planting and field operations."
    }
  ]
},
// ================== الكرنب ==================
{
  id: 25,
  name: isArabic ? "الكرنب" : "Cabbage",
  img: "images/Cabbage.jpg",
  season: "Autumn",
  seasonText: isArabic ? "أغسطس - أكتوبر" : "August - October",
  modalImg: "images/Cabbage.jpg",

  growth: isArabic ? "90 - 120 يوم بعد الشتل" : "90 - 120 days after transplanting",
  fertilizer: isArabic
    ? "سماد عضوي + نيتروجين عالي + فوسفور + بوتاسيوم"
    : "Organic manure + high nitrogen + phosphorus + potassium",

  totalCost: 78000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 70,000 - 85,000 جنيه حسب نوع الشتلات والخدمة"
    : "Average cost per feddan: 70,000 - 85,000 EGP depending on seedlings and field care",

  method: isArabic
    ? "الكرنب من محاصيل الخضر الورقية الثقيلة في التغذية، ويحتاج إلى شتلات قوية وتربة جيدة التجهيز. تبدأ الزراعة غالبًا بإنتاج الشتلات في مشتل لمدة 30 إلى 40 يوم، ثم تُنقل للأرض المستديمة بعد تجهيزها بالحرث والسماد العضوي. يحتاج الكرنب إلى مسافات مناسبة حتى تتكون رؤوس كبيرة ومتماسكة، كما يحتاج إلى تسميد نيتروجيني واضح أثناء النمو الورقي، مع عدم إهمال البوتاسيوم لتحسين جودة الرأس. من أهم المشاكل التي يجب متابعتها دودة ورق الكرنب والمن والأعفان."
    : "Cabbage is a heavy-feeding leafy vegetable crop that needs strong seedlings and well-prepared soil. It usually starts in a nursery for 30 to 40 days, then seedlings are transplanted into the field after plowing and organic manure application. Cabbage requires proper spacing to form large firm heads, and it needs strong nitrogen fertilization during leaf growth while potassium improves head quality. Important issues include cabbage leaf worms, aphids, and rots.",

  cultivationSteps: [
    {
      title: isArabic ? "إنتاج الشتلات في المشتل" : "Nursery seedling production",
      text: isArabic
        ? "زراعة البذور في مشتل أو صواني شتلات لمدة 30–40 يوم حتى تصبح الشتلات قوية وصالحة للشتل."
        : "Sow seeds in a nursery or trays for 30–40 days until seedlings become strong enough for transplanting."
    },
    {
      title: isArabic ? "تجهيز الأرض المستديمة" : "Main field preparation",
      text: isArabic
        ? "حرث الأرض جيدًا وتنعيمها وإضافة سماد عضوي متحلل قبل الشتل لتحسين خصوبة التربة."
        : "Plow and soften the field well, adding decomposed organic manure before transplanting to improve fertility."
    },
    {
      title: isArabic ? "الشتل بمسافات مناسبة" : "Transplanting with proper spacing",
      text: isArabic
        ? "زراعة الشتلات على مسافة 50–70 سم بين النباتات حتى تأخذ الرأس مساحة كافية للتكوين."
        : "Transplant seedlings with 50–70 cm spacing so the head has enough space to form properly."
    },
    {
      title: isArabic ? "رية الثبات بعد الشتل" : "Settling irrigation",
      text: isArabic
        ? "ري الأرض مباشرة بعد الشتل لتثبيت الجذور وتقليل الذبول في الأيام الأولى."
        : "Irrigate immediately after transplanting to settle roots and reduce wilting during the first days."
    },
    {
      title: isArabic ? "التسميد النيتروجيني" : "Nitrogen fertilization",
      text: isArabic
        ? "إضافة النيتروجين على دفعات لدعم النمو الورقي وتكوين رأس قوية، مع عدم الزيادة المفرطة حتى لا تزيد الأمراض."
        : "Apply nitrogen in split doses to support leafy growth and head formation, without excessive use to avoid disease pressure."
    },
    {
      title: isArabic ? "مكافحة دودة ورق الكرنب" : "Cabbage worm control",
      text: isArabic
        ? "متابعة الأوراق باستمرار لمكافحة الديدان والمن والأمراض الفطرية عند بداية الإصابة."
        : "Monitor leaves regularly to control worms, aphids, and fungal diseases at the start of infection."
    },
    {
      title: isArabic ? "الحصاد عند صلابة الرأس" : "Harvesting firm heads",
      text: isArabic
        ? "يتم الحصاد عندما تصبح الرأس صلبة ومتماسكة، مع إزالة الأوراق الخارجية التالفة قبل التسويق."
        : "Harvest when heads become firm and compact, removing damaged outer leaves before marketing."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "بذور وشتلات كرنب" : "Cabbage seeds and seedlings",
      amount: 18000,
      details: isArabic
        ? "شراء بذور جيدة أو شتلات جاهزة قوية، والتكلفة تختلف حسب الصنف والهجين."
        : "Buying good seeds or strong ready seedlings; cost varies by variety and hybrid type."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز المشتل أو الصواني" : "Nursery or tray preparation",
      amount: 7000,
      details: isArabic
        ? "تربة زراعة، صواني أو مشتل، ومتابعة الشتلات قبل نقلها للأرض."
        : "Growing medium, trays or nursery preparation, and seedling care before transplanting."
    },
    {
      id: 3,
      title: isArabic ? "تجهيز الأرض والحرث" : "Land preparation and plowing",
      amount: 10000,
      details: isArabic
        ? "حرث، تنعيم، تسوية، وتخطيط الأرض للشتل."
        : "Plowing, softening, leveling, and preparing rows for transplanting."
    },
    {
      id: 4,
      title: isArabic ? "سماد عضوي قبل الشتل" : "Organic manure before transplanting",
      amount: 12000,
      details: isArabic
        ? "إضافة سماد بلدي متحلل أو كمبوست لتحسين التربة قبل زراعة الشتلات."
        : "Adding decomposed manure or compost to improve soil before transplanting."
    },
    {
      id: 5,
      title: isArabic ? "أسمدة نيتروجين وبوتاسيوم" : "Nitrogen and potassium fertilizers",
      amount: 16000,
      details: isArabic
        ? "جرعات نيتروجين لتكوين المجموع الورقي، وبوتاسيوم لتحسين صلابة الرأس."
        : "Nitrogen doses for leaf growth and potassium to improve head firmness."
    },
    {
      id: 6,
      title: isArabic ? "عمالة شتل وخدمة" : "Transplanting and field labor",
      amount: 9000,
      details: isArabic
        ? "عمالة نقل الشتلات، الشتل، العزيق، وتنظيف الحشائش."
        : "Labor for moving seedlings, transplanting, hoeing, and weed cleaning."
    },
    {
      id: 7,
      title: isArabic ? "مكافحة ديدان وأمراض" : "Pest and disease control",
      amount: 8000,
      details: isArabic
        ? "مكافحة دودة ورق الكرنب والمن والأعفان عند ظهور الإصابة."
        : "Control cabbage worms, aphids, and rots when infection appears."
    },
    {
      id: 8,
      title: isArabic ? "حصاد وتنظيف ونقل" : "Harvesting, cleaning, and transport",
      amount: 8000,
      details: isArabic
        ? "عمالة تقطيع الرؤوس، إزالة الأوراق التالفة، وفرز ونقل المحصول."
        : "Labor for cutting heads, removing damaged leaves, sorting, and transporting the crop."
    }
  ]
},
// ================== التفاح ==================
{
  id: 26,
  name: isArabic ? "التفاح" : "Apple",
  img: "images/Apple.jpg",
  season: "Winter",
  seasonText: isArabic ? "يناير - مارس" : "January - March",
  modalImg: "images/Apple.jpg",

  growth: isArabic ? "3 - 5 سنوات لبدء الإنتاج التجاري" : "3 - 5 years to start commercial production",
  fertilizer: isArabic
    ? "سماد عضوي + فوسفور + بوتاسيوم + نيتروجين متوازن + عناصر صغرى"
    : "Organic manure + phosphorus + potassium + balanced nitrogen + micronutrients",

  totalCost: 120000,
  cost: isArabic
    ? "متوسط تكلفة الفدان: 105,000 - 135,000 جنيه في سنة التأسيس"
    : "Average cost per feddan: 105,000 - 135,000 EGP in the establishment year",

  method: isArabic
    ? "التفاح من أشجار الفاكهة المعمرة التي تحتاج إلى برودة شتوية مناسبة وأرض جيدة الصرف، لذلك نجاحه يعتمد على اختيار الصنف المناسب للمنطقة. تبدأ الزراعة بشراء شتلات مطعومة سليمة، ثم تجهيز الجور وإضافة السماد العضوي والسوبر فوسفات قبل الغرس. يتم غرس الشتلات أثناء فترة السكون الشتوي، مع تثبيت الشتلة بدعامة وحماية منطقة التطعيم. في السنوات الأولى يكون التركيز على تكوين هيكل قوي للشجرة بالتقليم والتربية، وليس الحصول على محصول كبير مباشرة. يحتاج التفاح إلى برنامج تسميد متدرج ومتابعة دقيقة للمنّ والبياض الدقيقي والجرب."
    : "Apple is a perennial fruit tree that needs suitable winter chilling and well-drained soil, so success depends on choosing the right variety for the region. Cultivation starts with healthy grafted seedlings, then planting holes are prepared with organic manure and superphosphate. Seedlings are planted during winter dormancy, supported with stakes, and the graft union is protected. In the first years, the focus is on building a strong tree structure through pruning and training rather than heavy production. Apples require gradual fertilization and careful monitoring for aphids, powdery mildew, and apple scab.",

  cultivationSteps: [
    {
      title: isArabic ? "اختيار الصنف والشتلات" : "Variety and seedling selection",
      text: isArabic
        ? "اختيار صنف مناسب للمناخ المحلي وشراء شتلات مطعومة قوية وخالية من الأمراض من مشتل موثوق."
        : "Choose a variety suitable for the local climate and buy strong disease-free grafted seedlings from a trusted nursery."
    },
    {
      title: isArabic ? "تجهيز الجور قبل الزراعة" : "Preparing planting holes",
      text: isArabic
        ? "حفر جور واسعة قبل الزراعة وخلط ناتج الحفر بسماد عضوي متحلل وسوبر فوسفات لتحسين بداية نمو الجذور."
        : "Dig wide holes before planting and mix excavated soil with decomposed manure and superphosphate to support early root growth."
    },
    {
      title: isArabic ? "الغرس في فترة السكون" : "Planting during dormancy",
      text: isArabic
        ? "زراعة الشتلات في الشتاء قبل خروج البراعم، مع جعل منطقة التطعيم أعلى من سطح التربة وعدم دفنها."
        : "Plant seedlings in winter before bud break, keeping the graft union above soil level and not burying it."
    },
    {
      title: isArabic ? "تثبيت الشتلات والري الأول" : "Staking and first irrigation",
      text: isArabic
        ? "تثبيت الشتلات بدعامات لحمايتها من الرياح، ثم ريها مباشرة بعد الغرس لإخراج الفراغات الهوائية حول الجذور."
        : "Stake seedlings to protect them from wind, then irrigate immediately after planting to remove air pockets around roots."
    },
    {
      title: isArabic ? "تكوين هيكل الشجرة" : "Tree training",
      text: isArabic
        ? "إجراء تقليم تربية في السنوات الأولى لاختيار أفرع رئيسية قوية تسمح بدخول الضوء والهواء داخل الشجرة."
        : "Apply training pruning in early years to select strong main branches that allow light and air into the canopy."
    },
    {
      title: isArabic ? "التسميد المتدرج" : "Gradual fertilization",
      text: isArabic
        ? "إضافة نيتروجين بكميات محدودة في بداية النمو، مع فوسفور وبوتاسيوم وعناصر صغرى حسب حالة الشجرة والتربة."
        : "Apply limited nitrogen early, along with phosphorus, potassium, and micronutrients according to tree and soil condition."
    },
    {
      title: isArabic ? "المكافحة والمتابعة" : "Protection and monitoring",
      text: isArabic
        ? "متابعة المنّ والجرب والبياض الدقيقي والأعفان، والرش عند بداية الإصابة لتجنب انتشار المرض."
        : "Monitor aphids, apple scab, powdery mildew, and rots, spraying at the beginning of infection to prevent spread."
    }
  ],

  costSteps: [
    {
      id: 1,
      title: isArabic ? "شتلات تفاح مطعومة" : "Grafted apple seedlings",
      amount: 42000,
      details: isArabic
        ? "شراء شتلات مطعومة من صنف مناسب للمنطقة، ويفضل أن تكون من مشتل معتمد لتقليل الفاقد."
        : "Buying grafted seedlings of a variety suitable for the region, preferably from a certified nursery to reduce losses."
    },
    {
      id: 2,
      title: isArabic ? "تجهيز الأرض وتحديد المسافات" : "Land preparation and spacing",
      amount: 12000,
      details: isArabic
        ? "حرث وتسوية الأرض وتحديد أماكن الأشجار بمسافات مناسبة حسب الصنف ونظام التربية."
        : "Plowing, leveling, and marking tree positions with proper spacing according to variety and training system."
    },
    {
      id: 3,
      title: isArabic ? "حفر الجور وتجهيزها" : "Hole digging and preparation",
      amount: 9000,
      details: isArabic
        ? "حفر الجور وخلط التربة بالسماد العضوي والسوبر فوسفات قبل الغرس."
        : "Digging holes and mixing soil with organic manure and superphosphate before planting."
    },
    {
      id: 4,
      title: isArabic ? "سماد عضوي وسوبر فوسفات" : "Organic manure and superphosphate",
      amount: 16000,
      details: isArabic
        ? "إضافة كمبوست أو سماد بلدي متحلل مع سوبر فوسفات لتحسين نمو الجذور في البداية."
        : "Adding compost or decomposed manure with superphosphate to improve early root growth."
    },
    {
      id: 5,
      title: isArabic ? "شبكة ري بالتنقيط" : "Drip irrigation system",
      amount: 20000,
      details: isArabic
        ? "تركيب خراطيم ونقاطات ووصلات لتوفير ري منتظم وتقليل مشاكل زيادة المياه حول الجذور."
        : "Installing drip lines, emitters, and fittings to provide regular irrigation and reduce excess water around roots."
    },
    {
      id: 6,
      title: isArabic ? "دعامات وحماية الشتلات" : "Stakes and seedling protection",
      amount: 6000,
      details: isArabic
        ? "تثبيت الشتلات بدعامات وحماية منطقة التطعيم من الكسر أو الرياح القوية."
        : "Supporting seedlings with stakes and protecting the graft area from breakage or strong winds."
    },
    {
      id: 7,
      title: isArabic ? "تسميد ومغذيات أول سنة" : "First-year fertilizers and nutrients",
      amount: 9000,
      details: isArabic
        ? "جرعات نيتروجين خفيفة، بوتاسيوم، فوسفور، وعناصر صغرى حسب احتياج الشتلات."
        : "Light nitrogen doses, potassium, phosphorus, and micronutrients according to seedling needs."
    },
    {
      id: 8,
      title: isArabic ? "مكافحة وتقليم وصيانة" : "Pest control, pruning, and maintenance",
      amount: 6000,
      details: isArabic
        ? "مكافحة المنّ والجرب والبياض الدقيقي، مع تقليم تربية ومتابعة نمو الشتلات."
        : "Control aphids, scab, and powdery mildew, with training pruning and seedling follow-up."
    }
  ]
},

    
  ]), [isArabic]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [checkedCosts, setCheckedCosts] = useState({});

  const seasons = [
    { key: 'all', label: isArabic ? 'كل الفصول' : 'All Seasons', icon: 'far fa-calendar', subText: null },
    { key: 'Spring', label: isArabic ? 'الربيع' : 'Spring', icon: 'fas fa-cloud', subText: isArabic ? 'مارس - مايو' : 'March - May' },
    { key: 'Summer', label: isArabic ? 'الصيف' : 'Summer', icon: 'fas fa-sun', subText: isArabic ? 'يونيو - أغسطس' : 'June - August' },
    { key: 'Autumn', label: isArabic ? 'الخريف' : 'Autumn', icon: 'fas fa-cloud-rain', subText: isArabic ? 'سبتمبر - نوفمبر' : 'September - November' },
    { key: 'Winter', label: isArabic ? 'الشتاء' : 'Winter', icon: 'far fa-snowflake', subText: isArabic ? 'ديسمبر - فبراير' : 'December - February' }
  ];

  const monthMap = useMemo(() => ({
    // Arabic
    "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "ابريل": 4, "مايو": 5, "يونيو": 6,
    "يوليو": 7, "أغسطس": 8, "اغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "اكتوبر": 10,
    "نوفمبر": 11, "ديسمبر": 12,
    // English
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12,
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
    const regex = new RegExp(`(${monthNames}).*?(${monthNames})`, 'i');
    const match = cleaned.match(regex);
    if (!match) return [];
    const startMonth = monthMap[match[1]];
    const endMonth = monthMap[match[2]];
    if (!startMonth || !endMonth) return [];
    const months = getMonthsInRange(startMonth, endMonth);
    return [...new Set(months.map(getSeasonFromMonth))];
  }, [getMonthsInRange, getSeasonFromMonth, monthMap]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPlants(plants);
    } else {
      setFilteredPlants(plants.filter((item) => extractSeasonsFromText(item.seasonText).includes(activeFilter)));
    }
  }, [activeFilter, plants, extractSeasonsFromText]);

  const handleFilterClick = (filterKey) => setActiveFilter(filterKey);

  const handleCardClick = (plant) => {
    setSelectedPlant(plant);
    setCheckedCosts({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlant(null);
    setCheckedCosts({});
  };

  const toggleCostItem = (itemId) => {
    setCheckedCosts(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const spentAmount = useMemo(() => {
    if (!selectedPlant) return 0;
    return selectedPlant.costSteps.reduce((sum, item) => checkedCosts[item.id] ? sum + item.amount : sum, 0);
  }, [selectedPlant, checkedCosts]);

  const progressPercent = selectedPlant?.totalCost ? Math.min((spentAmount / selectedPlant.totalCost) * 100, 100) : 0;

  return (
    <>
      <section className="container py-5 text-center crops-page-premium">
        <h3 className="title-txt text-center text-success mb-4">
          {isArabic ? 'النباتات والفصول الزراعية' : 'Plants and Agricultural Seasons'}
        </h3>
        <h5 className="title-txt text-center text-success mb-5">
          {isArabic ? 'اكتشف أفضل النباتات لكل فصل مع خطوات الزراعة والتكلفة التقديرية' : 'Discover the best plants for each season with cultivation steps and estimated cost'}
        </h5>

        <div className="btnAll d-flex flex-wrap justify-content-center gap-3 mb-5">
          {seasons.map(season => (
            <button key={season.key} className={`btnSeason btn btn-light text-success px-5 py-3 text-center fs-5 ${activeFilter === season.key ? 'active' : ''}`} onClick={() => handleFilterClick(season.key)}>
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
                <img
                  src={plant.img}
                  className="card-img-top h-50"
                  alt={plant.name}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
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
            <div className="modal-dialog modal-dialog-centered modal-xl premium-crop-dialog">
              <div className="modal-content premium-crop-modal">
                <div className="premium-modal-hero">
                  <button type="button" className="premium-close-btn" onClick={handleCloseModal} aria-label="Close">
                    <i className="fas fa-times"></i>
                  </button>
                  <img
                    src={selectedPlant.modalImg}
                    alt={selectedPlant.name}
                    className="premium-hero-img"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="premium-hero-overlay">
                    <span className="premium-season-pill"><i className="far fa-calendar ms-2"></i>{selectedPlant.seasonText}</span>
                    <h2>{selectedPlant.name}</h2>
                    <p>{selectedPlant.cost}</p>
                  </div>
                </div>

                <div className="modal-body premium-modal-body text-end">
                  <div className="premium-summary-grid">
                    <div className="premium-summary-card">
                      <i className="far fa-clock"></i>
                      <span>{isArabic ? 'مدة النمو' : 'Growth Duration'}</span>
                      <strong>{selectedPlant.growth}</strong>
                    </div>
                    <div className="premium-summary-card">
                      <i className="fas fa-leaf"></i>
                      <span>{isArabic ? 'السماد الموصى به' : 'Recommended Fertilizer'}</span>
                      <strong>{selectedPlant.fertilizer}</strong>
                    </div>
                    <div className="premium-summary-card">
                      <i className="fas fa-wallet"></i>
                      <span>{isArabic ? 'إجمالي تقديري للفدان' : 'Estimated total per feddan'}</span>
                      <strong>{formatMoney(selectedPlant.totalCost)}</strong>
                    </div>
                  </div>

                  <div className="premium-info-box">
                    <div className="section-title-row">
                      <i className="fas fa-seedling"></i>
                      <h4>{isArabic ? 'شرح مختصر لطريقة الزراعة' : 'Cultivation Overview'}</h4>
                    </div>
                    <p>{selectedPlant.method}</p>
                  </div>

                  <div className="premium-details-layout">
                    <div className="premium-steps-panel">
                      <div className="section-title-row mb-3">
                        <i className="fas fa-list-check"></i>
                        <h4>{isArabic ? 'خطوات الزراعة بالتفصيل' : 'Detailed Cultivation Steps'}</h4>
                      </div>
                      <div className="cultivation-timeline">
                        {selectedPlant.cultivationSteps.map((step, index) => (
                          <div className="timeline-step" key={index}>
                            <div className="timeline-number">{index + 1}</div>
                            <div className="timeline-content">
                              <h5>{step.title}</h5>
                              <p>{step.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="premium-cost-panel">
                      <div className="spent-card">
                        <span>{isArabic ? 'أنت صرفت حتى الآن' : 'You have spent so far'}</span>
                        <strong>{formatMoney(spentAmount)}</strong>
                        <small>{isArabic ? `من إجمالي ${formatMoney(selectedPlant.totalCost)}` : `of total ${formatMoney(selectedPlant.totalCost)}`}</small>
                        <div className="spent-progress"><div style={{ width: `${progressPercent}%` }}></div></div>
                      </div>

                      <div className="section-title-row mb-3">
                        <i className="fas fa-receipt"></i>
                        <h4>{isArabic ? 'بنود الدفع الفعلية' : 'Actual Payment Items'}</h4>
                      </div>

                      <div className="cost-check-list">
                        {selectedPlant.costSteps.map((item) => (
                          <label className={`cost-check-card ${checkedCosts[item.id] ? 'checked' : ''}`} key={item.id}>
                            <input type="checkbox" checked={!!checkedCosts[item.id]} onChange={() => toggleCostItem(item.id)} />
                            <span className="custom-check"><i className="fas fa-check"></i></span>
                            <span className="cost-main">
                              <strong>{item.title}</strong>
                              <small>{item.details}</small>
                            </span>
                            <span className="cost-price">{formatMoney(item.amount)}</span>
                          </label>
                        ))}
                      </div>

                      <div className="cost-note">
                        <i className="fas fa-circle-info"></i>
                        <span>{isArabic ? 'الري موجود في خطوات الزراعة لأنه خدمة أساسية، لكنه غير محسوب كبند دفع مستقل هنا.' : 'Irrigation is included in cultivation steps as a required operation, but it is not counted as a separate payment item here.'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {showModal && <div className="modal-backdrop fade show premium-backdrop" onClick={handleCloseModal}></div>}
    </>
  );
};

export default CropsPage;
