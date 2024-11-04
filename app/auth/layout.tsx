'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import React, { useCallback } from 'react'
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // Make sure you install tsparticles-slim
import { Engine } from "tsparticles-engine"
import { useTheme } from 'next-themes';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine); // Initialize the slim version
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log(container);
  }, []);

  const { resolvedTheme } = useTheme()

  return (
    <SessionProvider>
      <AnimatePresence>
        <motion.div
          className="relative bg-cover bg-center min-h-screen overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
        > 
          <div className='z-0'>
            <Particles
              id="tsparticles"
              style={{ zIndex: '-1', position: 'fixed', width: '100%', height: '100%' }}
              init={particlesInit}
              loaded={particlesLoaded}
              options={{
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onHover: { enable: true, mode: "grab" },
                    resize: true,
                  },
                  modes: {
                    grab: {
                      distance: 150,
                      links: { opacity: 1 }
                    }
                  }
                },
                particles: {
                  color: { value: resolvedTheme == 'light'? "#000000":"#ffffff" },
                  links: {
                    color: resolvedTheme == 'light'? "#000000":"#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" },
                    random: false,
                    speed: 0.5,
                    straight: false,
                  },
                  number: {
                    density: { enable: true, area: 1500 },
                    value: 100,
                  },
                  opacity: { value: 0.5 },
                  size: { value: 2 },
                },
                detectRetina: true,
              }}
            />
          </div>

          <div className='h-screen flex items-center justify-center flex-col'>
            {children}
          </div>

        </motion.div>
      </AnimatePresence>
    </SessionProvider>
  );
}

export default AuthLayout;
