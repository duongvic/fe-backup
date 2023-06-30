import React, { useState, useEffect } from 'react';
import { Progress, Tag } from 'antd';

import "antd/dist/antd.css";
import { API } from 'const';
import axiosClient from "api/axiosClient";

function DashboardAD() {
    const [diskoverCommit, setDiskoverCommit] = useState(0);
    const [diskued, setDiskused ] = useState(0)
    const [diskname, setDiskname] = useState(0);
    const [useronnode, setuseronnode] = useState(0);
    // const [disknode, setDisknode] = useState(0);

  
    
    useEffect(() => {
        ( async () => {
            const response = await axiosClient.get(API.LIST_NODE);
            if(response){
                // const percent2 = parseFloat (disk2.disk_used * 10)
                // setPercent2(percent2)

                // // console('percent2',percent2)
                // const res = response?.data?.data;
               
                setDiskoverCommit(prevState => ({
                    ...prevState,
                    percent: response?.data?.map(item =>item.disk_used_overcommit) * 100
                    
                })) 
                setDiskused(prevState => ({
                    ...prevState,
                    percent: response?.data?.map(item => item.disk_used_percent)
                    
                })) 
                
                setDiskname(response?.data?.map(item => item.name))
                setuseronnode(response?.data?.map(item => item.storage_count))
                
            }

                // setOvercommit(prevState => ({
                //     ...prevState,
                //     percent: res.data.data[0].disk_used_overcommit
                //     }))  
                // setOvercommit2(prevState => ({
                //     ...prevState,
                //     percent: res.data.data[2].disk_used_overcommit
                //  })) 

                })()
                
            },[]);
            
    return (
        <div className="chart-tq back-all">
            <h3 className="text-ad">Disk user</h3>
        <div className="flex-around2">
        
            <div>
            <Progress type="circle" {...diskued} />
            <p className="text-dos">{diskname}</p>
            </div>
            {/* <div>
                
            <Progress type="circle" percent ={diskname.percent} />
            <p className="text-dos">Node 2: Allowed 130%</p>
            </div> */}
            
        </div>
        <h3 className="text-ad">Disk overcommit (Allow 130%)</h3>
        <div className="flex-around2">
        <div className="chart-ad">
        <Progress {...diskoverCommit} />
        <p className="text-dos">{diskname}</p>
        </div>
        
        {/* <div className="chart-ad ">
        <Progress {...diskoverCommit} />
        <p className="text-dos">Node 2: Allowed 130%</p>
        </div> */}
       
        </div>
       
        <div className="pd-top-20">
        <h3 className="text-ad">User on Node</h3>
        <div className="useronnode">
            <p>{diskname} : <Tag color="magenta">{useronnode || 0 }</Tag> </p>
            
        </div>
        </div>
        
        </div>
    );
}
export default DashboardAD;
