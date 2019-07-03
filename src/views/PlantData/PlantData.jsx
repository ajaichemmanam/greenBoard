import React, { Component } from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// import Store from "@material-ui/icons/Store";
// import Warning from "@material-ui/icons/Warning";
// import DateRange from "@material-ui/icons/DateRange";
// import LocalOffer from "@material-ui/icons/LocalOffer";
// import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
// import Accessibility from "@material-ui/icons/Accessibility";
// import BugReport from "@material-ui/icons/BugReport";
// import Code from "@material-ui/icons/Code";
// import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/RegionTable/RegionTable.jsx";
// import Tasks from "components/Tasks/Tasks.jsx";
// import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
// import Danger from "components/Typography/Danger.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
// import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
// import { bugs, website, server } from "variables/general.jsx";
import avatar from "assets/img/plants/plant.png";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { serviceApi } from "connections/connect.js"
// Import History
import history from "authorization/history"
// For Time momentjs
// var moment = require('moment');
// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");



// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80,
  durations = 500;
// var delays2 = 80,
//   durations2 = 500;

//   var chartAnimation;
//   var chartOption;

class PlantData extends Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    plantId: "",
    plantType: "",
    plantDate: "",
    plantRemarks: "",
    value: 0,
    // dataViewDate: moment().format("YYYY-MM-DD"),
    growthPerc:"",
    dataViewDate: "",
    growthData: [[]],
    dateArray: [],
    plantModel: [],
    regionArray: [],

    dataRemoveStatus: ""
  };


  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  getPlantData = (id) => {
    serviceApi.getPlantById(id).then(res => {
      if (res.status === 200) {

        if (res.data['status'] === true) {
          var data = res.data['data']
          // console.log("Data by plantId", data)
          var tempDateArray = []
          var greenPercArray = []
          var greenPercArrayofArray = []
          data.forEach(plantData => {
            tempDateArray.push(plantData['date'])
            greenPercArray.push(plantData['greenPercentage'])

          });
          // Array of Array for making to chart required format
          greenPercArrayofArray.push(greenPercArray)

          // Calculate growth, greenPercArray[0] first value, greenPercArray[len(greenPercArray)-1] final value
          var percInc = (greenPercArray[greenPercArray.length-1]-greenPercArray[0])/greenPercArray[0]
          console.log("percInc", percInc )
          this.setState({ 'growthData': greenPercArrayofArray, 'dateArray': tempDateArray, 'growthPerc':percInc*100 })
          // console.log("DataArray", tempDateArray )
          // console.log("GreenPercArray", greenPercArray )

        }
      }

    })
  }

  getPlantDataOnDate = (id, date) => {
    // var date = moment().format("YYYY-MM-DD");

    serviceApi.getPlantOnDate(id, date).then(res => {
      if (res.status === 200) {

        if (res.data['status'] === true) {


          var plantModel = serviceApi.toPlantDataModel(JSON.parse(res.data['data']))
          // console.log(plantModel)
          var regionArray = []
          var regions = serviceApi.toPlantRegionModel(plantModel.regions)
          // console.log(regions)
          for (var i in regions) {
            var score = parseFloat(regions[i].score) * 100
            regionArray.push([regions[i].key.toString(), regions[i].colour + "B3", regions[i].label.toUpperCase(), score.toString(), regions[i].maskArea]);
          }
          // console.log(regionArray)
          this.setState(({ 'plantModel': plantModel, 'regionArray': regionArray }))
        }
        else {
          console.log(res.data['data'])
        }
      }
    });
  }

  handleChange = (event, type) => {
    // console.log(type, event.target.value)
    switch (type) {
      case "dataViewDate":
        this.setState({ "dataViewDate": event.target.value })
        if (this.state.dateArray.includes(event.target.value)) {
          this.getPlantDataOnDate(this.state.plantId, event.target.value);
        }
        break;
      default:
        console.log("Case note matching")
        break;
    }
  }

  handleRemovePlantData = (event, method) => {
    console.log("Plant Remove Method Called", method)
    serviceApi.removePlant(this.state.plantId, method).then(res => {
      if (res.status === 200) {
        if (res.data.status) {
          this.setState({ 'dataRemoveStatus': res.data['data'] })
          console.log("Plant Removed", method)
          if(method==="allData"){
            history.push({ pathname: '/admin/dashboard' })
          }
        }
        else{
          this.setState({ 'dataRemoveStatus': res.data['data'] })
          console.log("Plant Data Not Removed", res.data['data'])
        }
      }
      else {
        console.log("Network Error", res.status)
      }
    })

  }

  componentDidMount() {
    var plantId = this.props.location.state.id;
    var plantType = this.props.location.state.type;
    var plantDate = this.props.location.state.date;
    var plantRemarks = this.props.location.state.remarks;
    this.setState({ 'plantId': plantId, 'plantType': plantType, 'plantDate': plantDate, 'plantRemarks': plantRemarks })

    this.getPlantData(plantId)

    var date = this.state.dataViewDate;
    if (this.state.dateArray.includes(this.state.dataViewDate)) {
      this.getPlantDataOnDate(plantId, date);
    }
    this.chartAnimation = {
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

    this.chartOption = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // Rrecommend to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }

    // this.setState({ 'growthData': [[12, 17, 7, 17, 23, 18, 38]], 'growthLabel': ["M", "T", "W", "T", "F", "S", "S"] })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="plant" />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>{this.state.plantType || "Plant Type"}</h6>
                <h4 className={classes.cardTitle}>{this.state.plantId || "Plant Id"}</h4>
                <p className={classes.description}>
                  Planted on:  {this.state.plantDate || "Date"}
                </p>
                <p className={classes.description}>
                  {this.state.plantRemarks || "Plant Remarks"}
                </p>
                <CustomInput
                  labelText="View Data on"
                  id="dataViewDate"
                  inputProps={{ type: "date", autoComplete: "false", value: this.state.dataViewDate, onChange: (event) => this.handleChange(event, "dataViewDate") }}
                  formControlProps={{
                    fullWidth: true
                  }}
                  labelProps={{
                    shrink: true,
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={8}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={{
                    labels: this.state.dateArray,
                    series: this.state.growthData
                  }}
                  type="Line"
                  options={this.chartOption}
                  listener={this.chartAnimation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Plant Growth Rate</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> {this.state.growthPerc}
                  </span>{" "}
                  increase in growth till date.
                </p>
              </CardBody>
              <CardFooter chart>
                <Button onClick={(event) => this.handleRemovePlantData(event, "plantData")} color="primary" round >
                  Clear Data
              </Button>
                {this.state.dataRemoveStatus}
                <Button onClick={(event) => this.handleRemovePlantData(event, "allData")} color="primary" round >
                  Remove Plant
              </Button>
                {/* <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div> */}
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        {this.state.dateArray.includes(this.state.dataViewDate) ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="success">
                  Original Image
              </CardHeader>
                <CardBody>
                  <img src={this.state.plantModel.inputUrl} alt="Original" height="350" width="450" />
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> Image Taken on {this.state.dataViewDate}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>


            {/* <GridItem xs={12} sm={12} md={6}>
            <CustomTabs
              title="Tasks:"
              headerColor="primary"
              tabs={[
                {
                  tabName: "Bugs",
                  tabIcon: BugReport,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0, 3]}
                      tasksIndexes={[0, 1, 2, 3]}
                      tasks={bugs}
                    />
                  )
                },
                {
                  tabName: "Website",
                  tabIcon: Code,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0]}
                      tasksIndexes={[0, 1]}
                      tasks={website}
                    />
                  )
                },
                {
                  tabName: "Server",
                  tabIcon: Cloud,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[1]}
                      tasksIndexes={[0, 1, 2]}
                      tasks={server}
                    />
                  )
                }
              ]}
            />
          </GridItem> */}
            {/* <GridItem xs={12} sm={12} md={12}>
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
                  tableHead={["ID", "Age", "Growth Rate", "Status"]}
                  tableData={[
                    ["Plant1", "1 Month", "36.738%", "Healthy"],
                    ["Plant2", "2 Weeks", "23.789%", "Average"],
                    ["Plant3", "24 Hrs", "56.142%", "Good"],
                    ["Plant4", "3 Month", "38.735%", "About to Die"]
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem> */}

            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="success">
                  Analysed Image
              </CardHeader>
                <CardBody>
                  <img src={this.state.plantModel.outputUrl} alt="Processed" height="350" width="450" />
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> Analysed on {this.state.dataViewDate}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>

            <GridItem xs={12} sm={12} md={6}>
              <Card >
                <CardHeader color="success">
                  Analytics Result
              </CardHeader>
                <CardBody>
                  <h4>Green Percentage = {this.state.plantModel.greenPerc} % </h4>
                  <div style={{ overflowY: "scroll", maxHeight: "300px" }}>
                    <Table
                      tableHeaderColor="success"
                      tableHead={["Key", "Colour", "Object", "Score", "MaskArea"]}
                      // tableData={[
                      //   ["Leaf 1", "5.67 cm", "3.67 cm", "Healthy"],
                      //   ["Leaf 2", "8.2 cm", "2.3 cm", "Average"],
                      //   ["Leaf 3", "6.4 cm", "2.3 cm", "Good"],
                      //   ["Leaf 4", "7 cm", "3.1 cm", "About to Die"]
                      // ]}
                      tableData={this.state.regionArray}
                    />
                  </div>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime />  Analysed on {this.state.dataViewDate}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            {/* <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem> */}
          </GridContainer>

        ) : (
            <div style={{ textAlign: "center" }}>
              "No Data Found/ Choose a Valid Date"
            </div>
          )}

      </div>
    );
  }
}

PlantData.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PlantData);
