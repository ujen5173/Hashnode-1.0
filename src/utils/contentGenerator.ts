import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env.mjs";

const genAI = new GoogleGenerativeAI(env.NEXT_PUBLIC_GENERATIVE_AI_KEY);
export const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    maxOutputTokens: 1234,
  },
});

const generateContent = async ({
  type,
  subject,
}: {
  type: "TITLE" | "SUBTITLE" | "CONTENT";
  subject?: string;
}) => {
  let prompt = "";
  switch (type) {
    case "TITLE":
      prompt =
        "Write 1 short, simple and interesting title for a blog post on tech genre. Don't add quotation marks.";
      break;
    case "SUBTITLE":
      prompt = subject
        ? "Write 1 short, simple and interesting subtitle for a tech blog post on '" +
          subject +
          "'. Don't add quotation marks."
        : "Write 1 short, simple and interesting subtitle for a blog post on tech genre. Don't add quotation marks.";
      break;
    case "CONTENT":
      prompt =
        "You are an AI writing assistant that continues existing text based on context from prior text. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        (subject
          ? "Write on topic of '" + subject + "'. "
          : "Write on topic of tech genre. ") +
        "Make your response interesting, fun, make sure to construct complete sentences. Don't add quotation marks at the start and in the end of the response. " +
        "Use HTML tags to format your response. Use proper html tags to make the response more appeling. " +
        "Use the following tags only: h1, h2, h3, ul, li, ol, p, code, span, blockquote. " +
        "Avoid using the following tags: a, img, iframe, video, audio, table, tr, td, th, div, pre, hr, br. ";
      break;

    default:
      prompt =
        "You are an AI writing assistant that continues existing text based on context from prior text. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        "Write a title for a blog post on tech genre. ";
      break;
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

export default generateContent;
