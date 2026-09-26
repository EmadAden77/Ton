# Ton

تطبيق ويب عربي لبناء Prompts منظمة لسيلفي واقعي داخل غرفة نوم، مع إعطاء الأولوية للهوية المرجعية، الفيزياء، التشريح، الإضاءة وسلوك تصوير الهاتف.

## الحالة الحالية

**Phase 1A: Draft / غير مختبرة بعد**

هذه النسخة موجودة في الفرع `phase/1a-foundation` ولم يتم اعتبارها مكتملة بعد، لأن `npm install` وفحوص الجودة لم تُشغّل في بيئة التنفيذ الحالية.

الموجود حالياً:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Vitest
- واجهة عربية RTL أولية ومتجاوبة
- ملف `.env.example` لتوضيح مكان أسرار الخادم مستقبلاً

لا توجد في هذه المرحلة أي API خارجية، قاعدة بيانات، تسجيل دخول، Zustand أو Prompt Engine.

## تثبيت الاعتماديات

تمت إزالة أرقام الإصدارات غير المتحقق منها. يستخدم `package.json` حالياً وسم `latest` بدلاً من اختراع أرقام إصدارات.

عند التثبيت المحلي، نفّذ:

```bash
npm install
```

وسيُنشئ npm ملف `package-lock.json` الذي يثبت الإصدارات الفعلية التي تم حلها وقت التثبيت.

إذا أردت إنشاء الأساس من الصفر بدلاً من استخدام الفرع الحالي، استخدم:

```bash
npx create-next-app@latest ton --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd ton
npm install --save-dev vitest prettier eslint-config-prettier
```

## التشغيل

```bash
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## فحوص الجودة المطلوبة قبل اعتماد Phase 1A

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

صفحة داكنة عربية باتجاه RTL تحمل اسم **Ton** وشارة **Phase 1A draft** وثلاث بطاقات توضح الأساس التقني.

كما يجب أن تظهر ملاحظة صريحة بأن النسخة Draft وغير مختبرة بعد.

لا يفترض أن ترى محرر Prompt أو رفع صورة في هذه المرحلة.

## متى تعتبر Phase 1A مكتملة؟

فقط بعد نجاح:

1. `npm install`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run dev` وفتح الصفحة بنجاح

حتى ذلك الوقت لا نستخدم كلمة Ready ولا ننتقل إلى Phase 1B.

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

- Phase 1B: الهيكل البصري لأقسام الاستوديو فقط، بعد موافقة المستخدم على Phase 1A.
- Phase 1C: SceneState مبسط + Validator بسيط + PromptBuilder + اختبار + Live Preview.
- Phase 2 وما بعدها: إضافة الأقسام بالتدرج مع قواعد التوافق والاختبارات.
