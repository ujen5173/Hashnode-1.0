import React from "react";

const ImagePreview = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M17.8828 11.0741L13.8013 16.0424L10.1085 12.0823L5.699 16.504M14.1999 8.08994C14.1999 8.31085 14.0208 8.48994 13.7999 8.48994C13.579 8.48994 13.3999 8.31085 13.3999 8.08994M14.1999 8.08994C14.1999 7.86902 14.0208 7.68994 13.7999 7.68994C13.579 7.68994 13.3999 7.86902 13.3999 8.08994M14.1999 8.08994H13.3999M6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21Z"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  );
};

export default ImagePreview;
