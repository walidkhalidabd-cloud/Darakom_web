import apiReq from '../apiReq';

// ==========================================
// API Service للعميل - جميع النقاط المتوافقة مع الباك
// ==========================================

// ----- الملف الشخصي (مشترك) -----
export const fetchClientProfile = () => apiReq.get('/profile');
export const updateClientProfile = (data) => apiReq.put('/profile/update', data);

// ----- الشكاوي -----
export const fetchClientComplaints = () => apiReq.get('/client/complaints');
export const submitClientComplaint = (data) => apiReq.post('/client/complaints', data);
export const fetchClientComplaintsAgainstMe = () => apiReq.get('/client/complaints-against-me');

// ----- المفضلة -----
export const fetchFavorites = () => apiReq.get('/favorites');
export const toggleFavorite = (favoriteUserId) => apiReq.post('/favorites/toggle', { favorite_user_id: favoriteUserId });
export const removeFavorite = (favoriteUserId) => apiReq.delete(`/favorites/${favoriteUserId}`);

// ----- المشاريع -----
export const fetchClientProjects = () => apiReq.get('/client/projects');
export const fetchClientProjectDetails = (id) => apiReq.get(`/client/projects/${id}`);

// ----- عروض المشروع (الاستلام/القبول/الرفض) -----
export const fetchProjectOffers = (projectId) => apiReq.get(`/client/projects/${projectId}/offers`);
export const acceptOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/accept`);
export const rejectOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/reject`);

// ----- تقييم المشروع -----
export const rateProject = (projectId, data) => apiReq.post(`/client/projects/${projectId}/rate`, data);

// ----- الدعوات الخاصة (إرسال دعوة لمزود) -----
export const sendProjectInvitation = (projectId, data) => apiReq.post(`/client/projects/${projectId}/invitations`, data);
export const cancelInvitation = (invitationId) => apiReq.delete(`/client/invitations/${invitationId}`);

// ----- تقارير المشروع (عرض من منظور العميل) -----
export const fetchClientProjectReports = (projectId) => apiReq.get(`/client/projects/${projectId}/reports`);
export const fetchClientProjectReport = (projectId, reportId) => apiReq.get(`/client/projects/${projectId}/reports/${reportId}`);

// ----- الخطوات والتقييمات -----
export const fetchClientProjectSteps = (projectId) => apiReq.get(`/client/projects/${projectId}/steps`);
export const fetchClientProjectStep = (projectId, stepId) => apiReq.get(`/client/projects/${projectId}/steps/${stepId}`);
export const fetchClientMyRatings = () => apiReq.get('/client/my-ratings');
export const fetchClientRating = (ratingId) => apiReq.get(`/client/ratings/${ratingId}`);
export const updateClientRating = (ratingId, data) => apiReq.put(`/client/ratings/${ratingId}`, data);
export const deleteClientRating = (ratingId) => apiReq.delete(`/client/ratings/${ratingId}`);

// =============================================================
// وظائف توافقية (Compatibility) - الواجهات تعتمد عليها حالياً
// لا تحذفها حتى لا تنكسر الواجهات
// =============================================================

// ----- متابعة مشاريع العميل -----
// الباك يوفر قائمة المشاريع + خطوات المشروع بشكل فعلي، وليس مسار tracking مخصص.
export const fetchClientOngoingProjects = () => apiReq.get('/client/projects');
export const fetchClientProjectTracking = (id) => apiReq.get(`/client/projects/${id}/steps`);

// ============================================================
// ملاحظة: المسارات التالية لا تزال غير موجودة في الباك فعلياً:
// client/notifications, client/reviews, client/favorites,
// client/tracking/projects
// ============================================================

export default {
  fetchClientProfile,
  updateClientProfile,
  fetchClientComplaints,
  submitClientComplaint,
  fetchClientComplaintsAgainstMe,
  fetchFavorites,
  toggleFavorite,
  removeFavorite,
  fetchClientProjects,
  fetchClientProjectDetails,
  fetchProjectOffers,
  acceptOffer,
  rejectOffer,
  rateProject,
  sendProjectInvitation,
  cancelInvitation,
  fetchClientProjectReports,
  fetchClientProjectReport,
  fetchClientProjectSteps,
  fetchClientProjectStep,
  fetchClientMyRatings,
  fetchClientRating,
  updateClientRating,
  deleteClientRating
};
