import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

const Appearance = () => {
  const { mutateAsync, isLoading } = api.handles.updateHandle.useMutation();
  const { data: user } = useSession();

  const [appearance, setAppearance] = useState<{
    layout: "MAGAZINE" | "STACKED" | "GRID";
  }>({
    layout: "STACKED",
  });

  const handleUpdate = async () => {
    const res = await mutateAsync({
      appearance: appearance,
    });

    if (res) {
      toast.success("Appearance updated successfully");
    } else {
      toast.error("Failed to update appearance");
    }
  };

  return (
    <section className="relative w-full">
      <h1 className="mb-8 text-4xl font-semibold text-gray-700 dark:text-text-secondary">
        Appearance Settings
      </h1>

      <main>
        <h1 className="mb-2 text-lg font-semibold text-gray-700 dark:text-text-secondary">
          Homepage layout
        </h1>
        <div className="mb-8 flex items-center gap-12">
          <AppearenceRadioButton
            label="Magazine Layout"
            imagePath="/layout_magazine.png"
            defaultChecked={
              user?.user.handle?.appearance?.layout === "MAGAZINE" || false
            }
            setAppearance={setAppearance}
          />
          <AppearenceRadioButton
            label="Stacked Layout"
            imagePath="/layout_stacked.png"
            defaultChecked={
              user?.user.handle?.appearance?.layout === "STACKED" || false
            }
            setAppearance={setAppearance}
          />
          <AppearenceRadioButton
            label="Grid Layout"
            imagePath="/layout_grid.png"
            defaultChecked={
              user?.user.handle?.appearance?.layout === "GRID" || false
            }
            setAppearance={setAppearance}
          />
        </div>

        <button
          disabled={isLoading}
          className={`btn-outline ${isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          onClick={() => void handleUpdate()}
        >
          {isLoading ? "Updating..." : "Update"}{" "}
        </button>
      </main>
    </section>
  );
};
export default Appearance;

const AppearenceRadioButton = ({
  label,
  imagePath,
  defaultChecked = false,
  setAppearance,
}: {
  label: string;
  imagePath: string;
  defaultChecked?: boolean;
  setAppearance: React.Dispatch<
    React.SetStateAction<{
      layout: "MAGAZINE" | "STACKED" | "GRID";
    }>
  >;
}) => {
  return (
    <div className="flex flex-1 gap-2">
      <input
        type="radio"
        name="Layout"
        id={label}
        className="appearence-radio-button mr-2"
        defaultChecked={defaultChecked}
        onChange={() => {
          setAppearance({
            layout: label.toUpperCase().replace("LAYOUT", "").trim() as
              | "MAGAZINE"
              | "STACKED"
              | "GRID",
          });
        }}
      />
      <label
        htmlFor={label}
        className="flex flex-col items-center gap-2 font-semibold text-gray-700 dark:text-text-secondary"
      >
        <Image
          src={imagePath}
          alt={label}
          className="w-full overflow-hidden rounded-md border border-border-light object-cover dark:border-border"
          width={1200}
          height={500}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};
