import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Update from "@material-ui/icons/Update";
import AccessTime from "@material-ui/icons/AccessTime";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
// Connection Components
import { sensorEndpoint } from "connections/endpoints.js"
import { serviceApi } from "connections/connect.js"
import io from 'socket.io-client';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80, durations = 500;

class Dashboard extends React.Component {

  state = {
    temperature: 0,
    conductivity: 0,
    salinity: 0,
    luxIR: 0,
    luxVisible: 0,
    waterLevel: 0,
    value: 0,
    allPlantData: [],
    growthData: [],
    growthDate: []
  };

  onRowClick = (e, prop, key) => {

    this.props.history.push({ pathname: '/admin/PlantData', state: { id: prop[0], type: prop[1], date: prop[2], remarks: prop[3] } })
  }

  getPlantList = () => {
    serviceApi.listPlants().then(res => {
      if (res.status === 200) {
        // let logs = res.data["Data"];
        if (res.data.status) {
          this.setState({ 'allPlantData': res.data["data"] })
        }
        // console.log("Plant List", res.data)
      }
    });
  }

  getGrowthData = () => {
    serviceApi.getGrowthData().then(res => {
      if (res.status === 200) {
        if (res.data.status) {
          // console.log("Growth Data", res.data.data)
          var data = res.data["data"]
          var plantlist = []
          var arrayofarray = []
          var temparray = []
          var datearray = []
          data.forEach(row => {
            // Plant data already  added to plantlist
            if (plantlist.includes(row[0])) {
              // Add another data to the temp data array 
              temparray.push(row[1])
              // Check if the date is not already added to date array
              if (!datearray.includes(row[2])) {
                datearray.push(row[2])
              }
            }
            // Plant Id for the first time
            else {
              // Add to plant list array
              plantlist.push(row[0])
              // Check if the date is not already added to date array
              if (!datearray.includes(row[2])) {
                datearray.push(row[2])
              }
              // Check if the old temparray has data
              if (temparray.length > 0) {
                arrayofarray.push(temparray)
                //Clear the array
                temparray = []
              }
              temparray.push(row[1])
            }

          });
          // Check if the old temparray has data, add the final data
          if (temparray.length > 0) {
            arrayofarray.push(temparray)
            temparray = []
          }
          this.setState({ 'growthData': arrayofarray, 'growthDate': datearray })
          // console.log("Date Array", datearray)
          // console.log("Data Array", arrayofarray)
          // this.setState({ 'allPlantData': res.data["data"] })
        }
        else {
          console.log("Growth Data Error", res.data)
        }


      }
    });
  }

  componentWillUnmount() {
    this.socket.close()
    console.log("component unmounted")
  }
  componentDidMount() {
    this.socket = io.connect(sensorEndpoint, {
    reconnection: true,
    // transports: ['polling']
    transports: ['websocket']
});
    console.log("component mounted", this.socket)
    this.socket.on("responseMessage", message => {
      if(message.waterTemperatureC === undefined){
        console.log("responseMessage",  message.waterTemperatureC)        
      }
      else{
        console.log("data", message)
      this.setState({ 'temperature': message.waterTemperatureC, 'conductivity': message.conductivity, 'salinity': message.salinity, 'luxIR': message.luxIR, 'luxVisible': message.luxVisible })
      if (message.waterLevel !== 0.01) {
        this.setState({ 'waterLevel': Math.min(Math.max(parseInt(message.waterLevel), 1), 100) })
      }
    }
    });
//     this.socket.on('message', message=>{
// console.log("message", message)
//     });


    this.allPlantChartOption = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 100, // Recommend to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }

    this.allPlantChartAnimation = {
      draw: function (data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    }

    this.getPlantList()
    this.getGrowthData()
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>toys</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Temperature</p>
                <h3 className={classes.cardTitle}>
                  {this.state.temperature} <small>oC</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {/* <Danger>
                    <Warning />
                  </Danger>
                    Text Placebo
                  </a> */}
                  <Update />
                  Updated Now
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  {/* <Store /> */}
                  <Icon>opacity</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Salinity</p>
                <h3 className={classes.cardTitle}>{this.state.salinity} <small>%</small></h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {/* <DateRange />
                  Last 24 Hours */}
                  <Update />
                  Updated Now
                </div>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>brightness_4</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Luminance</p>
                <h3 className={classes.cardTitle}> {this.state.luxVisible} <small>cd</small></h3>
                {/* <h3 className={classes.cardTitle}> {this.state.luxIR} <small>cd</small></h3> */}
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Updated Now
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>gradient</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Water Level</p>
                <h3 className={classes.cardTitle}>
                  {this.state.waterLevel} <small> %</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {/* <Danger>
                    <Warning />
                  </Danger>
                    Text Placebo
                  </a> */}
                  <Update />
                  Updated Now
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={{
                    labels: this.state.growthDate,
                    series: this.state.growthData
                  }}
                  type="Line"
                  options={this.allPlantChartOption}
                  listener={this.allPlantChartAnimation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Plant Green Rate</h4>
                <p className={classes.cardCategory}>
                  Green Estimation
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> Updated Today
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={9} md={9}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Plant Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  All Hydroponic Plants Data
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  // Sample Data Structure
                  // tableHead={["PlantID", "Age", "Average Growth Rate", "Status"]}
                  // tableData={[
                  //   ["1", "1 Month", "36.738%", "Healthy"],
                  //   ["2", "2 Weeks", "23.789%", "Average"],
                  //   ["3", "24 Hrs", "56.142%", "Good"],
                  //   ["4", "3 Month", "38.735%", "About to Die"]
                  // ]}
                  tableHead={["PlantID", "Plant Type", "Planted On", "Remarks"]}
                  tableData={this.state.allPlantData}
                  onRowClick={this.onRowClick}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
