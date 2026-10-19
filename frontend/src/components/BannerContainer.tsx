"use client";

import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/api";

export const BannerContainer = ({
  bannerUrl,
  className,
  children,
  style = {}
}: {
  bannerUrl?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const defaultBanner = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80";
  const [src, setSrc] = useState(defaultBanner);

  useEffect(() => {
    const url = getImageUrl(bannerUrl);
    if (!url) {
      setSrc(defaultBanner);
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => setSrc(url);
    img.onerror = () => setSrc(defaultBanner);
  }, [bannerUrl]);

  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${src})`
      }}
    >
      {children}
    </div>
  );
};
