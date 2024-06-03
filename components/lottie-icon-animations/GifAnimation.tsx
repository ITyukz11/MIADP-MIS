// components/GifAnimation.tsx
import React from 'react';

interface GifAnimationProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

const GifAnimation: React.FC<GifAnimationProps> = ({
  src,
  width = 400,
  height = 400,
  alt = 'GIF Animation',
}) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={width} height={height} alt={alt} />;
};

export default GifAnimation;
