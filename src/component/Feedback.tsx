import { X } from "lucide-react";
import Image from "next/image";
import { useState, type FC } from "react";
import { api } from "~/utils/api";

const Feedback: FC<{
  close: () => void;
  setFeedbackForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ close, setFeedbackForm }) => {

  return (
    <>
      <div className="relative w-80 rounded-xl p-4 shadow-xl shadow-white/10 bg-blue-600">
        <div onClick={() => close()} className="absolute right-2 top-2 p-2">
          <X className="h-5 w-5 cursor-pointer text-white" />
        </div>
        <h1 className="mb-4 text-xl font-bold text-white">
          How would you rate your experience?
        </h1>

        <div className="flex gap-4">
          <button
            className="rounded-lg bg-black px-4 py-2 font-bold text-white transition hover:bg-slate-800"
            onClick={() => {
              setFeedbackForm(true);
            }}
          >
            Send Feedback
          </button>
          <button
            className="rounded-lg bg-white px-4 py-2 font-bold text-black transition hover:bg-slate-200"
            onClick={() => void close()}
          >
            Cancel
          </button>
        </div>
      </div>

    </>
  );
};

export default Feedback;

export const FeedbackForm = ({
  close,
  setFeedbackForm,
}: {
  close: () => void;
  setFeedbackForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutateAsync, isLoading } = api.feedback.send.useMutation();
  const [send, setSend] = useState(false);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<"0" | "1" | "2" | "3" | "4">("2");

  const sendFeedback = async () => {
    if (!feedback) return;
    await mutateAsync({
      name,
      feedback,
      rating: rating,
    });

    setSend(true);
    setTimeout(() => {
      close();
      setFeedbackForm(false);
    }, 1000);
  };

  const emojies = {
    "0": <Amazed />,
    "1": <Nice />,
    "2": <Average />,
    "3": <Disapointed />,
    "4": <Vomit />,
  } as const;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div
        onClick={() => {
          void setFeedbackForm(false);
          void close();
        }}
        className="absolute inset-0 z-[70] bg-black/20 backdrop-blur-sm"
      ></div>

      <div className="relative z-[80] w-7/12 max-w-[400px] rounded-xl border border-border-light bg-white p-4 dark:border-border dark:bg-slate-900">
        <h1 className="mb-4 text-xl font-bold text-black dark:text-white">
          Share your Feedback
        </h1>
        <div
          onClick={() => {
            void setFeedbackForm(false);
            void close();
          }}
          className="absolute right-2 top-2 p-2"
        >
          <X className="h-5 w-5 cursor-pointer text-white" />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-slate-800 dark:text-slate-200">
            Name or Email Address: (Optional)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-filled mb-4"
            placeholder="John Doe / john@example.com"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-slate-800 dark:text-slate-200">
            How would you rate your experience?
          </label>

          <div className="mb-6 flex items-center justify-between gap-3">
            {Object.entries(emojies).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className={`cursor-pointer rounded-xl p-2 ${rating.toString() === key
                    ? "bg-blue-600"
                    : "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  onClick={() => setRating(key as "0" | "1" | "2" | "3" | "4")}
                >
                  {value}
                </div>
              );
            })}
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="input-filled mb-4 h-32"
            placeholder="Write your feedback here..."
          />
          <div className="flex justify-end gap-4">
            <button
              className={`${send ? "bg-green" : "bg-blue-600"
                } rounded-lg px-4 py-2 font-bold text-white transition`}
              onClick={() => void sendFeedback()}
            >
              {isLoading
                ? "Sending..."
                : send
                  ? "Send Successfully"
                  : "Send Feedback"}
            </button>
            <button
              className="rounded-lg bg-white px-4 py-2 font-bold text-black transition hover:bg-slate-200"
              onClick={() => {
                void setFeedbackForm(false);
                void close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Amazed = () => {
  return (
    <Image
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Astonished%20Face.png"
      alt="Astonished Face"
      width="55"
      height="55"
    />
  );
};

const Disapointed = () => {
  return (
    <Image
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Disappointed%20Face.png"
      alt="Disappointed Face"
      width="55"
      height="55"
    />
  );
};

const Nice = () => {
  return (
    <Image
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pink%20Heart.png"
      alt="Pink Heart"
      width="55"
      height="55"
    />
  );
};

const Average = () => {
  return (
    <Image
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Slightly%20Smiling%20Face.png"
      alt="Slightly Smiling Face"
      width="55"
      height="55"
    />
  );
};

const Vomit = () => {
  return (
    <Image
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Vomiting.png"
      alt="Face Vomiting"
      width="55"
      height="55"
    />
  );
};
