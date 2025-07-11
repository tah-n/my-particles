'use client'
import React, { useState } from 'react'
import NavItems from './NavItems';

const Navbar = () => {
    const [show,setShow] = useState(false);

    const handleEnter = () => {
        setShow(true);
    }

    const handleLeave = () => {
        setShow(false);
    }

  return (
    <div className={`${show? 'right-0': '-right-[10.5rem]'} fixed z-50 top-4 w-max h-max px-8 py-1 bg-white rounded-bl-lg transition-all duration-100 ease-in-out`} onMouseLeave={handleLeave}>
      <div className='relative w-full h-full'>
        <NavItems text='component 1' />
        <NavItems text='component 2' />
        <div className='absolute w-[2rem] h-[3.5rem] -left-14 bg-white -top-4 rounded-lg cursor-pointer' onMouseEnter={handleEnter} onClick={handleEnter} />
      </div>
    </div>
  )
}

export default Navbar;
