import React from 'react'
import style from '../styles/HomePage.module.css'

function HomePage() {
  return (
    <div className={style.main}>
      <div className={style.top}>
        <p className={style.headingTag}>Timings</p>
        <div className={style.checkin}>
          {/* <p>Check in</p> */}
        </div>
      </div>
      <div className={style.middle}>
        <div className={style.heading}></div>
        <div className={style.break}></div>
      </div>
      <div className={style.bottom}>
        <p className={style.headingTag}>User activity</p>
        <div className={style.activity}></div>
      </div>
      
    </div>
  )
}

export default HomePage
