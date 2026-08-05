import apiReq from '../apiReq';

// ==========================================
// API Service للمصادقة (Auth)
// ==========================================

// تسجيل الدخول
export const login = (credentials) => apiReq.post('/login', credentials);

// إنشاء حساب جديد (يدعم رفع الوثائق للمزود)
export const register = (data) => apiReq.post('/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// تسجيل الخروج
export const logout = () => apiReq.post('/logout');

// جلب قائمة المحافظات
export const fetchProvinces = () => apiReq.get('/provinces');

export default {
    login,
    register,
    logout,
    fetchProvinces
};
