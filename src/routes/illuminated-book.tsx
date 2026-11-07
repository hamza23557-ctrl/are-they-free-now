import { createFileRoute } from "@tanstack/react-router";
import IlluminatedBook from "@/quran/pages/illuminated-book";

export const Route = createFileRoute("/illuminated-book")({
  head: () => ({ meta: [
    { title: "الكتاب المضيئ | سؤال وجواب ديني" },
    { name: "description", content: "أسئلة دينية وإجابات تعليمية بالذكاء الاصطناعي مع النصوص المرجعية وإخلاء المسؤولية." },
    { property: "og:title", content: "الكتاب المضيئ | سؤال وجواب ديني" },
    { property: "og:description", content: "اسأل عن القرآن والتفسير والدين، واقرأ الإجابة مع مراجعها المتاحة." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: IlluminatedBook,
});