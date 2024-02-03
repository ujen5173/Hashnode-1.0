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
        timeTook: z.string(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await transporter.sendMail({
        from: "Hashnode Clone Team",
        to: env.TO,
        subject: "Hashnode Clone Feedback",
        html: `
        <div class="feedback-container-style">
          <div class="feedback-container-body">
            <div class="feedback-image-style">
              <img src={"~/public/hashnode-logo-full.png"} alt="Hashnode Clone Logo" />
            </div>

            <h1 class="feedback-title">Hashnode Clone Feedback</h1>

            <div class="feedback-content">
              <div class="feedback-card">Name / Email Address: ${input.name ?? "NaN"}</div>
              <div class="feedback-card">
                <span>Rating:</span>
               ${(() => {
                 switch (input.rating) {
                   case "0":
                     return `<img src="~/public/emojies/Astonished%20Face.png" alt="" />`;
                   case "1":
                     return `<img src="~/public/emojies/Slightly%20Smiling%20Face.png" alt="" />`;
                   case "2":
                     return `<img src="~/public/emojies/Pink%20Heart.png" alt="" />`;
                   case "3":
                     return `<img src="~/public/emojies/Disappointed%20Face.png" alt="" />`;
                   case "4":
                     return `<img src="~/public/emojies/Face%20Vomiting.png" alt="" />`;
                   default:
                     return `<img src="~/public/emojies/Pink%20Heart.png" alt="" />`;
                 }
               })()}
              </div>
              <div class="feedback-card">
                Feedback: ${input.feedback}
              </div>
            </div>
          </div>
        </div>
      `,
      });
      return {
        success: true,
      };
    }),
});

export { feedbackRouter };
