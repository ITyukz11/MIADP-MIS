// components/LottieAnimation.tsx
import React, { useRef } from 'react';
import animationData from '../../lib/lottie/system-solid-46-notification-bell.json'; // Update this path
import Lottie, { Options } from 'react-lottie';

interface NotificationLottieAnimationProps {
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
}

const NotificationLottieAnimation: React.FC<NotificationLottieAnimationProps> = ({
  width,
  height,
  loop = false,
  autoplay = false
}) => {
  const lottieRef = useRef<any>(null);

  const handleClick = () => {
    if (lottieRef.current) {
      lottieRef.current.stop();
      setTimeout(() => {
        lottieRef.current.play();
      }, 0); // You can adjust the delay if needed
    }
  };

  const defaultOptions: Options = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Lottie
        options={defaultOptions}
        height={height}
        width={width}
        isStopped={true}
        ref={lottieRef}
      />
    </div>
  );
};

export default NotificationLottieAnimation;
