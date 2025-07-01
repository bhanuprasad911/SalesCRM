import React from 'react'
import style from '../styles/HeaderComponent.module.css'
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';


function HeaderComponent({}) {
  const {user}= useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const rawPath = location.pathname
  const page =rawPath.slice(1).split("-").map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
const username= user?.firstName+" "+user?.lastName
const userN= username.toString()
  return (
    <div className={style.main}>
        <div className={style.title}>
          <p className={style.titleText}>Canova</p>
          <p className={`${style.titleText} ${style.editedTitle}`}>CRM</p>
        </div>
        {
          page==='Home'?<div className={style.wishDiv}>
            <p className={style.wish}>Good moring</p>
            <p className={style.name}>{userN}</p>
          </div>:<div className={style.details}>
            <button className={style.button} onClick={()=>navigate('/home')}>
              <IoIosArrowBack color='white' size={30} />
            </button>
            <p className={style.pageName}>{page}</p>
          </div>
        }

      
    </div>
  )
}

export default HeaderComponent
