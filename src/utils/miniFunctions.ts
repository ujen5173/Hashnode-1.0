export const limitTags = (tags: string[], limit: number) => {
  // character limit: 12;
  // tagslimit: 3;

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
