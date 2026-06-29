"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function StarInput({ value = 0, onChange, size = 20 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover ? star <= hover : star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={`transition-colors ${
                active
                  ? "fill-[#ff6f00] text-[#ff6f00]"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}