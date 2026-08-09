import { useState } from 'react';
import { FaStar, FaPlus, FaTrash } from 'react-icons/fa';

const AddProjectTab = ({ projectType, setProjectType, directProvider, setDirectProvider, setActiveTab }) => {
    
    // حالات خاصة بهذه الواجهة فقط
    const [tenderType, setTenderType] = useState('عادي');
    const [documents, setDocuments] = useState([]);

    const addDocumentRow = () => setDocuments([...documents, { id: Date.now(), type: '', title: '', file: null }]);
    const handleDocChange = (id, field, value) => setDocuments(documents.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    const removeDocumentRow = (id) => setDocuments(documents.filter(doc => doc.id !== id));

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
            
            {directProvider && (
                <div className="alert d-flex justify-content-between align-items-center mb-5 rounded-4 shadow-sm" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
                    <div className="d-flex align-items-center gap-3">
                        <FaStar size={24} className="text-warning" />
                        <span className="fw-bold" style={{ fontSize: '20px' }}>أنت تقوم بطرح هذا المشروع كطلب مباشر وحصري لـ ({directProvider})</span>
                    </div>
                    <button type="button" className="btn-close" onClick={() => setDirectProvider(null)}></button>
                </div>
            )}

            <div className="d-flex justify-content-center gap-3 mb-5 border-bottom pb-4">
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm" 
                    style={{ backgroundColor: projectType === 'construction' ? '#ff8a00' : '#e2e8f0', color: projectType === 'construction' ? 'white' : '#1b2a47', fontSize: '22px', minWidth: '220px' }}
                    onClick={() => setProjectType('construction')}
                >
                    إنشاء
                </button>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm" 
                    style={{ backgroundColor: projectType === 'finishing' ? '#ff8a00' : '#e2e8f0', color: projectType === 'finishing' ? 'white' : '#1b2a47', fontSize: '22px', minWidth: '220px' }}
                    onClick={() => setProjectType('finishing')}
                >
                    تشطيب
                </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert(directProvider ? 'تم إرسال الطلب المباشر!' : 'تم طرح المشروع!'); setActiveTab('dashboard'); setDirectProvider(null); setDocuments([]); }}>
                <div className="row g-5">
                    <div className="col-12">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>اسم المشروع</label>
                        <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="أدخل اسم المشروع" required />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>وصف المشروع بدقة</label>
                        <textarea className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} rows="5" required></textarea>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المحافظة</label>
                        <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required>
                            <option value="">اختر المحافظة...</option>
                            <option value="دمشق">دمشق</option>
                            <option value="ريف دمشق">ريف دمشق</option>
                            <option value="حلب">حلب</option>
                            <option value="حمص">حمص</option>
                            <option value="حماة">حماة</option>
                            <option value="اللاذقية">اللاذقية</option>
                            <option value="طرطوس">طرطوس</option>
                            <option value="إدلب">إدلب</option>
                            <option value="الرقة">الرقة</option>
                            <option value="دير الزور">دير الزور</option>
                            <option value="الحسكة">الحسكة</option>
                            <option value="درعا">درعا</option>
                            <option value="السويداء">السويداء</option>
                            <option value="القنيطرة">القنيطرة</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المساحة</label>
                        <div className="input-group">
                            <input type="number" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px 0 0 12px' }} required />
                            <span className="input-group-text p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '0 12px 12px 0', fontWeight: 'bold', color: '#1b2a47' }}>م²</span>
                        </div>
                    </div>

                    {projectType === 'construction' && (
                        <>
                            {!directProvider && (
                                <div className="col-md-6">
                                    <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مزود الخدمة المطلوبة</label>
                                    <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required>
                                        <option value="">اختر...</option>
                                        <option value="مكاتب هندسية وشركات">مكاتب هندسية وشركات</option>
                                        <option value="مهندس مدني">مهندس مدني</option>
                                        <option value="مهندس معماري">مهندس معماري</option>
                                        <option value="مهندس استشاري">مهندس استشاري</option>
                                        <option value="مقاول">مقاول</option>
                                    </select>
                                </div>
                            )}
                            <div className={directProvider ? "col-12" : "col-md-6"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة (بالأيام)</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required>
                                    <option value="">اختر...</option>
                                    <option value="1">1 يوم</option>
                                    <option value="2">2 يوم</option>
                                    <option value="3">3 يوم</option>
                                    <option value="4">4 يوم</option>
                                    <option value="5">5 يوم</option>
                                    <option value="6">6 يوم</option>
                                    <option value="7">7 يوم</option>
                                    <option value="8">8 يوم</option>
                                    <option value="9">9 يوم</option>
                                    <option value="10">10 يوم</option>
                                    <option value="11">11 يوم</option>
                                    <option value="12">12 يوم</option>
                                    <option value="13">13 يوم</option>
                                    <option value="14">14 يوم</option>
                                    <option value="15">15 يوم</option>
                                    <option value="16">16 يوم</option>
                                    <option value="17">17 يوم</option>
                                    <option value="18">18 يوم</option>
                                    <option value="19">19 يوم</option>
                                    <option value="20">20 يوم</option>
                                    <option value="21">21 يوم</option>
                                    <option value="22">22 يوم</option>
                                    <option value="23">23 يوم</option>
                                    <option value="24">24 يوم</option>
                                    <option value="25">25 يوم</option>
                                    <option value="26">26 يوم</option>
                                    <option value="27">27 يوم</option>
                                    <option value="28">28 يوم</option>
                                    <option value="29">29 يوم</option>
                                    <option value="30">30 يوم</option>
                                </select>
                            </div>
                        </>
                    )}

                    {projectType === 'finishing' && (
                        <>
                            {!directProvider && (
                                <div className="col-md-4">
                                    <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>الحرفة المطلوبة</label>
                                    <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required>
                                        <option value="">اختر...</option>
                                        <option value="فني كهرباء">فني كهرباء</option>
                                        <option value="فني سباكة">فني سباكة</option>
                                        <option value="فني دهان">فني دهان</option>
                                        <option value="فني بلاط">فني بلاط</option>
                                        <option value="فني تكييف">فني تكييف</option>
                                        <option value="فني حداد">فني حداد</option>
                                        <option value="فني نجار">فني نجار</option>
                                    </select>
                                </div>
                            )}
                            <div className={directProvider ? "col-md-6" : "col-md-4"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>نوع المناقصة</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={tenderType} onChange={(e) => setTenderType(e.target.value)} required>
                                    <option value="عادي">عادي (بالايام)</option>
                                    <option value="مستعجل">مستعجل (بالساعات)</option>
                                </select>
                            </div>
                            <div className={directProvider ? "col-md-6" : "col-md-4"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة ({tenderType === 'مستعجل' ? 'بالساعات' : 'بالايام'})</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required>
                                    <option value="">اختر...</option>
                                    {Array.from({ length: tenderType === 'مستعجل' ? 15 : 30 }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>{num} {tenderType === 'مستعجل' ? 'ساعة' : 'يوم'}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* المرفقات */}
                    <div className="col-12 mt-5">
                        <div className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-light border">
                            <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '24px' }}>المرفقات</span>
                            <button type="button" className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white" style={{ backgroundColor: '#ff8a00', fontSize: '20px' }} onClick={addDocumentRow}><FaPlus /> إضافة ملف</button>
                        </div>
                        {documents.map((doc) => (
                            <div key={doc.id} className="row g-3 p-4 mt-3 rounded-4 align-items-end" style={{ border: '2px dashed #cbd5e1' }}>
                                <div className="col-md-3">
                                    <select className="form-select p-3 bg-light" value={doc.type} onChange={(e) => handleDocChange(doc.id, 'type', e.target.value)} required><option value="">اختر...</option><option value="image">صورة</option></select>
                                </div>
                                <div className="col-md-4">
                                    <input type="text" className="form-control p-3 bg-light" placeholder="عنوان الملف" value={doc.title} onChange={(e) => handleDocChange(doc.id, 'title', e.target.value)} required />
                                </div>
                                <div className="col-md-4">
                                    <input type="file" className="form-control p-3 bg-light" disabled={!doc.type} onChange={(e) => handleDocChange(doc.id, 'file', e.target.files[0])} required />
                                </div>
                                <div className="col-md-1 text-center">
                                    <button type="button" className="btn btn-outline-danger p-3 w-100" onClick={() => removeDocumentRow(doc.id)}><FaTrash size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-12 mt-5 text-center">
                        <button type="submit" className="btn fw-bold py-3 shadow" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '26px', borderRadius: '15px', width: '80%' }}>
                            {directProvider ? `إرسال الطلب لـ ${directProvider}` : 'إضافة المشروع'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProjectTab;