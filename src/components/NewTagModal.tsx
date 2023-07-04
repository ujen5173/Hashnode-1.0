import { TRPCClientError } from "@trpc/client";
import React, { useState, type FC } from "react";
import { toast } from "react-toastify";
import { Times } from "~/svgs";
import { api } from "~/utils/api";
import Input from "./Input";

export const NewTagModal: FC<{
  setCreateTagState: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
}> = ({ setCreateTagState, query }) => {
  const [newTag, setNewTag] = useState<{
    name: string;
    description: string;
    logo?: string | null;
  }>({
    name: query,
    description: "",
    logo: null,
  });

  const { mutateAsync, isLoading } = api.tags.new.useMutation();

  const handleCreateNew = async () => {
    try {
      if (!newTag.name || !newTag.description) {
        alert("Please fill up the name and description");
        return;
      }

      if (newTag.name.length < 3) {
        toast.error("Name should be at least 3 characters long");
        return;
      }

      await mutateAsync(newTag);
      setCreateTagState(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        console.log({ err });
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => setCreateTagState(false)}
        className="absolute inset-0 z-40 bg-black bg-opacity-40 backdrop-blur"
      ></div>
      <div className="relative z-50 w-full min-w-[350px] max-w-[550px] overflow-hidden rounded-md border border-border-light bg-light-bg dark:border-border dark:bg-primary">
        <div className="flex items-center justify-between border-b border-border-light p-4 dark:border-border">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
            Create New Tag
          </h1>

          <button
            role="button"
            aria-label="Close Modal"
            onClick={() => setCreateTagState(false)}
          >
            <Times className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
          </button>
        </div>

        <div className="p-4">
          <Input
            label="Tag Name"
            type="INPUT"
            variant="FILLED"
            placeholder="Python"
            input_type="text"
            disabled={false}
            required={true}
            value={newTag.name}
            autoFocus={true}
            name="name"
            onChange={(e) => {
              setNewTag((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
          <Input
            type="TEXTAREA"
            input_type="text"
            placeholder="Description"
            variant="FILLED"
            onChange={(e) => {
              setNewTag((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            value={newTag.description}
            disabled={false}
            required={true}
            label="Tag Description"
            name="description"
          />
          <Input
            type="IMAGE"
            input_type="image"
            placeholder=""
            variant="FILLED"
            onChange={() => {
              console.log("hi");
            }}
            value={newTag.logo || ""}
            disabled={false}
            required={true}
            label="Tag Logo"
            name="logo"
          />
          <button
            onClick={() => void handleCreateNew()}
            className={`btn-filled ${
              isLoading ? "cursor-not-allowed opacity-40" : ""
            }`}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTagModal;
