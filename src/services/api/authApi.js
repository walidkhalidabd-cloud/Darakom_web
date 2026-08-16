import apiReq from '../apiReq';

// ==========================================
// API Service للمصادقة والحساب المشترك
// ==========================================

// ----- المحافظات -----
export const fetchProvinces = () => apiReq.get('/provinces');

// ----- أنواع الوثائق -----
export const fetchDocumentTypes = () => apiReq.get('/document-types');

// ----- التسجيل (تم إضافة الـ Headers لدعم الملفات) -----
export const register = (data) => apiReq.post('/register', data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// ----- تسجيل الدخول -----
export const login = (data) => apiReq.post('/login', data);

// ----- الملف الشخصي (مشترك) -----
export const fetchProfile = () => apiReq.get('/profile');
export const updateProfile = (data) => apiReq.put('/profile/update', data);

// ----- تسجيل الخروج -----
export const logout = () => apiReq.post('/logout');

// طلب كود استعادة كلمة المرور
export const forgotPassword = (data) => {
    return apiReq.post('/forgot-password', data); 
};

// تأكيد الكود وتغيير كلمة المرور
export const resetPassword = (data) => {
    return apiReq.post('/reset-password', data);
};
export default {
  fetchProvinces,
  fetchDocumentTypes,
  register,
  login,
  fetchProfile,
  updateProfile,
  logout
};