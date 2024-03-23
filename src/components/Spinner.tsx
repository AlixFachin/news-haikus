import React from "react";
import "./Spinner.css";

const Spinner = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <p>Loading...</p>
    <div className="wave-spinner">
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </div>
  </div>
);

export default Spinner;
