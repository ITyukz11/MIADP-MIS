'use client'
import { AnimatePresence, motion} from 'framer-motion'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <AnimatePresence>
      <motion.div
        className="relative bg-cover bg-center min-h-screen"       
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.5 }}
      >
        <div className='h-screen flex items-center justify-center flex-col'>
          {children}
        </div>
    
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthLayout;
