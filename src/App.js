import React, { Component } from "react";
import { Route, Switch, Router, Redirect } from "react-router-dom";
// import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import history from "authorization/history"
// import "./App.css";
// import "antd/dist/antd.css";
// Styles
// CoreUI Icons Set
// import "@coreui/icons/css/coreui-icons.min.css";
// Import Flag Icons Set
// import "flag-icon-css/css/flag-icon.min.css";
// Import Font Awesome Icons Set
// import "font-awesome/css/font-awesome.min.css";
// Import Simple Line Icons Set
// import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "./scss/style.css";

// core components
import Admin from "layouts/Admin.jsx";
import RTL from "layouts/RTL.jsx";

import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Manage from "views/Manage/Manage.jsx";
// import TableList from "views/TableList/TableList.jsx";
// import Typography from "views/Typography/Typography.jsx";
// import Icons from "views/Icons/Icons.jsx";
// import Maps from "views/Maps/Maps.jsx";
// import NotificationsPage from "views/Notifications/Notifications.jsx";
// Pages
import Login from "views/Login/Login.jsx";
//Authorization
import Auth from "./authorization/auth";
// import {connect} from "connections/socketio.js"
// import { initialize } from "./data-source/actions/chartActions";

// import { renderRoutes } from 'react-router-config';
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends Component {
    // constructor(props) {
    //     super(props);
    //     // call our connect function and define
    //     // an anonymous callback function that
    //     // simply console.log's the received
    //     // message
    //     connect(message => {
    //       console.log(message);
    //     });
    //   }
  componentDidMount() {
    // console.log("Component mounted");
  }
  render() {
    return (
      // <BrowserRouter>
      <Router history = {history}> 
        <Switch>
    
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/rtl" component={RTL} />
          {/* <Route exact path="/register" name="Register Page" component={Register} /> */}
          <PrivateRoute
            path="/admin/dashboard"
            name="dashboard"
            component={DashboardPage}
          />
          <PrivateRoute
            path="/admin/manage"
            name="Manage"
            component={Manage}
          />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
        
        </Router>
      // </BrowserRouter>
    );
  }
}

export default App;