import React, { useEffect, useState } from "react";
import style from "../styles/HomePage.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { logout, updateCheck } from "../services/api.js";

function HomePage() {
  const { user, setUser } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [checkInDetails, setCheckedInDetails] = useState({
    checkedInTime: "--:--",
    checkedOutTime: "--:--",
  });
  const [currentShift, setCurrentShift] = useState(null);
  console.log(user);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const allBreaks = user.history
  ?.flatMap(entry =>
    entry.breaks.map(brk => ({
      ...brk,
      date: entry.date,
      fullDateTime: new Date(`${entry.date} ${brk.breakStartTime}`)
    }))
  )
  .sort((a, b) => b.fullDateTime - a.fullDateTime) // Sort by latest first
  .slice(0, 10); 
  useEffect(() => {
    const today = getFormattedDate();
    const currentShift = user.history.find((hist) => hist.date === today);
    if (currentShift) {
      setCheckedInDetails({
        checkedInTime: currentShift.checkedInTime || "--:--",
        checkedOutTime: currentShift.checkedOutTime || "--:--",
      });
      setCurrentShift(currentShift);
      setCheckedIn(user.status === "Active");
    }
  }, [user]);

  function getFormattedDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0"); // 01 to 31
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 01 to 12
    const year = today.getFullYear(); // 2025

    return `${day}-${month}-${year}`;
  }

  // const updateCheckIn = async () => {
  //   if (isBreak) return toast.error("Remove break");

  //   const currentTime = getCurrentTime();
  //   const prevCheckedIn = checkedIn; // Save the old value before toggling

  //   // 👇 Prepare new check-in or check-out time before updating state
  //   const newCheckInDetails = {
  //     ...checkInDetails,
  //     [!prevCheckedIn ? "checkedInTime" : "checkedOutTime"]: currentTime
  //   };

  //   // 🔄 Update state

  //   // 📦 Send new details to backend
  //   const data = {
  //     checkedIn: !prevCheckedIn, // true when checking in, false when checking out
  //     shift: {
  //       date: getFormattedDate(),
  //       checkedInTime: newCheckInDetails.checkedInTime,
  //       checkedOutTime: newCheckInDetails.checkedOutTime,
  //       breaks: []
  //     }
  //   };

  //   try {
  //     const response = await updateCheck(data);
  //     console.log(response);
  //     setUser(response.data.data)
  //     toast.success(response.data.message);
  //     setCheckedInDetails(newCheckInDetails);
  //   setCheckedIn(!prevCheckedIn);
  //   } catch (err) {
  //     toast.error(err.response.data.message);
  //     console.error(err);
  //   }
  // };
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

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
  user?.recentActivities.sort((a,b)=>{return new Date(b.timestamp)-new Date(a.timestamp)});

  const updateBreak = () => {
    if (!checkedIn) {
      return toast.error("Cannot start break without checking in");
    }

    setIsBreak((prev) => !prev);
    toast.success(!isBreak ? "Break started" : "Break ended");
  };

  return (
    <div className={style.main}>
      <div className={style.top}>
        <p className={style.headingTag}>Timings</p>
        <div className={style.checkin}>
          <div className={style.details}>
            <p>Check-in</p>
            <p>{currentShift ? currentShift.checkedInTime : "--:--"}</p>
          </div>
          <div className={style.details}>
            <p>Check-out</p>
            <p>{currentShift ? currentShift.checkedOutTime : "--:--"}</p>
          </div>
          <button
            className={`${style.button} ${
              user.status === "Active" ? style.checkedIn : ""
            }`}
            onClick={handleLogout}
          ></button>
        </div>
      </div>

      <div className={style.middle}>
        <div className={style.heading}>
          <div>
            <p>Break</p>
          </div>
          <button
            className={`${style.button} ${isBreak ? style.isBreak : ""}`}
            onClick={updateBreak}
          ></button>
        </div>
        <div className={style.break}>
  {allBreaks.map((brk, index) => (
    <div key={index} className={style.eachBreak}>
      <div className={style.deb}>
        <p>Break</p>
        <p>{brk.breakStartTime}</p>
      </div>
      <div className={style.deb}>
        <p>Ended</p>
        <p>{brk.breakEndTime || "Ongoing"}</p>
      </div>
      <div className={style.deb}>
        <p>Date</p>
        <p>{brk.date}</p>
      </div>
    </div>
  ))}
</div>

      </div>

      <div className={style.bottom}>
        <p className={style.headingTag}>User Activity</p>
        <div className={style.activity}>
          <ul>
            {user?.recentActivities.map((activity, index) => {
              const hoursAgo = activity.timestamp
                ? `${getTimeDifferenceFromNow(activity.timestamp)}`
                : "some time ago";

              return (
                <li key={index} className={style.p}>
                  <p>{`${activity.message} - ${hoursAgo}`}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
