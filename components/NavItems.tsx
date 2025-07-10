'use client'
import React from 'react'
import { useStore } from './lib/useStore'

const NavItems = ({text} : {text: string}) => {
    const setComponent = useStore(state => state.setWhichComponent)

    const handleChange = () => {
        setComponent(text);
    }

  return (
    <div className='capitalize cursor-pointer my-3 text-black font-semibold hover:text-black/80' onClick={handleChange} >
       {text}
    </div>
  )
}

export default NavItems
