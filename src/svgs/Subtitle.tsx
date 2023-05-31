import React from "react";

const Subtitle = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" {...props}>
      <path
        d="M11.25 11.953h-9m1.2-2.906h11.1c.42 0 .63 0 .79-.082a.75.75 0 0 0 .328-.328c.082-.16.082-.37.082-.79v-.6c0-.42 0-.63-.082-.79a.75.75 0 0 0-.327-.328c-.16-.082-.371-.082-.791-.082H3.45c-.42 0-.63 0-.79.082a.75.75 0 0 0-.328.327c-.082.16-.082.37-.082.79v.6c0 .42 0 .63.082.791a.75.75 0 0 0 .328.328c.16.082.37.082.79.082Z"
        strokeWidth="1.25px"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      ></path>
    </svg>
  );
};

export default Subtitle;
