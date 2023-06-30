import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";

import TableBakupAdmin from './TableBakupAdmin'
import TableBackupUser from './TableBackupUser'


const Listbackup = () => {
  const [userInfo, setUserInfo] = useState();
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) return setUserInfo(JSON.parse(userStr));
  }, []);
  return (
    <div className="chart-tq back-all">
     
      {userInfo && userInfo?.role?.toUpperCase() === 'ADMIN' && (
          <TableBakupAdmin />
      )}
      {userInfo && userInfo?.role?.toUpperCase() === 'USER' && (
          <TableBackupUser />
      )}
     
    </div>
  );
}

export default Listbackup;
