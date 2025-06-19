import React from 'react'
import style from '../styles/FooterComponent.module.css'
import { FaUserTag, FaHome, FaRegUserCircle } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

function FooterComponent({select, setSelect}) {
  return (
    <div className={style.main}>
        <div className={`${style.section} ${select==='Home'?style.selected:""}`} onClick={()=>setSelect('Home')}>
            <FaHome size={30}/>
            <p>Home</p>
        </div>
        <div className={`${style.section} ${select==='Leads'?style.selected:""}`} onClick={()=>setSelect('Leads')}>
            <FaUserTag size={30}/>
            <p>Leads</p>

        </div>
        <div className={`${style.section} ${select==='Schedule'?style.selected:""}`} onClick={()=>setSelect('Schedule')}>
            <SlCalender size={30}/>
            <p>Schedule</p>
        </div>
        <div className={`${style.section} ${select==='Profile'?style.selected:""}`} onClick={()=>setSelect('Profile')}>
            <FaRegUserCircle size={30}/>
            <p>Profile</p>
        </div>
      
    </div>
  )
}

export default FooterComponent
