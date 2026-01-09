# 🛡️ Cyber Awareness Hub

<div dir="rtl">

## نظام شامل للتوعية بالأمن السيبراني مع نظام كشف التسلل (IDS)

منصة تعليمية تفاعلية باللغة العربية لرفع مستوى الوعي بالأمن السيبراني، تتضمن أدوات عملية وتدريبات تفاعلية.

</div>

---

## ✨ الميزات الرئيسية

### 🎓 محتوى تعليمي شامل
- **نصائح أمنية**: دليل شامل لحماية الأجهزة والحسابات
- **Phishing Awareness**: دليل التعرف على رسائل التصيد الاحتيالي
- **Social Engineering**: شرح تقنيات الهندسة الاجتماعية
- **اختبارات تفاعلية**: Quiz لاختبار المعرفة الأمنية

### 🔧 أدوات عملية
- **🔐 أدوات التشفير**: تشفير وفك تشفير النصوص (AES, RSA)
- **🔑 فحص كلمات المرور**: تقييم قوة كلمات المرور
- **🔍 URL Scanner**: فحص الروابط باستخدام VirusTotal API
- **🛡️ IDS Dashboard**: لوحة تحكم لرصد التهديدات الأمنية

### 📊 نظام كشف التسلل (IDS)
- رصد محاولات الهجوم في الوقت الفعلي
- تسجيل تفاصيل الأنشطة المشبوهة
- إشعارات عبر Telegram (اختياري)
- تحليل أنماط الهجمات

---

## 🚀 البدء السريع

### المتطلبات
- Node.js (v18 أو أحدث)
- npm أو yarn

### التثبيت المحلي

```bash
# استنساخ المشروع
git clone https://github.com/ahmadhamad970/cyber-awareness-hub.git
cd cyber-awareness-hub

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
cp .env.example .env

# تحرير .env وإضافة API Keys الخاصة بك
# VT_API_KEY=your_virustotal_api_key

# تشغيل السيرفر
npm start
```

افتح المتصفح على: `http://localhost:3000`

---

## 📦 بنية المشروع

```
cyber-awareness-hub/
├── public/                    # ملفات Frontend
│   ├── index.html            # الصفحة الرئيسية
│   ├── encryption.html       # أدوات التشفير
│   ├── password-tools.html   # فحص كلمات المرور
│   ├── url-scanner.html      # فحص الروابط
│   ├── ids.html              # لوحة IDS
│   ├── quiz.html             # اختبار تفاعلي
│   ├── style.css             # التنسيقات
│   └── config.js             # إعدادات API
├── server.js                 # Backend الرئيسي
├── ids-middleware.mjs        # IDS Middleware
├── ids-server.mjs            # IDS Server منفصل
├── package.json              # المكتبات
├── render.yaml               # إعدادات Render
├── netlify.toml              # إعدادات Netlify
└── DEPLOYMENT.md             # دليل النشر الكامل
```

---

## 🌐 النشر على الإنترنت

### خيارات النشر الموصى بها:
- **Backend**: Render (مجاني)
- **Frontend**: Netlify (مجاني)

### خطوات النشر السريعة:

1. **ارفع المشروع على GitHub**
2. **نشر Backend على Render** → [دليل مفصل](./DEPLOYMENT.md#2️⃣-نشر-backend-على-render)
3. **نشر Frontend على Netlify** → [دليل مفصل](./DEPLOYMENT.md#4️⃣-نشر-frontend-على-netlify)

📖 **للتعليمات الكاملة، اقرأ ملف [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🔑 المتغيرات البيئية (Environment Variables)

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# إعدادات السيرفر
PORT=3000
NODE_ENV=development

# VirusTotal API (مطلوب لفحص الروابط)
VT_API_KEY=your_virustotal_api_key

# Telegram (اختياري - للإشعارات)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### الحصول على API Keys:
- **VirusTotal**: [virustotal.com/gui/my-apikey](https://www.virustotal.com/gui/my-apikey)
- **Telegram Bot**: تحدث مع [@BotFather](https://t.me/BotFather)

---

## 🎯 الاستخدام

### للتطوير المحلي:
```bash
npm start          # تشغيل السيرفر الرئيسي
npm run start:ids  # تشغيل IDS Server منفصل
```

### للإنتاج:
```bash
npm start
```

---

## 🧪 الاختبار

### اختبار IDS:
```bash
# محاكاة هجوم SQL Injection
curl -X POST http://localhost:3000/log-attack \
  -H "Content-Type: application/json" \
  -d '{"type":"SQL Injection","endpoint":"/api/test"}'
```

### اختبار URL Scanner:
```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

---

## 📱 واجهات المستخدم

### الصفحات المتاحة:
- `/` - الصفحة الرئيسية
- `/tips.html` - نصائح أمنية
- `/encryption.html` - أدوات التشفير
- `/password-tools.html` - فحص كلمات المرور
- `/url-scanner.html` - فحص الروابط
- `/ids.html` - لوحة IDS
- `/phishing-awareness.html` - دليل التصيد الاحتيالي
- `/social-engineering.html` - الهندسة الاجتماعية
- `/quiz.html` - اختبار المعرفة

---

## 🔒 الأمان

- ✅ CORS محمي
- ✅ Rate limiting على جميع الـ endpoints
- ✅ تشفير البيانات الحساسة
- ✅ Helmet.js headers (يمكن تفعيله)
- ✅ Input validation
- ✅ IDS لرصد الهجمات

---

## 🤝 المساهمة

المساهمات مرحب بها! لإضافة ميزات جديدة:

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

---

## 📝 الترخيص

ISC License - مفتوح المصدر للاستخدام التعليمي والتجاري

---

## 🐛 الإبلاغ عن المشاكل

إذا وجدت مشكلة أو لديك اقتراح:
1. افتح [Issue جديد](https://github.com/ahmadhamad970/cyber-awareness-hub/issues)
2. وصف المشكلة بالتفصيل
3. أرفق screenshots إن أمكن

---

## 📞 التواصل

- **GitHub**: [@ahmadhamad970](https://github.com/ahmadhamad970)
- **Project**: [cyber-awareness-hub](https://github.com/ahmadhamad970/cyber-awareness-hub)

---

## 🙏 شكر وتقدير

هذا المشروع مبني باستخدام:
- Express.js
- VirusTotal API
- Web Crypto API
- Telegram Bot API

---

<div align="center">

**صنع بـ ❤️ لرفع الوعي بالأمن السيبراني في العالم العربي**

⭐ إذا أعجبك المشروع، لا تنسى إعطائه نجمة!

</div>
