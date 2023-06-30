
import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

import Doashboarduser from './DoashboardUser'
import DashboardAD from './DashboardAD'
// import Slider from "./components/Slider";
 
function Home() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);
 
  

  return (
    <div>
      {userInfo && userInfo?.role?.toUpperCase() === 'ADMIN' && (
          <DashboardAD />
      )}
      {userInfo && userInfo?.role?.toUpperCase() === 'USER' && (
          <Doashboarduser />
      )}
    </div>
  );
}

export default Home;
