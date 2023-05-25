const Search = (props: { className: string }) => {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 21L15.8091 15.8091M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
        strokeWidth="1.5px"
        strokeLinecap="round"
        strokeLinejoin="round"
        fillOpacity="0"
        {...props}
      ></path>
    </svg>
  );
};
export default Search;
