"use client";

import React from 'react'
import { X } from 'lucide-react';

const SearchReset = () => {
    const reset = ()=>{
        const form = document.querySelector(".search-form") as HTMLFormElement;
        if(form) form.reset();
    }
  return (
    <div>
      <button className='search-btn text-white' onClick={reset}>
        <X className='size-5'/>
      </button>
    </div>
  )
}

export default SearchReset
