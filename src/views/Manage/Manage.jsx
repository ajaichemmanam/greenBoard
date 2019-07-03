import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomCheckBox from "components/CustomCheckBox/CustomCheckBox.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import avatar from "assets/img/faces/marc.jpg";
//Authorization
import Auth from "authorization/auth";
// Import History
import history from "authorization/history"
// Import Endpoints
import { serviceApi } from "connections/connect.js"


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
    username: "",
    password: "",
    passMatch: false,
    adminAccess: false,
    deleteUsername: "",
    deleteUsernameStatus: "",
    registerStatus: "",
    plantId: "",
    plantType: "",
    plantedDate: "",
    remarks: "",
    addPlantStatus: ""
  };
  handleLogOut() {
    Auth.signout();
    console.log('After Logout' + Auth.isAuthenticated)
    sessionStorage.removeItem('auth');
    history.push({ pathname: '/' })
  }
  handleDeleteUser = () => {
    if (this.state.deleteUsername !== "") {
      var data = {
        // username: window.sessionStorage.getItem('username')
        username: this.state.deleteUsername
      }
      serviceApi.unregisterUser(data).then(res => {
        if (res.status === 200) {
          if (res.data["status"]) {
            // Signout Deleted User      
            // if (this.state.deleteUsername === window.sessionStorage.getItem('username')) {
            if (this.state.deleteUsername === Auth.sessionGet('username')) {
              Auth.signout();
              console.log('After Logout' + Auth.isAuthenticated)
              // sessionStorage.removeItem('auth');
              history.push({ pathname: '/' })
            }
            this.setState({ 'deleteUsername': "" })
          }
          this.setState({'deleteUsernameStatus': res.data['result']})
          console.log("Delete User", res.data)
        }
      })
    }
    else {
      this.setState({'deleteUsernameStatus': "Enter Username to Delete"})
      console.log("Enter Username to Delete")
    }
  }
  handleChange = (event, type) => {
    // console.log(type, event.target.value)
    switch (type) {
      case "username":
        this.setState({ "username": event.target.value })
        break;
      case "password":
        this.setState({ 'password': event.target.value })
        break;
      case "deleteUsername":
        this.setState({ 'deleteUsername': event.target.value })
        break;
      case "plantId":
        this.setState({ "plantId": event.target.value })
        break;
      case "plantType":
        this.setState({ "plantType": event.target.value })
        break;
      case "plantedDate":
        this.setState({ "plantedDate": event.target.value })
        break;
      case "remarks":
        this.setState({ "remarks": event.target.value })
        break;
      default:
        console.log("Case note matching")

    }

  }
  handleAdminAccess = event => {
    this.setState({ 'adminAccess': event.target.checked })
    console.log("Checkbox Change", event.target.checked)
  }
  handleConfirmPasswordChange = event => {
    if ((this.state.password === event.target.value) && (this.state.password !== "")) {
      this.setState({ 'passMatch': true })
      // console.log("Pass Matching")
    } else {
      this.setState({ 'passMatch': false })
      // console.log("Pass Not Matching")
    }
  }
  registerUser = () => {
    if (this.state.username !== "" && this.state.passMatch) {
      var data = {
        username: this.state.username,
        password: this.state.password,
        admin: this.state.adminAccess
      }
      serviceApi.registerUser(data).then(res => {
        if (res.status === 200) {
          if (res.data["status"]) {

            console.log("Registered User", res.data['result'])
            this.setState({ 'registerStatus': res.data['result'] })
          }
          else {
            console.log("Register User Failed", res.data['result'])
            this.setState({ 'registerStatus': res.data['result'] })
          }
          this.setState({ 'username': '', 'password': '', 'adminNew': false })
        }
        else {
          this.setState({ 'registerStatus': "Network Error:- " + res.status })
          console.log("Register User Fail", res.status)
        }
      })
    } else {
      console.log("Form Validation Failed")
    }
  }
  addPlant = () => {
    if (this.state.plantId !== "") {
      var data = {
        plantId: this.state.plantId,
        plantType: this.state.plantType,
        plantedOn: this.state.plantedDate,
        remarks: this.state.remarks
      }

      serviceApi.addPlant(data).then(res => {
        if (res.status === 200) {
          if (res.data["status"]) {
            this.setState({ 'addPlantStatus': res.data["data"] })
            console.log("Add Plant")
            this.setState({ 'plantId': '', 'plantType': '', 'plantedDate': '', 'remarks': '' })
          }
          else {
            this.setState({ 'addPlantStatus': res.data["data"] })
            console.log("Failed to add plant")
          }
        }
        else {
          this.setState({ 'addPlantStatus': "Network Error:- " + res.status })
        }
      })
    }
    else {
      this.setState({ 'addPlantStatus': "Enter a Unique PlantId" })
      console.log("Form Validation Failed")
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
                <h4 className={classes.cardTitleWhite}>User Registration</h4>
                <p className={classes.cardCategoryWhite}>Enter User details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    {/* <InputLabel style={{ color: "#AAAAAA" }}>User Name</InputLabel> */}
                    <CustomInput
                      labelText="Username"
                      id="username"
                      inputProps={{ value: this.state.username, autoComplete: "false", onChange: (event) => this.handleChange(event, "username") }}
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomCheckBox
                      labelText="Admin Access "
                      id="adminCheckBox"
                      inputProps={{ checked: this.state.adminAccess, onChange: this.handleAdminAccess }}
                      formControlProps={{
                        fullWidth: true
                      }} />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Password"
                      id="password"
                      inputProps={{ type: "password", value: this.state.password, autoComplete: "false", onChange: (event) => this.handleChange(event, "password") }}

                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Confirm Password"
                      id="password-verify"
                      inputProps={{ type: "password", autoComplete: "false", onChange: this.handleConfirmPasswordChange }}
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                      error={!this.state.passMatch}
                      success={true}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button onClick={this.registerUser} color="primary">Register</Button>
                <h6 className={classes.cardCategory}>{this.state.registerStatus}</h6>
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
                {/* <Button onClick={this.handleLogOut} color="primary" round > */}
                {window.sessionStorage.getItem('isAdmin') === "false" ? (null) : (
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
                  </React.Fragment>)}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Add Plant</h4>
                <p className={classes.cardCategoryWhite}>Enter Plant details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>

                  <GridItem xs={12} sm={12} md={4}>
                    {/* <InputLabel style={{ color: "#AAAAAA" }}>User Name</InputLabel> */}
                    <CustomInput
                      labelText="Plant Id (Unique)"
                      id="plantId"
                      inputProps={{ value: this.state.plantId, autoComplete: "false", onChange: (event) => this.handleChange(event, "plantId") }}
                      formControlProps={{
                        required: true,
                        fullWidth: true
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Plant Type"
                      id="planttype"
                      inputProps={{ value: this.state.plantType, autoComplete: "false", onChange: (event) => this.handleChange(event, "plantType") }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Planted On"
                      id="plantedDate"
                      inputProps={{ type: "date", autoComplete: "false", value: this.state.plantedDate, onChange: (event) => this.handleChange(event, "plantedDate") }}
                      formControlProps={{
                        fullWidth: true
                      }}
                      labelProps={{
                        shrink: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    {/* <InputLabel style={{ color: "#AAAAAA" }}>Remarks</InputLabel> */}
                    <CustomInput
                      labelText="Remarks"
                      id="remark"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 2,
                        value: this.state.remarks,
                        onChange: (event) => this.handleChange(event, "remarks")
                      }}
                    />
                  </GridItem>
                </GridContainer>

              </CardBody>
              <CardFooter>
                <Button onClick={this.addPlant} color="primary">Add Plant</Button>
                <h6 className={classes.cardCategory}>{this.state.addPlantStatus}</h6>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Manage);
