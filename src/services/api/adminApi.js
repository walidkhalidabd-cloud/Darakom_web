import apiReq from '../apiReq';

// ==========================================
// API Service للوحة الإدارة - نقاط الإدارة
// ==========================================

export const fetchAdminDashboard = () => apiReq.get('/admin/totals');

// تم ربطها بـ profiles حسب مسارات API المتوفرة في الباك إند
export const fetchAdminUsers = () => apiReq.get('/admin/profiles');
export const fetchAdminUser = (id) => apiReq.get(`/admin/profiles/${id}`);
export const updateAdminUser = (id, data) => apiReq.put(`/admin/profiles/${id}`, data);
export const deleteAdminUser = (id) => apiReq.delete(`/admin/profiles/${id}`);

// مسارات إضافية للمستخدمين (في حال تم إضافتها للباك لاحقاً)
export const createAdminUser = (data) => apiReq.post('/admin/users', data);
export const toggleUserStatus = (id) => apiReq.post(`/admin/users/${id}/toggle-status`);

export const fetchProjectTypes = () => apiReq.get('/admin/project-types');
export const fetchProjectType = (id) => apiReq.get(`/admin/project-types/${id}`);
export const createProjectType = (data) => apiReq.post('/admin/project-types', data);
export const updateProjectType = (id, data) => apiReq.put(`/admin/project-types/${id}`, data);
export const deleteProjectType = (id) => apiReq.delete(`/admin/project-types/${id}`);

export const fetchRoles = () => apiReq.get('/admin/roles');
export const fetchRole = (id) => apiReq.get(`/admin/roles/${id}`);
export const createRole = (data) => apiReq.post('/admin/roles', data);
export const updateRole = (id, data) => apiReq.put(`/admin/roles/${id}`, data);
export const deleteRole = (id) => apiReq.delete(`/admin/roles/${id}`);

export const fetchAdminServiceCategories = () => apiReq.get('/admin/service-categories');
export const createServiceCategory = (data) => apiReq.post('/admin/service-categories', data);
export const updateServiceCategory = (id, data) => apiReq.put(`/admin/service-categories/${id}`, data);
export const deleteServiceCategory = (id) => apiReq.delete(`/admin/service-categories/${id}`);

export const fetchAdminDocumentTypes = () => apiReq.get('/admin/document-types');
export const createDocumentType = (data) => apiReq.post('/admin/document-types', data);
export const updateDocumentType = (id, data) => apiReq.put(`/admin/document-types/${id}`, data);
export const deleteDocumentType = (id) => apiReq.delete(`/admin/document-types/${id}`);

export const fetchProviderRequests = () => apiReq.get('/admin/provider-requests');
export const approveProviderRequest = (id) => apiReq.post(`/admin/provider-requests/${id}/approve`);
export const rejectProviderRequest = (id, reason) => apiReq.post(`/admin/provider-requests/${id}/reject`, { admin_comment: reason });

export const fetchAdminProjects = () => apiReq.get('/admin/projects');
export const approveProject = (id) => apiReq.post(`/admin/projects/${id}/approve`);
export const rejectProject = (id, reason) => apiReq.post(`/admin/projects/${id}/reject`, { reason });

// ==========================================
// API Service للوحة الإدارة - إدارة الشكاوى
// ==========================================

// جلب جميع الشكاوى
export const fetchAdminComplaints = () => apiReq.get('/admin/complaints');

// الرد على الشكوى وحلها
export const replyToComplaint = (id, data) => apiReq.post(`/admin/complaints/${id}/reply`, data);

// إغلاق الشكوى بدون رد
export const closeComplaint = (id) => apiReq.post(`/admin/complaints/${id}/close`);

export const fetchAdminOffers = () => apiReq.get('/admin/offers');
export const approveOffer = (id) => apiReq.post(`/admin/offers/${id}/approve`);
export const rejectOffer = (id, reason) => apiReq.post(`/admin/offers/${id}/reject`, { reason });

export const fetchAdminRatings = () => apiReq.get('/admin/ratings');
export const fetchAdminRating = (id) => apiReq.get(`/admin/ratings/${id}`);
export const deleteAdminRating = (id) => apiReq.delete(`/admin/ratings/${id}`);

export const fetchSiteSettings = () => apiReq.get('/admin/settings');
export const updateSiteSettings = (data) => apiReq.put('/admin/settings', data);

export default {
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchAdminUser,
  updateAdminUser,
  deleteAdminUser,
  fetchProjectTypes,
  fetchProjectType,
  createProjectType,
  updateProjectType,
  deleteProjectType,
  fetchRoles,
  fetchRole,
  createRole,
  updateRole,
  deleteRole,
  fetchAdminServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  fetchAdminDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  fetchAdminComplaints,
  replyToComplaint,
  closeComplaint,
  fetchAdminRatings,
  fetchAdminRating,
  deleteAdminRating,
  fetchAdminProjects, 
  approveProject,     
  rejectProject       
};