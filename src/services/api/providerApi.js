import apiReq from '../apiReq';

// ==========================================
// API Service لمزود الخدمة - ملائم للباك الفعلي
// ==========================================

// ----- الملف الشخصي (مشترك) -----
export const fetchProfile = () => apiReq.get('/profile');
export const updateProfile = (data) => apiReq.put('/profile/update', data);

// ----- أنواع المستندات / تصنيفات الخدمات -----
export const fetchDocumentTypes = () => apiReq.get('/document-types');
export const fetchServiceCategories = () => apiReq.get('/service-categories');
export const fetchProviderServiceCategory = (id) => apiReq.get(`/service-categories/${id}`);
export const toggleProviderServiceCategory = (categoryId) => apiReq.post('/provider/service-category/toggle', { service_category_id: categoryId });

// ----- المستندات -----
export const fetchProviderDocuments = () => apiReq.get('/documents');
export const uploadProviderDocument = (data) => apiReq.post('/documents', data);
export const deleteProviderDocument = (id) => apiReq.delete(`/documents/${id}`);
export const fetchProjectDocuments = (projectId) => apiReq.get(`/client/projects/${projectId}/documents`);
export const uploadProjectDocument = (projectId, data) => apiReq.post(`/client/projects/${projectId}/documents`, data);
export const deleteProjectDocument = (id) => apiReq.delete(`/client/documents/${id}`);

// ----- لوحة التحكم -----
export const fetchProviderDashboard = () => apiReq.get('/provider/dashboard');

// ----- المناقصات -----
export const fetchPublicTenders = () => apiReq.get('/provider/public-tenders');
export const fetchPrivateTenders = () => apiReq.get('/provider/private-tenders');
export const fetchTenderDetails = (id) => apiReq.get(`/provider/tenders/${id}`);
export const declineInvitation = (id) => apiReq.post(`/provider/invitations/${id}/decline`);

// ----- عروضي (المقدمة من المزود) -----
export const fetchMyOffers = () => apiReq.get('/provider/offers');
export const submitOffer = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/offers`, data);
export const updateOffer = (offerId, data) => apiReq.put(`/provider/offers/${offerId}`, data);
export const deleteOffer = (offerId) => apiReq.delete(`/provider/offers/${offerId}`);

// ----- مشاريعي -----
export const fetchProviderProjects = () => apiReq.get('/provider/projects');
export const fetchProjectDetails = (id) => apiReq.get(`/provider/projects/${id}`);
export const fetchProjectTracking = (id) => apiReq.get(`/provider/projects/${id}/tracking`);
export const endProject = (projectId) => apiReq.post(`/provider/projects/${projectId}/end`);

// ----- الخطوات -----
export const fetchProjectSteps = (projectId) => apiReq.get(`/provider/projects/${projectId}/steps`);
export const createProjectStep = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/steps`, data);
export const fetchProjectStep = (projectId, stepId) => apiReq.get(`/provider/projects/${projectId}/steps/${stepId}`);
export const updateProjectStep = (stepId, data) => apiReq.put(`/provider/steps/${stepId}`, data);
export const deleteProjectStep = (stepId) => apiReq.delete(`/provider/steps/${stepId}`);

// ----- التقارير -----
export const fetchProjectReports = (projectId) => apiReq.get(`/provider/projects/${projectId}/reports`);
export const fetchProjectReport = (projectId, reportId) => apiReq.get(`/provider/projects/${projectId}/reports/${reportId}`);
export const addReport = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/reports`, data);
export const updateReport = (reportId, data) => apiReq.put(`/provider/reports/${reportId}`, data);
export const deleteReport = (reportId) => apiReq.delete(`/provider/reports/${reportId}`);

// ----- الدعوات -----
export const fetchInvitations = () => apiReq.get('/provider/invitations');
export const fetchInvitation = (id) => apiReq.get(`/provider/invitations/${id}`);
export const acceptInvitation = (id) => apiReq.post(`/provider/invitations/${id}/accept`);
export const declineInvitationAction = (id) => apiReq.post(`/provider/invitations/${id}/decline`);

// ----- التقييمات -----
export const fetchMyRatings = () => apiReq.get('/provider/ratings');
export const fetchProviderRating = (ratingId) => apiReq.get(`/provider/ratings/${ratingId}`);

// ----- الأعمال السابقة / البورتفوليو -----
export const fetchPreviousWorks = () => apiReq.get('/portfolio/previous-works');
export const fetchPreviousWork = (id) => apiReq.get(`/portfolio/previous-works/${id}`);
export const createPreviousWork = (data) => apiReq.post('/portfolio/previous-works', data);
export const updatePreviousWork = (id, data) => apiReq.put(`/portfolio/previous-works/${id}`, data);
export const deletePreviousWork = (id) => apiReq.delete(`/portfolio/previous-works/${id}`);
export const addPreviousWorkImage = (previousWorkId, data) => apiReq.post(`/portfolio/previous-works/${previousWorkId}/images`, data);
export const deletePreviousWorkImage = (imageId) => apiReq.delete(`/portfolio/images/${imageId}`);
export const setPreviousWorkCover = (imageId) => apiReq.patch(`/portfolio/images/${imageId}/set-cover`);

// ----- الشكاوي -----
export const fetchComplaints = () => apiReq.get('/provider/complaints');
export const fetchComplaintsAgainstMe = () => apiReq.get('/provider/complaints-against-me');
export const submitComplaint = (data) => apiReq.post('/provider/complaints', data);

// =============================================================
// وظائف توافقية (Compatibility) - الواجهات تعتمد عليها حالياً
// لا تحذفها حتى لا تنكسر الواجهات
// =============================================================

// ----- إضافة مرحلة/تقرير إنجاز (النقطة الفعلية في الباك: reports) -----
export const addStage = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/reports`, data);

// ----- الإشعارات -----
// الباك يستخدم مسارات /notifications وليس /provider/notifications.
export const fetchNotifications = () => apiReq.get('/notifications');
export const markNotificationRead = (id) => apiReq.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => apiReq.patch('/notifications/read-all');
export const deleteNotification = (id) => apiReq.delete(`/notifications/${id}`);

// ----- التقييمات -----
// الباك يوفر /provider/ratings فقط؛ مسار /given غير موجود فعلياً.
export const fetchReceivedReviews = () => apiReq.get('/provider/ratings');
export const fetchGivenReviews = () => apiReq.get('/provider/ratings');

// ============================================================
// ملاحظة: ما زالت الواجهات التالية غير موجودة في الباك فعلياً:
// provider/reviews/given, provider/notifications/* إذا كان السيرفر لا يملك هذه المسارات في نسخة معينة
// ============================================================

export default {
  fetchProfile,
  updateProfile,
  fetchDocumentTypes,
  fetchServiceCategories,
  fetchProviderServiceCategory,
  toggleProviderServiceCategory,
  fetchProviderDocuments,
  uploadProviderDocument,
  deleteProviderDocument,
  fetchProjectDocuments,
  uploadProjectDocument,
  deleteProjectDocument,
  fetchProviderDashboard,
  fetchPublicTenders,
  fetchPrivateTenders,
  fetchTenderDetails,
  declineInvitation,
  fetchMyOffers,
  submitOffer,
  updateOffer,
  deleteOffer,
  fetchProviderProjects,
  fetchProjectDetails,
  fetchProjectTracking,
  endProject,
  fetchProjectSteps,
  createProjectStep,
  fetchProjectStep,
  updateProjectStep,
  deleteProjectStep,
  fetchProjectReports,
  fetchProjectReport,
  addReport,
  updateReport,
  deleteReport,
  fetchInvitations,
  fetchInvitation,
  acceptInvitation,
  declineInvitationAction,
  fetchMyRatings,
  fetchProviderRating,
  fetchPreviousWorks,
  fetchPreviousWork,
  createPreviousWork,
  updatePreviousWork,
  deletePreviousWork,
  addPreviousWorkImage,
  deletePreviousWorkImage,
  setPreviousWorkCover,
  fetchComplaints,
  fetchComplaintsAgainstMe,
  submitComplaint
};
