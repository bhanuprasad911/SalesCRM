import React from "react";
import style from "../styles/Dashboard.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { getActivity, getEmployees, getLeadFiles } from "../services/api.js";
import { FaMoneyBills } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdHandshake } from "react-icons/md";
import { PiSpeedometerBold } from "react-icons/pi";
import EmployeeComponent from "../components/EmployeeComponent.jsx";

function Dashboard({ select }) {
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [leadFiles, setLeadFiles] = useState([]);
  const [totalUnassigned, setTotalUnAssigned] = useState(0);
  const [assignedThisWeek, setAssignedThisWeek] = useState(0);
  const [Employees, setEmployees] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    setActiveCount(Employees.length);
  }, [Employees]);

  useEffect(() => {
    const getleads = async () => {
      try {
        const response = await getLeadFiles();
        setLeadFiles(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    getleads();
  }, []);

  useEffect(() => {
    const updateValues = () => {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      // ✅ Total unassigned (from all files)
      const totalUnassignedCount = leadFiles.reduce(
        (acc, file) => acc + (file.unAssigned || 0),
        0
      );
      setTotalUnAssigned(totalUnassignedCount);

      // ✅ Filter only files from last 7 days
      const recentItems = leadFiles.filter((file) => {
        const createdDate = new Date(file.createdAt);
        return createdDate >= sevenDaysAgo && createdDate <= now;
      });

      // ✅ Total assigned from last 7 days
      const totalAssignedThisWeek = recentItems.reduce(
        (acc, file) => acc + (file.assigned || 0),
        0
      );
      setAssignedThisWeek(totalAssignedThisWeek);
    };

    updateValues();
  }, [leadFiles]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        const filtered = res.data.data.filter((emp) => emp.status === "Active");
        setEmployees(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  function getTimeDifferenceFromNow(pastTimestamp) {
    const past = new Date(pastTimestamp);
    const now = new Date();
    const diffMs = now - past;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
  }
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await getActivity();
      console.log(response);
      setActivities(response.data);
    };
    fetchActivities();
  }, []);
  // useEffect(()=>console.log(activities), [activities])
  return (
    <div className={style.main}>
      <SearchComponent text={search} setText={setSearch} />
      <div className={style.title}>
        <p>{` Home > ${select}`}</p>
      </div>

      <div className={style.grid}>
        <div className={style.grid1}>
          <button className={style.logoButton}>
            <FaMoneyBills size={30} color={"grey"} />
          </button>
          <div className={style.divdetails}>
            <p className={style.tag}>Unassigned Leads</p>
            <p className={style.value}>{totalUnassigned}</p>
          </div>
        </div>
        <div className={style.grid2}>
          <button className={style.logoButton}>
            <FaRegCircleUser size={30} color={"grey"}/>
          </button>
          <div className={style.divdetails}>
            <p className={style.tag}>Assigned This Week</p>
            <p className={style.value}>{assignedThisWeek}</p>
          </div>
        </div>
        <div className={style.grid3}>
          <button className={style.logoButton}>
            <MdHandshake size={30} color={"grey"}/>
          </button>
          <div className={style.divdetails}>
            <p className={style.tag}>Active Sales People</p>
            <p className={style.value}>{activeCount}</p>
          </div>
        </div>
        <div className={style.grid4}>
          <button className={style.logoButton}>
            <PiSpeedometerBold size={30} color={"grey"}/>
          </button>
        </div>
        <div className={style.grid5}>Five</div>
        <div className={style.grid6}>
          <p>Recent Activity Feed</p>
          <div className={style.innerList}>
            <ol className={style.ol}>
              {activities.map((activity, index) => {
                return (
                  <li key={index} className={style.li}>
                    <p className={style.activity} key={index}>{`${
                      activity.message
                    } - ${getTimeDifferenceFromNow(activity.timestamp)}`}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className={style.grid7}>
          {
            Employees.length>0&&(
              <>
              <div className={style.tableHead}>
                <p className={style.name}>Name</p>
                <p>employee id</p>
                <p>Assigned Leads</p>
                <p>Closed Leads</p>
                <p>Status</p>
              </div>
              {
                Employees.map((employee, index)=><EmployeeComponent key={index} employee={employee}/>)
              }
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
