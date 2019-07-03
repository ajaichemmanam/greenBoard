import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// import InputLabel from "@material-ui/core/InputLabel";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
// import CustomCheckBox from "components/CustomCheckBox/CustomCheckBox.jsx";
import CustomSwitch from "components/CustomSwitch/CustomSwitch.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import CustomSliderInput from "components/CustomSliderInput/CustomSliderInput.jsx";

import avatar from "assets/img/faces/marc.jpg";
//Authorization
import Auth from "authorization/auth";
// Import History
import history from "authorization/history"
// Connection Components
import { sensorEndpoint } from "connections/endpoints.js"
import { serviceApi } from "connections/connect.js"
import io from 'socket.io-client';


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};


// function Manage(props) {
class Manage extends Component {
  // constructor(props) {
  //   super(props);
  //   this.registerUser = this.registerUser.bind(this);
  // } 
  state = {
    operationMode: "Automatic",
    lightValue: 0,
    waterPump: false,
    pumpState:"Off",
    adminAccess: false,
  };

  componentWillUnmount() {
    this.socket.close()
    console.log("component unmounted")
  }
  componentDidMount() {
    this.socket = io.connect(sensorEndpoint, {
      reconnection: true
    });
    console.log("component mounted", this.socket)
    this.socket.on("responseMessage", message => {
      console.log(message)
    });
  }

  handleLogOut() {
    Auth.signout();
    console.log('After Logout' + Auth.isAuthenticated)
    sessionStorage.removeItem('auth');
    history.push({ pathname: '/' })
  }

  handleSliderChange = (event, newValue) => {
    this.setState({ 'lightValue': newValue })
  }

  handleSwitchToggle = (event, type) => {
    // console.log(type, event.target.value)
    switch (type) {
      case "pumpSwitch":
        this.setState({ "waterPump": event.target.checked })
        if (event.target.checked) {
          this.setState({ 'pumpState': 'On' })
        } else {
          this.setState({ 'pumpState': 'Off' })
        }
        break;
      default:
        console.log("Switch Toggle, Case note matching")
    }
  }
  handleChange = (event, type) => {
    // console.log(type, event.target.value)
    switch (type) {
      case "sliderInput":
        if (event.target.value === '') {
          this.setState({ "lightValue": '' })
        }
        else {
          if (Number(event.target.value) < 0) {
            this.setState({ "lightValue": 0 })
          }
          else if (Number(event.target.value) > 100) {
            this.setState({ "lightValue": 100 })
          }
          else {
            this.setState({ "lightValue": Number(event.target.value) })
          }
        }
        break;
      default:
        console.log("Input Change, Case note matching")

    }

  }
  

  applyManualChanges = () => {
    this.socket.emit("message", { 'mode': this.state.operationMode, 'lightIntensity': this.state.lightValue, 'pumpState': this.state.pumpState })
  }
  changeOperationMode = ()=>{
    if(this.state.operationMode==="Automatic"){
      this.setState({'operationMode':'Manual'})
    }
    else{
      this.setState({'operationMode':'Automatic'})
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Manual Control</h4>
                <p className={classes.cardCategoryWhite}>Control Raspberry Pi Module Manually</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomSliderInput
                      sliderProps={{
                        value: typeof this.state.lightValue === 'number' ? this.state.lightValue : 0,
                        onChange: this.handleSliderChange
                      }}
                      labelText="Light Intensity"
                      id="lightIntensity"
                      inputProps={{
                        value: this.state.lightValue, autoComplete: "false",
                        onChange: (event) => this.handleChange(event, "sliderInput"),
                        // step: 10,
                        // min: 0,
                        // max: 100,                    
                        type: 'number',
                        margin: "dense"
                      }}
                    ></CustomSliderInput>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <CustomSwitch labelText="Water Pump"
                      id="pumpSwitch"
                      inputProps={{ checked: this.state.waterPump, onChange: (event) => this.handleSwitchToggle(event, "pumpSwitch") }}
                      formControlProps={{
                        fullWidth: true
                      }} />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button onClick={this.applyManualChanges} color="primary">Apply Changes</Button>
                <h6 className={classes.cardCategory}>Operation Mode: {this.state.operationMode}</h6>
                <Button onClick={this.changeOperationMode} color="primary">Change Mode</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>C3I Center</h6>
                <h4 className={classes.cardTitle}>{window.sessionStorage.getItem('username')}</h4>
                <p className={classes.description}>
                  {window.sessionStorage.getItem('isAdmin') === "false" ? "Regular User" : "Admin User"}
                </p>
                <Button onClick={this.handleLogOut} color="primary" round > LogOut
                {/* {window.sessionStorage.getItem('isAdmin') === "false" ? (null) : (
                  <React.Fragment>
                    <CustomInput
                      labelText="Username to Delete"
                      id="userDelete"
                      inputProps={{ value: this.state.deleteUsername, autoComplete: "false", onChange: (event) => this.handleChange(event, "deleteUsername") }}
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                    />
                    <Button onClick={this.handleDeleteUser} color="primary" round >
                      Delete User
              </Button>
                    <h6 className={classes.cardCategory}>{this.state.deleteUsernameStatus}</h6>
                  </React.Fragment>)} */}


                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>       
      </div>
    );
  }
}

export default withStyles(styles)(Manage);
