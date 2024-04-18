'use client'
import { AnimatePresence, motion} from 'framer-motion'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <AnimatePresence>
      <motion.div
        className="relative bg-cover bg-center bg-no-repeat min-h-screen"
        style={{ backgroundImage: "url('/result-background.png')" }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.5 }}
      >
        <div className='h-screen flex items-center justify-center flex-col bg-cover bg-center bg-no-repeat min-h-screen'
          style={{ backgroundImage: "url('/background.png')" }}>
          {children}
   

        </div>
    
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthLayout;
