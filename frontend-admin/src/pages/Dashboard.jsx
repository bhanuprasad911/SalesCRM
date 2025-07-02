import React from "react";
import style from "../styles/Dashboard.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { getActivity } from "../services/api.js";

function Dashboard({ select }) {
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([])
  useEffect(()=>{
    const fetchActivities = async () =>{
      const response = await getActivity()
      console.log(response)
      setActivities(response.data)
    }
    fetchActivities();
  }, [])
  // useEffect(()=>console.log(activities), [activities])
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
        <div className={style.grid6}>
          <p>Recent Activity Feed</p>
          <div className={style.innerList}>
          <ol className={style.ol}>

       
          {
            activities.map((activity, index)=>{
              return(
                <li className={style.li}>
                  <p className={style.activity} key={index}>
                  {activity.message}
                </p>

                </li>
                
              )
            })
          }
             </ol>
             </div>
        </div>
        <div className={style.grid7}>7</div>
       
      </div>
    </div>
  );
}

export default Dashboard;
