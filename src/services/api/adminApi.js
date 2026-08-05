import apiReq from '../apiReq';

// ==========================================
// API Service للأدمن - جميع النقاط
// ==========================================

// ----- لوحة التحكم (Dashboard) -----
export const fetchAdminStats = () => apiReq.get('/admin/stats');

// ----- إدارة المستخدمين (Users) -----
export const fetchAdminUsers = () => apiReq.get('/admin/users');
export const createUser = (data) => apiReq.post('/admin/users', data);
export const updateUser = (id, data) => apiReq.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => apiReq.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id) => apiReq.put(`/admin/users/${id}/toggle-status`);

// ----- الشكاوى (Complaints) -----
export const fetchAdminComplaints = () => apiReq.get('/admin/complaints');
export const replyToComplaint = (id, reply) => apiReq.put(`/admin/complaints/${id}/reply`, { reply });
export const resolveComplaint = (id) => apiReq.put(`/admin/complaints/${id}/resolve`);

// ----- إدارة بيانات الموقع (Site Settings) -----
export const fetchSiteSettings = () => apiReq.get('/admin/settings');
export const updateSiteSettings = (data) => apiReq.put('/admin/settings', data);
export const fetchGuidanceContent = () => apiReq.get('/admin/guidance');
export const updateGuidanceContent = (data) => apiReq.put('/admin/guidance', data);

export default {
  fetchAdminStats,
  fetchAdminUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  fetchAdminComplaints,
  replyToComplaint,
  resolveComplaint,
  fetchSiteSettings,
  updateSiteSettings,
  fetchGuidanceContent,
  updateGuidanceContent
};
