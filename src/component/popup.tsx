import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Confetti from "react-confetti";
import useWindowSize from "~/hooks/useWindow";

const Popup = ({
  setPopup,
}: {
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { width, height } = useWindowSize();
  const { data: user } = useSession();

  return (
    <>
      <Confetti width={width} height={height} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        <div
          className="absolute inset-0 h-full w-full bg-black opacity-50"
          onClick={() => {
            setPopup(false);
            localStorage.setItem("remove_popup", JSON.stringify(true));
          }}
        />
        <div className="relative z-[60] rounded-md border border-border-light bg-white p-4 shadow-xl dark:border-border dark:bg-primary">
          <header className="flex items-center justify-between border-b border-border-light pb-4 dark:border-border">
            <h1 className="text-black dark:text-white">Whats New?</h1>
            <button
              className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="close"
              onClick={() => {
                setPopup(false);
                localStorage.setItem("remove_popup", JSON.stringify(true));
              }}
            >
              <X />
            </button>
          </header>

          <section className="border-b border-border-light py-4 dark:border-border">
            <ul className="list-inside list-disc">

              <li className="py-2 text-slate-700 dark:text-white">
                Added AI generation for free/paid users (MUST TRY)
              </li>
            </ul>
          </section>

          <footer className="flex justify-end pt-4">
            <Link
              onClick={() => {
                setPopup(false);
                localStorage.setItem("remove_popup", JSON.stringify(true));
              }}
              href={user ? "/article/new" : "/onboard"}
              className="btn-filled"
            >
              Lets see
            </Link>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Popup;
