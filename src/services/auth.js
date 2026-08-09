// ==========================================
// أدوات المصادقة المشتركة (تخزين/قراءة/تسجيل خروج)
// ==========================================

// حفظ بيانات الدخول (التوكن + المستخدم)
export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// جلب المستخدم الحالي
export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// جلب التوكن
export const getToken = () => localStorage.getItem('token');

// هل المستخدم مسجّل دخول؟
export const isLoggedIn = () => !!localStorage.getItem('token');

// مسح بيانات الدخول
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// مسار لوحة التحكم المناسب حسب نوع المستخدم
export const getDashboardPath = (user) => {
  if (!user) return '/login';
  switch (user.type) {
    case 'client': return '/client/dashboard';
    case 'provider': return '/provider/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/login';
  }
};

export default {
  setAuth,
  getAuthUser,
  getToken,
  isLoggedIn,
  clearAuth,
  getDashboardPath
};
