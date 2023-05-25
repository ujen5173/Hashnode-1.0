const Ai = (props: { className: string }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333ea"></stop>
          <stop offset="100%" stopColor="#2563eb"></stop>
        </linearGradient>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333ea"></stop>
          <stop offset="100%" stopColor="#2563eb"></stop>
        </linearGradient>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333ea"></stop>
          <stop offset="100%" stopColor="#2563eb"></stop>
        </linearGradient>
      </defs>
      <g fill='url("#gradient")' x="0" y="0">
        <path
          d="M2.2 4.2c1.8.5 3.1 1.9 3.6 3.6.1.2.3.2.4 0C6.7 6 8.1 4.7 9.8 4.2c.2-.1.2-.3 0-.4C8.1 3.3 6.7 1.9 6.2.2c-.1-.2-.3-.2-.4 0-.5 1.7-1.9 3.1-3.6 3.6-.3.1-.3.3 0 .4zM19.8 9.7C17.1 9 15 6.9 14.3 4.2c-.1-.3-.5-.3-.6 0C13 6.9 10.9 9 8.2 9.7c-.3.1-.3.5 0 .6 2.6.7 4.7 2.8 5.5 5.5.1.3.5.3.6 0 .7-2.6 2.8-4.7 5.5-5.5.3-.1.3-.5 0-.6zM7.8 15.8c-1.8-.5-3.1-1.9-3.6-3.6-.1-.2-.3-.2-.4 0-.5 1.8-1.9 3.1-3.6 3.6-.2.1-.2.3 0 .4 1.8.5 3.1 1.9 3.6 3.6.1.2.3.2.4 0 .5-1.8 1.9-3.1 3.6-3.6.3-.1.3-.3 0-.4z"
          fill='url("#gradient")'
        ></path>
      </g>
    </svg>
  );
};
export default Ai;
