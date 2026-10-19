"use client";

import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/api";

export const AvatarImage = ({
  username,
  avatarUrl,
  className,
  alt = "",
  style = {}
}: {
  username?: string;
  avatarUrl?: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(getImageUrl(avatarUrl));
  }, [avatarUrl]);

  const fallbackUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(username || "default")}`;

  return (
    <img
      src={src || fallbackUrl}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (src !== fallbackUrl) {
          setSrc(fallbackUrl);
        }
      }}
    />
  );
};
