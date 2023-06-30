import {  Progress, Spin } from 'antd';
import React, { useState, useEffect} from "react";
import "antd/dist/antd.css";
import { API } from 'const';
import axiosClient from "api/axiosClient";

const DoashboardUser = (props) => {

 const [storageBackup, setStorageBackup] = useState(0);
 const[liststatic, setListstatic] = useState(0);
 const [listGb, setListGb] = useState(0);
 const [listAllowed, setListAllowed] = useState(0);
 const [capacity, setCapacity] = useState(0);
 const [listFree, setListFree] = useState(0);
 const [loadingoverview, setLoadingoverview] = useState();


 useEffect(() => {
  setLoadingoverview(true)
    const fetchOverview = async () => {
    const res = await axiosClient.get(API.USER_STARTIC);
    if(res) {
      const a = String(res?.disk_used / 1024 / 1024 / 1024).slice(0,2)
      const b = String(res?.disk_allowed).slice(0,2)
      setLoadingoverview(false);
      if( a / b > 1){
        setStorageBackup(prevState => ({
          ...prevState,
          percent: ((a / b) * 10).toFixed(1)
        }))
      } else if(a / b < 1){
        setStorageBackup(prevState => ({
          ...prevState,
          percent: ((a / b) * 100).toFixed(1)
        }))
      
    }
    setListGb(prevState => ({
      ...prevState,
      percent: (res?.disk_used / 1024 / 1024 / 1024).toFixed(1)
    })) 
    
    setListAllowed(prevState => ({
      ...prevState,
      percent: (res?.disk_allowed / 1024 / 1024 / 1024)
    })) 
    setListFree(prevState => ({
      ...prevState,
      percent: ((res?.disk_allowed / 1024 / 1024 / 1024) - (res?.disk_used/ 1024 / 1024 / 1024)).toFixed(1)
    })) 
    setCapacity(prevState => ({
      ...prevState,
      percent: (res?.disk_allowed / 1024 / 1024 / 1024)
    })) 
    setListstatic(prevState => ({
        ...prevState,
        percent: res
    }))
    } else {
     
     setLoadingoverview(true);

    }
  }
  fetchOverview();
  }, []);   


  return (
   
    <div className="chart-tq back-all user-doash">
      {loadingoverview ?(
        <>
          <Spin />
        </>
      ):(
        <>
          <div className="flex-between">
            <h3>STORAGE</h3>
            <div>Free: <b>{String(listFree?.percent)} GB</b></div>
            </div>
            <Progress {...storageBackup}  />
            <div className="flex-between pd-201">
              <div>Used: <b>{String(listGb?.percent)} GB</b></div>
              <div>Capacity: <b>{capacity?.percent } GB</b></div>
            
            </div>
        
            <div className="pd-top-20">
            <div className="flex-now marg-10"><p className="text-user">VMs:</p> <div className="number-doas">{liststatic?.percent?.vm_count || 0 }</div></div> 
            <div className="flex-now marg-10"><p className="text-user">Volume:</p> <div className="number-doas">{liststatic?.percent?.volume_count || 0 }</div></div> 
            <div className="flex-now marg-10"><p className="text-user">Backup Groups:</p> <div className="number-doas">{liststatic?.percent?.backup_group_count || 0 }</div></div> 
            <div className="flex-now marg-10"><p className="text-user">Backup Versions:</p> <div className="number-doas">{liststatic?.percent?.backup_count || 0 }</div></div> 
            
            </div>
          </>
      )}
            
      
    </div>
   
  );
}


export default DoashboardUser;
