import React from 'react'
import style from '../styles/HeaderComponent.module.css'
import { IoIosArrowBack } from "react-icons/io";

function HeaderComponent({page, setPage}) {
  return (
    <div className={style.main}>
        <div className={style.title}>
          <p className={style.titleText}>Canova</p>
          <p className={`${style.titleText} ${style.editedTitle}`}>CRM</p>
        </div>
        {
          page==='Home'?<div className={style.wishDiv}>
            <p className={style.wish}>Good moring</p>
            <p className={style.name}>Bhanu prasad</p>
          </div>:<div className={style.details}>
            <button className={style.button} onClick={()=>setPage("Home")}>
              <IoIosArrowBack color='white' size={30} />
            </button>
            <p className={style.pageName}>{page}</p>
          </div>
        }

      
    </div>
  )
}

export default HeaderComponent
