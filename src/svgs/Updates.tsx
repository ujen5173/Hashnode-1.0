const Updates = (props: { className: string }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        d="M4.5 6.75v4.5m0-4.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 4.5a2.25 2.25 0 1 0 2.25 2.25M4.5 11.25a2.25 2.25 0 0 1 2.25 2.25m6.75-6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0a6.75 6.75 0 0 1-6.75 6.75"
        {...props}
        strokeWidth="1.25px"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
export default Updates;
