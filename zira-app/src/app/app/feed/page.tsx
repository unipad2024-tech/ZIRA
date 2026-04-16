import { createClient } from "@/lib/supabase/server";
import { Microscope, Bookmark, Share2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الاكتشاف العلمي" };

const CATEGORY_MAP: Record<string, { label: string; emoji: string; variant: "gold" | "green" | "purple" | "blue" | "red" | "surface" }> = {
  biology:     { label: "الأحياء",       emoji: "🧬", variant: "green" },
  chemistry:   { label: "الكيمياء",      emoji: "⚗️", variant: "purple" },
  physics:     { label: "الفيزياء",      emoji: "⚛️", variant: "blue" },
  mathematics: { label: "الرياضيات",     emoji: "📐", variant: "gold" },
  history:     { label: "التاريخ",       emoji: "🏛️", variant: "surface" },
  geography:   { label: "الجغرافيا",     emoji: "🌍", variant: "green" },
  literature:  { label: "الأدب",         emoji: "📖", variant: "gold" },
  technology:  { label: "التكنولوجيا",   emoji: "💻", variant: "blue" },
};

// Static fallback content when DB is empty
const STATIC_CONTENT = [
  {
    id: "1", title_ar: "الجهاز العصبي البشري", category: "biology",
    content_ar: "يتكون الجهاز العصبي من أكثر من 86 مليار خلية عصبية. يمكن للإشارات العصبية أن تنتقل بسرعة تصل إلى 120 متراً في الثانية.",
    image_url: null, created_at: new Date().toISOString(),
  },
  {
    id: "2", title_ar: "نظرية النسبية الخاصة", category: "physics",
    content_ar: "أثبت أينشتاين أن الزمن يمر بشكل أبطأ كلما اقتربنا من سرعة الضوء. هذا يعني أن رواد الفضاء الذين يسافرون بسرعة عالية يشيخون بشكل أبطأ.",
    image_url: null, created_at: new Date().toISOString(),
  },
  {
    id: "3", title_ar: "نظرية الأعداد الأولية", category: "mathematics",
    content_ar: "الأعداد الأولية هي أعداد تقبل القسمة على 1 وعلى نفسها فقط. أكبر عدد أولي معروف حتى الآن يحتوي على أكثر من 24 مليون رقم.",
    image_url: null, created_at: new Date().toISOString(),
  },
  {
    id: "4", title_ar: "الحضارة المصرية القديمة", category: "history",
    content_ar: "استمرت الحضارة المصرية القديمة لأكثر من 3000 سنة. بنيت الأهرامات قبل حوالي 4500 سنة وما زالت قائمة حتى اليوم.",
    image_url: null, created_at: new Date().toISOString(),
  },
  {
    id: "5", title_ar: "الذكاء الاصطناعي والتعلم العميق", category: "technology",
    content_ar: "تعمل نماذج الذكاء الاصطناعي الحديثة على مئات المليارات من المعاملات. GPT-4 تدرب على ما يزيد عن 100 تيرابايت من النصوص.",
    image_url: null, created_at: new Date().toISOString(),
  },
  {
    id: "6", title_ar: "الجدول الدوري للعناصر", category: "chemistry",
    content_ar: "يحتوي الجدول الدوري على 118 عنصراً. معظم الكون يتكون من الهيدروجين (75%) والهيليوم (24%). كل العناصر الأثقل تشكلت داخل النجوم.",
    image_url: null, created_at: new Date().toISOString(),
  },
];

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: dbContent } = await supabase
    .from("science_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const content = (dbContent && dbContent.length > 0) ? dbContent : STATIC_CONTENT;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--blue-glow)] border border-[rgba(59,130,246,0.3)] flex items-center justify-center">
          <Microscope className="w-5 h-5 text-[var(--blue)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">الاكتشاف العلمي</h1>
          <p className="text-[var(--text-muted)] text-sm">حقائق علمية مذهلة يومياً</p>
        </div>
      </div>

      {/* Daily card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a3e] to-[#0f0f25] border border-[rgba(168,85,247,0.3)] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--purple)] to-[var(--blue)] opacity-5" />
        <div className="relative">
          <Badge variant="purple" size="md" className="mb-3">✨ حقيقة اليوم</Badge>
          <p className="text-lg font-bold text-[var(--text)] leading-relaxed">
            المخ البشري يولّد ما يكفي من الكهرباء لإضاءة مصباح صغير — حتى عندما تكون نائماً!
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="green" size="sm">🧬 الأحياء</Badge>
            <button className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors ml-auto">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="text-[var(--text-muted)] hover:text-[var(--blue)] transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button className="px-3 py-1.5 rounded-full bg-[var(--gold-glow)] border border-[rgba(245,166,35,0.3)] text-[var(--gold)] text-xs font-medium whitespace-nowrap">
          الكل
        </button>
        {Object.values(CATEGORY_MAP).map((cat) => (
          <button key={cat.label} className="px-3 py-1.5 rounded-full bg-[var(--bg-surface2)] border border-[var(--border)] text-[var(--text-soft)] text-xs font-medium whitespace-nowrap hover:text-[var(--text)] hover:border-[var(--gold)] transition-colors">
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.map((item, i) => {
          const cat = CATEGORY_MAP[item.category] ?? { label: item.category, emoji: "📚", variant: "surface" as const };
          return (
            <div
              key={item.id}
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--gold)] transition-all duration-200 group animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Color accent top */}
              <div className={`h-1 rounded-full mb-4 bg-gradient-to-r ${
                cat.variant === "green" ? "from-[var(--green)] to-emerald-400" :
                cat.variant === "purple" ? "from-[var(--purple)] to-violet-400" :
                cat.variant === "blue" ? "from-[var(--blue)] to-sky-400" :
                cat.variant === "gold" ? "from-[var(--gold)] to-yellow-400" :
                "from-zinc-500 to-zinc-400"
              }`} />

              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-[var(--text)] leading-snug">{item.title_ar}</h3>
                <span className="text-xl shrink-0">{cat.emoji}</span>
              </div>

              <p className="text-sm text-[var(--text-soft)] leading-relaxed mb-4">{item.content_ar}</p>

              <div className="flex items-center justify-between">
                <Badge variant={cat.variant} size="sm">{cat.label}</Badge>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="text-[var(--text-muted)] hover:text-[var(--blue)] transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
