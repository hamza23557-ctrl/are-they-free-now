import { Link } from "@/quran/wouter-shim";
import { ChevronRight } from "lucide-react";

const sections: { title: string; body: string[] }[] = [
  { title: "مقدمة", body: ["يحترم تطبيق «تقوى القلوب | محمد صديق المنشاوي | تطبيق متكامل» خصوصيتك. توضح هذه الصفحة البيانات التي يتعامل معها التطبيق وكيف تُستخدم."] },
  { title: "البيانات المحفوظة على جهازك", body: ["المفضلة والعلامات وإعدادات التذكير وعدّاد التسبيح تُحفظ على هاتفك فقط، ولا تُرسل إلينا.", "تُحذف هذه البيانات إذا حذفت التطبيق أو مسحت بياناته من إعدادات الهاتف."] },
  { title: "الموقع الجغرافي", body: ["يُستخدم موقعك فقط لحساب مواقيت الصلاة واتجاه القبلة، وبعد موافقتك. لا نحفظ موقعك ولا نشاركه مع أحد لأغراض تجارية."] },
  { title: "حساسات الحركة", body: ["تُستخدم بوصلة الهاتف في صفحة القبلة فقط لتحديد الاتجاه، ولا تُحفظ قراءاتها."] },
  { title: "الإشعارات", body: ["تُجهَّز تذكيرات الأذكار والتسابيح داخل هاتفك، ويمكنك إيقافها في أي وقت من صفحة «الإشعارات والتذكير» أو من إعدادات الهاتف."] },
  { title: "أسئلة «الكتاب المضيئ»", body: ["عند طرح سؤال يُرسل نص السؤال إلى خدمة ذكاء اصطناعي لإعداد الإجابة. لا تكتب في سؤالك معلومات شخصية أو حساسة."] },
  { title: "الإعلانات", body: ["يعرض التطبيق إعلانات عبر Google AdMob. قد تجمع جوجل معرّف الإعلانات في جهازك وبيانات تقنية عامة لعرض الإعلانات وقياسها، وفق سياسة خصوصية جوجل: policies.google.com/privacy", "يمكنك إعادة ضبط معرّف الإعلانات أو تقييد الإعلانات المخصصة من إعدادات جوجل في هاتفك.", "تم منع فئات الإعلانات غير اللائقة قدر الإمكان."] },
  { title: "الأطفال", body: ["التطبيق مناسب لجميع الأعمار، ولا نجمع عن قصد أي بيانات شخصية من الأطفال."] },
  { title: "التغييرات على هذه السياسة", body: ["قد نحدّث هذه السياسة من وقت لآخر، وتظهر النسخة الأحدث دائمًا في هذه الصفحة."] },
  { title: "التواصل", body: ["لأي استفسار عن الخصوصية، راسلنا على البريد: hamza152524@gmail.com"] },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-4" dir="rtl">
      <div className="flex items-center gap-2">
        <Link href="/" className="p-2 text-foreground" aria-label="العودة"><ChevronRight /></Link>
        <h1 className="text-2xl font-bold text-foreground">سياسة الخصوصية</h1>
      </div>
      <p className="text-sm text-muted-foreground">آخر تحديث: أكتوبر 2026</p>
      {sections.map((s) => (
        <section key={s.title} className="space-y-2 rounded-xl border border-border bg-card p-4">
          <h2 className="font-bold text-foreground">{s.title}</h2>
          {s.body.map((p) => <p key={p} className="leading-7 text-muted-foreground">{p}</p>)}
        </section>
      ))}
    </div>
  );
}
