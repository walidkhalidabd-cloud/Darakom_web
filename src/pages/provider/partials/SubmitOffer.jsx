import { useState } from 'react';
import {
    FaChevronRight, FaClock, FaMoneyBillWave, FaCalendarAlt,
    FaPaperPlane, FaFileAlt, FaEdit, FaSpinner
} from 'react-icons/fa';
import { submitOffer, updateOffer } from '../../../services/api/providerApi';
import './provider-tabs.css';

const SubmitOffer = ({ tender, onBack, isEditing, offerData }) => {
    const [duration, setDuration] = useState(isEditing && offerData ? offerData.duration : '');
    const [durationUnit, setDurationUnit] = useState(isEditing && offerData ? offerData.duration_unit : 'day');
    const [price, setPrice] = useState(isEditing && offerData ? String(offerData.cost || offerData.amount || '').replace(/,/g, '') : '');
    const [providerComment, setProviderComment] = useState(isEditing && offerData ? offerData.provider_comment || '' : '');
    const [details, setDetails] = useState(isEditing && offerData ? offerData.details || '' : '');
    const [saving, setSaving] = useState(false);

    const projectId = tender?.id || tender?.project?.id || tender?.project_id || offerData?.project_id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            cost: price,
            duration,
            duration_unit: durationUnit,
            provider_comment: providerComment,
            details: details
        };
        try {
            if (isEditing) {
                await updateOffer(offerData.id, payload);
                alert('✅ تم تحديث العرض بنجاح!');
            } else {
                await submitOffer(projectId, payload);
                alert('✅ تم تقديم عرضك بنجاح!');
            }
            onBack();
        } catch (err) {
            console.error('فشل الإرسال:', err.message);
            alert('⚠️ تعذر إرسال العرض. تأكد من تسجيل الدخول وحاول مجدداً.');
        } finally {
            setSaving(false);
        }
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
                        {isEditing ? `تعديل عرضك على مناقصة: ${tender?.project?.title || tender?.title}` : `لمناقصة: ${tender?.project?.title || tender?.title}`}
                    </p>
                    <hr className="text-muted my-4" style={{ opacity: '0.15' }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* 1. المدة الزمنية */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaClock className="ms-2 text-warning" />المدة الزمنية
                            </label>
                            <input
                                type="number"
                                className="form-control form-control-lg p-4 bg-light border"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                placeholder="مثل: 30"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>

                        {/* 2. وحدة المدة */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaCalendarAlt className="ms-2 text-danger" />وحدة المدة
                            </label>
                            <select
                                className="form-select form-select-lg p-4 bg-light border"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                            >
                                <option value="day">يوم</option>
                                <option value="hour">ساعة</option>
                            </select>
                        </div>

                        {/* 3. السعر */}
                        <div className="col-md-6">
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

                        {/* 4. تعليق المزود */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaFileAlt className="ms-2 text-warning" />تعليق المزود
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg p-4 bg-light border"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                placeholder="أي ملاحظات إضافية..."
                                value={providerComment}
                                onChange={(e) => setProviderComment(e.target.value)}
                            />
                        </div>

                        {/* 5. التفاصيل */}
                        <div className="col-12">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '20px', color: '#1b2a47' }}>
                                <FaFileAlt className="ms-2 text-warning" />تفاصيل العرض
                            </label>
                            <textarea
                                className="form-control form-control-lg p-4 bg-light border"
                                rows="4"
                                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                placeholder="اكتب تفاصيل العرض..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            ></textarea>
                        </div>

                        <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                        {/* 6. زر تقديم / تحديث العرض */}
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
                                disabled={saving}
                            >
                                {saving ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : isEditing ? <><FaEdit /> تحديث العرض</> : <><FaPaperPlane /> تقديم العرض</>}
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
                .form-control:focus, .form-select:focus {
                    border-color: #ff8a00 !important;
                    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15) !important;
                }
            `}</style>
        </div>
    );
};

export default SubmitOffer;
