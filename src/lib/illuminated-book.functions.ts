import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askIlluminatedBook = createServerFn({ method: "POST" })
  .inputValidator(input => z.object({ question: z.string().trim().min(3).max(2000) }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "خدمة الإجابات غير مهيأة حاليًا." };
    try {
      const { answerReligiousQuestion } = await import("./illuminated/answer.server");
      return { ok: true as const, ...await answerReligiousQuestion(data.question, key) };
    } catch (error) {
      const detail = error as { responseBody?: string; message?: string };
      let message = detail.message || "تعذر الاتصال بخدمة الإجابات. لم يُعد إرسال السؤال تلقائيًا.";
      if (detail.responseBody) {
        try {
          const body = JSON.parse(detail.responseBody);
          message = body.message || body.error?.message || message;
        } catch { /* Keep the original safe service message. */ }
      }
      return { ok: false as const, error: message };
    }
  });