import React from 'react'
import style from '../styles/ProfilePage.module.css'


function ProfilePage() {
  return (
    <div className={style.main}>
     <div className={style.div}>
      <label className={style.label}>First Name</label>
      <input type="text" className={style.input} />
     </div>
     <div className={style.div}>
      <label className={style.label}>Last Name</label>
      <input type="text" className={style.input} />
     </div>
     <div className={style.div}>
      <label className={style.label}>Email</label>
      <input type="text" className={style.input} />
     </div>
     <div className={style.div}>
      <label className={style.label}>Password</label>
      <input type="password" className={style.input} />
     </div>
     <div className={style.div}>
      <label className={style.label}>Confim password</label>
      <input type="password" className={style.input} />
     </div>
     <button className={style.button}>Save</button>
    </div>
  )
}

export default ProfilePage
