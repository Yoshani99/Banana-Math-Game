import React, { useEffect } from "react";

// Inline CSS styles
const loaderStyles: {
  loader: React.CSSProperties;
  spinnerWrapper: React.CSSProperties;
} = {
  loader: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #3498db",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
  },
  spinnerWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
};

const Loader: React.FC = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={loaderStyles.spinnerWrapper}>
      <div style={loaderStyles.loader}></div>
    </div>
  );
};

export default Loader;