const Gridclassic = (props: { className: string }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55">
      <path
        d="M2 2h51v11H2V2zm0 40h51v11H2V42zm0-20h51v11H2V22z"
        {...props}
        strokeWidth="4px"
      ></path>
    </svg>
  );
};
export default Gridclassic;
