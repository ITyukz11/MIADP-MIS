import React, { useRef, useEffect } from 'react';
import animationData from '../../lib/lottie/system-solid-17-assignment.json'; // Update this path
import Lottie, { Options } from 'react-lottie';

interface TAssignmentLottieAnimationProps {
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  isHovered: boolean; // Add this prop
}

const AssignmentLottieAnimation: React.FC<TAssignmentLottieAnimationProps> = ({
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
      />
    </div>
  );
};

export default AssignmentLottieAnimation;
