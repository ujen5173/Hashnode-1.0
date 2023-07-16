const Manage = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20">
      <path
        {...props}
        d="M4.167 2.5v8.333m1.666 0H4.167m0 0H2.5m1.667 2.5V17.5M10 9.167V17.5m1.667-10.833H10m0 0V2.5m0 4.167H8.333m9.167 6.666h-1.667m0 0V2.5m0 10.833h-1.666m1.666 2.5V17.5"
        strokeLinecap="round"
        strokeWidth="1.25px"
      ></path>
    </svg>
  );
};

export default Manage;
