import React, { FC } from "react";
import "./Loader.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  className?: string;
}

const Loader: FC<LoaderProps> = ({
  size = "medium",
  fullScreen = false,
  className = "",
}) => {
  const loaderClass = `loader-container ${
    fullScreen ? "full-screen" : ""
  } ${className}`;

  return (
    <div className={loaderClass} data-testid="loader">
      <div className={`loader-spinner loader-${size}`}>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
      </div>
    </div>
  );
};

export default Loader;
