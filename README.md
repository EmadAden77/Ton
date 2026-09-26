# Ton

تطبيق ويب عربي لبناء Prompts منظمة لسيلفي واقعي داخل غرفة نوم، مع إعطاء الأولوية للهوية المرجعية، الفيزياء، التشريح، الإضاءة وسلوك تصوير الهاتف.

## الحالة الحالية

**Phase 1A: Project Foundation**

تم إعداد الأساس فقط:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Vitest
- واجهة عربية RTL أولية ومتجاوبة
- ملف `.env.example` لتوضيح مكان أسرار الخادم مستقبلاً

لا توجد في هذه المرحلة أي API خارجية، قاعدة بيانات، تسجيل دخول، Zustand أو Prompt Engine.

## المتطلبات

- Node.js 22.12 أو أحدث
- npm

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## فحوص الجودة

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
```

ولتنسيق الملفات تلقائياً:

```bash
npm run format
```

## ما المتوقع رؤيته؟

صفحة داكنة عربية باتجاه RTL تحمل اسم **Ton** وشارة **Phase 1A ready** وثلاث بطاقات توضح الأساس التقني. لا يفترض أن ترى محرر Prompt أو رفع صورة في هذه المرحلة.

## العمارة المستهدفة

```text
UI
  ↓
Structured SceneState
  ↓
Scene Validator
  ↓
Prompt Builder
  ↓
Arabic Prompt / English Prompt / Negative Constraints
```

سيتم إثبات هذه السلسلة عملياً في **Phase 1C** بعد بناء الهيكل البصري في Phase 1B.

## الأمن والخصوصية

- لا تضع أي مفتاح API أو كلمة مرور في المستودع.
- الأسرار المستقبلية توضع محلياً في `.env.local` أو في Secret Store على منصة النشر.
- أي مفتاح لمزود صور يجب أن يبقى في الخادم، وفق المسار: `Browser → Next.js Server → Provider API`.
- المشروع لا يضمن ثبات الهوية 100%، لأن النتيجة النهائية تعتمد على قدرات وسياسات نموذج الصور الخارجي.

## المراحل القادمة

- Phase 1B: الهيكل البصري لأقسام الاستوديو فقط.
- Phase 1C: SceneState مبسط + Validator بسيط + PromptBuilder + اختبار + Live Preview.
- Phase 2 وما بعدها: إضافة الأقسام بالتدرج مع قواعد التوافق والاختبارات.
