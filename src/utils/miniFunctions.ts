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

export const limitText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
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
    return minutesAgo <= 0
      ? "Just now"
      : `${minutesAgo} ${minutesAgo > 1 ? "mins" : "min"} ago`;
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hoursAgo} ${hoursAgo > 1 ? "hours" : "hour"} ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
}

export function isValidURL(url: string): boolean {
  // GPT answer
  try {
    // Parse the URL using the URL object
    const parsedURL = new URL(url);

    // Check if the URL has a valid protocol (http or https)
    if (parsedURL.protocol !== "http:" && parsedURL.protocol !== "https:") {
      return false;
    }

    // Check if the URL has a valid hostname (including subdomains)
    if (!/^(?:[\w-]+\.)+[a-z]{2,}$/i.test(parsedURL.hostname)) {
      return false;
    }

    // Check if the URL has valid query parameters
    if (parsedURL.searchParams) {
      // You can perform specific checks for query parameters here if needed
    }

    // Check if the URL is an IP address URL
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(parsedURL.hostname)) {
      return false;
    }

    // If all checks pass, return true
    return true;
  } catch (error) {
    // If an error occurs while parsing the URL, it's not valid
    return false;
  }
}
