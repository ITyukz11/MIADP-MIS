import React, { useRef, useEffect } from 'react';
import animationData from '../../lib/lottie/system-solid-39-trash.json'; // Update this path
import Lottie, { Options } from 'react-lottie';

interface TrashLottieAnimationProps {
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  isHovered: boolean; // Add this prop
}

const TrashLottieAnimation: React.FC<TrashLottieAnimationProps> = ({
  width,
  height,
  loop = false,
  autoplay = false,
  isHovered
}) => {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (isHovered) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isHovered]);

  const defaultOptions: Options = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ cursor: 'pointer' }}>
      <Lottie
        options={defaultOptions}
        height={height}
        width={width}
        isStopped={!autoplay && !isHovered} // Ensure it stops if not autoplay or not hovered
        ref={lottieRef}
        style={{color:'red'}}
      />
    </div>
  );
};

export default TrashLottieAnimation;
