const Testimonials = () => {
    return (
        <section className="container py-5 mb-5">
            <h2 className="fw-bold text-center mb-5 display-5" style={{ color: '#1b2a47' }}>
                شركاء النجاح يثقون بـ <span style={{ color: '#ff8a00' }}>داركم</span>
            </h2>
            <div className="row g-4 mt-2">
                
                {/* التقييم الأول */}
                <div className="col-md-4">
                    <div className="card h-100 border text-center p-4 bg-white shadow-sm" style={{ borderRadius: '15px', borderColor: '#e2e8f0' }}>
                        <div className="mb-4 d-flex justify-content-center">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ff8a00" viewBox="0 0 16 16" className="mx-1">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            ))}
                        </div>
                        <p className="text-muted fs-6 mb-4 px-2 fw-semibold flex-grow-1" style={{ lineHeight: '1.9' }}>
                            "لولا داركم لما تمكنت من إيجاد فريق هندسي متكامل لمشروعي. سهولة في التعامل وشفافية مطلقة في تسعير البنود."
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-auto">
                            <div className="text-end">
                                <h5 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>أحمد س.</h5>
                                <span className="text-muted">صاحب مشروع</span>
                            </div>
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '55px', height: '55px', backgroundColor: '#6c757d' }}>
                                أ
                            </div>
                        </div>
                    </div>
                </div>

                {/* التقييم الثاني */}
                <div className="col-md-4">
                    <div className="card h-100 border text-center p-4 bg-white shadow-sm" style={{ borderRadius: '15px', borderColor: '#e2e8f0' }}>
                        <div className="mb-4 d-flex justify-content-center">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ff8a00" viewBox="0 0 16 16" className="mx-1">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            ))}
                        </div>
                        <p className="text-muted fs-6 mb-4 px-2 fw-semibold flex-grow-1" style={{ lineHeight: '1.9' }}>
                            "منصة داركم هي الحل الأمثل لأي مقاول يبحث عن فرص عمل حقيقية ومشاريع مضمونة الدفع. أنصح بها وبشدة."
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-auto">
                            <div className="text-end">
                                <h5 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>محمود ع.</h5>
                                <span className="text-muted">مقاول بناء</span>
                            </div>
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '55px', height: '55px', backgroundColor: '#6c757d' }}>
                                م
                            </div>
                        </div>
                    </div>
                </div>

                {/* التقييم الثالث */}
                <div className="col-md-4">
                    <div className="card h-100 border text-center p-4 bg-white shadow-sm" style={{ borderRadius: '15px', borderColor: '#e2e8f0' }}>
                        <div className="mb-4 d-flex justify-content-center">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ff8a00" viewBox="0 0 16 16" className="mx-1">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            ))}
                        </div>
                        <p className="text-muted fs-6 mb-4 px-2 fw-semibold flex-grow-1" style={{ lineHeight: '1.9' }}>
                            "تجربة رائعة! تم تنفيذ التشطيبات الداخلية لشقّتي باحترافية عالية وفي الوقت المحدد بفضل الحرفيين الموجودين بالمنصة."
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-auto">
                            <div className="text-end">
                                <h5 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>سارة ن.</h5>
                                <span className="text-muted">عميل</span>
                            </div>
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '55px', height: '55px', backgroundColor: '#6c757d' }}>
                                س
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;