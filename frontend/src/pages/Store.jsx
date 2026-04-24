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
      img: "images/مبيد حشاائش.jpg",
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
      img: "images/الجرار.jpg",
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
      img: "images/tomato3.jpg",
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
      img: "images/فاس.jpg",
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
      img: "images/قمح.jpg",
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
      img: "images/اداة للزراعة.jpeg",
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
      img: "images/مبيد نيماتودا.jpg",
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
    }
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