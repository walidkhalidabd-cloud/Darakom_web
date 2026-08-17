import { useState } from 'react';
import { 
    FaBell, FaCheckCircle, FaFileInvoiceDollar, 
    FaInfoCircle, FaHardHat, FaSearchDollar,
    FaStar, FaExclamationTriangle
} from 'react-icons/fa';

const ProviderNotificationsTab = () => {
    // بيانات وهمية للإشعارات خاصة بمزود الخدمة
    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            type: 'tender', 
            title: 'مناقصة جديدة متاحة!', 
            text: 'تم طرح مناقصة جديدة بعنوان "تشطيب فيلا فاخرة - 500م" تتطابق مع تخصصك.', 
            time: 'منذ 10 دقائق', 
            isRead: false 
        },
        { 
            id: 2, 
            type: 'offer', 
            title: 'تم قبول عرضك!', 
            text: 'لقد وافق العميل "أحمد سليمان" على عرضك المقدم لمشروع "بناء عظم - مساحة 400م".', 
            time: 'منذ ساعتين', 
            isRead: false 
        },
        { 
            id: 3, 
            type: 'project', 
            title: 'تحديث في سير المشروع', 
            text: 'قام العميل "خالد عبدالله" بتأكيد استلام المرحلة الأولى من المشروع بنجاح.', 
            time: 'منذ 5 ساعات', 
            isRead: false 
        },
        { 
            id: 4, 
            type: 'review', 
            title: 'حصلت على تقييم جديد', 
            text: 'لقد قام العميل "سارة ناصر" بإضافة تقييم 5 نجوم لخدماتك. واصل تميزك!', 
            time: 'أمس', 
            isRead: true 
        },
        { 
            id: 5, 
            type: 'system', 
            title: 'توثيق الحساب', 
            text: 'تهانينا! تمت مراجعة أوراقك واعتماد حسابك كمزود خدمة موثوق في منصة داركم.', 
            time: 'منذ 3 أيام', 
            isRead: true 
        },
        { 
            id: 6, 
            type: 'complaint', 
            title: 'إشعار إداري (شكوى)', 
            text: 'تم استلام شكوى بخصوص التأخير في تسليم المشروع، يرجى مراجعة قسم الشكاوى للرد.', 
            time: 'منذ أسبوع', 
            isRead: true 
        }
    ]);

    // دالة تحويل جميع الإشعارات إلى مقروءة
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    // دالة لاختيار الأيقونة واللون بناءً على نوع الإشعار
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'tender': return <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle"><FaSearchDollar size={24} /></div>;
            case 'offer': return <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle"><FaFileInvoiceDollar size={24} /></div>;
            case 'project': return <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle"><FaHardHat size={24} /></div>;
            case 'review': return <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle"><FaStar size={24} /></div>;
            case 'complaint': return <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle"><FaExclamationTriangle size={24} /></div>;
            case 'system': return <div className="bg-secondary bg-opacity-10 text-secondary p-3 rounded-circle"><FaCheckCircle size={24} /></div>;
            default: return <div className="bg-light text-secondary p-3 rounded-circle"><FaInfoCircle size={24} /></div>;
        }
    };

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة وزر تحديد الكل كمقروء */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <h3 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                        <FaBell className="text-warning" /> الإشعارات
                    </h3>
                    {unreadCount > 0 && (
                        <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">{unreadCount} جديد</span>
                    )}
                </div>
                
                <button 
                    className="btn btn-outline-secondary fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                >
                    <FaCheckCircle /> تحديد الكل كمقروء
                </button>
            </div>

            {/* قائمة الإشعارات */}
            <div className="list-group list-group-flush gap-3">
                {notifications.length > 0 ? notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        className={`list-group-item border-0 p-4 rounded-4 d-flex align-items-start gap-4 transition-all ${notif.isRead ? 'bg-light border opacity-75' : 'bg-white shadow-sm border-end border-4 border-warning'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            // جعل الإشعار مقروءاً عند الضغط عليه
                            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                        }}
                    >
                        {getNotificationIcon(notif.type)}
                        
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                                <h5 className={`fw-bold mb-0 ${notif.isRead ? 'text-secondary' : 'text-dark'}`}>{notif.title}</h5>
                                <span className="text-muted small fw-bold">{notif.time}</span>
                            </div>
                            <p className="text-muted mb-0 fw-semibold mt-2" style={{ fontSize: '18px', lineHeight: '1.6' }}>{notif.text}</p>
                        </div>
                        
                        {!notif.isRead && (
                            <span className="badge bg-danger rounded-pill mt-2 flex-shrink-0">جديد</span>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-5">
                        <FaBell className="text-muted mb-3 opacity-25" size={50} />
                        <h4 className="text-muted fw-bold">لا توجد إشعارات حالياً</h4>
                        <p className="text-muted fw-semibold">ستظهر هنا جميع الإشعارات المتعلقة بعروضك ومشاريعك.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ProviderNotificationsTab;