# Ton

تطبيق ويب عربي لبناء Prompts واقعية لصور سيلفي داخل غرفة نوم.

**استخدم التطبيق:** https://ton-seven-nu.vercel.app/

---

## ما يفعله التطبيق

تختار إعدادات الكاميرا والغرفة والإضاءة والملابس والشعر والوضعية وتعابير الوجه واليد الحرة.
يمكنك البدء بأحد السيناريوهات الجاهزة ثم تعديل الخيارات كما تريد.
يُنشئ التطبيق ثلاثة نصوص قابلة للنسخ، بهدف وصف صورة فوتوغرافية طبيعية وتجنب المظاهر المصطنعة الشائعة في صور AI.
التطبيق يبني نصوصاً فقط؛ لا يرفع صورة مرجعية ولا يولّد الصور بنفسه.

---

## المخرجات الثلاثة

- **Prompt (English):** وصف إنجليزي قابل للنسخ إلى أدوات توليد الصور مثل Midjourney وDALL-E وStable Diffusion.
- **Prompt (العربية):** وصف عربي للفهم والاستخدام باللغة العربية.
- **Negative Prompt:** قيود مرتبطة بالمشهد، ومنها قيود اليد بحسب ظهورها في الإطار.

---

## المميزات

- 10 مجموعات قابلة للطي ضمن 4 تبويبات: الكاميرا، الغرفة، الشخص، ومتقدم.
- 6 سيناريوهات جاهزة مع إمكانية تعديل الخيارات بعد تطبيق أي منها.
- 33 حقلاً في `SceneState`، منها `handPlacement` القديم للتوافق؛ 32 مدخلاً ظاهراً في الواجهة.
- 71 اختباراً باستخدام Vitest.
- واجهة عربية باتجاه RTL تعمل على الجوال والكمبيوتر، مع معاينة حية ونسخ النص.

---

## التقنية

- Next.js 15 (App Router)، وفق نطاق الإصدار في `package.json`.
- TypeScript وTailwind CSS.
- Vitest للاختبارات، وESLint وPrettier لجودة الكود.
- GitHub Actions لفحوص CI، وVercel للاستضافة.

---

## البنية

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── features/prompt-studio/
│   ├── types.ts
│   ├── promptBuilder.ts
│   ├── promptBuilder.test.ts
│   ├── scenarios.ts
│   └── scenarios.test.ts
├── lib/
│   ├── project-info.ts
│   └── project-info.test.ts
└── types/
    └── css.d.ts
```

السلسلة: `UI → SceneState → buildPromptArabic / buildPromptEnglish / buildNegativePrompt → نصوص`.
تطبّق `scenarios.ts` إعدادات جاهزة على `SceneState`، ويمكن تغييرها بعد الاختيار.

---

## التشغيل المحلي

يتطلب Node.js 22+ وnpm.

### 1. Vercel (موصى به)

الرابط المباشر: https://ton-seven-nu.vercel.app/ . مع ربط المشروع بـGit، يؤدي دفع التغييرات إلى `main` إلى نشر نسخة الإنتاج تلقائياً.

### 2. Linux / macOS / Windows

```bash
git clone https://github.com/EmadAden77/Ton.git
cd Ton
npm install
npm run dev
```

افتح `http://localhost:3000`.

### 3. Android / Termux

بعد تثبيت Git وNode.js 22+ في Termux:

```bash
git clone https://github.com/EmadAden77/Ton.git
cd Ton
npm install
npm run dev -- --webpack
```

استخدم `--webpack` لأن Turbopack لا يدعم ARM64 في بيئة Termux المستخدمة هنا.

## الفحوص

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
```

ينفذ CI أيضاً `npm ci`، ويشغّل مهمة منفصلة للتنسيق الآلي عند الحاجة.
