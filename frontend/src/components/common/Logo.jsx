import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ size = "md", showTagline = false, clickable = true, className = "" }) {
  const sizeMap = {
    sm: { img: 30, text: 19 },
    md: { img: 38, text: 22 },
    lg: { img: 50, text: 28 },
    xl: { img: 64, text: 34 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`brand-logo-wrap ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
      <div 
        className="brand-logo-icon-box"
        style={{
          width: currentSize.img,
          height: currentSize.img,
          borderRadius: Math.round(currentSize.img * 0.28),
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          boxShadow: "0 4px 18px rgba(99, 102, 241, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#131b2e"
        }}
      >
        <img 
          src="/logo.svg" 
          alt="ServeBook Logo" 
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span 
          className="brand-logo-text"
          style={{ 
            fontSize: currentSize.text, 
            fontWeight: 800, 
            letterSpacing: "-0.03em",
            color: "#ffffff"
          }}
        >
          Serve<span style={{ color: "var(--primary)" }}>Book</span>
        </span>
        {showTagline && (
          <span 
            style={{ 
              fontSize: 11, 
              color: "var(--text-muted)", 
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: 3
            }}
          >
            Home & Personal Services
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) return content;

  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
}
