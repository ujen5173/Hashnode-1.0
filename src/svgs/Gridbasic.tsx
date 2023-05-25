const Gridbasic = (props: { className: string }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 55 55"
      fill="none"
    >
      <path
        d="M2 2h51v21H2V2zm0 30h51v21H2V32z"
        strokeWidth="4px"
        {...props}
      ></path>
    </svg>
  );
};
export default Gridbasic;
