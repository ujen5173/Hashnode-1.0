export const limitTags = (tags: string[], limit: number) => {
  const newTags = tags.slice(0, 3).map((tag) => {
    if (tag.length > limit) {
      return tag.slice(0, limit) + "...";
    }
    return tag;
  });

  if (tags.length > 3) {
    newTags.push(`+${tags.length - 3}`);
  }

  return newTags;
};

export const wait = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), time * 1000));

export const handleImageChange = (file: File): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    if (!file) reject("No file uploaded");
    resolve(URL.createObjectURL(file) || "");
  });
};
