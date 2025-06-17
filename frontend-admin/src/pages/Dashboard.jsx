import React from "react";
import style from "../styles/Dashboard.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import { useState } from "react";

function Dashboard({ select }) {
  const [search, setSearch] = useState("");
  return (
    <div className={style.main}>
      <SearchComponent text={search} setText={setSearch} />
      <div className={style.title}>
      <p>{` Home > ${select}`}</p>
      </div>

      <div className={style.grid}>
        <div className={style.grid1}>One</div>
        <div className={style.grid2}>Two</div>
        <div className={style.grid3}>Three</div>
        <div className={style.grid4}>Four</div>
        <div className={style.grid5}>Five</div>
        <div className={style.grid6}>6</div>
        <div className={style.grid7}>7</div>
       
      </div>
    </div>
  );
}

export default Dashboard;
