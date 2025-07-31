import React from "react";

function Wave() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="w-full opacity-40"
      version="1.1"
      viewBox="0 0 390.486 94.245"
    >
      <defs>
        <linearGradient id="linearGradient4">
          <stop offset="0" stopColor="#fff" stopOpacity="1"></stop>
          <stop offset="1" stopColor="#4789ef" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="linearGradient2"
          x1="41.06"
          x2="37.486"
          y1="66.427"
          y2="-22.967"
          gradientTransform="translate(63.164 -169.816)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient4"
        ></linearGradient>
      </defs>
      <g transform="translate(94.593 174.557)">
        <path
          fill="url(#linearGradient2)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="7"
          d="M-94.477-174.557h390.37v49.022c-67.24-18.136-140.236-14.232-205.159 10.973-24.09 9.353-47.136 21.556-71.988 28.643-12.426 3.543-25.298 5.781-38.218 5.596-12.92-.184-25.91-2.852-37.429-8.707-18.876-9.594-33.088-27.912-37.692-48.58z"
        ></path>
      </g>
    </svg>
  );
}

export default Wave;
