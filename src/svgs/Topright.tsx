const Topright = (props: { className: string }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z" {...props}></path>
    </svg>
  );
};
export default Topright;
