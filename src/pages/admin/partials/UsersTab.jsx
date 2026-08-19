import { useState, useEffect } from 'react';
import {
  FaUserPlus, FaUsers, FaSearch, FaEdit, FaTrashAlt,
  FaBan, FaCheckCircle, FaUserTie, FaBuilding, FaHardHat,
  FaWrench, FaSpinner, FaSave, FaTimes
} from 'react-icons/fa';
import {
  fetchAdminUsers, createAdminUser, updateAdminUser,
  deleteAdminUser, toggleUserStatus
} from '../../../services/api/adminApi';
import './admin-tabs.css';

const typeLabels = {
  client: 'عميل',
  engineer: 'مهندس',
  office: 'مكتب',
  contractor: 'مقاول',
  craftsman: 'حرفي',
  provider: 'مزود خدمة'
};

const typeIcons = {
  client: <FaUserTie />,
  engineer: <FaHardHat />,
  office: <FaBuilding />,
  contractor: <FaWrench />,
  craftsman: <FaUsers />,
  provider: <FaUsers />
};

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', type: 'client', password: ''
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminUsers();
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (err) {
        console.warn("خطأ في جلب المستخدمين", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const openAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', type: 'client', password: '' });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    // التعامل الآمن مع البيانات سواء كانت داخل Model User أو Model Profile
    const displayFullName = user.user?.name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '';
    const displayEmail = user.user?.email || user.email || '';
    const displayPhone = user.user?.phone || user.phone || '';
    const displayType = user.user?.type || user.type || user.role?.name || 'client';
    
    setFormData({ name: displayFullName, email: displayEmail, phone: displayPhone, type: displayType, password: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('error', 'يرجى تعبئة الاسم والبريد الإلكتروني');
      return;
    }
    
    const safeUsersList = Array.isArray(users) ? users : [];

    try {
      if (editingUser) {
        await updateAdminUser(editingUser.id, formData);
        setUsers(safeUsersList.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        showToast('success', '✅ تم تعديل بيانات المستخدم بنجاح');
      } else {
        const res = await createAdminUser(formData);
        const newUser = res.data?.data || { id: Date.now(), ...formData, status: 'active', created_at: new Date().toISOString() };
        setUsers([newUser, ...safeUsersList]);
        showToast('success', '✅ تم إضافة المستخدم بنجاح');
      }
    } catch {
      showToast('error', 'حدث خطأ أثناء حفظ البيانات');
    }
    setShowModal(false);
  };

  const handleToggleStatus = async (user) => {
    const currentStatus = user.user?.status || user.status;
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const safeUsersList = Array.isArray(users) ? users : [];
    try {
      await toggleUserStatus(user.id);
      setUsers(safeUsersList.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      showToast('info', newStatus === 'blocked' ? `تم حظر الحساب` : `تم تفعيل الحساب`);
    } catch {
      showToast('error', 'حدث خطأ أثناء تغيير الحالة');
    }
  };

  const handleDelete = async (user) => {
    const displayFullName = user.user?.name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'هذا المستخدم';
    if (!window.confirm(`هل أنت متأكد من حذف ${displayFullName}؟`)) return;
    
    const safeUsersList = Array.isArray(users) ? users : [];
    try {
      await deleteAdminUser(user.id);
      setUsers(safeUsersList.filter(u => u.id !== user.id));
      showToast('success', '✅ تم حذف المستخدم بنجاح');
    } catch {
      showToast('error', 'حدث خطأ أثناء الحذف');
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(u => {
    const userName = (u.user?.name || u.name || `${u.first_name || ''} ${u.last_name || ''}`).trim() || '';
    const userEmail = u.user?.email || u.email || '';
    const uType = u.user?.type || u.type || u.role?.name || 'client';

    const matchSearch = userName.toLowerCase().includes(search.toLowerCase()) || 
                        userEmail.toLowerCase().includes(search.toLowerCase());
                        
    const matchType = typeFilter === 'all' || uType === typeFilter;
    
    return matchSearch && matchType;
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="admin-section-header">
        <div>
          <h3><FaUsers className="ms-2 text-warning" /> إدارة حسابات المستخدمين</h3>
          <p>إضافة وتعديل وحظر وحذف حسابات المستخدمين في المنصة.</p>
        </div>
        <button className="btn-admin-orange d-inline-flex align-items-center gap-2" onClick={openAdd}>
          <FaUserPlus /> إضافة مستخدم
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-admin"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: '45px' }}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>
          <div className="col-md-6">
            <select className="form-control form-control-admin" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">كل الأنواع</option>
              <option value="client">عملاء</option>
              <option value="provider">مزودي خدمة</option>
              <option value="engineer">مهندسين</option>
              <option value="office">مكاتب</option>
              <option value="contractor">مقاولين</option>
              <option value="craftsman">حرفيين</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table admin-table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>النوع</th>
                  <th>رقم الهاتف</th>
                  <th>تاريخ الانضمام</th>
                  <th>الحالة</th>
                  <th className="text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const displayFullName = (user.user?.name || user.name || `${user.first_name || ''} ${user.last_name || ''}`).trim() || 'بدون اسم';
                  const displayType = user.user?.type || user.type || user.role?.name || 'client';
                  const displayPhone = user.user?.phone || user.phone || 'غير متوفر';
                  const displayEmail = user.user?.email || user.email || 'بدون بريد';
                  const displayDate = user.created_at ? String(user.created_at).split('T')[0] : (user.joined || 'غير معروف');
                  const displayStatus = user.user?.status || user.status || 'active';

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#1b2a47,#ff8a00)' }}>
                            {displayFullName.charAt(0) || 'م'}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{displayFullName}</div>
                            <div className="text-muted small fw-semibold" dir="ltr">{displayEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark fw-bold d-inline-flex align-items-center gap-1" style={{ fontSize: '14px', padding: '6px 12px' }}>
                          {typeIcons[displayType] || <FaUserTie />} {typeLabels[displayType] || displayType}
                        </span>
                      </td>
                      <td className="fw-semibold text-muted" dir="ltr">{displayPhone}</td>
                      <td className="fw-semibold text-muted">{displayDate}</td>
                      <td>
                        {displayStatus === 'active' ? (
                          <span className="admin-badge admin-badge-active"><FaCheckCircle /> نشط</span>
                        ) : (
                          <span className="admin-badge admin-badge-blocked"><FaBan /> محظور</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary" title="تعديل" onClick={() => openEdit(user)}>
                            <FaEdit />
                          </button>
                          <button
                            className={`btn btn-sm ${displayStatus === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} `}
                            title={displayStatus === 'active' ? 'حظر' : 'تفعيل'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {displayStatus === 'active' ? <FaBan /> : <FaCheckCircle />}
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="حذف" onClick={() => handleDelete(user)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <FaUsers size={50} />
            <h5>لا يوجد مستخدمون مطابقون</h5>
            <p>جرّب تعديل البحث أو التصفية.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header py-3" style={{ backgroundColor: '#1b2a47', color: 'white' }}>
                <h5 className="modal-title fw-bold">
                  {editingUser ? <><FaEdit className="ms-2" /> تعديل مستخدم</> : <><FaUserPlus className="ms-2" /> إضافة مستخدم جديد</>}
                </h5>
                <button className="btn btn-sm text-white" onClick={() => setShowModal(false)}><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الاسم الكامل</label>
                      <input className="form-control form-control-admin" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">رقم الهاتف</label>
                      <input className="form-control form-control-admin" value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">البريد الإلكتروني</label>
                      <input type="email" className="form-control form-control-admin" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">النوع</label>
                      <select className="form-control form-control-admin" value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}>
                        <option value="client">عميل</option>
                        <option value="engineer">مهندس</option>
                        <option value="office">مكتب</option>
                        <option value="contractor">مقاول</option>
                        <option value="craftsman">حرفي</option>
                      </select>
                    </div>
                    {!editingUser && (
                      <div className="col-12">
                        <label className="form-label fw-bold">كلمة المرور المؤقتة</label>
                        <input type="password" className="form-control form-control-admin" value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="اتركها فارغة لإنشاء كلمة افتراضية" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0 pb-4">
                  <button type="button" className="btn btn-link fw-bold" onClick={() => setShowModal(false)}>إلغاء</button>
                  <button type="submit" className="btn-admin-orange d-inline-flex align-items-center gap-2">
                    <FaSave /> {editingUser ? 'حفظ التعديلات' : 'إضافة المستخدم'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;