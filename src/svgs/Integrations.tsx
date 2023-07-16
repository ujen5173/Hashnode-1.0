const Integrations = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
      <path
        d="M304 16c0-8.836-7.2-16-16-16s-16 7.164-16 16v96h32V16zm-192 0c0-8.836-7.2-16-16-16S80 7.164 80 16v96h32V16zm256 128H16c-8.836 0-16 7.2-16 16s7.164 16 16 16h16v64c0 82.74 63.38 150.2 144 158.4V496c0 8.836 7.164 16 16 16s16-7.164 16-16v-97.62C288.6 390.2 352 322.7 352 240v-64h16c8.8 0 16-7.2 16-16s-7.2-16-16-16zm-48 96c0 70.59-57.42 128-128 128S64 310.59 64 240v-64h256v64z"
        {...props}
      ></path>
    </svg>
  );
};

export default Integrations;
