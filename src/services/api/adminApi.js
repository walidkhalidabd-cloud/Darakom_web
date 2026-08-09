import apiReq from '../apiReq';

// ==========================================
// API Service للوحة الإدارة - نقاط الإدارة
// ==========================================

// ----- لوحة التحكم (الإحصائيات العامة) -----
export const fetchAdminDashboard = () => apiReq.get('/admin/dashboard');

// ----- إدارة المستخدمين -----
export const fetchAdminUsers = () => apiReq.get('/admin/users');
export const createAdminUser = (data) => apiReq.post('/admin/users', data);
export const updateAdminUser = (id, data) => apiReq.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => apiReq.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id) => apiReq.post(`/admin/users/${id}/toggle-status`);

// ----- طلبات انشاء حسابات مزودي الخدمة (الموافقة/الرفض) -----
export const fetchProviderRequests = () => apiReq.get('/admin/provider-requests');
export const approveProviderRequest = (id) => apiReq.post(`/admin/provider-requests/${id}/approve`);
export const rejectProviderRequest = (id, reason) => apiReq.post(`/admin/provider-requests/${id}/reject`, { reason });

// ----- مراجعة المشاريع (قبول/رفض) -----
export const fetchAdminProjects = () => apiReq.get('/admin/projects');
export const approveProject = (id) => apiReq.post(`/admin/projects/${id}/approve`);
export const rejectProject = (id, reason) => apiReq.post(`/admin/projects/${id}/reject`, { reason });

// ----- مراجعة العروض (قبول/رفض) -----
export const fetchAdminOffers = () => apiReq.get('/admin/offers');
export const approveOffer = (id) => apiReq.post(`/admin/offers/${id}/approve`);
export const rejectOffer = (id, reason) => apiReq.post(`/admin/offers/${id}/reject`, { reason });

// ----- الإشراف على الشكاوى -----
export const fetchAdminComplaints = () => apiReq.get('/admin/complaints');
export const replyToComplaint = (id, data) => apiReq.post(`/admin/complaints/${id}/reply`, data);
export const closeComplaint = (id) => apiReq.post(`/admin/complaints/${id}/close`);

// ----- إعدادات الموقع -----
export const fetchSiteSettings = () => apiReq.get('/admin/settings');
export const updateSiteSettings = (data) => apiReq.put('/admin/settings', data);
export const updateGuidancePage = (data) => apiReq.put('/admin/guidance', data);

export default {
  fetchAdminDashboard,
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
toggleUserStatus,
  fetchProviderRequests,
  approveProviderRequest,
  rejectProviderRequest,
  fetchAdminProjects,
  approveProject,
  rejectProject,
  fetchAdminOffers,
  approveOffer,
  rejectOffer,
  fetchAdminComplaints,
  replyToComplaint,
  closeComplaint,
  fetchSiteSettings,
  updateSiteSettings,
  updateGuidancePage
};
