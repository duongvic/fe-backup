import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from '@ant-design/icons';
const BreadCrumb = () => {
  const location = useLocation();
  const breadcrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
   
    return (
      <div>
        <Breadcrumb>
       
          {pathnames.length > 0 ? (
            
            <Breadcrumb.Item>
                <Link to="/"><HomeOutlined /> Home</Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          )}
          {pathnames.map((name, index) => {
            let breadcrumbName = []
            name.split("_").map((element, index) => {
              element = element.charAt(0).toUpperCase() + element.slice(1);
              breadcrumbName.push(element);
              return element})

            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <Breadcrumb.Item>{breadcrumbName.join(" ")}</Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item>
                <Link to={`${routeTo}`}>{breadcrumbName.join(" ")}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  };

  return <>{breadcrumbView()}</>;
};

export default BreadCrumb;