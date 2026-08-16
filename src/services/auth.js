// ==========================================
// أدوات المصادقة المشتركة (تخزين/قراءة/تسجيل خروج)
// ==========================================

export const normalizeUserType = (type) => {
  const value = String(type || '').toLowerCase();
  if (value === 'artisan' || value === 'craftsman') return 'craftsman';
  return value;
};

// حفظ بيانات الدخول (التوكن + المستخدم)
export const setAuth = (token, user) => {
  const safeUser = user ? { ...user, type: normalizeUserType(user.type) } : user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(safeUser));
};

// جلب المستخدم الحالي
export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed) return null;
    return { ...parsed, type: normalizeUserType(parsed.type) };
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
  const type = normalizeUserType(user.type);

  switch (type) {
    case 'client': return '/client/dashboard';
    case 'provider': return '/provider/dashboard';
    case 'craftsman': return '/artisan/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/login';
  }
};

export default {
  normalizeUserType,
  setAuth,
  getAuthUser,
  getToken,
  isLoggedIn,
  clearAuth,
  getDashboardPath
};
