import { FiUserPlus, FiFileText, FiCheckCircle, FiSmile } from 'react-icons/fi';

const Steps = () => {
    // مصفوفة تحتوي على بيانات الخطوات الأربع لتسهيل الكود ومنع التكرار
    const stepsData = [
        { id: 1, icon: <FiUserPlus />, title: 'سجل حسابك', desc: 'قم بإنشاء حسابك كعميل أو مزود خدمة بخطوات بسيطة ومجانية.' },
        { id: 2, icon: <FiFileText />, title: 'اطرح مشروعك', desc: 'أضف تفاصيل مشروعك أو الخدمة التي تحتاجها بوضوح تام.' },
        { id: 3, icon: <FiCheckCircle />, title: 'اختر العرض الأنسب', desc: 'قارن بين عروض الأسعار المقدمة من الخبراء واختر الأفضل لك.' },
        { id: 4, icon: <FiSmile />, title: 'تابع التنفيذ', desc: 'تواصل مباشرة وتابع نسبة الإنجاز والتقارير حتى التسليم.' }
    ];

    return (
        <section className="py-5" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="container py-5">
                
                {/* عنوان القسم */}
                <h2 className="text-center fw-bold mb-5" style={{ color: 'var(--primary-color)', fontSize: '40px' }}>
                    كيف تبدأ رحلتك معنا؟
                </h2>
                
                {/* شبكة البطاقات (Grid) */}
                <div className="row g-4 text-center">
                    {stepsData.map((step) => (
                        <div key={step.id} className="col-lg-3 col-md-6">
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', transition: 'transform 0.3s' }}>
                                <div className="card-body p-4 mt-3">
                                    
                                    {/* الأيقونة مع الرقم فوقها */}
                                    <div 
                                        className="d-inline-flex align-items-center justify-content-center mb-4"
                                        style={{ 
                                            width: '90px', 
                                            height: '90px', 
                                            backgroundColor: 'var(--primary-color)', 
                                            color: 'var(--secondary-color)',
                                            borderRadius: '20px',
                                            fontSize: '40px',
                                            position: 'relative'
                                        }}
                                    >
                                        {step.icon}
                                        {/* دائرة الرقم البرتقالية */}
                                        <span 
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                            style={{ backgroundColor: 'var(--secondary-color)', fontSize: '20px', border: '4px solid white' }}
                                        >
                                            {step.id}
                                        </span>
                                    </div>
                                    
                                    {/* النصوص */}
                                    <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>{step.title}</h4>
                                    <p className="text-muted" style={{ fontSize: '18px', lineHeight: '1.6' }}>{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Steps;