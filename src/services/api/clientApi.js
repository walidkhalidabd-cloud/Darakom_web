import apiReq from '../apiReq';

// ==========================================
// API Service للعميل - مسارات مطابقة للباك
// ==========================================

// ----- الملف الشخصي (يستخدم المسارات المشتركة) -----
export const fetchClientProfile = () => apiReq.get('/profile');
export const updateClientProfile = (data) => apiReq.put('/profile/update', data);

// ----- المشاريع -----
export const fetchClientProjects = () => apiReq.get('/client/projects');
export const fetchClientProjectDetails = (id) => apiReq.get(`/client/projects/${id}`);

// ----- إنشاء / تعديل / حذف مشروع (مسارات مشتركة) -----
export const createProject = (data) => apiReq.post('/projects', data);
export const updateProject = (id, data) => apiReq.put(`/projects/${id}`, data);
export const deleteProject = (id) => apiReq.delete(`/projects/${id}`);

// ----- العروض المستلمة -----
export const fetchClientProjectOffers = (projectId) => apiReq.get(`/client/projects/${projectId}/offers`);
export const acceptOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/accept`);
export const rejectOffer = (projectId, offerId) => apiReq.post(`/client/projects/${projectId}/offers/${offerId}/reject`);

// ----- الشكاوي -----
export const fetchClientComplaints = () => apiReq.get('/client/complaints');
export const submitClientComplaint = (data) => apiReq.post('/client/complaints', data);

// ----- التقييمات (نقطة النهاية موجودة في الباك: client/projects/{project}/rate) -----
export const rateProject = (projectId, data) => apiReq.post(`/client/projects/${projectId}/rate`, data);
// توافق مع اسم مستخدم في واجهة التقييمات (ReviewsTab)
export const submitClientReview = (data) => apiReq.post(`/client/projects/${data?.project_id}/rate`, data);

// ----- الدعوات (Invitations) -----
export const sendInvitation = (projectId, data) => apiReq.post(`/client/projects/${projectId}/invitations`, data);
export const cancelInvitation = (invitationId) => apiReq.delete(`/client/invitations/${invitationId}`);

// ----- التقارير (Reports - عرض العميل) -----
export const fetchClientProjectReports = (projectId) => apiReq.get(`/client/projects/${projectId}/reports`);
export const fetchClientReportDetails = (projectId, reportId) => apiReq.get(`/client/projects/${projectId}/reports/${reportId}`);

export default {
  fetchClientProfile,
  updateClientProfile,
  fetchClientProjects,
  fetchClientProjectDetails,
  createProject,
  updateProject,
  deleteProject,
  fetchClientProjectOffers,
  acceptOffer,
  rejectOffer,
  fetchClientComplaints,
  submitClientComplaint,
  rateProject,
  sendInvitation,
  cancelInvitation,
  fetchClientProjectReports,
  fetchClientReportDetails
};
