"use client";

import dynamic from "next/dynamic";
import "react-inner-image-zoom/lib/styles.min.css";

// Dynamically import the component and disable Server-Side Rendering (SSR)
const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"), {
  ssr: false,
});

export default function ImageZoom({
  src,
  zoomSrc,
  zoomType = "hover",
  zoomScale = 1,
  zoomPreload = true,
  width,
  height,
  className = "",
  alt = "Zoomable image",
  ...rest
}) {
  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <InnerImageZoom
        src={src}
        zoomSrc={zoomSrc || src}
        zoomType={zoomType}
        zoomScale={zoomScale}
        zoomPreload={zoomPreload}
        className={`iiz__img-wrapper ${className}`}
        width={width}
        height={height}
        alt={alt}
        {...rest}
      />
    </div>
  );
}
