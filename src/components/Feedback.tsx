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
      <div className="relative w-80 rounded-xl bg-blue-600 p-4 shadow-xl shadow-white/10">
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
  const [timeTook, setTimeTook] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<"0" | "1" | "2" | "3" | "4">("2");

  const sendFeedback = async () => {
    if (!feedback) return;
    await mutateAsync({
      name,
      feedback,
      timeTook,
      rating: rating,
    });

    setSend(true);
    setTimeout(() => {
      close();
      setFeedbackForm(false);
    }, 1000);
  };

  const emojies = {
    "0": "Astonished%20Face.png",
    "3": "Slightly%20Smiling%20Face.png",
    "2": "Pink%20Heart.png",
    "1": "Disappointed%20Face.png",
    "4": "Face%20Vomiting.png",
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

      <div className="relative z-[80] w-11/12 max-w-[400px] rounded-xl border border-border-light bg-white p-4 dark:border-border dark:bg-slate-900 md:w-7/12">
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
          <X className="h-5 w-5 cursor-pointer text-black dark:text-white" />
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

        <div className="mb-4">
          <label className="mb-2 block text-slate-800 dark:text-slate-200">
            How is Data fetching experience: (Optional)
          </label>
          <input
            value={timeTook}
            onChange={(e) => setTimeTook(e.target.value)}
            className="input-filled mb-4"
            placeholder="Time took to load the data? (1sec, 2sec, 3sec)"
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
                  className={`cursor-pointer rounded-xl p-2 ${
                    rating.toString() === key
                      ? "bg-blue-600"
                      : "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setRating(key as "0" | "1" | "2" | "3" | "4")}
                >
                  <Image
                    src={`/emojies/${value}`}
                    alt={`${value.replace("%20", " ")}`}
                    width="55"
                    height="55"
                  />
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
              className={`${
                send ? "bg-green" : "bg-blue-600"
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
