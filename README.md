# Ton

تطبيق عربي لبناء وصف نصي لمشهد سيلفي داخل غرفة نوم. يركز التطوير على فصل حالة المشهد عن صياغة النص والواجهة.

## الحالة

دُمجت Phase 1A (أساس المشروع) وPhase 1C (إثبات بنية توليد النص) في `main`. تُبنى Phase 1B على شكل أقسام صغيرة؛ قسم الكاميرا هو الشريحة الحالية.

الواجهة عربية باتجاه RTL وبخلفية داكنة. تعرض اختيارات اللقطة والإضاءة والكاميرا، مع معاينة نصية تتغير عند تغييرها. لا يوجد رفع صورة أو توليد صورة أو اتصال بمزوّد خارجي.

## البنية

- `src/features/prompt-studio/types.ts`: تعريف `SceneState` لخيارات المشهد.
- `src/features/prompt-studio/promptBuilder.ts`: دالة `buildPromptArabic` النقية والخرائط العربية.
- `src/features/prompt-studio/promptBuilder.test.ts`: اختبارات نص اللقطة والإضاءة والكاميرا.
- `src/app/page.tsx`: عناصر الاختيار والمعاينة الحية.

السلسلة المستخدمة: `SceneState → buildPromptArabic → نص عربي`. لا توجد طبقة تحقق من المشهد في هذه الشريحة.

## المتطلبات والتشغيل

يتطلب المشروع Node.js 22+ وnpm. ثبّت الاعتماديات الموجودة في ملف القفل:

```bash
npm ci
npm run dev
```

افتح `http://localhost:3000`. على Android/Termux استخدم Webpack لأن Turbopack غير مدعوم على ARM64:

```bash
npm run dev -- --webpack
```

## الفحوص

يشغّل CI خمسة فحوص/خطوات جودة: `npm ci`، `npm run lint`، `npm run typecheck`، `npm run test`، `npm run format:check`.

لا تضع مفاتيح API أو كلمات مرور في المستودع. أي تكامل مستقبلي مع مزوّد صور يحتاج إبقاء المفتاح في الخادم.
