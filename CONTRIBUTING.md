# 🤝 المساهمة في المشروع (Contributing)

شكراً لاهتمامك بالمساهمة في **Cyber Awareness Hub**! نرحب بجميع المساهمات.

---

## 🎯 أنواع المساهمات المطلوبة

### 💡 أفكار جديدة
- اقتراح ميزات جديدة
- تحسينات على الواجهة
- أدوات أمنية إضافية
- محتوى تعليمي جديد

### 🐛 الإبلاغ عن المشاكل
- أخطاء في الكود
- مشاكل في الأداء
- مشاكل في التوافق
- أخطاء إملائية أو لغوية

### 📝 التوثيق
- تحسين README
- إضافة أمثلة
- ترجمات
- شروحات فيديو

### 💻 كود
- إصلاح Bugs
- إضافة ميزات جديدة
- تحسين الأداء
- إعادة هيكلة الكود

---

## 🚀 كيفية المساهمة

### 1. Fork المشروع
```bash
# اضغط على زر Fork في GitHub
```

### 2. Clone المشروع
```bash
git clone https://github.com/YOUR_USERNAME/cyber-awareness-hub.git
cd cyber-awareness-hub
```

### 3. إنشاء Branch جديد
```bash
git checkout -b feature/amazing-feature
# أو
git checkout -b fix/bug-name
```

### 4. إعداد البيئة المحلية
```bash
npm install
cp .env.example .env
# أضف API Keys في .env
npm start
```

### 5. إجراء التعديلات
- اكتب كود نظيف ومنظم
- اتبع نمط الكود الموجود
- أضف تعليقات عند الحاجة
- اختبر التعديلات جيداً

### 6. Commit التغييرات
```bash
git add .
git commit -m "وصف واضح للتعديل"
```

**نصائح لرسائل Commit جيدة:**
- ✅ "إضافة ميزة فحص SSL للروابط"
- ✅ "إصلاح مشكلة CORS في IDS API"
- ✅ "تحسين واجهة Password Tools"
- ❌ "تعديلات"
- ❌ "fix"

### 7. Push للـ Branch
```bash
git push origin feature/amazing-feature
```

### 8. فتح Pull Request
1. اذهب إلى repository الأصلي
2. اضغط "New Pull Request"
3. اختر branch الخاص بك
4. اكتب وصف تفصيلي للتغييرات
5. اضغط "Create Pull Request"

---

## 📋 معايير القبول

### ✅ Checklist قبل فتح PR:

- [ ] الكود يعمل بدون أخطاء
- [ ] تم اختبار الميزة الجديدة
- [ ] لم يتم كسر أي ميزات موجودة
- [ ] الكود يتبع نمط المشروع
- [ ] تم إضافة تعليقات للكود المعقد
- [ ] تم تحديث التوثيق (إذا لزم)
- [ ] لا توجد معلومات حساسة (API Keys, passwords)

---

## 🎨 معايير الكود

### JavaScript/Node.js
```javascript
// ✅ استخدم const/let بدلاً من var
const API_KEY = process.env.VT_API_KEY;

// ✅ استخدم async/await بدلاً من callbacks
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// ✅ أضف error handling
try {
  const data = await fetchData();
} catch (error) {
  console.error("Error:", error);
}

// ✅ استخدم أسماء واضحة
function calculatePasswordStrength(password) {
  // ...
}
```

### HTML/CSS
```html
<!-- ✅ استخدم semantic HTML -->
<section class="container">
  <header>
    <h1>العنوان</h1>
  </header>
  <main>
    <!-- المحتوى -->
  </main>
</section>

<!-- ✅ استخدم classes واضحة -->
<button class="btn btn-primary scan-button">
  فحص
</button>
```

---

## 🌍 الترجمة

نرحب بترجمة المحتوى لأي لغة:

1. أنشئ مجلد `i18n/` إذا لم يكن موجوداً
2. أضف ملفات الترجمة:
   - `i18n/en.json` (الإنجليزية)
   - `i18n/fr.json` (الفرنسية)
   - إلخ...

---

## 🐛 الإبلاغ عن Bug

عند فتح Issue لـ Bug:

### معلومات مطلوبة:
- **وصف المشكلة**: ماذا حدث؟
- **الخطوات لإعادة إنتاج المشكلة**: كيف نصل لنفس المشكلة؟
- **السلوك المتوقع**: ماذا كان من المفترض أن يحدث؟
- **Screenshots**: إذا أمكن
- **البيئة**:
  - نظام التشغيل: (Windows, Mac, Linux)
  - المتصفح: (Chrome, Firefox, Safari)
  - نسخة Node.js: `node --version`

### مثال:

```markdown
## وصف المشكلة
عند الضغط على "فحص" في URL Scanner، لا يحدث شيء

## خطوات إعادة الإنتاج
1. افتح `url-scanner.html`
2. أدخل رابط: `https://google.com`
3. اضغط "فحص"
4. لا توجد استجابة

## السلوك المتوقع
يجب أن يظهر نتائج الفحص

## البيئة
- OS: Windows 11
- Browser: Chrome 120
- Node: v18.17.0

## Screenshots
[أرفق صورة]
```

---

## 💡 اقتراح ميزة جديدة

عند فتح Issue لميزة:

### معلومات مطلوبة:
- **وصف الميزة**: ما هي الفكرة؟
- **الفائدة**: لماذا هذه الميزة مفيدة؟
- **مثال على الاستخدام**: كيف سيتم استخدامها؟

### مثال:

```markdown
## وصف الميزة
إضافة فحص أمان البريد الإلكتروني

## الفائدة
يساعد المستخدمين على معرفة إذا كان بريدهم مخترق

## مثال الاستخدام
1. المستخدم يدخل email
2. النظام يفحص عبر HaveIBeenPwned API
3. عرض النتائج: آمن أو مخترق
```

---

## 🎓 أفكار للمساهمة

إذا لم تكن متأكداً من أين تبدأ:

### للمبتدئين:
- [ ] تحسين الترجمة والنصوص
- [ ] إضافة المزيد من الأسئلة في Quiz
- [ ] تحسين التنسيقات (CSS)
- [ ] إضافة أيقونات جديدة
- [ ] تحسين README

### متوسط:
- [ ] إضافة Dark Mode
- [ ] تحسين IDS Dashboard بمزيد من الإحصائيات
- [ ] إضافة Password Generator
- [ ] إضافة Email Security Checker
- [ ] تحسين الأداء

### متقدم:
- [ ] إضافة Database (SQLite/MongoDB)
- [ ] إضافة Authentication System
- [ ] بناء API متقدم
- [ ] إضافة Machine Learning للكشف عن التهديدات
- [ ] بناء Mobile App

---

## 📞 التواصل

- **Issues**: للمشاكل والاقتراحات
- **Discussions**: للنقاشات العامة
- **Pull Requests**: للمساهمات

---

## 🙏 شكراً

كل مساهمة، مهما كانت صغيرة، تساعد في تحسين المشروع. شكراً لك! ❤️

---

## 📄 الترخيص

بالمساهمة في هذا المشروع، أنت توافق على أن مساهمتك ستكون مرخصة بنفس ترخيص المشروع (ISC License).
