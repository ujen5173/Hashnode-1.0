
import { useState, type FC } from 'react';
import { toast } from 'react-toastify';
import z from "zod";
import { type SocialHandles, type UserDetails } from '~/types';
import { api } from '~/utils/api';
import { BasicInfo, SocialInfo } from '../macroComponent/Settings';

const Settings: FC<{ user: UserDetails }> = ({ user }) => {
  const { mutateAsync, isLoading } = api.users.updateUser.useMutation();

  const [data, setData] = useState<UserDetails>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      social: {
        ...data.social,
        [e.target.name]: e.target.value,
      },
    });
  };

  const updateHandler = async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be atleast 3 characters long"),
      username: z.string().min(3, "Username must be atleast 3 characters long"),
      email: z.string().email("Invalid Email"),
      location: z.string().nullable(),
      image: z.string().nullable(),
      tagline: z.string().nullable(),
      available: z.string().nullable(),
      cover_image: z.string().nullable(),
      bio: z.string().nullable(),
      skills: z.string().trim().nullable(),
      social: z.object({
        twitter: z.string(),
        instagram: z.string(),
        github: z.string(),
        stackoverflow: z.string(),
        facebook: z.string(),
        website: z.string(),
        linkedin: z.string(),
        youtube: z.string(),
      }),
    });

    try {
      const dataWithSocial = {
        ...data,
        social: {
          twitter: data.social.twitter || "",
          instagram: data.social.instagram || "",
          github: data.social.github || "",
          stackoverflow: data.social.stackoverflow || "",
          facebook: data.social.facebook || "",
          website: data.social.website || "",
          linkedin: data.social.linkedin || "",
          youtube: data.social.youtube || "",
        },
      };
      schema.parse(dataWithSocial);
      const socialHandles: (keyof SocialHandles)[] = [
        "twitter",
        "instagram",
        "github",
        "stackoverflow",
        "facebook",
        "website",
        "linkedin",
        "youtube",
      ];

      for (const handle of socialHandles) {
        const url = dataWithSocial.social[handle];
        if (url !== "") {
          try {
            z.string().url().parse(url);
          } catch (error) {
            if (error instanceof Error) {
              toast.error(`Invalid URL in ${handle}`);
              return;
            }
          }
        }
      }
      const res = await mutateAsync({
        ...dataWithSocial,
        skills: dataWithSocial.skills.trim().length > 0 ? dataWithSocial.skills.split(",").map((e) => e.trim()).filter(e => e !== "") : [],
        social: dataWithSocial.social,
      });

      toast.success(res.message);
      setData(JSON.parse(JSON.stringify({
        ...res.data[0],
        skills: (res.data[0]?.skills ?? []).join(", "),
      })) as UserDetails);
    } catch (error) {
      if (error instanceof z.ZodError && error.errors[0]) {
        toast.error(error.errors[0].message);
      }
    }
  };


  return (
    <>
      <div className="flex flex-col gap-8 md:flex-row">
        <BasicInfo handleChange={handleChange} data={data} />

        <SocialInfo
          data={data}
          handleChange={handleChange}
          handleSocialChange={handleSocialChange}
        />
      </div>

      <button
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.5 : 1,
        }}
        className={`${isLoading ? "cursor-not-allowed" : ""} btn-filled`}
        onClick={() => void updateHandler()}
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </>
  )
}

export default Settings;