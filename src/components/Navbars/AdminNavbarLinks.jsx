import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";

//Authorization
import Auth from "authorization/auth";
import { Redirect } from "react-router-dom";

class HeaderLinks extends React.Component {
  state = {
    open: false,
    profileOpen: false,
    profileEdit: false,
    auth:Auth.isAuthenticated,
    NotificationsArray:["C3i Plant12 requies attention", "Water Low Warning"]
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  handleMenuClick = (event, i) => {
    var not = this.state.NotificationsArray;
    not.splice(i,1)
    this.setState({'NotificationsArray': not})
    this.handleClose(event)
    console.log("Notification Clicked", not)
    // if (this.anchorEl.contains(event.target)) {
    //   return;
    // }
    // this.setState({ open: false });
  }
  handleProfileToggle = () => {
    this.setState(state => ({ profileOpen: !state.profileOpen }));
  };

  handleProfileClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ profileOpen: false });
  };
  handleManage = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ profileOpen: false, profileEdit:true });
    
  };
  handleLogOut = () => {
    Auth.signout();
    console.log('After Logout'+Auth.isAuthenticated)
    this.setState({auth:Auth.isAuthenticated});
    sessionStorage.removeItem('auth');
  }
  render() {
    const { classes } = this.props;
    const { open, profileOpen, profileEdit, auth, NotificationsArray } = this.state;

var menuArray = [];
NotificationsArray.forEach((notification, i) => menuArray.push(
  <MenuItem
  onClick={event=>{this.handleMenuClick(event,i)}}
  className={classes.dropdownItem}
  key={i}
>
 { notification}
</MenuItem>
))

    if(auth === false){
      return <Redirect to = '/login' />
    }
    if(profileEdit){
      return <Redirect to = '/admin/manage' />
    }
    return (
      <div>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className={classes.buttonLink}
          >
            <Notifications className={classes.icons} />
            <span className={classes.notifications}>{NotificationsArray.length}</span>
            <Hidden mdUp implementation="css">
              <p onClick={this.handleClick} className={classes.linkText}>
                Notification
              </p>
            </Hidden>
          </Button>
          <Poppers
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList role="menu">
                    {menuArray}
                      
                      {/* <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                        Mike John responded to your email
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                        You have 5 new tasks
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                        You're now friend with Andrew
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                        Another Notification
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                        Another One
                      </MenuItem> */}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Person"
          aria-owns={profileOpen ? "menu-list-grow" : null}
          aria-haspopup="true"
          onClick={this.handleProfileToggle}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
            open={profileOpen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !profileOpen }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleProfileClose}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleManage}
                        className={classes.dropdownItem}
                      >
                        Manage
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleLogOut}
                        className={classes.dropdownItem}
                      >
                        Log Out
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
