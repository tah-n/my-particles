'use client'
import React from 'react'
import NewScene from './NewScene';
import Navbar from './Navbar';

const Homepage = () => {
  return (
    <div className='relative w-screen h-screen'>
      <Navbar />
      <NewScene />
    </div>
  )
}

export default Homepage;
