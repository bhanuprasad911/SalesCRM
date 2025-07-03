import React, { useEffect, useState } from "react";
import style from "../styles/HomePage.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user, setUser, logoutUser } = useAuth(); // ⬅ use logoutUser from context
  const [checkedIn, setCheckedIn] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [checkInDetails, setCheckedInDetails] = useState({
    checkedInTime: "--:--",
    checkedOutTime: "--:--",
  });
  const [currentShift, setCurrentShift] = useState(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const today = getFormattedDate();
    const currentShift = user?.history?.find((hist) => hist.date === today);
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
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  }

  const allBreaks = user?.history
    ?.flatMap((entry) =>
      entry.breaks.map((brk) => ({
        ...brk,
        date: entry.date,
        fullDateTime: new Date(`${entry.date} ${brk.breakStartTime}`),
      }))
    )
    .sort((a, b) => b.fullDateTime - a.fullDateTime)
    .slice(0, 10);

  user?.recentActivities.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

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
            onClick={logoutUser} // ⬅ updated to call from context
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
                ? getTimeDifferenceFromNow(activity.timestamp)
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

export default HomePage;
