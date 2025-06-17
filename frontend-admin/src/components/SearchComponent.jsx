import React from 'react'
import style from '../styles/SearchComponent.module.css'
import { IoSearchSharp } from "react-icons/io5";

function SearchComponent({text, setText}) {
  return (
    <div className={style.main}>
    <input className={style.input} placeholder='Search here...' type="text" value={text} onChange={(e)=>setText(e.target.value)} />
    <IoSearchSharp className={style.loc} size={23} />
    </div>
  )
}

export default SearchComponent
