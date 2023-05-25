import Image from "next/image";
import path from "path";
import fs from "fs";
import { useState } from "react";
import Ai from "./../../svgs/Ai";
import Search from "./../../svgs/Search";
import Hamburger from "./../../svgs/Hamburger";

const Svg = ({ svgs }: { svgs: string[] }) => {
  const [copied, setCopied] = useState(false);

  const handleCipboard = async (text: string) => {
    // copy the text to the clipboard
    await navigator.clipboard.writeText(`/svgs/${text}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      <section className="relative min-h-screen bg-gray-800 p-8">
        <main className="">
          <h1 className="text-xl font-semibold text-gray-100">SVG:</h1>
          <div className="flex flex-wrap gap-4">
            {svgs.map((svg) => (
              <div
                title={svg}
                onClick={() => void handleCipboard(svg)}
                className="flex h-20 w-20 cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-md hover:bg-gray-700"
                key={svg}
              >
                <Image
                  src={`/svgs/${svg}`}
                  width={40}
                  height={40}
                  alt=""
                  className="h-8 w-10"
                />
                <span className="max-height-one text-center text-xs text-white">
                  {svg}
                </span>
              </div>
            ))}
          </div>
        </main>
        {copied && (
          <div className="fixed bottom-6 right-6 flex w-72 items-center justify-between rounded-md bg-gray-700 px-6 py-4 text-white">
            <span>Copied</span>
            <span>
              <Image
                src="/svgs/times.svg"
                width={20}
                height={20}
                alt=""
                className="h-5 w-5"
              />
            </span>
          </div>
        )}
      </section>
    </>
  );
};

export default Svg;

export const getServerSideProps = () => {
  const svgs = fs.readdirSync(path.join(process.cwd(), "public/svgs"));

  return {
    props: {
      svgs,
    },
  };
};
