import { useState, useEffect } from 'react';
import { 
  FaBell, FaCheckCircle, FaFileInvoiceDollar, 
  FaInfoCircle, FaHardHat, FaTimes, FaSearchDollar,
  FaStar, FaExclamationTriangle
} from 'react-icons/fa';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderNotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // تحميل الإشعارات من API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchNotifications();
        setNotifications(response.data?.data || []);
      } catch (err) {
        console.warn('⚠️ API غير متاح:', err.message);
        // بيانات وهمية
        setNotifications([
          { id: 1, type: 'tender', title: 'مناقصة جديدة متاحة!', text: 'تم نشر مناقصة جديدة بعنوان "تشطيب فيلا فاخرة - 500م" في الرياض.', time: 'منذ 10 دقائق', is_read: false },
          { id: 2, type: 'offer', title: 'تحديث حالة العرض', text: 'تم قبول عرضك في مشروع "بناء عظم - مساحة 400م" من قبل العميل أحمد سليمان.', time: 'منذ ساعتين', is_read: false },
          { id: 3, type: 'project', title: 'تحديث مرحلة المشروع', text: 'قام العميل خالد عبدالله بتأكيد إنجاز المرحلة الأولى.', time: 'منذ 5 ساعات', is_read: false },
          { id: 4, type: 'review', title: 'تقييم جديد', text: 'حصلت على تقييم 5 نجوم من العميل سارة ن.', time: 'أمس', is_read: true },
          { id: 5, type: 'system', title: 'تم توثيق حسابك', text: 'تمت مراجعة مستنداتك والموافقة عليها.', time: 'منذ 3 أيام', is_read: true },
          { id: 6, type: 'complaint', title: 'تم استلام شكوى', text: 'قام أحد العملاء بتقديم شكوى ضدك.', time: 'منذ أسبوع', is_read: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch (err) { /* ignore */ }
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    showToast('success', '✅ تم تحديد الكل كمقروء');
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
    } catch (err) { /* ignore */ }
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
    } catch (err) { /* ignore */ }
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('info', '🗑️ تم حذف الإشعار');
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'tender': return <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle"><FaSearchDollar size={24} /></div>;
      case 'offer': return <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle"><FaFileInvoiceDollar size={24} /></div>;
      case 'project': return <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle"><FaHardHat size={24} /></div>;
      case 'review': return <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle"><FaStar size={24} /></div>;
      case 'complaint': return <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle"><FaExclamationTriangle size={24} /></div>;
      default: return <div className="bg-secondary bg-opacity-10 text-secondary p-3 rounded-circle"><FaInfoCircle size={24} /></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="section-header"><div><h3><FaBell className="ms-2 text-warning" /> الإشعارات</h3></div></div>
        {[1,2,3,4].map(i => (
          <div key={i} className="card-provider p-4 mb-3">
            <div className="loading-skeleton" style={{ width: '60%', height: '22px' }}></div>
            <div className="loading-skeleton mt-2" style={{ width: '90%', height: '18px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '1000px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="section-header">
        <div className="d-flex align-items-center gap-3">
          <h3><FaBell className="ms-2 text-warning" /> الإشعارات</h3>
          {unreadCount > 0 && <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">{unreadCount} جديد</span>}
        </div>
        <button className="btn-provider-outline d-flex align-items-center gap-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <FaCheckCircle /> تحديد الكل كمقروء
        </button>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 mb-4 d-flex align-items-center gap-3">
          <FaExclamationTriangle /> <strong>{error}</strong>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {notifications.length > 0 ? notifications.map(n => (
          <div key={n.id} className={`card-provider d-flex align-items-start gap-3 p-4 ${!n.is_read ? 'bg-white shadow-sm border-end border-4 border-warning' : 'bg-light opacity-75 border'}`}
            style={{ cursor: 'pointer' }} onClick={() => markAsRead(n.id)}>
            
            <button className="btn btn-sm btn-light text-muted position-absolute top-0 start-0 mt-2 ms-2 rounded-circle" onClick={(e) => handleDelete(e, n.id)}
              style={{ width: '30px', height: '30px' }} title="حذف"><FaTimes size={12} /></button>

            {getIcon(n.type)}

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className={`fw-bold mb-0 ${n.is_read ? 'text-secondary' : 'text-dark'}`}>{n.title}</h5>
                <span className="text-muted small fw-bold">{n.time}</span>
              </div>
              <p className="text-muted mb-0 mt-2 fw-semibold" style={{ lineHeight: '1.7' }}>{n.text}</p>
            </div>

            {!n.is_read && <span className="badge bg-danger rounded-pill px-3 py-2 flex-shrink-0">جديد</span>}
          </div>
        )) : (
          <div className="empty-state">
            <FaBell size={60} />
            <h4>لا توجد إشعارات حالياً</h4>
            <p>ستظهر هنا جميع الإشعارات المتعلقة بعروضك ومشاريعك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderNotificationsTab;

