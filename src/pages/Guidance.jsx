import { 
  FaInfoCircle, FaShieldAlt, FaFileAlt, FaHandshake, FaCheckCircle, 
  FaChartLine, FaCalculator, FaBalanceScale, FaEdit, FaBuilding, 
  FaShoppingCart, FaBook, FaStar, FaExclamationTriangle 
} from 'react-icons/fa';

const Guidance = () => {
  return (
    <div style={{ backgroundColor: '#f4f6f9', fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* قسم الترحيب العلوي */}
      <section className="py-5 text-center text-white" style={{ backgroundColor: '#1b2a47' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#ff8a00' }}>الدليل الإرشادي للبناء</h1>
          <p className="fs-5 fw-semibold mx-auto" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
            كل ما تحتاجه من معلومات، خطوات، ونصائح لبناء مشروعك بنجاح وبأعلى معايير الجودة والتوفير.
          </p>
        </div>
      </section>

      <div className="container mt-5">
        
        {/* أولاً: إرشادات عامة قبل البدء */}
        <section className="mb-5">
          <h2 className="fw-bold mb-4 border-bottom pb-2" style={{ color: '#1b2a47', borderColor: '#e2e8f0' }}>
            <FaInfoCircle className="me-2" style={{ color: '#ff8a00' }} /> أولاً: إرشادات عامة قبل البدء
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                <div className="mb-3"><FaShieldAlt size={50} style={{ color: '#1b2a47' }} /></div>
                <h5 className="fw-bold" style={{ color: '#ff8a00' }}>السلامة أولاً</h5>
                <p className="text-muted small fw-semibold mt-2">يجب توفير معدات السلامة الشخصية لجميع العاملين في الموقع والالتزام بمعايير الأمن والسلامة المهنية.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                <div className="mb-3"><FaFileAlt size={50} style={{ color: '#1b2a47' }} /></div>
                <h5 className="fw-bold" style={{ color: '#ff8a00' }}>التراخيص القانونية</h5>
                <p className="text-muted small fw-semibold mt-2">تأكد من استخراج كافة التصاريح الهندسية والبلدية من الجهات المختصة قبل بدء أي أعمال على أرض الواقع.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                <div className="mb-3"><FaHandshake size={50} style={{ color: '#1b2a47' }} /></div>
                <h5 className="fw-bold" style={{ color: '#ff8a00' }}>اختيار المقاول</h5>
                <p className="text-muted small fw-semibold mt-2">تعامل مع شركات مقاولات معتمدة وذات خبرة لضمان جودة التنفيذ والالتزام بالجدول الزمني المحدد.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4">
                <div className="mb-3"><FaCheckCircle size={50} style={{ color: '#1b2a47' }} /></div>
                <h5 className="fw-bold" style={{ color: '#ff8a00' }}>جودة المواد</h5>
                <p className="text-muted small fw-semibold mt-2">احرص على شراء وتوريد مواد بناء مطابقة للمواصفات القياسية لضمان استدامة المبنى وعمره الافتراضي.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ثانياً: خطوات ومراحل البناء الأساسية */}
        <section className="mb-5 mt-5 pt-4">
          <h2 className="fw-bold mb-5 text-center" style={{ color: '#1b2a47' }}>
            ثانياً: خطوات ومراحل البناء الأساسية
          </h2>
          <div className="row g-4">
            {[
              { title: "التخطيط والتصميم", desc: "تبدأ المرحلة بالتعاقد مع مكتب هندسي لعمل التصميمات المعمارية والإنشائية، وتوزيع المساحات بشكل يلبي الاحتياجات." },
              { title: "تجهيز الموقع والحفر", desc: "يتم تنظيف الأرض، وتسويتها، وتحديد أماكن القواعد، ثم البدء بأعمال الحفر بناءً على المخططات الهندسية." },
              { title: "أعمال الأساسات", desc: "تشمل هذه المرحلة وضع الحديد المسلح وصب الخرسانة للقواعد لضمان ثبات المبنى." },
              { title: "بناء الهيكل الخرساني", desc: "يتم تشييد الأعمدة، وصب الأسقف، وبناء الجدران الخارجية والداخلية حسب التقسيم المعتمد." },
              { title: "التأسيسات الكهربائية", desc: "تركيب شبكات المياه، ومواسير الصرف الصحي، وتمديد الأسلاك والعلب الكهربائية الأساسية." },
              { title: "أعمال اللياسة (المحارة)", desc: "تغطية الجدران والأسقف بطبقة من الإسمنت والرمل لتسويتها وتجهيزها لمراحل التشطيب النهائية." },
              { title: "التشطيبات الداخلية", desc: "تشمل تركيب الأرضيات، وتثبيت النوافذ والأبواب، وأعمال الدهان، وتمديد الإضاءة." },
              { title: "الفحص النهائي والتسليم", desc: "مراجعة كافة الأعمال للتأكد من مطابقتها للمواصفات الهندسية، وتسليم المبنى جاهزاً للاستخدام." }
            ].map((step, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="bg-white p-4 rounded-4 shadow-sm h-100 position-relative mt-4 pt-5 border-top border-4" style={{ borderColor: '#ff8a00' }}>
                  <div className="position-absolute start-50 translate-middle-x rounded-circle d-flex align-items-center justify-content-center shadow" style={{ top: '-25px', width: '50px', height: '50px', backgroundColor: '#ff8a00', color: '#1b2a47', fontSize: '1.5rem', fontWeight: 'bold', border: '4px solid white' }}>
                    {index + 1}
                  </div>
                  <h5 className="fw-bold text-center mt-2" style={{ color: '#1b2a47' }}>{step.title}</h5>
                  <p className="text-muted small fw-semibold text-center mt-3">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ثالثاً: نصائح مالية */}
        <section className="mb-5 mt-5 pt-4">
          <h2 className="fw-bold mb-4 border-bottom pb-2" style={{ color: '#1b2a47', borderColor: '#e2e8f0' }}>
            <FaChartLine className="me-2" style={{ color: '#ff8a00' }} /> ثالثاً: نصائح مالية لتقليل التكاليف بكفاءة
          </h2>
          
          <div className="row g-3">
            {[
              { icon: <FaCalculator />, title: "وضع ميزانية دقيقة (مع هامش طوارئ)", text: "قم بحساب التكاليف المتوقعة بدقة بناءً على أسعار السوق الحالية، واحرص على تخصيص 10% إلى 20% كاحتياطي لمواجهة أي نفقات غير متوقعة." },
              { icon: <FaBalanceScale />, title: "المقارنة بين عروض الأسعار", text: "لا تكتفِ بعرض واحد. احصل على عروض من عدة مقاولين وموردين، وقارن بينها مع مراعاة الجودة وسابقة الأعمال." },
              { icon: <FaEdit />, title: "الالتزام بالتصميم المعتمد", text: "تجنب إجراء تعديلات جوهرية على المخططات بعد بدء البناء، حيث أن التعديلات المتأخرة تكلف الكثير من الوقت والمال." },
              { icon: <FaBuilding />, title: "الاستثمار في الأساسيات", text: "أنفق الجزء الأكبر من ميزانيتك على جودة الهيكل الإنشائي والتأسيسات؛ فهذه العناصر يصعب تغييرها لاحقاً." },
              { icon: <FaShoppingCart />, title: "الشراء بالجملة وفي الأوقات المناسبة", text: "قم بشراء مواد البناء الأساسية دفعة واحدة إذا توفرت مساحة تخزين آمنة، واستغل فترات ركود السوق." },
              { icon: <FaBook />, title: "المتابعة الدورية للمصروفات", text: "قم بتسجيل كل النفقات بشكل مستمر وقارنها بالميزانية المحددة سلفاً، لضمان عدم الانحراف عن الخطة المالية." }
            ].map((tip, index) => (
              <div className="col-md-6" key={index}>
                <div className="d-flex align-items-start bg-white p-3 rounded-3 shadow-sm h-100 border-end border-4" style={{ borderColor: '#1b2a47' }}>
                  <div className="ms-3 rounded d-flex align-items-center justify-content-center flex-shrink-0 fs-4" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255, 138, 0, 0.1)', color: '#ff8a00' }}>
                    {tip.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{tip.title}</h6>
                    <p className="text-muted small mb-0 fw-semibold">{tip.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* النصيحة الذهبية والملاحظة */}
        <section className="mt-5">
          <div className="card border-0 shadow rounded-4 overflow-hidden">
            <div className="row g-0">
              
              {/* النصيحة الذهبية */}
              <div className="col-md-8 p-4 p-md-5" style={{ backgroundColor: '#1b2a47', color: 'white' }}>
                <h3 className="fw-bold mb-3" style={{ color: '#ff8a00' }}>
                  <FaStar className="me-2 mb-1" /> نصيحة ذهبية
                </h3>
                <p className="fs-5 fw-semibold" style={{ lineHeight: '1.8' }}>
                  احرص على أن تكون الدفعات المالية للمقاول مرتبطة بمراحل الإنجاز الفعلي على أرض الواقع. قسّم مستحقاته إلى أجزاء تتوافق مع إتمام كل مرحلة (مثل: بعد صب الأساسات، بعد الانتهاء من العظم، إلخ) لضمان التزامه بإنهاء العمل بالوقت والجودة المتفق عليهما.
                </p>
              </div>
              
              {/* ملاحظة هامة */}
              <div className="col-md-4 p-4 p-md-5 d-flex flex-column justify-content-center" style={{ backgroundColor: '#ff8a00', color: '#1b2a47' }}>
                <h4 className="fw-bold mb-3 text-white">
                  <FaExclamationTriangle className="me-2 mb-1" /> ملاحظة هامة
                </h4>
                <p className="fw-bold mb-0 text-white" style={{ lineHeight: '1.7' }}>
                  قد تختلف المدة الزمنية والتفاصيل الدقيقة لكل مرحلة بناءً على حجم المشروع، والميزانية المتاحة، واشتراطات البناء الخاصة بالمنطقة.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Guidance;