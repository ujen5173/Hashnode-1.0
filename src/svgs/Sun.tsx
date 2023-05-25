const Sun = (props: { className: string }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 20v2m0-20v2m8 8h2M2 12h2m14 6 1.5 1.5m-15-15L6 6m12 0 1.5-1.5m-15 15L6 18m11-6a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
        {...props}
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
export default Sun;
