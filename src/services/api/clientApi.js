import apiReq from '../apiReq';

// ==========================================
// API Service للعميل - جميع النقاط المتوافقة مع الباك
// ==========================================

// ----- لوحة التحكم (Dashboard) -----
export const fetchClientDashboard = () => apiReq.get('/client/dashboard');

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
export const createClientProject = (data) => apiReq.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ----- عروض المشروع (الاستلام/القبول/الرفض) -----
export const fetchProjectOffers = (projectId) => apiReq.get(`/client/projects/${projectId}/offers`);
export const acceptOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/accept`);
export const rejectOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/reject`);
export const fetchPublicOffers = () => apiReq.get('/client/offers/public');
export const fetchPrivateOffers = () => apiReq.get('/client/offers/private');

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

export const fetchClientOngoingProjects = () => apiReq.get('/client/projects');
export const fetchClientProjectTracking = (id) => apiReq.get(`/client/projects/${id}/steps`);
export const updateClientProject = (projectId, data) => apiReq.put(`/projects/${projectId}`, data);
export const deleteClientProject = (projectId) => apiReq.delete(`/projects/${projectId}`);
export const fetchClientFavorites = () => apiReq.get('/favorites');
export const toggleClientFavorite = (data) => apiReq.post('/favorites/toggle', data);

export default {
  fetchClientDashboard,
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
  createClientProject,
  fetchProjectOffers,
  acceptOffer,
  rejectOffer,
  fetchPublicOffers,
  fetchPrivateOffers,
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