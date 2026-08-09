import apiReq from '../apiReq';

// ==========================================
// API Service لمزود الخدمة - ملائم للباك الفعلي
// ==========================================

// ----- الملف الشخصي (مشترك) -----
export const fetchProfile = () => apiReq.get('/profile');
export const updateProfile = (data) => apiReq.put('/profile/update', data);

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

// ----- الشكاوي -----
export const fetchComplaints = () => apiReq.get('/provider/complaints');
export const submitComplaint = (data) => apiReq.post('/provider/complaints', data);

// =============================================================
// وظائف توافقية (Compatibility) - الواجهات تعتمد عليها حالياً
// لا تحذفها حتى لا تنكسر الواجهات
// =============================================================

// ----- إضافة مرحلة/تقرير إنجاز (النقطة الفعلية في الباك: reports) -----
export const addStage = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/reports`, data);

// ----- الإشعارات (غير متوفرة في الباك حالياً - تحتاج فريق الباك) -----
export const fetchNotifications = () => apiReq.get('/provider/notifications');
export const markNotificationRead = (id) => apiReq.put(`/provider/notifications/${id}/read`);
export const markAllNotificationsRead = () => apiReq.put('/provider/notifications/read-all');
export const deleteNotification = (id) => apiReq.delete(`/provider/notifications/${id}`);

// ----- التقييمات (المستلمة/المقدمة) - الباك يوفر /provider/ratings -----
export const fetchReceivedReviews = () => apiReq.get('/provider/ratings');
export const fetchGivenReviews = () => apiReq.get('/provider/ratings/given');

// ============================================================
// ملاحظة: النقاط التالية غير متوفرة في الباك حالياً (تحتاج فريق الباك):
// provider/notifications, provider/reviews/given (تابعة للـ Rating)
// ============================================================

export default {
  fetchProfile,
  updateProfile,
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
  fetchComplaints
};
