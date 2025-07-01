# 🧪 نظام اختبار الألوان للكشف عن المواد

نظام متقدم لاختبار الألوان للكشف عن المواد المختلفة باستخدام تقنيات الذكاء الاصطناعي والتحليل الرقمي.

## ✨ المميزات

### 🔬 اختبارات شاملة
- **اختبارات مجانية**: أول 5 اختبارات مجانية لجميع المستخدمين
- **اختبارات متقدمة**: مكتبة شاملة من اختبارات الكشف
- **نتائج دقيقة**: تحليل رقمي متطور للألوان
- **تقارير مفصلة**: نتائج مع شرح علمي مفصل

### 👤 إدارة المستخدمين
- **تسجيل آمن**: نظام مصادقة متقدم مع Firebase
- **ملفات شخصية**: تتبع الاستخدام والتاريخ
- **لوحة تحكم**: إحصائيات مفصلة للاستخدام
- **دعم متعدد اللغات**: العربية والإنجليزية

### 💳 نظام الاشتراكات
- **نموذج مجاني**: 5 اختبارات مجانية
- **اشتراك شهري**: 29 ريال سعودي للوصول الكامل
- **دفع آمن**: تكامل مع Tap Company
- **إلغاء مرن**: يمكن الإلغاء في أي وقت

## 🚀 التقنيات المستخدمة

### Frontend
- **Next.js 14**: إطار عمل React مع App Router
- **TypeScript**: أمان الأنواع والتطوير المتقدم
- **Tailwind CSS**: تصميم سريع ومرن
- **Framer Motion**: رسوم متحركة سلسة
- **React Hook Form**: إدارة النماذج المتقدمة

### Backend & Database
- **Firebase**: قاعدة بيانات وتوثيق
- **Firestore**: قاعدة بيانات NoSQL سحابية
- **Firebase Auth**: نظام مصادقة آمن
- **API Routes**: واجهات برمجة تطبيقات Next.js

### Payment Integration
- **Tap Company**: معالج دفع سعودي محلي
- **Webhooks**: تحديثات فورية للمدفوعات
- **SAR Support**: دعم الريال السعودي
- **Multiple Payment Methods**: مدى، فيزا، ماستركارد

## 📦 التثبيت والإعداد

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- حساب Firebase
- حساب Tap Company

### خطوات التثبيت

1. **استنساخ المشروع**
   ```bash
   git clone [repository-url]
   cd color-testing-drug-detection
   ```

2. **تثبيت التبعيات**
   ```bash
   npm install
   # أو
   yarn install
   ```

3. **إعداد متغيرات البيئة**
   ```bash
   cp .env.local.example .env.local
   ```
   
   قم بتحديث الملف بالقيم الصحيحة:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # Tap Payment Configuration
   TAP_SECRET_KEY=sk_test_your_tap_secret_key
   NEXT_PUBLIC_TAP_PUBLISHABLE_KEY=pk_test_your_tap_publishable_key
   
   # Application URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **إعداد Firebase**
   ```bash
   npm run setup:database
   ```

5. **تشغيل التطبيق**
   ```bash
   npm run dev
   ```

## 💳 إعداد نظام الدفع

### لماذا Tap Company؟
- ✅ **مرخص سعودياً** من البنك المركزي السعودي
- ✅ **رسوم أقل** مقارنة بالمنصات الدولية
- ✅ **تحويل فوري** للحسابات السعودية
- ✅ **دعم عربي كامل** مع خدمة عملاء محلية
- ✅ **دعم جميع البنوك السعودية** بما في ذلك بطاقات مدى

### إعداد Tap Company
راجع الدليل المفصل: [TAP_SETUP_GUIDE.md](./TAP_SETUP_GUIDE.md)

### هيكل الرسوم
- **بطاقات مدى**: 1.75% + 1 ريال
- **البطاقات الدولية**: 2.75% + 1 ريال
- **المحافظ الرقمية**: 1.75% + 1 ريال
- **التحويلات البنكية**: مجانية للحسابات السعودية

## 🧪 الاختبار

### بطاقات الاختبار
```bash
# بطاقة ناجحة
4508750015741019

# بطاقة مرفوضة
4000000000000002

# أموال غير كافية
4000000000009995

# تاريخ الانتهاء: أي تاريخ مستقبلي (مثل 12/25)
# CVC: أي 3 أرقام (مثل 123)
```

### تشغيل الاختبارات
```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📁 هيكل المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # صفحات التوثيق
│   ├── dashboard/         # لوحة التحكم
│   └── tests/             # صفحات الاختبارات
├── components/            # مكونات React
│   ├── auth/              # مكونات التوثيق
│   ├── dashboard/         # مكونات لوحة التحكم
│   ├── subscription/      # مكونات الاشتراك
│   └── ui/                # مكونات واجهة المستخدم
├── lib/                   # مكتبات ومساعدات
│   ├── firebase.ts        # إعداد Firebase
│   ├── tap-service.ts     # خدمة Tap للدفع
│   └── subscription-service.ts # خدمة الاشتراكات
└── data/                  # بيانات الاختبارات
```

## 🔧 الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run build            # بناء للإنتاج
npm run start            # تشغيل الإنتاج
npm run lint             # فحص الكود

# قاعدة البيانات
npm run setup:database   # إعداد قاعدة البيانات
npm run setup:admin      # إعداد حساب المدير
npm run test:database    # اختبار الاتصال

# الاختبارات
npm test                 # تشغيل الاختبارات
npm run test:watch       # مراقبة الاختبارات
npm run test:coverage    # تقرير التغطية
```

## 🌐 النشر

### Vercel (موصى به)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# رفع مجلد .next للنشر
```

### خادم مخصص
```bash
npm run build
npm start
```

## 📚 الوثائق الإضافية

- [دليل إعداد Tap Company](./TAP_SETUP_GUIDE.md)
- [دليل إعداد الاشتراكات](./SUBSCRIPTION_SETUP.md)
- [دليل الاختبار](./TESTING_GUIDE.md)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء.

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

- **البريد الإلكتروني**: support@example.com
- **الهاتف**: +966 XX XXX XXXX
- **الموقع**: [example.com](https://example.com)

---

صُنع بـ ❤️ في السعودية
