import React from "react";

const maskStyles = {
  "fade-edges":
    "radial-gradient(ellipse at center, white, transparent)",
  "fade-center":
    "radial-gradient(ellipse at center, transparent, white)",
  "fade-top":
    "linear-gradient(to bottom, transparent, white)",
  "fade-bottom":
    "linear-gradient(to bottom, white, transparent)",
  "fade-left":
    "linear-gradient(to right, transparent, white)",
  "fade-right":
    "linear-gradient(to right, white, transparent)",
  "fade-x":
    "linear-gradient(to right, transparent, white, transparent)",
  "fade-y":
    "linear-gradient(to bottom, transparent, white, transparent)",
  none: null,
};

function getBgImage(variant, fill, size) {
  switch (variant) {
    case "dots":
      return `radial-gradient(${fill} 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case "diagonal-stripes":
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
    case "horizontal-lines":
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case "vertical-lines":
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
    case "checkerboard":
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
    default:
      return undefined;
  }
}

const BGPattern = ({
  variant = "grid",
  mask = "none",
  size = 24,
  fill = "#252525",
  className,
  style,
  ...props
}) => {
  const bgSize = `${size}px ${size}px`;
  const backgroundImage = getBgImage(variant, fill, size);
  const maskImage = maskStyles[mask] || null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        backgroundImage,
        backgroundSize: bgSize,
        WebkitMaskImage: maskImage,
        maskImage: maskImage,
        pointerEvents: "none",
        ...style,
      }}
      {...props}
    />
  );
};

BGPattern.displayName = "BGPattern";
export { BGPattern };
