import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s ease",
    width: fullWidth ? "100%" : "auto",
  };

  const variants = {
    primary: {
      backgroundColor: "#3498db",
      color: "#fff",
    },
    danger: {
      backgroundColor: "#e74c3c",
      color: "#fff",
    },
    success: {
      backgroundColor: "#2ecc71",
      color: "#fff",
    },
    secondary: {
      backgroundColor: "#95a5a6",
      color: "#fff",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#3498db",
      border: "2px solid #3498db",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

export default Button;