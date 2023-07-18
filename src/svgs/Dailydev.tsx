const Dailydev = (props: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fillRule="evenodd" {...props}>
        <path
          d="M19.174 11.59l-2.207-2.208 1.103-2.207 3.587 3.587a1.17 1.17 0 010 1.655l-4.415 4.416a1.17 1.17 0 01-1.655-1.656l3.587-3.587z"
          opacity=".56"
          {...props}
        ></path>
        <path
          d="M15.588 6.343a1.17 1.17 0 011.655 0l.828.828-9.658 9.657a1.17 1.17 0 01-1.655 0L5.93 16l9.658-9.657zm-4.14 3.035l-1.655 1.656-2.208-2.208-2.76 2.76 2.208 2.207L5.93 16l-3.587-3.587a1.17 1.17 0 010-1.655l4.415-4.415a1.17 1.17 0 011.655 0l3.036 3.035z"
          {...props}
        ></path>
      </g>
    </svg>
  );
};

export default Dailydev;
