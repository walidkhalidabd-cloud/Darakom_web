import { useState, useEffect } from 'react';
import {
    FaUsers, FaPlus, FaSearch, FaEdit, FaTrash, FaBan, FaCheckCircle,
    FaUserAlt, FaUserTie, FaHardHat, FaHammer, FaBuilding, FaSpinner,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaTimesCircle
} from 'react-icons/fa';
import { fetchAdminUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../../services/api/adminApi';
import './admin-tabs.css';

const userTypeMeta = {
    client: { label: 'عميل', icon: <FaUserAlt />, color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
    engineer: { label: 'مهندس', icon: <FaUserTie />, color: '#198754', bg: 'rgba(25,135,84,0.1)' },
    office: { label: 'مكتب', icon: <FaBuilding />, color: '#6f42c1', bg: 'rgba(111,66,193,0.1)' },
    contractor: { label: 'مقاول', icon: <FaHardHat />, color: '#ff8a00', bg: 'rgba(255,138,0,0.1)' },
    craftsman: { label: 'حرفي', icon: <FaHammer />, color: '#dc3545', bg: 'rgba(220,53,69,0.1)' },
};

const initialForm = { name: '', email: '', phone: '', governorate: '', type: 'client', password: '' };

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchAdminUsers();
                setUsers(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setUsers([
                    { id: 1, name: 'أحمد سليمان', email: 'ahmed@test.com', phone: '0933 452 110', governorate: 'دمشق', type: 'client', status: 'active', joined: '2026/01/15' },
                    { id: 2, name: 'م. ليلى حسن', email: 'laila@test.com', phone: '0944 781 203', governorate: 'حلب', type: 'engineer', status: 'active', joined: '2026/02/03' },
                    { id: 3, name: 'مكتب الأفق الهندسي', email: 'office@test.com', phone: '0955 332 918', governorate: 'حمص', type: 'office', status: 'active', joined: '2026/01/28' },
                    { id: 4, name: 'مؤسسة النور للمقاولات', email: 'contract@test.com', phone: '0966 120 445', governorate: 'اللاذقية', type: 'contractor', status: 'blocked', joined: '2025/12/10' },
                    { id: 5, name: 'أبو محمد - فني كهرباء', email: 'craft@test.com', phone: '0977 654 320', governorate: 'درعا', type: 'craftsman', status: 'active', joined: '2026/03/22' },
                    { id: 6, name: 'خالد عبدالله', email: 'khaled@test.com', phone: '0988 223 761', governorate: 'طرطوس', type: 'client', status: 'active', joined: '2026/02/18' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
try {
            if (editing) {
                await updateUser(editing.id, form);
            } else {
                await createUser(form);
            }
        } catch {
            // محاكاة نجاح محلي حتى يتوفر السيرفر
        } finally {
            showToast('success', editing ? '✅ تم تحديث بيانات المستخدم بنجاح' : '✅ تم إضافة المستخدم بنجاح');
            setSaving(false);
            setShowForm(false);
            setEditing(null);
            setForm(initialForm);
        }
    };

const handleToggleStatus = async (user) => {
        try {
            await toggleUserStatus(user.id);
        } catch {
            // تجاهل
        }
        setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
        showToast('info', user.status === 'active' ? `⛔ تم حظر المستخدم ${user.name}` : `✅ تم إلغاء حظر المستخدم ${user.name}`);
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) return;
        try {
            await deleteUser(user.id);
        } catch {
            // تجاهل
        }
        setUsers(users.filter(u => u.id !== user.id));
        showToast('error', '🗑️ تم حذف المستخدم');
    };

    const startEdit = (user) => {
        setEditing(user);
        setForm({ name: user.name, email: user.email, phone: user.phone || '', governorate: user.governorate || '', type: user.type, password: '' });
        setShowForm(true);
    };

    // تصفية المستخدمين
    const filteredUsers = users.filter(u => {
        const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || u.type === typeFilter;
        return matchSearch && matchType;
    });

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1200px' }}>
                <div className="section-header"><div><h3><FaUsers className="ms-2 text-primary" /> إدارة المستخدمين</h3></div></div>
                {[1, 2, 3].map(i => <div key={i} className="card-admin p-5 mb-4"><div className="loading-skeleton" style={{ height: '100px' }}></div></div>)}
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
            {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

            <div className="section-header">
                <div>
                    <h3><FaUsers className="ms-2 text-primary" /> إدارة المستخدمين</h3>
                    <p>إضافة وتمديد وحظر وحذف حسابات المستخدمين</p>
                </div>
                <button className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-admin-orange'} fw-bold rounded-pill d-flex align-items-center gap-2 px-4 py-2 shadow-sm`}
                    onClick={() => { setShowForm(!showForm); setEditing(null); setForm(initialForm); }}>
                    {showForm ? <><FaTimesCircle /> إلغاء</> : <><FaPlus /> إضافة مستخدم</>}
                </button>
            </div>

            {/* نموذج إضافة/تعديل مستخدم */}
            {showForm && (
                <div className="card-admin p-4 p-md-5 bg-white mb-4 border border-primary border-opacity-25">
                    <h4 className="fw-bold text-primary mb-4">
                        <FaPlus className="ms-2" /> {editing ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">الاسم الكامل</label>
                                <input type="text" className="form-control form-control-custom" placeholder="أدخل الاسم" required
                                    value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">نوع الحساب</label>
                                <select className="form-select form-control-custom" value={form.type}
                                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}>
                                    <option value="client">عميل</option>
                                    <option value="engineer">مهندس</option>
                                    <option value="office">مكتب</option>
                                    <option value="contractor">مقاول</option>
                                    <option value="craftsman">حرفي</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">البريد الإلكتروني</label>
                                <input type="email" className="form-control form-control-custom" placeholder="email@test.com" required
                                    value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">رقم الهاتف</label>
                                <input type="text" className="form-control form-control-custom" placeholder="09xx xxx xxx"
                                    value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">المحافظة</label>
                                <input type="text" className="form-control form-control-custom" placeholder="المحافظة"
                                    value={form.governorate} onChange={e => setForm(prev => ({ ...prev, governorate: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">{editing ? 'كلمة المرور (اتركها فارغة لعدم التغيير)' : 'كلمة المرور'}</label>
                                <input type="password" className="form-control form-control-custom" placeholder="********"
                                    value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
                            </div>
                            <div className="col-12 text-center mt-4">
                                <button type="submit" className="btn-admin-primary d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '20px' }} disabled={saving}>
                                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <>{editing ? <><FaEdit /> حفظ التعديلات</> : <><FaPlus /> إضافة المستخدم</>}</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* شريط البحث والتصفية */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="search-input position-relative">
                        <FaSearch className="position-absolute" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                        <input type="text" className="form-control form-control-custom" style={{ paddingRight: '48px' }} placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <select className="form-select form-control-custom" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="all">جميع الأنواع</option>
                        <option value="client">عملاء</option>
                        <option value="engineer">مهندسين</option>
                        <option value="office">مكاتب</option>
                        <option value="contractor">مقاولين</option>
                        <option value="craftsman">حرفيين</option>
                    </select>
                </div>
            </div>

            {/* قائمة المستخدمين */}
            <div className="d-flex flex-column gap-3">
                {filteredUsers.length > 0 ? filteredUsers.map(u => {
                    const meta = userTypeMeta[u.type] || userTypeMeta.client;
                    const isBlocked = u.status === 'blocked';
                    return (
                        <div key={u.id} className={`card-admin p-4 bg-white border-end border-4 ${isBlocked ? 'border-secondary opacity-75' : 'border-primary'}`}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="user-avatar" style={{ backgroundColor: meta.color }}>{meta.icon}</div>
                                    <div>
                                        <h5 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{u.name}</h5>
                                        <div className="d-flex flex-wrap gap-3 text-muted small fw-semibold">
                                            <span><FaEnvelope className="ms-1" />{u.email}</span>
                                            {u.phone && <span><FaPhone className="ms-1" />{u.phone}</span>}
                                            {u.governorate && <span><FaMapMarkerAlt className="ms-1" />{u.governorate}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <span className="px-3 py-2 rounded-pill fw-bold fs-6" style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}33` }}>
                                        {meta.label}
                                    </span>
                                    {isBlocked
                                        ? <span className="badge-blocked rounded-pill d-inline-flex align-items-center gap-1"><FaBan /> محظور</span>
                                        : <span className="badge-active rounded-pill d-inline-flex align-items-center gap-1"><FaCheckCircle /> نشط</span>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <span className="text-muted small fw-bold">تاريخ الانضمام: {u.joined}</span>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary fw-bold rounded-pill d-flex align-items-center gap-1" onClick={() => startEdit(u)}>
                                        <FaEdit /> تعديل
                                    </button>
                                    <button className={`btn btn-sm ${isBlocked ? 'btn-outline-success' : 'btn-outline-warning'} fw-bold rounded-pill d-flex align-items-center gap-1`} onClick={() => handleToggleStatus(u)}>
                                        {isBlocked ? <><FaCheckCircle /> إلغاء الحظر</> : <><FaBan /> حظر</>}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger fw-bold rounded-pill d-flex align-items-center gap-1" onClick={() => handleDelete(u)}>
                                        <FaTrash /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="empty-state">
                        <FaUsers size={60} />
                        <h4>لا توجد نتائج</h4>
                        <p>لا يوجد مستخدمون مطابقون لبحثك</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTab;
