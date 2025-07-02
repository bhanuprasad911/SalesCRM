import React, { useState } from "react";
import style from "../styles/LeadsComponent.module.css";
import { SlCalender } from "react-icons/sl";
import { RiEditCircleLine } from "react-icons/ri";
import { WiTime4 } from "react-icons/wi";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import {
  leadAvailableUpdate,
  leadStatusUpdate,
  leadTypeUpdate,
} from "../services/api";

function LeadsComponent({ lead, leads, setLeads }) {
  const [showtype, setShowType] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [status, setStatus] = useState("");
  const [timeDetails, setTimeDetails] = useState({
    time: "",
    date: "",
  });

function formatDateToLongUTC(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}
  console.log(lead.createdAt)
  console.log(formatDateToLongUTC(lead.createdAt))

  function convertDateTimeToISO({ date, time }) {
    const localDateTimeString = `${date}T${time}:00`;
    const dateObj = new Date(localDateTimeString);
    return dateObj.toISOString();
  }

  const updateLeadsLocally = (updatedLead) => {
    const updatedLeads = leads.map((l) =>
      l._id === updatedLead._id ? { ...l, ...updatedLead } : l
    );
    setLeads(updatedLeads);
  };

  const updateType = async (newType) => {
    if (lead.type === newType) {
      toast.error(`This is already a ${newType} lead`);
      return;
    }

    if (lead.status === "Closed") {
      toast.error("You can't change the type of a closed lead");
      return;
    }

    try {
      const data = { id: lead._id, type: newType };
      await leadTypeUpdate(data);
      updateLeadsLocally({ ...lead, type: newType });
      toast.success(`Lead type updated to ${newType}`);
      setShowType(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lead type");
    }
  };

  const handleChange = (e) => {
    setTimeDetails({ ...timeDetails, [e.target.name]: e.target.value });
  };

  const handleUpdateTime = async () => {
    const time = convertDateTimeToISO(timeDetails);
    const data = {
      id: lead._id,
      time,
    };

    try {
      if (lead.status === "Closed") {
        toast.error("You can't schedule call for a closed lead");
        return;
        }
      await leadAvailableUpdate(data);
      updateLeadsLocally({ ...lead, NextAvailable: time });
      toast.success("Lead availability updated");
      setShowDate(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update time");
    }
  };

  const handleUpdateStatus = async () => {
    setShowStatus(false);

    try {
      if (lead.status === "Closed") {
        toast.error("Cannot change the status of a closed chat");
        return;
      }

      if (lead.status === status) {
        toast.error(`This lead is already ${status}`);
        return;
      }

      const now = new Date();
      const next = new Date(lead.NextAvailable);

      if (status === "Closed" && next > now) {
        toast.error("Scheduled lead cannot be closed");
        return;
      }

      const data = {
        id: lead._id,
        status,
      };

      await leadStatusUpdate(data);
      updateLeadsLocally({ ...lead, status });
      toast.success("Lead status updated");
      setStatus("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  const openType = () => {
    setShowType(!showtype);
    setShowDate(false);
    setShowStatus(false);
  };

  const openStatus = () => {
    setShowStatus(!showStatus);
    setShowDate(false);
    setShowType(false);
  };

  const openDate = () => {
    setShowDate(!showDate);
    setShowType(false);
    setShowStatus(false);
  };

  return (
    <div
      onClick={() => {
        setShowDate(false);
        setShowStatus(false);
        setShowType(false);
      }}
      className={style.main}
    >
      <div className={style.left}>
        <div className={style.leftTop}>
          <p className={style.name}>{lead.name}</p>
          <p className={style.email}>{lead.email}</p>
        </div>
        <div className={style.leftBottom}>
          <p className={style.DateHeading}>Date</p>
          <p className={style.date}>
            <SlCalender />
            {` ${formatDateToLongUTC(lead.createdAt)}`}
          </p>
        </div>
      </div>

      <div className={style.right}>
        <div
          className={`${style.rightTop} ${
            lead.type === "Hot"
              ? style.hot
              : lead.type === "Warm"
              ? style.warm
              : style.cold
          }`}
        >
          <p>{lead.status}</p>
        </div>

        <div className={style.rightBottom} onClick={(e) => e.stopPropagation()}>
          <button onClick={openType} className={style.button}>
            <RiEditCircleLine size={30} />
          </button>
          {showtype && (
            <div onClick={(e) => e.stopPropagation()} className={style.typeDiv}>
              <p>Type</p>
              <button
                onClick={() => updateType("Hot")}
                className={`${style.Typebutton} ${style.Typehot}`}
              >
                Hot
              </button>
              <button
                onClick={() => updateType("Warm")}
                className={`${style.Typebutton} ${style.Typewarm}`}
              >
                Warm
              </button>
              <button
                onClick={() => updateType("Cold")}
                className={`${style.Typebutton} ${style.Typecold}`}
              >
                Cold
              </button>
            </div>
          )}

          <button onClick={openDate} className={style.button}>
            <WiTime4 size={30} />
          </button>
          {showDate && (
            <div className={style.dateDiv}>
              <p className={style.p}>Date</p>
              <input
                className={style.input}
                type="date"
                name="date"
                onChange={handleChange}
                value={timeDetails.date}
              />
              <p className={style.p}>Time</p>
              <input
                className={style.input}
                type="time"
                name="time"
                onChange={handleChange}
                value={timeDetails.time}
              />
              <button className={style.saveButton} onClick={handleUpdateTime}>
                Save
              </button>
            </div>
          )}

          <button onClick={openStatus} className={style.button}>
            <IoChevronDownCircleOutline size={30} />
          </button>
          {showStatus && (
            <div className={style.statusDiv}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={style.select}
              >
                <option value="">Select</option>
                <option value="Closed">Closed</option>
              </select>
              <button onClick={handleUpdateStatus} className={style.saveButton}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadsComponent;
