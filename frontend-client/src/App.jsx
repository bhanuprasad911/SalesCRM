import React, { useState } from "react";
import style from "./styles/App.module.css";
import HeaderComponent from "./components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import HomePage from "./pages/HomePage.jsx";
import LeadsPage from "./pages/LeadsPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {Toaster} from 'react-hot-toast'

function App() {
  const [selected, setSelected] = useState("Home");
  return (
    <div className={style.main}>
      <Toaster />
      <div className={style.innerMain}>
        <HeaderComponent page={selected} setPage={setSelected}/>
        <div className={style.body}>
          {selected === "Home" && <HomePage />}
          {selected === "Leads" && <LeadsPage />}
          {selected === "Schedule" && <SchedulePage />}
          {selected === "Profile" && <ProfilePage />}
        </div>
        <FooterComponent select={selected} setSelect={setSelected} />
      </div>
    </div>
  );
}

export default App;
