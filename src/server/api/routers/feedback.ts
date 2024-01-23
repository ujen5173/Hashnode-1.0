import { z } from "zod";
import { env } from "~/env.mjs";
import transporter from "~/utils/nodemailer";
import { createTRPCRouter, publicProcedure } from "../trpc";

const feedbackRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        rating: z.enum(["0", "1", "2", "3", "4"]),
        feedback: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await transporter.sendMail({
        from: "Hashnode Clone Team",
        to: env.TO,
        subject: "Hashnode Clone Feedback",
        html: `
        <div>
          <h1 style="font-weight: bold; font-size: 24px;">Hashnode Clone Feedback</h1>
          <strong  style="font-weight: bold; margin-bottom:8px; font-size: 18px;">Experience: ${(() => {
            switch (input.rating) {
              case "0":
                return "Amazed 😲";
              case "1":
                return "Nice 👍";
              case "2":
                return "Average 😐";
              case "3":
                return "Disapointed 😔";
              case "4":
                return "Bad 😡";
            }
          })()}</strong>
          <br />
          <strong  style="font-weight: bold; font-size: 18px;">Feedback:</strong> ${
            input.feedback
          }
        </div>
      `,
      });
      return {
        success: true,
      };
    }),
});

export { feedbackRouter };
