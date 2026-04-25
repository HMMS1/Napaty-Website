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
      img: "/images/cucumber.jpg",
      season: "Spring",
      seasonText: isArabic ? "فبراير - أكتوبر" : "February - October",
      modalImg: "/images/cucumber.jpg",
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
      ]
    }
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
    "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "ابريل": 4, "مايو": 5, "يونيو": 6,
    "يوليو": 7, "أغسطس": 8, "اغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "اكتوبر": 10,
    "نوفمبر": 11, "ديسمبر": 12,
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
            <div className="modal-dialog modal-dialog-centered modal-xl premium-crop-dialog">
              <div className="modal-content premium-crop-modal">
                <div className="premium-modal-hero">
                  <button type="button" className="premium-close-btn" onClick={handleCloseModal} aria-label="Close">
                    <i className="fas fa-times"></i>
                  </button>
                  <img src={selectedPlant.modalImg} alt={selectedPlant.name} className="premium-hero-img" />
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
