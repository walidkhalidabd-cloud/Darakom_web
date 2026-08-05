import { useState } from 'react';
import { FaStar, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { createProject } from '../../../services/api/clientApi';

const AddProjectTab = ({ projectType, setProjectType, directProvider, setDirectProvider, setActiveTab }) => {
    
    // حالات خاصة بهذه الواجهة فقط
    const [tenderType, setTenderType] = useState('عادي');
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', province_id: '', area: '', location_details: '',
        building_no: '', budget: '', tender_duration: '', craftsman_type: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const addDocumentRow = () => setDocuments([...documents, { id: Date.now(), type: '', title: '', file: null }]);
    const handleDocChange = (id, field, value) => setDocuments(documents.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    const removeDocumentRow = (id) => setDocuments(documents.filter(doc => doc.id !== id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            // بناء البيانات المطابقة لحقول الباك
            const payload = {
                title: formData.title,
                description: formData.description,
                province_id: formData.province_id,
                area: formData.area,
                location_details: formData.location_details || formData.title,
                building_no: formData.building_no || '1',
                budget: formData.budget || undefined,
                work_type: projectType, // construction | finishing
                tender_type: tenderType === 'مستعجل' ? 'urgent' : 'normal',
                visibility: directProvider ? 'private' : 'public',
                invitation_type: directProvider ? 'private' : 'public',
                project_type_id: 1, // قيمة افتراضية، يمكن تعديلها حسب المشروع
                tender_duration: formData.tender_duration,
                tender_duration_unit: tenderType === 'مستعجل' ? 'hour' : 'day',
                craftsman_type: formData.craftsman_type || undefined,
            };
            await createProject(payload);
            alert(directProvider ? 'تم إرسال الطلب المباشر بنجاح!' : 'تم طرح المشروع بنجاح!');
            setActiveTab('dashboard');
            setDirectProvider(null);
            setDocuments([]);
            setFormData({ title: '', description: '', province_id: '', area: '', location_details: '', building_no: '', budget: '', tender_duration: '', craftsman_type: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال المشروع، يرجى المحاولة مجدداً.');
            console.error('فشل إنشاء المشروع:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
            
            {error && (
                <div className="alert alert-danger rounded-4 fw-bold fs-6">{error}</div>
            )}

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

            <form onSubmit={handleSubmit}>
                <div className="row g-5">
                    <div className="col-12">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>اسم المشروع</label>
                        <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="أدخل اسم المشروع" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>وصف المشروع بدقة</label>
                        <textarea className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} rows="5" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المحافظة</label>
                        <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={formData.province_id} onChange={(e) => setFormData({ ...formData, province_id: e.target.value })}>
                            <option value="">اختر المحافظة...</option>
                            <option value="1">دمشق</option>
                            <option value="2">ريف دمشق</option>
                            <option value="3">حلب</option>
                            <option value="4">حمص</option>
                            <option value="5">حماة</option>
                            <option value="6">اللاذقية</option>
                            <option value="7">طرطوس</option>
                            <option value="8">إدلب</option>
                            <option value="9">الرقة</option>
                            <option value="10">دير الزور</option>
                            <option value="11">الحسكة</option>
                            <option value="12">درعا</option>
                            <option value="13">السويداء</option>
                            <option value="14">القنيطرة</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المساحة</label>
                        <div className="input-group">
                            <input type="number" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px 0 0 12px' }} required value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                            <span className="input-group-text p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '0 12px 12px 0', fontWeight: 'bold', color: '#1b2a47' }}>م²</span>
                        </div>
                    </div>

                    {projectType === 'construction' && (
                        <>
                            <div className="col-md-6">
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة (بالأيام)</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={formData.tender_duration} onChange={(e) => setFormData({ ...formData, tender_duration: e.target.value })}>
                                    <option value="">اختر...</option>
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>{num} يوم</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {projectType === 'finishing' && (
                        <>
                            <div className="col-md-4">
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>الحرفة المطلوبة</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={formData.craftsman_type} onChange={(e) => setFormData({ ...formData, craftsman_type: e.target.value })}>
                                    <option value="">اختر...</option>
                                    <option value="electricity">فني كهرباء</option>
                                    <option value="plumbing">فني سباكة</option>
                                    <option value="painting">فني دهان</option>
                                    <option value="tiling">فني بلاط</option>
                                    <option value="ac">فني تكييف</option>
                                    <option value="gypsum">فني جبس</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>نوع المناقصة</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={tenderType} onChange={(e) => setTenderType(e.target.value)} required>
                                    <option value="عادي">عادي (بالايام)</option>
                                    <option value="مستعجل">مستعجل (بالساعات)</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة ({tenderType === 'مستعجل' ? 'بالساعات' : 'بالايام'})</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={formData.tender_duration} onChange={(e) => setFormData({ ...formData, tender_duration: e.target.value })}>
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
                        <button type="submit" className="btn fw-bold py-3 shadow" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '26px', borderRadius: '15px', width: '80%' }} disabled={submitting}>
                            {submitting ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : (directProvider ? `إرسال الطلب لـ ${directProvider}` : 'إضافة المشروع')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProjectTab;
