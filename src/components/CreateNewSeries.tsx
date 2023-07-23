import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import Input from "./Input";

const CreateNewSeries = () => {
  const [data, setData] = useState({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
  });

  const { mutateAsync, isLoading } = api.series.new.useMutation();

  const handleSubmit = async () => {
    const res = await mutateAsync(data);
    if (res) {
      toast.success("Series created successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="relative w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-text-secondary">
          New Series
        </h1>
      </header>
      <main>
        <div className="mb-4">
          <Input
            label="Series name"
            placeholder="Enter series name"
            input_type="text"
            type="INPUT"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            variant="FILLED"
            name="title"
            required={false}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Series Slug"
            placeholder="Enter series Slug"
            input_type="text"
            type="INPUT"
            value={data.slug}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            variant="FILLED"
            name="slug"
            required={false}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Describe the series"
            placeholder="In this series, I will..."
            input_type="text"
            type="TEXTAREA"
            value={data.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            variant="FILLED"
            name="description"
            required={false}
          />
        </div>

        <button
          onClick={() => void handleSubmit()}
          disabled={isLoading}
          className={`btn-outline
          ${
            isLoading
              ? "cursor-not-allowed bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-500"
              : ""
          }
        `}
        >
          Create
        </button>
      </main>
    </section>
  );
};

export default CreateNewSeries;
