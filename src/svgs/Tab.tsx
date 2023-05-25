const Tab = (props: { className: string }) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-icon="browser"
      data-prefix="fal"
      viewBox="0 0 512 512"
    >
      <path
        {...props}
        d="M0 96c0-35.35 28.65-64 64-64h384c35.3 0 64 28.65 64 64v320c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V96zm160 32h320V96c0-17.67-14.3-32-32-32H160v64zm-32-64H64c-17.67 0-32 14.33-32 32v32h96V64zm-96 96v256c0 17.7 14.33 32 32 32h384c17.7 0 32-14.3 32-32V160H32z"
      ></path>
    </svg>
  );
};
export default Tab;
