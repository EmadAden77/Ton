import { getProjectStatus } from "@/lib/project-info";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-10">
          <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            {getProjectStatus()}
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Ton
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            أساس تقني نظيف لتطبيق عربي يبني Prompts لسيلفي واقعي مع احترام الهوية،
            الفيزياء، التشريح، الإضاءة وسلوك كاميرا الهاتف.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-slate-400">الواجهة</p>
              <p className="mt-2 font-semibold">Arabic-first + RTL</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-slate-400">الأساس</p>
              <p className="mt-2 font-semibold">Next.js + TypeScript</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-slate-400">الجودة</p>
              <p className="mt-2 font-semibold">ESLint + Vitest + Prettier</p>
            </article>
          </div>

          <div className="mt-10 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-5 text-sm leading-7 text-amber-100/90">
            Phase 1A لا تحتوي بعد على محرر Prompt أو رفع صور أو ربط API. هذه الصفحة تؤكد أن
            أساس المشروع يعمل قبل بناء الخصائص فوقه.
          </div>
        </div>
      </section>
    </main>
  );
}
