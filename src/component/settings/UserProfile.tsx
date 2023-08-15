
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
      location: z.string().optional(),
      profile: z.string().optional(),
      tagline: z.string().optional(),
      available: z.string().optional(),
      cover_image: z.string().optional(),
      bio: z.string().optional(),
      skills: z.string().trim().optional(),
      social: z.object({
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        github: z.string().optional(),
        stackoverflow: z.string().optional(),
        facebook: z.string().optional(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
        youtube: z.string().optional(),
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
        skills: dataWithSocial.skills.trim().length > 0 ? dataWithSocial.skills.split(",").map((e) => e.trim()) : [],
        social: dataWithSocial.social,
      });

      toast.success("Profile Updated Successfully");
      setData(res.data);
    } catch (error) {
      if (error instanceof z.ZodError && error.errors[0]) {
        toast.error(error.errors[0].message);
      }
    }
  };


  return (<><div className="flex flex-col gap-8 md:flex-row">
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
  </>)
}

export default Settings;