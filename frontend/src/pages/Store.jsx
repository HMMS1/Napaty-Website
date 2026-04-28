import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/Store.css';

const ShoppingPage = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  // بيانات المنتجات
  const productsData = useMemo(() => ([
   
{
      id: 1,
      name: isArabic ? "سماد عضوي طبيعي" : "Natural Organic Fertilizer",
      img: "images/Organic.jpg",
      type: "fert",
      price: 150,
      description: isArabic
        ? "سماد عضوي غني بالمواد الغذائية مناسب لجميع النباتات."
        : "Organic fertilizer rich in nutrients suitable for all plants.",
      details: isArabic
        ? "يحسّن بنية التربة – يزيد الاحتفاظ بالماء – آمن تماماً للنباتات المنزلية والمحاصيل."
        : "Improves soil structure – increases water retention – completely safe for houseplants and crops."
    },
    {
      id: 2,
      name: isArabic ? "مبيد حشري قوي" : "Powerful Insecticide",
      img: "images/Herbicide.webp",
      type: "pest",
      price: 90,
      description: isArabic
        ? "مبيد فعال للقضاء على الحشرات الضارة."
        : "Effective pesticide to eliminate harmful insects.",
      details: isArabic
        ? "يعمل ضد الذبابة البيضاء – المن – الحشرات القشرية دون الإضرار بالأوراق."
        : "Works against whitefly, aphids, and scale insects without harming leaves."
    },
    {
      id: 3,
      name: isArabic ? "أداة حرث زراعية" : "Agricultural Tilling Tool",
      img: "images/Tractor.jpg",
      type: "tools",
      price: 350,
      description: isArabic
        ? "أداة قوية للحرث وتجهيز الأرض."
        : "A powerful tool for tilling and land preparation.",
      details: isArabic
        ? "مصنوعة من الحديد المقوى – مناسبة للأراضي الصلبة – سهلة الاستخدام."
        : "Made of reinforced iron – suitable for hard soil – easy to use."
    },
    {
      id: 4,
      name: isArabic ? "مبيد حشائش فعال" : "Effective Herbicide",
      img: "images/Fungicide.jpg",
      type: "pest",
      price: 95,
      description: isArabic
        ? "مبيد متخصص لإزالة الحشائش من التربة."
        : "Specialized herbicide for removing weeds from soil.",
      details: isArabic
        ? "يقضي على الحشائش الجذرية – يستمر تأثيره لمدة 45 يوم."
        : "Eliminates root weeds – remains effective for 45 days."
    },
    {
      id: 5,
      name: isArabic ? "بذور طماطم عالية الجودة" : "High-Quality Tomato Seeds",
      img: "images/Tomato.jpg",
      type: "seeds",
      price: 45,
      description: isArabic
        ? "بذور طماطم مميزة تعطي إنتاجًا وفيرًا."
        : "Premium tomato seeds that provide abundant yield.",
      details: isArabic
        ? "إنبات سريع – إنتاج قوي – مقاومة للأمراض الشائعة."
        : "Fast germination – strong productivity – resistant to common diseases."
    },
    {
      id: 6,
      name: isArabic ? "أداة زراعة متعددة الاستخدام" : "Multi-Purpose Farming Tool",
      img: "images/Axe.jpg",
      type: "tools",
      price: 120,
      description: isArabic
        ? "أداة زراعية عالية الجودة."
        : "High-quality farming tool.",
      details: isArabic
        ? "تستخدم للحفر – خلط التربة – تنظيف سطح الأرض."
        : "Used for digging – mixing soil – cleaning the soil surface."
    },
    {
      id: 7,
      name: isArabic ? "شتلات رمان" : "Pomegranate Seedlings",
      img: "images/Pomegranate.jpg",
      type: "seeds",
      price: 70,
      description: isArabic
        ? "شتلات رمان مناسبة للحدائق والمزارع."
        : "Pomegranate seedlings suitable for gardens and farms.",
      details: isArabic
        ? "عمر 6 أشهر – مقاومة للجفاف نسبياً – إنتاج بعد 2–3 سنوات."
        : "6 months old – relatively drought resistant – productive after 2–3 years."
    },
    {
      id: 8,
      name: isArabic ? "بذور قمح ممتازة" : "Premium Wheat Seeds",
      img: "images/Wheat.jpg",
      type: "seeds",
      price: 80,
      description: isArabic
        ? "بذور قمح نقية عالية الإنتاج."
        : "Pure wheat seeds with high productivity.",
      details: isArabic
        ? "معدل إنبات عالي – مقاومة للأمراض – إنتاج وفير."
        : "High germination rate – disease resistant – abundant yield."
    },
    {
      id: 9,
      name: isArabic ? "مجرفة يد صغيرة" : "Small Hand Shovel",
      img: "images/plantTool.jpeg",
      type: "tools",
      price: 65,
      description: isArabic
        ? "مجرفة خفيفة لخلط التربة."
        : "Light shovel for mixing soil.",
      details: isArabic
        ? "مناسبة للأحواض – قوية – مقبض مريح."
        : "Suitable for beds – durable – comfortable handle."
    },
    {
      id: 10,
      name: isArabic ? "رشاش ري زراعي" : "Agricultural Sprinkler",
      img: "images/sprinkler.jpg",
      type: "water",
      price: 600,
      description: isArabic
        ? "رشاش يوزع المياه بالتساوي."
        : "Sprinkler that distributes water evenly.",
      details: isArabic
        ? "مناسب للمزارع – تغطية كبيرة – يتحمل الضغط العالي."
        : "Suitable for farms – wide coverage – handles high pressure."
    },
    {
      id: 11,
      name: isArabic ? "مبيد نيماتودا قوي" : "Powerful Nematode Pesticide",
      img: "images/Nematode pesticide.jpg",
      type: "pest",
      price: 120,
      description: isArabic
        ? "مبيد متخصص للقضاء على النيماتودا."
        : "Specialized pesticide to eliminate nematodes.",
      details: isArabic
        ? "يحمي الجذور – يحسن النمو – مناسب للخضروات والأشجار."
        : "Protects roots – improves growth – suitable for vegetables and trees."
    },
    {
      id: 12,
      name: isArabic ? "سماد فوسفات عالي الجودة" : "High-Quality Phosphate Fertilizer",
      img: "images/Phosphate (2).jpg",
      type: "fert",
      price: 160,
      description: isArabic
        ? "يقوي الجذور ويزيد الإزهار."
        : "Strengthens roots and increases flowering.",
      details: isArabic
        ? "يساعد على امتصاص العناصر – مناسب لجميع المحاصيل."
        : "Helps absorb nutrients – suitable for all crops."
    },

{ 
  id: 13, 
  name: isArabic ? "سماد NPK مركب 20-20-20" : "NPK Compound Fertilizer 20-20-20", 
  img: "images/NPKFertilizer.jpg", 
  type: "fert", 
  price: 180, 
  description: isArabic ? "سماد متوازن لتعزيز نمو النبات." : "Balanced fertilizer to boost plant growth.", 
  details: isArabic ? "مناسب لجميع المحاصيل؛ يحتوي على نسب متساوية من N,P,K." : "Suitable for all crops; equal N,P,K formulation." 
},
{ 
  id: 14, 
  name: isArabic ? " سماد كالسيوم بورون 1 لتر" : "Calcium Boron Fertilizer 1L", 
  img: "images/calsuam.webp", 
  type: "fert", 
  price: 225, 
  description: isArabic ? "يدعم صلابة الثمار ويمنع العيوب." : "Supports fruit firmness and prevents disorders.", 
  details: isArabic ? "مصمم لتعويض الكالسيوم والبورون في التربة والنبات." : "Formulated to replenish calcium and boron in soil and plants." 
},
{ 
  id: 15, 
  name: isArabic ? "وصلة حرف T - 50/50/50" : "T Connector - 50/50/50", 
  img: "images/T-TOOL.jpg", 
  type: "tools", 
  price: 150, 
  description: isArabic ? "وصلة تي للري والتوصيلات." : "T connector for irrigation and piping.", 
  details: isArabic ? "مصنوعة من مواد متينة للاستخدام الخارجي والداخلي." : "Made from durable materials for indoor and outdoor use." 
},
{ 
  id: 16, 
  name: isArabic ? "ماكينة تقطيع الخشب" : "Wood Cutting Machine", 
  img: "images/Wood cutting machine.jpg", 
  type: "tools", 
  price: 741000, 
  description: isArabic ? "ماكينة قوية لتقطيع الأخشاب." : "Powerful machine for wood cutting.", 
  details: isArabic ? "مناسبة للأعمال الصناعية والورش الكبيرة؛ قدرة عالية ودقة." : "Suitable for industrial workshops; high power and precision." 
},
{ 
  id: 17, 
  name: isArabic ? "ببلر عادى بالمسمار CRB" : "Standard Bubbler with Screw CRB", 
  img: "images/buubler.jpg", 
  type: "tools", 
  price: 35, 
  description: isArabic ? "ببلر للري بالتنقيط مع مسمار تثبيت." : "Bubbler for drip irrigation with fixing screw.", 
  details: isArabic ? "سهل التركيب ومناسب للحدائق الصغيرة والبيوت المحمية." : "Easy to install; ideal for small gardens and greenhouses." 
},
{ 
  id: 18, 
  name: isArabic ? "وصلة خلخلة 16 / 16" : "16/16 Flushing Connector", 
  img: "images/Anklet Link.jpg", 
  type: "tools", 
  price: 50, 
  description: isArabic ? "وصلة صغيرة للأنابيب 16 مم." : "Small connector for 16 mm pipes.", 
  details: isArabic ? "تستخدم لتنظيف أو تفريغ خطوط الري بسهولة." : "Used for flushing or draining irrigation lines easily." 
},
{ 
  id: 19, 
  name: isArabic ? "كوع دوار نحاس-1 أكوا" : "Rotary Brass Elbow - 1 Aqua", 
  img: "images/Copper elbow.jpg", 
  type: "tools", 
  price: 5500, 
  description: isArabic ? "كوع نحاس دوار لتوصيلات المياه." : "Rotary brass elbow for water fittings.", 
  details: isArabic ? "مقاوم للتآكل ومناسب للأنظمة ذات الضغط العالي." : "Corrosion-resistant; suitable for high-pressure systems." 
},
{ 
  id: 20, 
  name: isArabic ? "طحالب" : "Algae", 
  img: "images/Fertilizer algae.jpg", 
  type: "fert", 
  price: 95, 
  description: isArabic ? "سماد عضوي من الطحالب البحرية." : "Organic fertilizer from seaweed.", 
  details: isArabic ? "يعزز صحة التربة ويزيد مقاومة النباتات للإجهاد." : "Improves soil health and increases plant stress resistance." 
},
{ 
  id: 21, 
  name: isArabic ? "قطعة وصلة اتصال للخرطيم الفلات (كيس 100 قطعة)" : "Flat Hose Connector Piece (Pack of 100)", 
  img: "images/Hose connector piece.jpg", 
  type: "tools", 
  price: 200, 
  description: isArabic ? "قطع توصيل للخرطوم الفلات بكيس 100." : "Flat hose connectors, pack of 100.", 
  details: isArabic ? "مناسبة للتركيبات السريعة في أنظمة الري." : "Suitable for quick fittings in irrigation systems." 
},
{ 
  id: 22, 
  name: isArabic ? "قناع النحال" : "Beekeeper Mask", 
  img: "images/Beekeeper's mask.jpg", 
  type: "tools", 
  price: 350, 
  description: isArabic ? "قناع حماية للنحالين." : "Protective mask for beekeepers.", 
  details: isArabic ? "شبك جيد التهوية مع غطاء واقٍ للوجه." : "Well-ventilated mesh with full face protection." 
},
{ 
  id: 23, 
  name: isArabic ? "شجرة نبق" : "Jujube Tree", 
  img: "images/Jujube Tree .jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "شجرة نبق جاهزة للزراعة." : "Jujube tree ready for planting.", 
  details: isArabic ? "مناسبة للزراعة في الحدائق والمزارع الصغيرة." : "Suitable for gardens and small farms." 
},
{ 
  id: 24, 
  name: isArabic ? "بذور جزر" : "Carrot Seeds", 
  img: "images/CarrotSeed.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "بذور جزر عالية الإنبات." : "High-germination carrot seeds.", 
  details: isArabic ? "تعطي محصولاً متجانساً ومقاوماً للأمراض الشائعة." : "Produces uniform crop; resistant to common diseases." 
},
{ 
  id: 25, 
  name: isArabic ? "بذور ريحان" : "Basil Seeds", 
  img: "images/Basilseed.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "بذور ريحان عطرية." : "Aromatic basil seeds.", 
  details: isArabic ? "مناسبة للزراعة في الأوعية والحدائق المنزلية." : "Suitable for pots and home gardens." 
},
{ 
  id: 26, 
  name: isArabic ? "بذور كوسة" : "Zucchini Seeds", 
  img: "images/Zucchini.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "بذور كوسة منتجة وسهلة العناية." : "Productive and easy-care zucchini seeds.", 
  details: isArabic ? "تعطي ثماراً كبيرة ومستمرة عبر الموسم." : "Yields large fruits continuously through the season." 
},
{ 
  id: 27, 
  name: isArabic ? "شجرة التوت الأحمر" : "Red Mulberry Tree", 
  img: "images/Red mulberry tree.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "شجرة توت أحمر مثمرة." : "Fruitful red mulberry tree.", 
  details: isArabic ? "مناسبة للزراعة في المناخ المحلي وتتحمل الجفاف الجزئي." : "Adapted to local climate; tolerates partial drought." 
},
{ 
  id: 28, 
  name: isArabic ? "بذور فراولة" : "Strawberry Seeds", 
  img: "images/StrawberrySeed.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "بذور فراولة عالية الجودة." : "High-quality strawberry seeds.", 
  details: isArabic ? "تعطي نباتات منتجة وثمار ذات طعم ممتاز." : "Produces productive plants and flavorful berries." 
},
{ 
  id: 29, 
  name: isArabic ? "بذور كزبرة" : "Coriander Seeds", 
  img: "images/CorianderSeed.jpg", 
  type: "seeds", 
  price: 350, 
  description: isArabic ? "بذور كزبرة طازجة." : "Fresh coriander seeds.", 
  details: isArabic ? "مناسبة للزراعة الموسمية وتستخدم للأوراق والبذور." : "Good for seasonal planting; used for leaves and seeds." 
},
{ 
  id: 30, 
  name: isArabic ? "مبيد حشري داستر - 500 ملليلتر" : "Duster Insecticide - 500 ml", 
  img: "images/Duster Insecticide.jpg", 
  type: "pest", 
  price: 325, 
  description: isArabic ? "مبيد حشري للاستخدام العام." : "General-purpose insecticide.", 
  details: isArabic ? "فعّال ضد مجموعة واسعة من الحشرات؛ اتبع تعليمات الاستخدام." : "Effective against many insects; follow usage instructions." 
},
{ 
  id: 31, 
  name: isArabic ? "مبيد حشري شالنجر سوبر 24% مركز معلق - 0.5 لتر" : "Challenger Super Insecticide 24% SC - 0.5 L", 
  img: "images/Challenger Insecticide.jpg", 
  type: "pest", 
  price: 450, 
  description: isArabic ? "مبيد مركز لمعالجة الحشرات." : "Concentrated insecticide for pest control.", 
  details: isArabic ? "مركز معلق 24%؛ يستخدم بتركيزات محددة حسب المحصول." : "24% suspension concentrate; use specified rates per crop." 
},
{ 
  id: 32, 
  name: isArabic ? "مبيد حشرى بيرمكتين - 500 مل" : "Permectin Insecticide - 500 ml", 
  img: "images/Permectin pesticide.jpg", 
  type: "pest", 
  price: 300, 
  description: isArabic ? "مبيد حشري فعال سريع المفعول." : "Fast-acting insecticide.", 
  details: isArabic ? "مناسب لمكافحة الحشرات القارضة والزاحفة؛ اتبع إرشادات السلامة." : "Good for chewing and crawling pests; follow safety guidelines." 
},
{ 
  id: 33, 
  name: isArabic ? "مبيد فطرى ميستيك برو - 250 مل" : "Mystic Pro Fungicide - 250 ml", 
  img: "images/Mystic fungicide.jpg", 
  type: "pest", 
  price: 550, 
  description: isArabic ? "مبيد فطري لحماية المحاصيل." : "Fungicide to protect crops.", 
  details: isArabic ? "يقي من الأمراض الفطرية الشائعة عند تطبيقه بانتظام." : "Protects against common fungal diseases when applied regularly." 
},
{ 
  id: 34, 
  name: isArabic ? "مبيد فطري كوليز 30% مركز معلق - 0.25 لتر" : "Colise Fungicide 30% SC - 0.25 L", 
  img: "images/Fungicide Coliz.jpg", 
  type: "pest", 
  price: 350, 
  description: isArabic ? "مبيد فطري مركز عالي الفعالية." : "High-efficiency concentrated fungicide.", 
  details: isArabic ? "مركز معلق 30%؛ يستخدم للوقاية والعلاج حسب التعليمات." : "30% SC; used for prevention and treatment per label." 
},
{ 
  id: 35, 
  name: isArabic ? "مبيد فطري البركة - 500 جرام" : "Al-Birka Fungicide - 500 g", 
  img: "images/Al-Barakah Fungicide.jpg", 
  type: "pest", 
  price: 350, 
  description: isArabic ? "مبيد فطري مسحوق للرش." : "Powder fungicide for spraying.", 
  details: isArabic ? "يستخدم لمعالجة الأمراض الفطرية في الحقول والبساتين." : "Used to treat fungal diseases in fields and orchards." 
},
{ 
  id: 37, 
  name: isArabic ? "سماد يوريا 5 ك" : "Urea Fertilizer 5 kg", 
  img: "images/Urea fertilizer .jpg", 
  type: "fert", 
  price: 300, 
  description: isArabic ? "سماد نيتروجيني عالي التركيز." : "High-nitrogen fertilizer.", 
  details: isArabic ? "مثالي لتعزيز النمو الخضري وزيادة محتوى النيتروجين في التربة." : "Ideal for promoting vegetative growth and boosting soil nitrogen." 
},
{ 
  id: 38, 
  name: isArabic ? "اسمدة مالتي فيد" : "Multi Feed Fertilizers", 
  img: "images/maltiFertilizer.png", 
  type: "fert", 
  price: 250, 
  description: isArabic ? "مزيج أسمدة متعدد العناصر." : "Multi-nutrient fertilizer blend.", 
  details: isArabic ? "يوفر عناصر دقيقة ومغذيات أساسية لتحسين صحة النبات." : "Provides micronutrients and essential nutrients to improve plant health." 
},
{ 
  id: 39, 
  name: isArabic ? "سيتوكينين - 5 جرام" : "Cytokinin - 5 g", 
  img: "images/Cytokinin Fertilizer.jpg", 
  type: "fert", 
  price: 200, 
  description: isArabic ? "هرمون نباتي لتحفيز النمو." : "Plant hormone to stimulate growth.", 
  details: isArabic ? "يستخدم بجرعات صغيرة لتحسين التفرع والإزهار." : "Used in small doses to enhance branching and flowering." 
},
{ 
  id: 40, 
  name: isArabic ? "سماد نيترو ماكس - 0.5 لتر" : "Nitro Max Fertilizer - 0.5 L", 
  img: "images/Nitera Max Fertilizer.png", 
  type: "fert", 
  price: 500, 
  description: isArabic ? "مغذٍ سائل غني بالنيتروجين." : "Liquid nutrient rich in nitrogen.", 
  details: isArabic ? "مصمم لتعزيز النمو السريع ورفع إنتاجية المحصول." : "Designed to boost rapid growth and increase crop yield." 
},
{ 
  id: 41, 
  name: isArabic ? "سماد مركب بورتراك 150 - 100 مللي" : "Portrak 150 Compound Fertilizer - 100 ml", 
  img: "images/Portrak compound fertilizer.jpg", 
  type: "fert", 
  price: 250, 
  description: isArabic ? "مكمل مغذي مركّز للنبات." : "Concentrated nutritional supplement for plants.", 
  details: isArabic ? "يحتوي على عناصر متوازنة لتعزيز الصحة العامة للنبات." : "Contains balanced elements to enhance overall plant health." 
},


    
  ]), [isArabic]);

  // States
  const [filter, setFilter] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  // message box states
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxType, setMessageBoxType] = useState('success');
  const [messageBoxTitle, setMessageBoxTitle] = useState('');
  const [messageBoxText, setMessageBoxText] = useState('');

  // الفلاتر
  const filters = useMemo(() => ([
    { key: 'all',   icon: 'far fa-calendar', text: isArabic ? 'الكل'       : 'All' },
    { key: 'fert',  icon: 'fas fa-seedling', text: isArabic ? 'أسمدة'      : 'Fertilizers' },
    { key: 'pest',  icon: 'fas fa-bug',      text: isArabic ? 'مبيدات'     : 'Pesticides' },
    { key: 'tools', icon: 'fas fa-tools',    text: isArabic ? 'أدوات'      : 'Tools' },
    { key: 'seeds', icon: 'fas fa-seedling', text: isArabic ? 'بذور'       : 'Seeds' },
    { key: 'water', icon: 'fas fa-tint',     text: isArabic ? 'أنظمة ري'   : 'Irrigation Systems' }
  ]), [isArabic]);

  // طرق الدفع
  const paymentMethods = useMemo(() => ([
    { id: 'vodafone', namee: 'Vodafone Cash', image: '/images/vodafone.png',  color: 'text-danger' },
    { id: 'We',       namee: 'WePay',         image: '/images/we.png',        color: 'text-danger' },
    { id: 'bank',     namee: 'Visa',          image: '/images/visaa.PNG',     color: 'text-primary' },
    { id: 'instapay', namee: 'InstaPay',      image: '/images/instapay.PNG',  color: 'text-purple' },
    { id: 'visa',     namee: 'FawryPay',      image: '/images/fawry.PNG',     color: 'text-info' },
    { id: 'etisalat', namee: 'etisalat cash', image: '/images/etisalat.png',  color: 'text-danger' },
  ]), []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(productsData.filter((p) => p.type === filter));
    }
  }, [productsData, filter]);

  // فتح message box
  const openMessageBox = (type, title, text) => {
    setMessageBoxType(type);
    setMessageBoxTitle(title);
    setMessageBoxText(text);
    setShowMessageBox(true);
  };

  // غلق message box
  const closeMessageBox = () => setShowMessageBox(false);

  // تحديث الفلتر
  const handleFilterChange = (filterKey) => {
    setFilter(filterKey);
    if (filterKey === 'all') {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(productsData.filter(p => p.type === filterKey));
    }
  };

  // إضافة منتج للسلة
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // تحديث الكمية
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // إفراغ السلة
  const clearCart = () => setCartItems([]);

  // حساب الإجمالي
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // معالجة الدفع
  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      openMessageBox(
        'warning',
        isArabic ? 'تنبيه' : 'Warning',
        isArabic
          ? 'الرجاء اختيار طريقة الدفع أولاً'
          : 'Please choose a payment method first'
      );
      return;
    }

    openMessageBox(
      'success',
      isArabic ? 'تم الدفع بنجاح' : 'Payment Successful',
      isArabic
        ? `تم الدفع بنجاح بقيمة ${calculateTotal()} جنيه عبر ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.namee}`
        : `Payment completed successfully for ${calculateTotal()} EGP via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.namee}`
    );

    clearCart();
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
  };

  // ══════════════════════════════════════════
  // مكون البطاقة
  // ══════════════════════════════════════════
  const ProductCard = ({ product }) => (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card shopCard pb-4 h-100">
        <img
          src={product.img}
          className="card-img-top object-fit-cover"
          alt={product.name}
        />
        <div className="card-body text-end text-success mt-2 d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <small className="text-success fs-5 d-block mb-2">
            {product.price} {isArabic ? 'جنيه' : 'EGP'}
          </small>
          <p className="card-text text-muted small flex-grow-1">{product.description}</p>
          <div className="mt-auto">
            <button
              className="btn btn-success w-100 mt-2"
              onClick={() => addToCart(product)}
            >
              <i className="fas fa-cart-plus me-2"></i>
              {isArabic ? 'أضف إلى السلة' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // مكون السلة
  const ShoppingCart = () => {
    if (cartItems.length === 0) {
      return (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-shopping-cart me-2"></i>
              {isArabic ? 'سلة التسوق' : 'Shopping Cart'}
            </h5>
          </div>
          <div className="card-body text-center py-5">
            <i className="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
            <p className="text-muted">{isArabic ? 'السلة فارغة' : 'Cart is empty'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card shadow-lg border-0 sticky-top">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-shopping-cart me-2"></i>
            {isArabic ? 'سلة التسوق' : 'Shopping Cart'}
          </h5>
          <span className="badge bg-light text-success">{cartItems.length}</span>
        </div>

        <div className="card-body">
          {cartItems.map(item => (
            <div key={item.id} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.name}</h6>
                  <small className="text-muted">
                    {item.price} {isArabic ? 'جنيه' : 'EGP'}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <span className="text-success fw-bold">
                  {item.price * item.quantity} {isArabic ? 'ج.م' : 'EGP'}
                </span>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">{isArabic ? 'الإجمالي:' : 'Total:'}</h6>
            <h5 className="mb-0 text-success">
              {calculateTotal()} {isArabic ? 'جنيه' : 'EGP'}
            </h5>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-success"
              onClick={() => setShowPaymentModal(true)}
            >
              <i className="fas fa-credit-card me-2"></i>
              {isArabic ? 'الدفع الآن' : 'Pay Now'}
            </button>
            <button className="btn btn-outline-danger" onClick={clearCart}>
              <i className="fas fa-trash me-2"></i>
              {isArabic ? 'إفراغ السلة' : 'Clear Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // مكون مودال الدفع
  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="modal show d-block modal-backdrop-custom">
        <div className="modal-dialog modal-dialog-centered payment-modal-dialog">
          <div className="modal-content payment-modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-success w-100 text-center">
                {isArabic ? 'إتمام عملية الشراء' : 'Complete Purchase'}
              </h4>
              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod('');
                }}
              ></button>
            </div>

            <div className="modal-body text-end payment-modal-body">
              <div className="p-3 mb-3 rounded payment-summary-box">
                <h6 className="text-success mb-3">
                  {isArabic ? 'تفاصيل المشتريات' : 'Purchase Details'}
                </h6>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{item.price * item.quantity} {isArabic ? 'ج.م' : 'EGP'}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>{isArabic ? 'الإجمالي' : 'Total'}</span>
                  <span>{calculateTotal()} {isArabic ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>

              <h6 className="text-success mb-3">
                {isArabic ? 'اختر وسيلة الدفع' : 'Choose Payment Method'}
              </h6>
              <div className="row g-2 mb-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="col-6">
                    <div
                      className={`p-3 rounded border text-center payment-method-card ${
                        selectedPaymentMethod === method.id
                          ? 'border-success border-2'
                          : 'border-1'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      {method.image ? (
                        <img
                          src={method.image}
                          alt={method.namee}
                          className="mb-3 payment-method-img"
                        />
                      ) : (
                        <i className={`${method.icon} ${method.color} fa-3x mb-3 d-block`}></i>
                      )}
                      <span className="text-success">{method.namee}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-success py-2 fs-5" onClick={handlePayment}>
                  <i className="fas fa-lock me-2"></i>
                  {isArabic ? 'تأكيد الدفع' : 'Confirm Payment'}
                </button>
                <button
                  className="btn btn-outline-secondary py-2"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                  }}
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // مكون Message Box
  const MessageBox = () => {
    if (!showMessageBox) return null;

    return (
      <div className="custom-message-overlay">
        <div className="custom-message-box">
          <div className={`message-icon-wrapper ${messageBoxType}`}>
            <i
              className={`fas ${
                messageBoxType === 'success'
                  ? 'fa-check-circle'
                  : 'fa-exclamation-triangle'
              }`}
            ></i>
          </div>
          <h4 className="message-title">{messageBoxTitle}</h4>
          <p className="message-text">{messageBoxText}</p>
          <button
            className={`btn ${
              messageBoxType === 'success' ? 'btn-success' : 'btn-warning'
            } px-4 py-2`}
            onClick={closeMessageBox}
          >
            {isArabic ? 'حسناً' : 'OK'}
          </button>
        </div>
      </div>
    );
  };

  // التصميم الرئيسي
  return (
    <div className={`shopping-page ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="container py-5 text-center">
        <h3 className="title-txt text-center text-success mb-4">
          {isArabic ? 'المتجر الزراعي' : 'Agricultural Store'}
        </h3>
        <h5 className="title-txt text-center text-success mb-5">
          {isArabic
            ? 'تسوق أفضل الأسمدة والمبيدات والبذور والأدوات الزراعية'
            : 'Shop the best fertilizers, pesticides, seeds, and agricultural tools'}
        </h5>

        {/* ── فلاتر المتجر ── */}
        <div className="shopFilterGroup d-flex flex-wrap justify-content-center gap-3 mb-5">
          {filters.map(filterItem => (
            <button
              key={filterItem.key}
              className={`shopFilterBtn btn btn-light text-success px-4 py-3 text-center fs-5 ${
                filter === filterItem.key ? 'active' : ''
              }`}
              onClick={() => handleFilterChange(filterItem.key)}
            >
              <i className={`${filterItem.icon} ms-2`}></i>
              {filterItem.text}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-9">
            <div className="row g-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="col-lg-3">
            <ShoppingCart />
          </div>
        </div>
      </div>

      <PaymentModal />

      <MessageBox />
    </div>
  );
};

export default ShoppingPage;
