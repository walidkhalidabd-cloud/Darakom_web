import apiReq from '../apiReq';

// ==========================================
// API Service للمصادقة والحساب المشترك
// ==========================================

// ----- المحافظات -----
export const fetchProvinces = () => apiReq.get('/provinces');

// ----- التسجيل -----
export const register = (data) => apiReq.post('/register', data);

// ----- تسجيل الدخول -----
export const login = (data) => apiReq.post('/login', data);

// ----- الملف الشخصي (مشترك) -----
export const fetchProfile = () => apiReq.get('/profile');
export const updateProfile = (data) => apiReq.put('/profile/update', data);

// ----- تسجيل الخروج -----
export const logout = () => apiReq.post('/logout');

export default {
  fetchProvinces,
  register,
  login,
  fetchProfile,
  updateProfile,
  logout
};
