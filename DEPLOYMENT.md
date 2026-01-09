# 🛡️ Cyber Awareness Hub - دليل النشر (Deployment Guide)

مشروع Cyber Awareness Hub - منصة تعليمية للتوعية بالأمن السيبراني مع نظام كشف التسلل (IDS)

## 📋 المتطلبات الأساسية

- حساب على [Render](https://render.com) للـ Backend
- حساب على [Netlify](https://netlify.com) للـ Frontend
- حساب على [VirusTotal](https://www.virustotal.com) للحصول على API Key
- حساب GitHub لرفع الكود

---

## 🚀 خطوات النشر

### 1️⃣ إعداد المشروع على GitHub

```bash
# إذا لم تكن قد رفعت المشروع بعد
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

### 2️⃣ نشر Backend على Render

#### الخطوات:

1. **إنشاء Web Service جديد:**
   - اذهب إلى [Render Dashboard](https://dashboard.render.com)
   - اضغط على "New +" → "Web Service"
   - اربط حسابك على GitHub واختر repository الخاص بالمشروع

2. **إعدادات الـ Service:**
   ```
   Name: cyber-awareness-hub-backend
   Region: Frankfurt (أو أي منطقة قريبة)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

3. **إضافة المتغيرات البيئية (Environment Variables):**
   
   اذهب إلى "Environment" وأضف المتغيرات التالية:
   
   ```
   NODE_ENV = production
   VT_API_KEY = YOUR_VIRUSTOTAL_API_KEY
   TELEGRAM_BOT_TOKEN = YOUR_TELEGRAM_BOT_TOKEN (اختياري)
   TELEGRAM_CHAT_ID = YOUR_TELEGRAM_CHAT_ID (اختياري)
   ```

4. **احفظ عنوان الـ Backend:**
   
   بعد النشر، ستحصل على رابط مثل:
   ```
   https://cyber-awareness-hub-backend.onrender.com
   ```

   **⚠️ مهم جداً:** احفظ هذا الرابط لاستخدامه في الخطوة التالية!

---

### 3️⃣ تحديث Frontend للاتصال بالـ Backend

1. **افتح ملف `public/config.js`**

2. **استبدل `YOUR-RENDER-APP-NAME` برابط الـ Backend الخاص بك:**

   ```javascript
   const API_CONFIG = {
     API_URL: window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://cyber-awareness-hub-backend.onrender.com'  // ضع رابطك هنا
   };
   ```

3. **احفظ التغييرات وارفعها على GitHub:**

   ```bash
   git add public/config.js
   git commit -m "Update API URL for production"
   git push
   ```

---

### 4️⃣ نشر Frontend على Netlify

#### الطريقة الأولى: عبر GitHub (موصى بها)

1. **اذهب إلى [Netlify](https://app.netlify.com)**

2. **اضغط على "Add new site" → "Import an existing project"**

3. **اختر GitHub وحدد repository الخاص بك**

4. **إعدادات البناء:**
   ```
   Branch to deploy: main
   Build command: (اتركه فارغ)
   Publish directory: public
   ```

5. **اضغط على "Deploy site"**

#### الطريقة الثانية: عبر Netlify CLI

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
netlify deploy --prod --dir=public
```

---

### 5️⃣ تحديث CORS على Backend (إذا لزم الأمر)

إذا واجهت مشاكل CORS، قم بتحديث `server.js`:

```javascript
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'https://your-netlify-app.netlify.app'  // ضع رابط Netlify هنا
  ] 
}));
```

ثم ارفع التغييرات:
```bash
git add server.js
git commit -m "Update CORS settings"
git push
```

Render سيقوم بإعادة النشر تلقائياً.

---

## 🔑 الحصول على VirusTotal API Key

1. اذهب إلى [VirusTotal](https://www.virustotal.com)
2. سجل دخول أو أنشئ حساب جديد
3. اذهب إلى [My API Key](https://www.virustotal.com/gui/my-apikey)
4. انسخ الـ API Key وأضفها في متغيرات البيئة على Render

---

## 📱 إعداد إشعارات Telegram (اختياري)

للحصول على تنبيهات IDS عبر Telegram:

1. **إنشاء Bot:**
   - افتح Telegram وابحث عن `@BotFather`
   - أرسل `/newbot` واتبع التعليمات
   - احفظ الـ **Bot Token**

2. **الحصول على Chat ID:**
   - ابدأ محادثة مع البوت الخاص بك
   - أرسل أي رسالة
   - افتح: `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
   - ابحث عن `"chat":{"id":123456789`
   - احفظ الـ **Chat ID**

3. **أضف المتغيرات في Render:**
   ```
   TELEGRAM_BOT_TOKEN = your_bot_token
   TELEGRAM_CHAT_ID = your_chat_id
   ```

---

## ✅ التحقق من النشر

### اختبر Backend:
```bash
# اختبر الصحة
curl https://your-backend.onrender.com/

# اختبر IDS API
curl -X POST https://your-backend.onrender.com/ids-scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

### اختبر Frontend:
- افتح رابط Netlify في المتصفح
- جرب صفحة URL Scanner
- تحقق من أن الـ IDS Dashboard يعمل

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Backend لا يستجيب
```
الحل: تحقق من logs على Render Dashboard
```

### المشكلة: CORS errors
```
الحل: تأكد من إضافة رابط Netlify في CORS settings
```

### المشكلة: VirusTotal API لا تعمل
```
الحل: تحقق من:
1. صحة API Key في متغيرات البيئة
2. لم تتجاوز حد الاستخدام المجاني (4 requests/minute)
```

---

## 📊 الميزات المتوفرة

- ✅ صفحة رئيسية مع نصائح أمنية
- ✅ أدوات التشفير
- ✅ فحص كلمات المرور
- ✅ اختبار التوعية
- ✅ IDS (نظام كشف التسلل)
- ✅ فحص الروابط عبر VirusTotal
- ✅ Phishing Awareness
- ✅ Social Engineering Guide

---

## 🔄 التحديثات المستقبلية

لتحديث المشروع:

```bash
# عدل الكود المطلوب
git add .
git commit -m "وصف التحديث"
git push

# Render و Netlify سيقومان بإعادة النشر تلقائياً
```

---

## 📝 ملاحظات مهمة

- 🆓 **Render Free Plan**: يدخل في وضع السكون بعد 15 دقيقة من عدم النشاط
- 🆓 **Netlify Free Plan**: 100GB bandwidth شهرياً
- ⏱️ **First Load**: قد يستغرق 30-60 ثانية بسبب cold start
- 🔒 **Security**: لا تشارك API Keys أبداً في الكود

---

## 📞 الدعم

إذا واجهت أي مشكلة، تحقق من:
- Render Logs: `Dashboard → Your Service → Logs`
- Netlify Logs: `Site → Deploys → Deploy log`
- Browser Console: `F12 → Console`

---

## 📄 الترخيص

ISC License

---

**تم بنجاح! 🎉 الآن مشروعك جاهز للنشر على الإنترنت**
