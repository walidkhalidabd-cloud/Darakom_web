import { useState } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, FaUserTie, FaHardHat } from 'react-icons/fa';

const ComplaintsTab = () => {
    // بيانات وهمية للشكاوي المقدمة مع حالتها المختلفة
    const [complaints] = useState([
        {
            id: 1,
            providerName: 'مؤسسة البناء الذهبي',
            projectTitle: 'بناء عظم - مساحة 400م',
            date: '2026/06/15',
            status: 'pending', // قيد المراجعة
            description: 'المقاول تأخر في تسليم المرحلة الثانية (بناء الأعمدة) لمدة تزيد عن أسبوعين دون عذر مبرر، ولم يستجب للمكالمات.',
            adminReply: null // لم يتم الرد بعد
        },
        {
            id: 2,
            providerName: 'شركة أطياف للتشطيبات',
            projectTitle: 'تشطيب شقة 150م',
            date: '2026/04/10',
            status: 'resolved', // تم الحل
            description: 'يوجد اختلاف في نوعية السيراميك الموردة عن ما تم الاتفاق عليه في العقد الأساسي للمشروع.',
            adminReply: 'تم التواصل مع الشركة المنفذة وإلزامهم بتغيير السيراميك للنوع المتفق عليه وتحمل تكاليف النقل. تم إغلاق الشكوى بنجاح لحفظ حقكم.'
        },
        {
            id: 3,
            providerName: 'مكتب الإبداع الهندسي',
            projectTitle: 'تصميم داخلي لفيلا',
            date: '2025/12/05',
            status: 'rejected', // مرفوضة
            description: 'المهندس يطلب مبلغاً إضافياً لتعديل المخطط للمرة الرابعة رغم أننا لم نعتمد المخطط النهائي بعد.',
            adminReply: 'بعد مراجعة العقد المبرم بينكم، وجدنا أن بند التعديلات المجانية يقتصر على 3 مرات فقط. طلب المهندس قانوني ومطابق للشروط المتفق عليها.'
        }
    ]);

    // دالة ذكية لإرجاع شكل ولون حالة الشكوى
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 shadow-sm"><FaClock className="me-1"/> قيد المراجعة</span>;
            case 'resolved': 
                return <span className="badge bg-success px-3 py-2 rounded-pill fs-6 shadow-sm"><FaCheckCircle className="me-1"/> تم الحل</span>;
            case 'rejected': 
                return <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 shadow-sm"><FaTimesCircle className="me-1"/> مغلقة (مرفوضة)</span>;
            default: 
                return null;
        }
    };

    // دالة لإرجاع لون الحدود للبطاقة حسب الحالة
    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'resolved': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return '';
        }
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الواجهة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل الشكاوى <FaExclamationTriangle className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold">متابعة حالة الشكاوى التي قمت برفعها للإدارة ضد مزودي الخدمة.</p>
                </div>
            </div>

            {/* عرض بطاقات الشكاوى */}
            <div className="d-flex flex-column gap-4">
                {complaints.length > 0 ? complaints.map(complaint => (
                    <div key={complaint.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(complaint.status)}`}>
                        
                        {/* رقم التذكرة والحالة */}
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة رقم: #{complaint.id + 1000}</h5>
                            {getStatusBadge(complaint.status)}
                        </div>
                        
                        {/* معلومات الجهة والمشروع */}
                        <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                            <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-2">
                                <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                <div>
                                    <span className="text-muted small fw-bold d-block">الجهة المشتكى عليها</span>
                                    <span className="fw-bold text-dark fs-5">{complaint.providerName}</span>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex align-items-center gap-2 border-start ps-md-4">
                                <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                <div>
                                    <span className="text-muted small fw-bold d-block">المشروع المرتبط</span>
                                    <span className="fw-bold text-dark fs-5">{complaint.projectTitle}</span>
                                </div>
                            </div>
                        </div>

                        {/* نص الشكوى */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-danger mb-2">وصف المشكلة:</h6>
                            <p className="text-dark fw-semibold fs-5" style={{ lineHeight: '1.8' }}>{complaint.description}</p>
                        </div>

                        {/* رد الإدارة (يظهر فقط إذا كان موجوداً) */}
                        {complaint.adminReply ? (
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="me-1" /> رد إدارة داركم:</h6>
                                <p className="text-dark fw-semibold mb-0" style={{ lineHeight: '1.8', fontSize: '18px' }}>{complaint.adminReply}</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                                <p className="text-warning-emphasis fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaClock size={20} /> جاري مراجعة الشكوى من قبل الإدارة وسيتم الرد قريباً.
                                </p>
                            </div>
                        )}

                        {/* تاريخ التقديم */}
                        <div className="text-end mt-4 pt-3 border-top text-muted small fw-bold">
                            تاريخ التقديم: {complaint.date}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-5">
                        <FaExclamationTriangle className="text-muted mb-3 opacity-25" size={50} />
                        <h4 className="text-muted fw-bold">سجل الشكاوى الخاص بك فارغ.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintsTab;