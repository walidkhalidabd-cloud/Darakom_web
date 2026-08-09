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

// =============================================================
// وظائف توافقية (Compatibility) - الواجهات تعتمد عليها حالياً
// لا تحذفها حتى لا تنكسر الواجهات
// =============================================================

// ----- متابعة مشاريع العميل (غير متوفرة في الباك حالياً - تحتاج فريق الباك) -----
export const fetchClientOngoingProjects = () => apiReq.get('/client/tracking/projects');
export const fetchClientProjectTracking = (id) => apiReq.get(`/client/tracking/projects/${id}`);

// ============================================================
// ملاحظة: النقاط التالية غير متوفرة في الباك حالياً (تحتاج فريق الباك):
// client/notifications, client/reviews, client/favorites,
// client/tracking/projects
// ============================================================

export default {
  fetchClientProfile,
  updateClientProfile,
  fetchClientComplaints,
  submitClientComplaint,
  fetchClientProjects,
  fetchClientProjectDetails,
  fetchProjectOffers,
  acceptOffer,
  rejectOffer,
  rateProject,
  sendProjectInvitation,
  cancelInvitation,
  fetchClientProjectReports,
  fetchClientProjectReport
};
