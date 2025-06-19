import React, { useState } from 'react';
import style from '../styles/HomePage.module.css';
import toast from 'react-hot-toast';

function HomePage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [checkInDetails, setCheckedInDetails] = useState({
    checkIn: "",
    checkOut: ""
  });

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const updateCheckIn = () => {
    const currentTime = getCurrentTime();
    if(isBreak) return toast.error("Remove break")

    setCheckedIn(prev => !prev);

    setCheckedInDetails(prev => ({
      ...prev,
      [checkedIn ? 'checkOut' : 'checkIn']: currentTime
    }));

    toast.success(!checkedIn ? 'Check-in Successful' : 'Check-out Successful');
  };

  const updateBreak = () => {
    if (!checkedIn) {
      return toast.error("Cannot start break without checking in");
    }

    setIsBreak(prev => !prev);
    toast.success(!isBreak ? "Break started" : "Break ended");
  };

  return (
    <div className={style.main}>
      <div className={style.top}>
        <p className={style.headingTag}>Timings</p>
        <div className={style.checkin}>
          <div className={style.details}>
            <p>Check-in</p>
            {checkInDetails?.checkIn.trim() ? <p>{checkInDetails.checkIn}</p>:<p>--:--</p>}
          </div>
          <div className={style.details}>
            <p>Check-out</p>
            {checkInDetails?.checkOut.trim() ? <p>{checkInDetails.checkOut}</p>:<p>--:--</p>}
          </div>
          <button
            className={`${style.button} ${checkedIn ? style.checkedIn : ""}`}
            onClick={updateCheckIn}
          >
          </button>
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
          >
          
          </button>
        </div>
        <div className={style.break}></div>
      </div>

      <div className={style.bottom}>
        <p className={style.headingTag}>User Activity</p>
        <div className={style.activity}></div>
      </div>
    </div>
  );
}

export default HomePage;
