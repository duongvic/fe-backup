import React, {  } from 'react';
import {BrowserRouter,  Route} from 'react-router-dom';
import Home from './pages/Home';
import DashboardAD from './pages/DashboardAD';
import Login from './pages/Login';
import Common from './pages/Common';
// import AdminCommon from './pages/admin/AdminCommon'
import Listbackup from './pages/backup/Listbackup';
import Manualbackup from './pages/backup/Manualbackup';
import Policy from './pages/policy/Policy';
import CreatePolicy from './pages/policy/Createpolicy';
import ListUser from './pages/userManager/ListUser';
// import ResourceOver from './pages/userManager/ResourceOver';
import ListStorage from './pages/storage/ListStorage';
import Vmname from './pages/groupVM/Vmname';
import DoashboardUser from './pages/DoashboardUser';
import { createStore, applyMiddleware } from 'redux'; 
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import reducer from './store/reducers';

let middleware = [thunk];
const store = createStore(reducer, applyMiddleware(...middleware));

const App =() => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteWrapper exact path="/" component={Home} layout={Common} />
        <RouteWrapper
          path="/admin_dashboard"
          component={DashboardAD}
          layout={Common}
        />
        <RouteWrapper
          path="/user_dashboard"
          component={DoashboardUser}
          layout={Common}
        />
        <RouteWrapper
          path="/version_backup"
          component={Listbackup}
          layout={Common}
        />
        <RouteWrapper
          path="/manual_backup"
          component={Manualbackup}
          layout={Common}
        />
        <RouteWrapper path="/policy" component={Policy} layout={Common} />
        <RouteWrapper
          path="/create_policy"
          component={CreatePolicy}
          layout={Common}
        />

        <RouteWrapper
          path="/user_overview"
          component={ListUser}
          layout={Common}
        />
      
        {/* <RouteWrapper
          path="/resource_overview"
          component={ResourceOver}
          layout={Common}
        /> */}
        <RouteWrapper path="/storage" component={ListStorage} layout={Common} />
        {/* <RouteWrapper path="/addvm" component={AddVM} layout={Common}/> */}
        <RouteWrapper path="/volume_groups" component={Vmname} layout={Common} />
        <Route path="/login" component={Login} />
      </BrowserRouter>
    </Provider>
  );
}
function RouteWrapper ({component: Component,  layout: Layout,  ...rest}) {
  return (
    <Route
      {...rest}
      render = {(props) => (
        <Layout {...props}>
          <Component {...props}/>
        </Layout>
      )}
    />
  )
}

export default App;