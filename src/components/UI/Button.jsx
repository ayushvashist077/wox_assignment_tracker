import React from "react";
import "../../styles/liquid-button.css";

let glassFilterMounted = false;

function GlassFilter() {
  if (glassFilterMounted) return null;
  glassFilterMounted = true;
  return (
    <svg className="liquid-glass-svg" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  className = "",
  size,
}) => {
  const sizeClass = size === "sm" ? "liquid-btn-sm" : size === "lg" ? "liquid-btn-lg" : "liquid-btn-sm";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={fullWidth ? { width: "100%" } : {}}
      className={`liquid-btn liquid-btn-variant-${variant} ${sizeClass} ${className}`}
    >
      <div
        className="liquid-btn-backdrop"
        style={{ backdropFilter: 'url("#liquid-glass-filter")' }}
      />
      <div className={`liquid-btn-glow liquid-btn-glow-${variant}`} />
      <div className="liquid-btn-inner-shadow" />
      <span className="liquid-btn-text">{children}</span>
      <GlassFilter />
    </button>
  );
};

export default Button;