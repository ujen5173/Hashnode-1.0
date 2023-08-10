import React, { type FC } from "react";
import { Input } from "~/component/miniComponent";
import { type UserDetails } from "~/types";

const BasicInfo: FC<{
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  data: UserDetails;
}> = ({ handleChange, data }) => {
  return (
    <div className="flex-1">
      <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
        Basic Info
      </h1>

      <Input
        label="Full name"
        type="INPUT"
        variant="FILLED"
        placeholder="John Doe"
        input_type="text"
        disabled={false}
        required={true}
        value={data.name}
        name="name"
        onChange={handleChange}
      />

      <Input
        label="Profile Tagline"
        type="INPUT"
        variant="FILLED"
        placeholder="Software Engineer @..."
        input_type="text"
        disabled={false}
        required={true}
        value={data.tagline}
        name="tagline"
        onChange={handleChange}
      />

      <Input
        label="Location"
        type="INPUT"
        variant="FILLED"
        placeholder="Kathmandu, Nepal"
        input_type="text"
        disabled={false}
        required={false}
        value={data.location}
        name="location"
        onChange={handleChange}
      />

      <Input
        label="Profile Bio (About you)"
        type="TEXTAREA"
        variant="FILLED"
        placeholder="I am a developer from ..."
        input_type="text"
        disabled={false}
        required={false}
        value={data.bio}
        max={500}
        name="bio"
        onChange={handleChange}
      />

      <Input
        label="Tech Stack"
        type="INPUT"
        variant="FILLED"
        placeholder="Python, Javascript, ..."
        input_type="text"
        disabled={false}
        required={false}
        value={data.skills}
        name="skills"
        onChange={handleChange}
      />

      <Input
        label="Available for"
        type="TEXTAREA"
        variant="FILLED"
        placeholder="I am available for mentoring, ..."
        input_type="text"
        disabled={false}
        required={false}
        value={data.available}
        max={500}
        name="available"
        onChange={handleChange}
      />
    </div>
  );
};

export default BasicInfo;
