import { useState } from "react";
// import * as Icon from "../svgs";
import { X } from "lucide-react";

const Icons = () => {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <div className="flex flex-wrap gap-4 p-16 bg-white dark:bg-black">
      <X className="stroke-gray-900 dark:stroke-gray-100" />
      {/* {
        Object.values(Icon).map((ele, i) => (
          <div key={i} onClick={() => {
            setSelected(prev => [...prev, i]);
          }} className={`w-10 h-10 flex items-center justify-center rounded-md ${selected.includes(i) ? "bg-green" : "bg-gray-100"}`}>
            {ele({ className: "w-4 h-4 fill-gray-900 stroke-gray-900" })}
          </div>
        ))
      } */}
    </div>
  )
}

export default Icons