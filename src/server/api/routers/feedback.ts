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
        <div className="feedback-container-style">
          <div className="feedback-container-body">
            <div className="feedback-image-style">
              <img src="/static/hashnode-logo-full.png alt="Hashnode Clone Logo" />
            </div>

            <h1 className="feedback-title">Hashnode Clone Feedback</h1>

            <div className="feedback-content">
              <div className="feedback-card">Name / Email Address: ${input.name ?? "NaN"}</div>
              <div className="feedback-card">
                <span>Rating:</span>
               ${(() => {
                 switch (input.rating) {
                   case "0":
                     return `<img src="/emojies/Astonished%20Face.png" alt="" />`;
                   case "1":
                     return `<img src="/emojies/Slightly%20Smiling%20Face.png" alt="" />`;
                   case "2":
                     return `<img src="/emojies/Pink%20Heart.png" alt="" />`;
                   case "3":
                     return `<img src="/emojies/Disappointed%20Face.png" alt="" />`;
                   case "4":
                     return `<img src="/emojies/Face%20Vomiting.png" alt="" />`;
                   default:
                     return `<img src="/emojies/Pink%20Heart.png" alt="" />`;
                 }
               })()}
              </div>
              <div className="feedback-card">
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
