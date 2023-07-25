import React, { type FC } from "react";
import { Input } from "~/component/miniComponent";
import { type UserDetails } from "~/types";

const SocialInfo: FC<{
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSocialChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  data: UserDetails;
}> = ({ handleSocialChange, handleChange, data }) => {
  return (
    <div className="flex-1">
      <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
        Social
      </h1>
      <Input
        label="Twitter Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://twitter.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.twitter}
        name="twitter"
        onChange={handleSocialChange}
      />

      <Input
        label="Instagram Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://instagram.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.instagram}
        name="instagram"
        onChange={handleSocialChange}
      />

      <Input
        label="Facebook Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://facebook.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.facebook}
        name="facebook"
        onChange={handleSocialChange}
      />

      <Input
        label="LinkedIn Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://linkedin.com/in/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.linkedin}
        name="linkedin"
        onChange={handleSocialChange}
      />

      <Input
        label="Youtube Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://youtube.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.youtube}
        name="youtube"
        onChange={handleSocialChange}
      />

      <Input
        label="Stackoverflow Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://stackoverflow.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.stackoverflow}
        name="stackoverflow"
        onChange={handleSocialChange}
      />

      <Input
        label="Github Profile"
        type="INPUT"
        variant="FILLED"
        placeholder="https://github.com/johndoe"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.github}
        name="github"
        onChange={handleSocialChange}
      />

      <Input
        label="Website"
        type="INPUT"
        variant="FILLED"
        placeholder="https://johndoe.com"
        input_type="text"
        disabled={false}
        required={false}
        value={data.social.website}
        name="website"
        onChange={handleSocialChange}
      />

      <h1 className="mb-4 mt-8 text-base font-semibold text-gray-700 dark:text-text-secondary">
        Profile Identity
      </h1>

      <Input
        label="Username"
        type="INPUT"
        variant="FILLED"
        placeholder="johndoe"
        input_type="text"
        disabled={false}
        required={true}
        value={data.username}
        name="username"
        onChange={handleChange}
      />

      <Input
        label="Email"
        type="INPUT"
        variant="FILLED"
        placeholder="johndoe@example.com"
        input_type="email"
        disabled={true}
        required={true}
        value={data.email}
        name="email"
        onChange={handleChange}
      />
    </div>
  );
};

export default SocialInfo;
