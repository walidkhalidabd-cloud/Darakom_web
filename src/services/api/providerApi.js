import apiReq from '../apiReq';

// ==========================================
// API Service لمزود الخدمة - مسارات مطابقة للباك
// ==========================================

// ----- لوحة التحكم (Dashboard) -----
export const fetchProviderDashboard = () => apiReq.get('/provider/dashboard');

// ----- المناقصات (Tenders) -----
export const fetchPublicTenders = () => apiReq.get('/provider/public-tenders');
export const fetchPrivateTenders = () => apiReq.get('/provider/private-tenders');
export const fetchTenderDetails = (id) => apiReq.get(`/provider/tenders/${id}`);

// ----- الدعوات (Invitations) -----
export const fetchInvitations = () => apiReq.get('/provider/invitations');
export const fetchInvitationDetails = (id) => apiReq.get(`/provider/invitations/${id}`);
export const acceptInvitation = (id) => apiReq.post(`/provider/invitations/${id}/accept`);
export const declineInvitation = (id) => apiReq.post(`/provider/invitations/${id}/decline`);

// ----- العروض (Offers) -----
export const fetchOffers = () => apiReq.get('/provider/offers');
export const submitOffer = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/offers`, data);
export const updateOffer = (offerId, data) => apiReq.put(`/provider/offers/${offerId}`, data);
export const deleteOffer = (offerId) => apiReq.delete(`/provider/offers/${offerId}`);

// ----- المشاريع (Projects) -----
export const fetchProviderProjects = () => apiReq.get('/provider/projects');
export const fetchProjectDetails = (id) => apiReq.get(`/provider/projects/${id}`);
export const fetchProjectTracking = (id) => apiReq.get(`/provider/projects/${id}/tracking`);

// ----- التقارير (Reports) -----
export const fetchProjectReports = (projectId) => apiReq.get(`/provider/projects/${projectId}/reports`);
export const addProjectReport = (projectId, data) => apiReq.post(`/provider/projects/${projectId}/reports`, data);
export const fetchReportDetails = (projectId, reportId) => apiReq.get(`/provider/projects/${projectId}/reports/${reportId}`);
export const updateReport = (reportId, data) => apiReq.put(`/provider/reports/${reportId}`, data);
export const deleteReport = (reportId) => apiReq.delete(`/provider/reports/${reportId}`);

// ----- التقييمات (Ratings) -----
export const fetchReceivedReviews = () => apiReq.get('/provider/ratings');

// ----- الشكاوي (Complaints) -----
export const fetchComplaints = () => apiReq.get('/provider/complaints');

// ----- الملف الشخصي (Profile) - يستخدم المسارات المشتركة -----
export const fetchProfile = () => apiReq.get('/profile');
export const updateProfile = (data) => apiReq.put('/profile/update', data);

// ----- الإشعارات (Notifications) - مسارات مشتركة -----
export const fetchNotifications = () => apiReq.get('/notifications');
export const markAllNotificationsRead = () => apiReq.patch('/notifications/markAsRead');
export const fetchUnreadCount = () => apiReq.get('/notifications/unread-count');

export default {
  fetchProviderDashboard,
  fetchPublicTenders,
  fetchPrivateTenders,
  fetchTenderDetails,
  fetchInvitations,
  fetchInvitationDetails,
  acceptInvitation,
  declineInvitation,
  fetchOffers,
  submitOffer,
  updateOffer,
  deleteOffer,
  fetchProviderProjects,
  fetchProjectDetails,
  fetchProjectTracking,
  fetchProjectReports,
  addProjectReport,
  fetchReportDetails,
  updateReport,
  deleteReport,
  fetchReceivedReviews,
  fetchComplaints,
  fetchProfile,
  updateProfile
};
