import React, { useState } from "react";
import style from "./styles/App.module.css";
import HeaderComponent from "./components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import HomePage from "./pages/HomePage.jsx";
import LeadsPage from "./pages/LeadsPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  const [selected, setSelected] = useState("home");
  return (
    <div className={style.main}>
      <div className={style.innerMain}>
        <HeaderComponent />
        <div className={style.body}>
          {selected === "home" && <HomePage />}
          {selected === "leads" && <LeadsPage />}
          {selected === "schedule" && <SchedulePage />}
          {selected === "profile" && <ProfilePage />}
        </div>
        <FooterComponent select={selected} setSelect={setSelected} />
      </div>
    </div>
  );
}

export default App;
