import axios from 'axios';

// 1. إعداد الرابط الأساسي للسيرفر (مطبخ Laravel)
// (هذا الرابط الافتراضي، سنقوم بتغييره لاحقاً إذا رفعنا الموقع على الإنترنت)
const apiReq = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
    }
});

// 2. معترض الطلبات (Request Interceptor) - "حارس الخروج"
// قبل أن يخرج أي طلب من الموقع، يقوم الحارس بتفتيشه ووضع التوكن بداخله
apiReq.interceptors.request.use(
    (config) => {
        // البحث عن التوكن في ذاكرة المتصفح
        const token = localStorage.getItem('token'); 
        if (token) {
            // إذا وجد التوكن، يلصقه في رأس الطلب (Headers)
            config.headers.Authorization = `Bearer ${token}`; 
        }
        // إذا كان الحمولة FormData، اترك axios يحدد Content-Type المناسب
        if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. معترض الردود (Response Interceptor) - "حارس الدخول"
// يراقب الردود القادمة من السيرفر لاكتشاف أي أخطاء أمنية
apiReq.interceptors.response.use(
    (response) => {
        // إذا كان الرد سليماً، يمرره بسلام
        return response; 
    },
    (error) => {
        if (error.response) {
            // إذا قال السيرفر أن التوكن منتهي أو غير صالح (401)
            if (error.response.status === 401) {
                console.error("انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مجدداً.");
                localStorage.removeItem('token'); // مسح التوكن التالف
                localStorage.removeItem('user'); // مسح بيانات المستخدم
                
                // توجيه المستخدم لصفحة الدخول
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default apiReq;