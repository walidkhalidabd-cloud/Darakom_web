# خطة ربط الفرونت مع الباك (تعديل الفرونت فقط)

## الخطوات المنفذة ✅ / المتبقية ⬜

### 1. تصحيح ملفات الـ API Services ✅
- ✅ `src/services/api/providerApi.js` — ربط بالمسارات الفعلية في الباك
- ✅ `src/services/api/clientApi.js` — ربط المسارات + `submitClientReview`

### 2. ربط تبويبات المزود
- ✅ `ProviderDashboardTab.jsx` — ربط `GET /provider/dashboard`
- ✅ `TendersTab.jsx` — ربط public/private-tenders + tenders/{id}
- ✅ `SubmitOffer.jsx` — ربط `POST /provider/projects/{project}/offers` + `PUT`
- ✅ `OffersTab.jsx` (مزود) — ربط `GET /provider/offers` + `DELETE/PUT`
- ✅ `ProjectsTab.jsx` — ربط `GET /provider/projects`
- ✅ `ProviderTrackingTab.jsx` — ربط projects + reports
- ✅ `ProviderProfileTab.jsx` — ربط profile
- ✅ `ProviderNotificationsTab.jsx` (fallback لأن مسار الإشعارات معطّل في الباك)
- ✅ `ProviderReviewsTab.jsx` — ربط ratings
- ✅ `ProviderComplaintsTab.jsx` — استدعاء API

### 3. ربط تبويبات العميل
- ✅ `DashboardTab.jsx` — ربط `GET /client/projects`
- ✅ `AddProjectTab.jsx` — ربط `POST /projects`
- ✅ `OffersTab.jsx` (عميل) — ربط projects + offers
- ✅ `OffersReceivedTab.jsx` — ربط `GET /client/projects/{id}/offers`
- ✅ `ComplaintsTab.jsx` — ربط `GET/POST /client/complaints`
- ✅ `ReviewsTab.jsx` — ربط `POST /client/projects/{project}/rate` (`rateProject`)
- ✅ `ProfileTab.jsx` — ربط `GET /profile`

### 4. اختبار الربط
- ✅ تشغيل `npm run build` — نجح بدون أخطاء
