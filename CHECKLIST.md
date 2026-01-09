# ✅ Deployment Checklist - قائمة التحقق قبل النشر

استخدم هذه القائمة للتأكد من أن كل شيء جاهز للنشر:

## 📋 قبل البدء

- [ ] Node.js مثبت على جهازك (v18 أو أحدث)
- [ ] Git مثبت ومُعد
- [ ] حساب GitHub جاهز
- [ ] حساب Render جاهز (مجاني)
- [ ] حساب Netlify جاهز (مجاني)
- [ ] حساب VirusTotal للحصول على API Key

---

## 🔧 إعداد المشروع محلياً

- [ ] نسخ `.env.example` إلى `.env`
- [ ] إضافة `VT_API_KEY` في ملف `.env`
- [ ] تثبيت المكتبات: `npm install`
- [ ] تشغيل السيرفر: `npm start`
- [ ] اختبار المشروع محلياً على `localhost:3000`
- [ ] التأكد من عمل URL Scanner
- [ ] التأكد من عمل IDS Dashboard

---

## 🌐 رفع المشروع على GitHub

- [ ] إنشاء repository جديد على GitHub
- [ ] تنفيذ:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```
- [ ] التأكد من رفع الملفات بنجاح
- [ ] التأكد من عدم رفع ملف `.env` (يجب أن يكون في `.gitignore`)

---

## 🚀 نشر Backend على Render

- [ ] تسجيل الدخول إلى Render
- [ ] إنشاء Web Service جديد
- [ ] ربط repository من GitHub
- [ ] إعداد البيانات:
  - Name: `cyber-awareness-hub-backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] إضافة Environment Variables:
  - [ ] `NODE_ENV = production`
  - [ ] `VT_API_KEY = YOUR_KEY`
  - [ ] `TELEGRAM_BOT_TOKEN` (اختياري)
  - [ ] `TELEGRAM_CHAT_ID` (اختياري)
- [ ] نشر الـ Service
- [ ] **حفظ رابط الـ Backend** (مهم جداً!)
- [ ] اختبار الـ Backend: افتح الرابط في المتصفح (يجب أن ترى `{"status":"ok"}`)

---

## 🔗 تحديث رابط API

- [ ] فتح ملف `public/config.js`
- [ ] استبدال `YOUR-RENDER-APP-NAME.onrender.com` برابط Render الفعلي
- [ ] حفظ الملف
- [ ] رفع التغييرات:
  ```bash
  git add public/config.js
  git commit -m "Update API URL for production"
  git push
  ```

---

## 🌐 نشر Frontend على Netlify

### الطريقة الأولى: Drag & Drop
- [ ] فتح Netlify Dashboard
- [ ] سحب مجلد `public` إلى المربع
- [ ] انتظار اكتمال النشر
- [ ] **حفظ رابط Netlify**

### الطريقة الثانية: من GitHub (موصى بها)
- [ ] في Netlify: Add new site → Import from Git
- [ ] اختيار repository
- [ ] إعداد البيانات:
  - Branch: `main`
  - Publish directory: `public`
  - Build command: (فارغ)
- [ ] نشر الموقع
- [ ] **حفظ رابط Netlify**

---

## ⚙️ إعدادات CORS (إذا لزم الأمر)

- [ ] فتح `server.js`
- [ ] البحث عن `app.use(cors(`
- [ ] إضافة رابط Netlify في قائمة `origin`
- [ ] حفظ ورفع التغييرات
- [ ] انتظار Render لإعادة النشر تلقائياً

---

## 🧪 اختبار المشروع

### اختبار Backend:
- [ ] فتح رابط Render في المتصفح
- [ ] يجب أن ترى: `{"status":"ok",...}`
- [ ] اختبار endpoint:
  ```bash
  curl -X POST https://your-backend.onrender.com/ids-scan \
    -H "Content-Type: application/json" \
    -d '{"url":"https://google.com"}'
  ```

### اختبار Frontend:
- [ ] فتح رابط Netlify في المتصفح
- [ ] الصفحة الرئيسية تعمل
- [ ] التنقل بين الصفحات يعمل
- [ ] جميع الأزرار تستجيب

### اختبار الميزات:
- [ ] **URL Scanner**: فحص رابط على VirusTotal
- [ ] **Password Tools**: اختبار قوة كلمة مرور
- [ ] **Encryption Tool**: تشفير وفك تشفير نص
- [ ] **IDS Dashboard**: عرض التنبيهات (إن وجدت)
- [ ] **Quiz**: إكمال الاختبار
- [ ] **Tips**: عرض النصائح الأمنية

---

## 🐛 حل المشاكل

### إذا لم يعمل Backend:
- [ ] فحص Logs على Render Dashboard
- [ ] التأكد من إضافة `VT_API_KEY`
- [ ] التأكد من `npm install` نجح
- [ ] التأكد من `npm start` يعمل

### إذا ظهرت أخطاء CORS:
- [ ] التأكد من تحديث CORS في `server.js`
- [ ] التأكد من رفع التغييرات على GitHub
- [ ] انتظار Render لإعادة النشر

### إذا لم يعمل URL Scanner:
- [ ] التأكد من صحة `VT_API_KEY`
- [ ] التأكد من تحديث `config.js` بشكل صحيح
- [ ] فحص Console في المتصفح (F12)

---

## 📝 بعد النشر

- [ ] إضافة رابط المشروع في README على GitHub
- [ ] مشاركة المشروع مع الآخرين
- [ ] مراقبة Logs بشكل دوري
- [ ] تحديث المشروع عند الحاجة

---

## 🎉 تهانينا!

إذا أكملت جميع النقاط أعلاه، فمشروعك الآن يعمل بنجاح على الإنترنت! 🚀

---

## 📞 الحصول على المساعدة

إذا واجهت أي مشكلة:
1. راجع [DEPLOYMENT.md](./DEPLOYMENT.md) للتعليمات المفصلة
2. راجع [QUICKSTART.md](./QUICKSTART.md) للخطوات السريعة
3. افتح Issue على GitHub
4. فحص Render Logs و Netlify Logs

---

**آخر تحديث**: 2026-01-09
