import React from "react";
import SearchComponent from "../components/SearchComponent.jsx";
import style from "../styles/Settings.module.css";

function Settings({ select }) {
  return (
    <div className={style.main}>
      <SearchComponent />
      <div className={style.innerMain}>
        <div className={style.title}>

        <p>{` Home > ${select}`}</p>
        </div>
        <div>
          <div className={style.profile}>
          <p>Edit profile</p>
        </div>
        <div className={style.form}>
          <label className={style.label}>First name</label><br />
          < input className={style.input} type="text" /><br /><br />
          <label className={style.label}>Last name</label><br />
          < input className={style.input} type="text"/><br /><br />
          <label className={style.label}> Email</label><br />
          < input className={style.input} type="text" /><br /><br />
          <label className={style.label}>Password</label><br />
          < input className={style.input} type="password"/><br /><br />
          <label className={style.label}>Confirm password</label><br />
          < input className={style.input} type="password"/><br /><br /><br />
          <button className={style.saveButton}>Save</button>
        </div>
        </div>
        
      </div>
    </div>
  );
}

export default Settings;
