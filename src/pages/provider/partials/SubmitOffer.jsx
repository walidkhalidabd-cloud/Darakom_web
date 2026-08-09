import { useState } from 'react';
import {
    FaChevronRight, FaClock, FaMoneyBillWave, FaCalendarAlt,
    FaPlus, FaTrash, FaFilePdf, FaImage, FaPaperPlane,
    FaProjectDiagram, FaFileAlt, FaHardHat, FaEdit
} from 'react-icons/fa';
import './provider-tabs.css';

const SubmitOffer = ({ tender, onBack, isEditing, offerData }) => {
    // بيانات العرض الأساسية — إذا كان تعديل، نملأ بالبيانات الموجودة
    const [projectTitle, setProjectTitle] = useState(isEditing && offerData ? offerData.title : (tender?.title || ''));
    const [duration, setDuration] = useState(isEditing && offerData ? offerData.duration.replace(' يوم', '') : '');
    const [price, setPrice] = useState(isEditing && offerData ? offerData.amount.replace(',', '') : '');
    const [startDate, setStartDate] = useState('');

    // مراحل المشروع
    const [stages, setStages] = useState(isEditing && offerData?.stages ? offerData.stages : []);

    // المرفقات
    const [attachments, setAttachments] = useState(isEditing && offerData?.attachments ? offerData.attachments : []);

    // إضافة مرحلة جديدة
    const addStage = () => {
        setStages([...stages, { id: Date.now(), name: '', duration: '' }]);
    };

    // تعديل حقل في مرحلة
    const handleStageChange = (id, field, value) => {
        setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // حذف مرحلة
    const removeStage = (id) => {
        setStages(stages.filter(s => s.id !== id));
    };

    // إضافة مرفق جديد
    const addAttachment = () => {
        setAttachments([...attachments, { id: Date.now(), type: '', title: '', file: null }]);
    };

    // تعديل حقل في مرفق
    const handleAttachmentChange = (id, field, value) => {
        setAttachments(attachments.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    // حذف مرفق
    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    // تقديم / تحديث العرض
    const handleSubmit = (e) => {
        e.preventDefault();
        const offerDataPayload = {
            tender,
            projectTitle,
            duration: `${duration} يوم`,
            price: `${parseInt(price).toLocaleString()}`,
            startDate,
            stages,
            attachments
        };
        console.log(isEditing ? '✅ تم تحديث العرض:' : '✅ تم تقديم العرض:', offerDataPayload);
        alert(isEditing ? '✅ تم تحديث العرض بنجاح!' : '✅ تم تقديم عرضك بنجاح!');
        onBack();
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            {/* زر العودة */}
            <button
                onClick={onBack}
                className="btn btn-link text-decoration-none mb-4 p-0 d-inline-flex align-items-center gap-2 fw-bold"
                style={{ color: '#1b2a47', fontSize: '20px' }}
            >
                <FaChevronRight /> {isEditing ? 'العودة للعروض' : 'العودة لتفاصيل المناقصة'}
            </button>

            <div className="card-provider p-4 p-md-5 bg-white mb-5">
                {/* رأس الواجهة */}
                <div className="text-center mb-5">
                    <div className="bg-light rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                        {isEditing ? (
                            <FaEdit className="fs-2" style={{ color: '#1b2a47' }} />
                        ) : (
                            <FaPaperPlane className="fs-2" style={{ color: '#ff8a00' }} />
                        )}
                    </div>
                    <h3 className="fw-bold" style={{ color: '#1b2a47', fontSize: '28px' }}>
                        {isEditing ? 'تعديل العرض' : 'تقديم عرض جديد'}
                    </h3>
                    <p className="text-muted fw-bold fs-5 mb-1">
                        {isEditing ? `تعديل عرضك على مناقصة: ${tender?.title}` : `لمناقصة: ${tender?.title}`}
                    </p>
                    {isEditing && (
                        <span className="badge-pending rounded-pill px-4 py-2 fs-6 d-inline-block mt-2">
                            <FaEdit className="ms-1" /> وضع التعديل
                        </span>
                    )}
                    <hr className="text-muted my-4" style={{ opacity: '0.15' }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* 1. عنوان المشروع */}
                        <div className="col-12">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaHardHat className="ms-2 text-warning" />عنوان المشروع
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg p-4 bg-light border"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                placeholder="أدخل عنوان المشروع"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* 2. المدة الزمنية */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaClock className="ms-2 text-warning" />المدة الزمنية
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control form-control-lg p-4 bg-light border"
                                    style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px 0 0 12px' }}
                                    placeholder="مثل: 30"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                />
                                <span className="input-group-text fw-bold p-4 bg-light border"
                                    style={{ borderRadius: '0 12px 12px 0', fontSize: '16px', color: '#1b2a47' }}>
                                    يوم
                                </span>
                            </div>
                        </div>

                        {/* 3. السعر */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaMoneyBillWave className="ms-2 text-success" />السعر
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control form-control-lg p-4 bg-light border"
                                    style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px 0 0 12px' }}
                                    placeholder="مثل: 50000"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                                <span className="input-group-text fw-bold p-4 bg-light border"
                                    style={{ borderRadius: '0 12px 12px 0', fontSize: '16px', color: '#1b2a47' }}>
                                    ل.س
                                </span>
                            </div>
                        </div>

                        {/* 4. تاريخ بدء العمل */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaCalendarAlt className="ms-2 text-danger" />تاريخ بدء العمل
                            </label>
                            <input
                                type="date"
                                className="form-control form-control-lg p-4 bg-light border"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* 5. مراحل المشروع */}
                        <div className="col-12 mt-5">
                            <div className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-light border mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <FaProjectDiagram className="fs-3" style={{ color: '#1b2a47' }} />
                                    <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '22px' }}>مراحل المشروع</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white"
                                    style={{ backgroundColor: '#1b2a47', fontSize: '18px' }}
                                    onClick={addStage}
                                >
                                    <FaPlus /> إضافة مرحلة
                                </button>
                            </div>

                            {stages.length === 0 && (
                                <div className="text-center p-5 rounded-4 border border-dashed mb-4" style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                                    <FaProjectDiagram className="fs-1 text-muted mb-3" style={{ opacity: '0.4' }} />
                                    <p className="fw-bold text-muted m-0" style={{ fontSize: '18px' }}>
                                        لم تقم بإضافة أي مرحلة بعد. اضغط على "إضافة مرحلة" للبدء.
                                    </p>
                                </div>
                            )}

                            {stages.map((stage, index) => (
                                <div
                                    key={stage.id}
                                    className="row g-3 p-4 mt-0 mb-3 rounded-4 align-items-end"
                                    style={{ border: '2px dashed #cbd5e1', backgroundColor: '#fafafa' }}
                                >
                                    {/* رقم المرحلة */}
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span
                                                className="badge rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                                style={{ backgroundColor: '#ff8a00', width: '32px', height: '32px', fontSize: '14px' }}
                                            >
                                                {index + 1}
                                            </span>
                                            <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '16px' }}>
                                                المرحلة {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* اسم المرحلة */}
                                    <div className="col-md-5">
                                        <label className="form-label fw-bold mb-2" style={{ fontSize: '16px', color: '#1b2a47' }}>
                                            اسم المرحلة
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control p-3 bg-light"
                                            style={{ borderRadius: '12px', fontSize: '16px' }}
                                            placeholder="مثل: أعمال الأساسات"
                                            value={stage.name}
                                            onChange={(e) => handleStageChange(stage.id, 'name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* المدة الزمنية للمرحلة */}
                                    <div className="col-md-5">
                                        <label className="form-label fw-bold mb-2" style={{ fontSize: '16px', color: '#1b2a47' }}>
                                            المدة الزمنية للانتهاء
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control p-3 bg-light"
                                                style={{ borderRadius: '12px 0 0 12px', fontSize: '16px' }}
                                                placeholder="مثل: 10"
                                                value={stage.duration}
                                                onChange={(e) => handleStageChange(stage.id, 'duration', e.target.value)}
                                                required
                                            />
                                            <span className="input-group-text fw-bold bg-light"
                                                style={{ borderRadius: '0 12px 12px 0', fontSize: '14px', color: '#1b2a47' }}>
                                                يوم
                                            </span>
                                        </div>
                                    </div>

                                    {/* زر حذف المرحلة */}
                                    <div className="col-md-2 text-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger p-3 w-100 d-flex align-items-center justify-content-center gap-2"
                                            style={{ borderRadius: '12px', fontSize: '16px' }}
                                            onClick={() => removeStage(stage.id)}
                                        >
                                            <FaTrash /> حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 6. المرفقات - ملفات وصور */}
                        <div className="col-12 mt-4">
                            <div className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-light border">
                                <div className="d-flex align-items-center gap-3">
                                    <FaFileAlt className="fs-3" style={{ color: '#ff8a00' }} />
                                    <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '22px' }}>الملفات والصور</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white"
                                    style={{ backgroundColor: '#ff8a00', fontSize: '18px' }}
                                    onClick={addAttachment}
                                >
                                    <FaPlus /> إضافة ملف
                                </button>
                            </div>

                            {attachments.length === 0 && (
                                <div className="text-center p-4 rounded-4 border mt-3" style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                                    <FaFileAlt className="fs-1 text-muted mb-2" style={{ opacity: '0.3' }} />
                                    <p className="text-muted fw-bold m-0">لم تقم بإضافة أي ملفات أو صور بعد.</p>
                                </div>
                            )}

                            {attachments.map((att) => (
                                <div
                                    key={att.id}
                                    className="row g-3 p-4 mt-3 rounded-4 align-items-end"
                                    style={{ border: '2px dashed #cbd5e1' }}
                                >
                                    {/* نوع المرفق (صورة/ملف) */}
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold mb-2" style={{ fontSize: '15px', color: '#1b2a47' }}>
                                            النوع
                                        </label>
                                        <select
                                            className="form-select p-3 bg-light"
                                            style={{ borderRadius: '12px', fontSize: '16px' }}
                                            value={att.type}
                                            onChange={(e) => handleAttachmentChange(att.id, 'type', e.target.value)}
                                            required
                                        >
                                            <option value="">اختر النوع...</option>
                                            <option value="image">صورة</option>
                                            <option value="file">ملف</option>
                                        </select>
                                    </div>

                                    {/* عنوان المرفق */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold mb-2" style={{ fontSize: '15px', color: '#1b2a47' }}>
                                            عنوان الملف
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control p-3 bg-light"
                                            style={{ borderRadius: '12px', fontSize: '16px' }}
                                            placeholder={att.type === 'image' ? 'مثال: صورة الواجهة' : 'مثال: مخطط المشروع'}
                                            value={att.title}
                                            onChange={(e) => handleAttachmentChange(att.id, 'title', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* رفع الملف */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold mb-2" style={{ fontSize: '15px', color: '#1b2a47' }}>
                                            رفع {att.type === 'image' ? 'صورة' : 'ملف'}
                                        </label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="file"
                                                className="form-control p-3 bg-light"
                                                style={{ borderRadius: '12px', fontSize: '15px' }}
                                                accept={att.type === 'image' ? 'image/*' : att.type === 'file' ? '.pdf,.doc,.docx,.xlsx,.zip' : '*'}
                                                disabled={!att.type}
                                                onChange={(e) => handleAttachmentChange(att.id, 'file', e.target.files[0])}
                                                required={!!att.type}
                                            />
                                            {att.type === 'image' && (
                                                <FaImage className="ms-2 fs-4 text-primary" />
                                            )}
                                            {att.type === 'file' && (
                                                <FaFilePdf className="ms-2 fs-4 text-danger" />
                                            )}
                                        </div>
                                    </div>

                                    {/* زر حذف المرفق */}
                                    <div className="col-md-1 text-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger p-3 w-100"
                                            style={{ borderRadius: '12px' }}
                                            onClick={() => removeAttachment(att.id)}
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                        {/* 7. زر تقديم / تحديث العرض */}
                        <div className="col-12 mt-3 text-center">
                            <button
                                type="submit"
                                className={`d-inline-flex align-items-center justify-content-center gap-3 py-3 px-5 shadow-lg`}
                                style={{
                                    fontSize: '24px',
                                    minWidth: '350px',
                                    backgroundColor: isEditing ? '#1b2a47' : '#ff8a00',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '50px',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isEditing ? <><FaEdit /> تحديث العرض</> : <><FaPaperPlane /> تقديم العرض</>}
                            </button>
                            <p className="text-muted fw-bold mt-3" style={{ fontSize: '15px' }}>
                                {isEditing
                                    ? 'بتحديثك للعرض، سيتم إعادة تقييمه من قبل العميل.'
                                    : 'بتقديمك للعرض، أنت توافق على شروط وأحكام المنصة.'}
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .border-dashed { border-style: dashed !important; }
                input[type="date"] { min-height: 56px; }
                .form-control:focus, .form-select:focus {
                    border-color: #ff8a00 !important;
                    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15) !important;
                }
            `}</style>
        </div>
    );
};

export default SubmitOffer;

