import React from "react";

const BookmarkArticle = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 16 20">
      <path
        d="M15.2 19V5.8C15.2 4.11984 15.2 3.27976 14.8731 2.63803C14.5854 2.07354 14.1265 1.6146 13.562 1.32698C12.9203 1 12.0802 1 10.4 1H5.60005C3.91989 1 3.07981 1 2.43808 1.32698C1.87359 1.6146 1.41465 2.07354 1.12703 2.63803C0.800049 3.27976 0.800049 4.11984 0.800049 5.8V19L5.85342 16.4733C6.64052 16.0798 7.03406 15.883 7.44686 15.8055C7.81246 15.737 8.18764 15.737 8.55324 15.8055C8.96603 15.883 9.35959 16.0798 10.1467 16.4733L15.2 19Z"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      ></path>
    </svg>
  );
};

export default BookmarkArticle;
