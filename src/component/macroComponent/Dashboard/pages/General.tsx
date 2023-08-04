import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "~/component/miniComponent";
import { api } from "~/utils/api";
import { generalSettingsSocials } from "~/utils/constants";

const dataFallBack = {
  name: "",
  about: "",
  handle: "",
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
  const { data: user } = useSession();
  const [data, setData] = useState<{
    name: string;
    about: string;
    handle: string;
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

  useEffect(() => {
    if (user?.user.handle) {
      const { appearance, ...rest } = user?.user.handle;
      setData({
        ...rest,
        social: {
          twitter: rest.social?.twitter || "",
          mastodon: rest.social?.mastodon || "",
          instagram: rest.social?.instagram || "",
          github: rest.social?.github || "",
          website: rest.social?.website || "",
          linkedin: rest.social?.linkedin || "",
          youtube: rest.social?.youtube || "",
          dailydev: rest.social?.dailydev || "",
        },
        about: rest.about || "",
      });
    }
  }, [user]);

  const { mutateAsync, isLoading } = api.handles.updateHandle.useMutation();

  const handleUpdate = async () => {
    const response = await mutateAsync(data);
    if (response) {
      toast.success("Updated successfully");
      window.location.reload();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-text-secondary sm:mb-8 md:text-3xl lg:text-4xl">
        General Settings
      </h1>

      <div className="mb-4">
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
          opacity={true}
          variant="FILLED"
          label="Publication Name"
        />
      </div>
      <div className="mb-4">
        <Input
          input_type="text"
          name="handle"
          onChange={(e) => {
            setData((prev) => ({ ...prev, handle: e.target.value }));
          }}
          placeholder="Publication Slug"
          type="INPUT"
          value={data.handle}
          autoFocus={false}
          required={false}
          opacity={true}
          description={
            "This is the slug that will be used in your publication URL. It can only contain lowercase letters, and dashes."
          }
          variant="FILLED"
          label="Publication Slug"
        />
      </div>
      <div className="mb-4">
        <Input
          input_type="text"
          name="about"
          onChange={(e) => {
            setData((prev) => ({ ...prev, about: e.target.value }));
          }}
          placeholder="Tell the world the best thing about you…"
          type="TEXTAREA"
          required={false}
          opacity={true}
          value={data.about}
          variant="FILLED"
          label="About me"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        {generalSettingsSocials.map((e) => (
          <div className="w-full md:w-[calc(100%/2-1rem)]" key={e.id}>
            <label htmlFor={e.name} className="flex items-center gap-2">
              {e.icon}
              <span className="text-base font-semibold text-gray-700 dark:text-text-primary">
                {e.label}
              </span>
            </label>

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
              opacity={true}
              placeholder={e.placeholder}
              type="INPUT"
              value={data.social[e.name as keyof typeof data.social]}
              required={false}
              variant="FILLED"
            />
          </div>
        ))}
      </div>

      <div className="w-full py-4">
        <button
          disabled={isLoading}
          onClick={() => void handleUpdate()}
          className={`btn-outline flex gap-2 ${isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
};
export default General;
