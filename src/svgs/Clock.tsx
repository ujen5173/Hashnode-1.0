const Clock = (props: { className: string }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        {...props}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25px"
        d="M10.001 5v5l3.334 1.667m5-1.667a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
      ></path>
    </svg>
  );
};
export default Clock;
