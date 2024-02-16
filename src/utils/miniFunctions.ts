import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import { generateHTML, generateJSON } from "@tiptap/react";
import { type DefaultEditorContent } from "~/types";

export const limitTags = (
  tags: {
    name: string;
    slug: string;
    id?: string;
  }[],
  limit: number,
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
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
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

export const dataURLToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob;
};

export const imageToBlogHandler = (file: File): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);

    // Create a new FileReader to read the contents of the image
    const reader = new FileReader();

    // Event listener for when the FileReader has finished reading the image
    reader.onload = async function (event) {
      const dataUrl = event.target?.result as string; // Get the data URL representation of the image
      const blob = await dataURLToBlob(dataUrl); // Convert data URL to Blob
      const imageFile = new File([blob], file.name, { type: file.type }); // Create a new File object
      resolve(imageFile);
    };

    // Event listener for when an error occurs during file reading
    reader.onerror = function (event) {
      reject(event.target?.error);
    };

    // Read the selected image as a data URL
    reader.readAsDataURL(file);
  });
};

export const formattedContent = (content: DefaultEditorContent) => {
  return generateHTML(content, [
    Document,
    Text,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Code,
    CodeBlock,
    CodeBlockLowlight,
    Heading,
    Blockquote,
    Highlight,
    Strike,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    ListItem,
    BulletList,
  ]);
};

export const convertToHTML = (content: string) =>
  generateJSON(content, [
    Document,
    Text,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Code,
    CodeBlock,
    CodeBlockLowlight,
    Heading,
    Blockquote,
    Highlight,
    Strike,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    ListItem,
    BulletList,
  ]);
