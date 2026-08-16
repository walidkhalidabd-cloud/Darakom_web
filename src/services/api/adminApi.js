import apiReq from '../apiReq';

// ==========================================
// API Service للوحة الإدارة - نقاط الإدارة
// ==========================================

// ----- لوحة التحكم (الإحصائيات العامة) -----
// ملاحظة: الباك لا يحتوي على /admin/dashboard حالياً
// الباك يحتوي على AdminController@totals بدلاً منها
export const fetchAdminDashboard = () => apiReq.get('/admin/totals');

// ----- إدارة المستخدمين (عبر /admin/profiles) -----
// البakistan لا يحتوي على /admin/users، لكنه يوفر /admin/profiles
export const fetchAdminUsers = () => apiReq.get('/admin/profiles');
export const fetchAdminUser = (id) => apiReq.get(`/admin/profiles/${id}`);
export const updateAdminUser = (id, data) => apiReq.put(`/admin/profiles/${id}`, data);
export const deleteAdminUser = (id) => apiReq.delete(`/admin/profiles/${id}`);

// createAdminUser و toggleUserStatus غير متوفرة حالياً في الباك
export const createAdminUser = (data) => apiReq.post('/admin/users', data);
export const toggleUserStatus = (id) => apiReq.post(`/admin/users/${id}/toggle-status`);

// ----- أنواع المشاريع -----
export const fetchProjectTypes = () => apiReq.get('/admin/project-types');
export const fetchProjectType = (id) => apiReq.get(`/admin/project-types/${id}`);
export const createProjectType = (data) => apiReq.post('/admin/project-types', data);
export const updateProjectType = (id, data) => apiReq.put(`/admin/project-types/${id}`, data);
export const deleteProjectType = (id) => apiReq.delete(`/admin/project-types/${id}`);

// ----- الأدوار -----
export const fetchRoles = () => apiReq.get('/admin/roles');
export const fetchRole = (id) => apiReq.get(`/admin/roles/${id}`);
export const createRole = (data) => apiReq.post('/admin/roles', data);
export const updateRole = (id, data) => apiReq.put(`/admin/roles/${id}`, data);
export const deleteRole = (id) => apiReq.delete(`/admin/roles/${id}`);

// ----- تصنيفات الخدمات -----
export const fetchAdminServiceCategories = () => apiReq.get('/service-categories');
export const createServiceCategory = (data) => apiReq.post('/admin/service-categories', data);
export const updateServiceCategory = (id, data) => apiReq.put(`/admin/service-categories/${id}`, data);
export const deleteServiceCategory = (id) => apiReq.delete(`/admin/service-categories/${id}`);

// ----- أنواع المستندات -----
export const fetchAdminDocumentTypes = () => apiReq.get('/admin/document-types');
export const createDocumentType = (data) => apiReq.post('/admin/document-types', data);
export const updateDocumentType = (id, data) => apiReq.put(`/admin/document-types/${id}`, data);
export const deleteDocumentType = (id) => apiReq.delete(`/admin/document-types/${id}`);

// ----- طلبات انشاء حسابات مزودي الخدمة -----
// ملاحظة: هذه المسارات غير متوفرة حالياً في الباك
 export const fetchProviderRequests = () => apiReq.get('/admin/provider-requests');
 export const approveProviderRequest = (id) => apiReq.post(`/admin/provider-requests/${id}/approve`);
 export const rejectProviderRequest = (id, reason) => apiReq.post(`/admin/provider-requests/${id}/reject`, { reason });

// ----- مراجعة المشاريع (قبول/رفض) -----
// ملاحظة: هذه المسارات غير متوفرة حالياً في الباك
 export const fetchAdminProjects = () => apiReq.get('/admin/projects');
export const approveProject = (id) => apiReq.post(`/admin/projects/${id}/approve`);
export const rejectProject = (id, reason) => apiReq.post(`/admin/projects/${id}/reject`, { reason });

// ----- مراجعة العروض (قبول/رفض) -----
// ملاحظة: هذه المسارات غير متوفرة حالياً في الباك
export const fetchAdminOffers = () => apiReq.get('/admin/offers');
export const approveOffer = (id) => apiReq.post(`/admin/offers/${id}/approve`);
export const rejectOffer = (id, reason) => apiReq.post(`/admin/offers/${id}/reject`, { reason });

// ----- الإشراف على الشكاوى -----
export const fetchAdminComplaints = () => apiReq.get('/admin/complaints');
export const manageComplaint = (id, data) => apiReq.post(`/admin/complaints/${id}/action`, data);
export const replyToComplaint = (id, data) => apiReq.post(`/admin/complaints/${id}/action`, { status: 'resolved', admin_response: data?.message || data?.admin_response || data?.reply || '', ...data });
export const closeComplaint = (id) => apiReq.post(`/admin/complaints/${id}/action`, { status: 'closed' });

// ----- إدارة التقييمات -----
export const fetchAdminRatings = () => apiReq.get('/admin/ratings');
export const fetchAdminRating = (id) => apiReq.get(`/admin/ratings/${id}`);
export const deleteAdminRating = (id) => apiReq.delete(`/admin/ratings/${id}`);

// ----- إعدادات الموقع -----
// ملاحظة: هذه المسارات غير متوفرة حالياً في الباك
export const fetchSiteSettings = () => apiReq.get('/admin/settings');
export const updateSiteSettings = (data) => apiReq.put('/admin/settings', data);
export const updateGuidancePage = (data) => apiReq.put('/admin/guidance', data);

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
  manageComplaint,
  replyToComplaint,
  closeComplaint,
  fetchAdminRatings,
  fetchAdminRating,
  deleteAdminRating
};
