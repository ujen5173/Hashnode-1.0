import React from "react";

const Follow = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M2.5 19.25C2.5 15.5221 5.52208 12.5 9.25 12.5V12.5C12.9779 12.5 16 15.5221 16 19.25V19.5C16 20.6046 15.1046 21.5 14 21.5H4.5C3.39543 21.5 2.5 20.6046 2.5 19.5V19.25Z"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
      <path
        d="M12.75 6C12.75 7.933 11.183 9.5 9.25 9.5C7.317 9.5 5.75 7.933 5.75 6C5.75 4.067 7.317 2.5 9.25 2.5C11.183 2.5 12.75 4.067 12.75 6Z"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
      <path
        d="M19 7.5V10.5M19 10.5V13.5M19 10.5H16M19 10.5H22"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  );
};

export default Follow;
