import React, { useState, useEffect } from 'react';
import style from './styles/App.module.css';

import SidebarComponent from './components/SidebarComponent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Leads from './pages/Leads.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  const [selected, setSelected] = useState('Dashboard');

  return (
    <div className={style.main}>
      <SidebarComponent selected={selected} select={setSelected} />

      {selected === 'Dashboard' && <Dashboard select={selected}/>}
      {selected === 'Employees' && <Employees select={selected}/>}
      {selected === 'Leads' && <Leads select={selected}/>}
      {selected === 'Settings' && <Settings select={selected}/>}
    </div>
  );
}

export default App;
