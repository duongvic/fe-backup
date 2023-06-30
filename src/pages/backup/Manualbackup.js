import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

import ManualAdmin from './ManualAdmin'
import ManualUser from './ManualUser'
 
function Manualbackup() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);

  return (
    <div className="chart-tq back-all manual">
    
      {userInfo && userInfo?.role?.toUpperCase() === 'ADMIN' && (
          <ManualAdmin />
      )}
      {userInfo && userInfo?.role?.toUpperCase() === 'USER' && (
          <ManualUser />
      )}
   
    </div>
  );
}

export default Manualbackup;
