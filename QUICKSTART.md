# 📋 Quick Start Guide - دليل البدء السريع

## خطوات النشر (3 دقائق فقط!)

### 1. رفع المشروع على GitHub ✅

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cyber-awareness-hub.git
git push -u origin main
```

---

### 2. نشر Backend على Render 🚀

1. اذهب إلى: https://dashboard.render.com
2. اضغط **New +** → **Web Service**
3. اختر repository الخاص بك
4. املأ البيانات:
   - **Name**: `cyber-awareness-hub-backend`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. أضف Environment Variables:
   ```
   VT_API_KEY = احصل عليه من virustotal.com/gui/my-apikey
   ```
6. اضغط **Create Web Service**
7. **احفظ الرابط**: مثلاً `https://cyber-awareness-hub-backend.onrender.com`

---

### 3. تحديث رابط API في المشروع 🔗

افتح ملف `public/config.js` وحدث السطر:

```javascript
API_URL: window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://YOUR-RENDER-URL-HERE.onrender.com'  // ضع رابط Render هنا
```

ثم:
```bash
git add public/config.js
git commit -m "Update API URL"
git push
```

---

### 4. نشر Frontend على Netlify 🌐

#### الطريقة السهلة (Drag & Drop):
1. اذهب إلى: https://app.netlify.com
2. اسحب مجلد `public` وضعه في المربع

#### الطريقة الأفضل (Git):
1. في Netlify: **Add new site** → **Import from Git**
2. اختر GitHub ثم repository
3. الإعدادات:
   - **Publish directory**: `public`
   - اترك Build command فارغاً
4. اضغط **Deploy**

---

### 5. تحديث CORS (إذا لزم) ⚙️

إذا ظهرت أخطاء CORS:

1. افتح `server.js`
2. ابحث عن `app.use(cors(`
3. غيرها إلى:
```javascript
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'  // رابط Netlify هنا
  ] 
}));
```
4. احفظ وارفع:
```bash
git add server.js
git commit -m "Update CORS"
git push
```

---

## ✅ اختبر المشروع

- افتح رابط Netlify في المتصفح
- جرب URL Scanner
- شاهد IDS Dashboard

---

## 🎉 تهانينا!

مشروعك الآن على الإنترنت! 🚀

للمساعدة الكاملة: اقرأ [DEPLOYMENT.md](./DEPLOYMENT.md)
