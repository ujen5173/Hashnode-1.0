const Heart = (props: { className: string }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12 21c1 0 10-5 10-12 0-3.5-3-5.956-6-6-1.5-.021-3 .5-4 2-1-1.5-2.526-2-4-2-3 0-6 2.5-6 6 0 7 9 12 10 12Z"
        {...props}
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
export default Heart;
