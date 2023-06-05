export const limitTags = (
  tags: {
    name: string;
    slug: string;
    id?: string;
  }[],
  limit: number
) => {
  const newTags = tags.slice(0, 3).map((tag) => {
    if (tag.name.length > limit) {
      return { ...tag, name: tag.name.slice(0, limit) + "..." };
    }
    return tag;
  });

  if (tags.length > 3) {
    newTags.push({ id: undefined, name: `+${tags.length - 3}`, slug: "" });
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

export function formatDate(date: Date): string {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - date.getTime();

  if (timeDifference < 60 * 60 * 1000) {
    const minutesAgo = Math.floor(timeDifference / (60 * 1000));
    return `${minutesAgo} minutes ago`;
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hoursAgo} hours ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
}
