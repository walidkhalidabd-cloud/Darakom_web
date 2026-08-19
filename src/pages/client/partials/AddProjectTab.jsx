import { useState, useEffect } from 'react';
import { FaStar, FaPlus, FaTrash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { createClientProject } from '../../../services/api/clientApi';
// تأكد من استيراد apiReq لجلب المحافظات 
import apiReq from '../../../services/apiReq'; 

const AddProjectTab = ({ projectType, setProjectType, directProvider, setDirectProvider, setActiveTab }) => {
    
    // حالات الفورم (States) المتوافقة مع الـ Backend
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [locationDetails, setLocationDetails] = useState('');
    const [buildingNo, setBuildingNo] = useState('');
    const [provinceId, setProvinceId] = useState('');
    const [area, setArea] = useState('');
    const [tenderDuration, setTenderDuration] = useState('');
    const [projectTypeId, setProjectTypeId] = useState('');
    const [craftsmanType, setCraftsmanType] = useState('');
    const [tenderType, setTenderType] = useState('normal'); 
    
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // حالة جديدة لتخزين المحافظات القادمة من الباك إند
    const [provinces, setProvinces] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(true);

    // جلب المحافظات عند تحميل المكون
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                // نستخدم المسار الموجود في api.php
                const res = await apiReq.get('/provinces');
                const data = res.data?.data || res.data || [];
                setProvinces(data);
            } catch (err) {
                console.error("فشل جلب المحافظات:", err);
                setError("لم نتمكن من تحميل قائمة المحافظات. يرجى تحديث الصفحة.");
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);

    const addDocumentRow = () => setDocuments([...documents, { id: Date.now(), file: null }]);
    const handleDocChange = (id, file) => setDocuments(documents.map(doc => doc.id === id ? { ...doc, file } : doc));
    const removeDocumentRow = (id) => setDocuments(documents.filter(doc => doc.id !== id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location_details', locationDetails);
        formData.append('building_no', buildingNo);
        formData.append('province_id', provinceId);
        formData.append('area', area);
        
        formData.append('work_type', projectType); 
        formData.append('tender_type', tenderType); 
        formData.append('visibility', directProvider ? 'private' : 'public');
        formData.append('invitation_type', directProvider ? 'private' : 'public');
        
        formData.append('tender_duration', tenderDuration);
        formData.append('tender_duration_unit', tenderType === 'urgent' ? 'hour' : 'day');

        formData.append('project_type_id', projectType === 'construction' ? projectTypeId : 1);
        
        if (projectType === 'finishing' && craftsmanType) {
            formData.append('craftsman_type', craftsmanType);
        }

        documents.forEach((doc) => {
            if (doc.file) {
                formData.append('documents[]', doc.file);
            }
        });

        try {
            await createClientProject(formData);
            alert(directProvider ? '✅ تم إرسال الطلب المباشر بنجاح!' : '✅ تم طرح المشروع بنجاح!');
            
            setDirectProvider(null);
            setActiveTab('dashboard');
        } catch (err) {
            console.error("Error creating project:", err);
            setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة المشروع، يرجى التأكد من صحة البيانات المُدخلة.');
        } finally {
            setLoading(false);
        }
    };

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

            {error && (
                <div className="alert alert-danger fw-bold rounded-3 shadow-sm mb-4" style={{ fontSize: '18px' }}>
                    ⚠️ {error}
                </div>
            )}

            <div className="d-flex justify-content-center gap-3 mb-5 border-bottom pb-4">
                <button 
                    type="button"
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm" 
                    style={{ backgroundColor: projectType === 'construction' ? '#ff8a00' : '#e2e8f0', color: projectType === 'construction' ? 'white' : '#1b2a47', fontSize: '22px', minWidth: '220px' }}
                    onClick={() => setProjectType('construction')}
                >
                    إنشاء
                </button>
                <button 
                    type="button"
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
                        <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="أدخل اسم المشروع" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                    </div>
                    
                    <div className="col-12">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>وصف المشروع بدقة</label>
                        <textarea className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} rows="5" placeholder="اكتب وصفاً مفصلاً لمتطلبات مشروعك..." value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
                    </div>

                    <div className="col-md-8">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>العنوان بالتفصيل</label>
                        <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="أدخل العنوان بالتفصيل (مثل: الحي، الشارع، أقرب معلم)" value={locationDetails} onChange={(e)=>setLocationDetails(e.target.value)} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>رقم البناء / العقار</label>
                        <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="مثال: 15A" value={buildingNo} onChange={(e)=>setBuildingNo(e.target.value)} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المحافظة</label>
                        <select 
                            className="form-select p-4 bg-light border" 
                            style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} 
                            value={provinceId} 
                            onChange={(e)=>setProvinceId(e.target.value)} 
                            disabled={loadingProvinces}
                            required
                        >
                            <option value="">{loadingProvinces ? 'جاري التحميل...' : 'اختر المحافظة...'}</option>
                            {/* عرض المحافظات بشكل ديناميكي من الباك إند */}
                            {provinces.map(prov => (
                                <option key={prov.id} value={prov.id}>{prov.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="col-md-6">
                        <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المساحة</label>
                        <div className="input-group">
                            <input type="number" min="1" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px 0 0 12px' }} placeholder="أدخل المساحة" value={area} onChange={(e)=>setArea(e.target.value)} required />
                            <span className="input-group-text p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '0 12px 12px 0', fontWeight: 'bold', color: '#1b2a47' }}>م²</span>
                        </div>
                    </div>

                    {projectType === 'construction' && (
                        <>
                            {!directProvider && (
                                <div className="col-md-6">
                                    <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مزود الخدمة المطلوبة</label>
                                    <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={projectTypeId} onChange={(e)=>setProjectTypeId(e.target.value)} required>
                                        <option value="">اختر...</option>
                                        <option value="1">مكاتب هندسية وشركات</option>
                                        <option value="2">مهندس مدني</option>
                                        <option value="3">مهندس معماري</option>
                                        <option value="4">مهندس استشاري</option>
                                        <option value="5">مقاول</option>
                                    </select>
                                </div>
                            )}
                            <div className={directProvider ? "col-12" : "col-md-6"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة (بالأيام)</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={tenderDuration} onChange={(e)=>setTenderDuration(e.target.value)} required>
                                    <option value="">اختر المدة...</option>
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>{num} أيام</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {projectType === 'finishing' && (
                        <>
                            {!directProvider && (
                                <div className="col-md-4">
                                    <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>الحرفة المطلوبة</label>
                                    <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={craftsmanType} onChange={(e)=>setCraftsmanType(e.target.value)} required>
                                        <option value="">اختر...</option>
                                        <option value="electricity">فني كهرباء</option>
                                        <option value="plumbing">فني سباكة</option>
                                        <option value="painting">فني دهان</option>
                                        <option value="tiling">فني بلاط</option>
                                        <option value="ac">فني تكييف</option>
                                        <option value="gypsum">فني جبس بورد</option>
                                    </select>
                                </div>
                            )}
                            <div className={directProvider ? "col-md-6" : "col-md-4"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>نوع المناقصة</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={tenderType} onChange={(e) => { setTenderType(e.target.value); setTenderDuration(''); }} required>
                                    <option value="normal">عادي (بالأيام)</option>
                                    <option value="urgent">مستعجل (بالساعات)</option>
                                </select>
                            </div>
                            <div className={directProvider ? "col-md-6" : "col-md-4"}>
                                <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة ({tenderType === 'urgent' ? 'ساعات' : 'أيام'})</label>
                                <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} value={tenderDuration} onChange={(e)=>setTenderDuration(e.target.value)} required>
                                    <option value="">اختر...</option>
                                    {Array.from({ length: tenderType === 'urgent' ? 24 : 30 }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>{num} {tenderType === 'urgent' ? 'ساعة' : 'يوم'}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="col-12 mt-5">
                        <div className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-light border">
                            <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '24px' }}>المرفقات (صور أو ملفات)</span>
                            <button type="button" className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white" style={{ backgroundColor: '#ff8a00', fontSize: '20px' }} onClick={addDocumentRow}>
                                <FaPlus /> إضافة ملف
                            </button>
                        </div>
                        {documents.map((doc) => (
                            <div key={doc.id} className="row g-3 p-4 mt-3 rounded-4 align-items-end" style={{ border: '2px dashed #cbd5e1' }}>
                                <div className="col-md-10">
                                    <input type="file" className="form-control p-3 bg-white" onChange={(e) => handleDocChange(doc.id, e.target.files[0])} required />
                                </div>
                                <div className="col-md-2 text-center">
                                    <button type="button" className="btn btn-outline-danger p-3 w-100" onClick={() => removeDocumentRow(doc.id)}>
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-12 mt-5 text-center">
                        <button type="submit" className="btn fw-bold py-3 shadow" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '26px', borderRadius: '15px', width: '80%' }} disabled={loading}>
                            {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle className="me-2" />} 
                            {directProvider ? `إرسال الطلب لـ ${directProvider}` : 'إضافة المشروع وطرحه'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProjectTab;