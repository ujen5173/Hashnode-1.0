function formComments(comments: Array<Comment>) {
  const map = new Map();

  const roots = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    comments[i].children = [];

    if (typeof comments[i]?.parentId === "string") {
      const parentCommentIndex: number = map.get(comments[i]?.parentId);

      comments[parentCommentIndex].replies.push(comments[i]);

      continue;
    }

    roots.push(comments[i]);
  }

  return roots;
}

export default formComments;
