import { useEffect, useState } from 'react';

const FALLBACK_IMAGE = '/images/hero-zenvor.png';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  [key: string]: any;
}

export default function SafeImage({ src, fallbackSrc = FALLBACK_IMAGE, alt, className, ...props }: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImageSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
      }}
    />
  );
}
