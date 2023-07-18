import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import Input from "../Input";

const dataFallBack = {
  name: "",
  about: "",
  social: {
    twitter: "",
    mastodon: "",
    instagram: "",
    github: "",
    website: "",
    linkedin: "",
    youtube: "",
    dailydev: "",
  },
};

const General = () => {
  const { user } = useContext(C) as ContextValue;
  const [data, setData] = useState<{
    name: string;
    about: string;
    social: {
      twitter: string;
      mastodon: string;
      instagram: string;
      github: string;
      website: string;
      linkedin: string;
      youtube: string;
      dailydev: string;
    };
  }>(dataFallBack);

  console.log({ data, user });

  useEffect(() => {
    if (user?.user.handle) {
      setData(user?.user.handle);
    }
  }, [user]);

  const { mutateAsync, isLoading } = api.handles.updateHandle.useMutation();

  const handleUpdate = async () => {
    const response = await mutateAsync(data);
    if (response) {
      toast.success("Updated successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="relative w-full p-8">
      <h1 className="mb-8 text-4xl font-semibold text-gray-700 dark:text-text-secondary">
        General Settings
      </h1>

      <Input
        input_type="text"
        name="name"
        onChange={(e) => {
          setData((prev) => ({ ...prev, name: e.target.value }));
        }}
        placeholder="Publication Name"
        type="INPUT"
        value={data.name}
        autoFocus={false}
        required={false}
        variant="FILLED"
        label="Publication Name"
      />
      <Input
        input_type="text"
        name="about"
        onChange={(e) => {
          setData((prev) => ({ ...prev, about: e.target.value }));
        }}
        placeholder="Tell the world the best thing about you…"
        type="TEXTAREA"
        required={false}
        value={data.about}
        variant="FILLED"
        label="About me"
      />

      <div className="mb-4 flex flex-wrap gap-4">
        {/* {generalSettingsSocials.map((e) => (
          <div className="w-full md:w-[calc(100%/2-1rem)]" key={e.id}>
            <div className="flex items-center gap-2">
              {e.icon}
              <span className="text-base font-semibold text-gray-700 dark:text-text-primary">
                {e.label}
              </span>
            </div>

            <Input
              input_type="text"
              name={e.name}
              onChange={(value) => {
                setData({
                  ...data,
                  social: {
                    ...data.social,
                    [value.target.name]: value.target.value,
                  },
                });
              }}
              placeholder={e.placeholder}
              type="INPUT"
              value={data.social[e.name as keyof typeof data.social]}
              required={false}
              variant="FILLED"
            />
          </div>
        ))} */}
      </div>

      <div className="w-full py-4">
        <button
          disabled={isLoading}
          onClick={() => void handleUpdate()}
          className={`btn-outline flex gap-2 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </section>
  );
};
export default General;
