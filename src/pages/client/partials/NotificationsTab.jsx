import { useState } from 'react';
import { FaBell, FaCheckCircle, FaFileInvoiceDollar, FaEnvelopeOpenText, FaInfoCircle } from 'react-icons/fa';

const NotificationsTab = () => {
    // بيانات وهمية للإشعارات مع حالة (isRead) لمعرفة هل الإشعار مقروء أم جديد
    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            type: 'offer', 
            title: 'عرض سعر جديد!', 
            text: 'تلقيت عرض سعر جديد من "مؤسسة البناء الذهبي" لمشروع بناء عظم.', 
            time: 'منذ ساعتين', 
            isRead: false // إشعار جديد
        },
        { 
            id: 2, 
            type: 'update', 
            title: 'تحديث حالة المشروع', 
            text: 'قام المقاول بتحديث نسبة الإنجاز في مشروع "بناء عظم - 400م" إلى 65%.', 
            time: 'منذ 5 ساعات', 
            isRead: false // إشعار جديد
        },
        { 
            id: 3, 
            type: 'system', 
            title: 'الموافقة على الحساب', 
            text: 'تمت مراجعة أوراقك والموافقة على حسابك كعميل موثوق في منصة داركم.', 
            time: 'أمس', 
            isRead: true // إشعار مقروء
        },
        { 
            id: 4, 
            type: 'system', 
            title: 'تذكير: تقييم مشروع منتهي', 
            text: 'يرجى تقييم أداء "مكتب الإبداع الهندسي" في مشروع التصميم الداخلي المنتهي.', 
            time: 'منذ 3 أيام', 
            isRead: true // إشعار مقروء
        }
    ]);

    // دالة تحويل جميع الإشعارات إلى مقروءة
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    // دالة لاختيار الأيقونة واللون بناءً على نوع الإشعار
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'offer': return <div className="bg-warning bg-opacity-25 text-warning p-3 rounded-circle"><FaFileInvoiceDollar size={24} /></div>;
            case 'update': return <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle"><FaEnvelopeOpenText size={24} /></div>;
            case 'system': return <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle"><FaCheckCircle size={24} /></div>;
            default: return <div className="bg-secondary bg-opacity-10 text-secondary p-3 rounded-circle"><FaInfoCircle size={24} /></div>;
        }
    };

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة وزر تحديد الكل كمقروء */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                <div className="d-flex align-items-center gap-3">
                    <h3 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                        <FaBell className="text-warning" /> الإشعارات
                    </h3>
                    {unreadCount > 0 && (
                        <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">{unreadCount} جديد</span>
                    )}
                </div>
                
                <button 
                    className="btn btn-outline-secondary fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2"
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
                            // جعل الإشعار مقروءاً عند الضغط عليه منفرداً
                            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                        }}
                    >
                        {getNotificationIcon(notif.type)}
                        
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <h5 className={`fw-bold mb-0 ${notif.isRead ? 'text-secondary' : 'text-dark'}`}>{notif.title}</h5>
                                <span className="text-muted small fw-bold">{notif.time}</span>
                            </div>
                            <p className="text-muted mb-0 fw-semibold mt-2" style={{ fontSize: '18px' }}>{notif.text}</p>
                        </div>
                        
                        {!notif.isRead && (
                            <span className="badge bg-danger rounded-pill mt-2">جديد</span>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-5">
                        <FaBell className="text-muted mb-3 opacity-25" size={50} />
                        <h4 className="text-muted fw-bold">لا توجد إشعارات حالياً</h4>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default NotificationsTab;