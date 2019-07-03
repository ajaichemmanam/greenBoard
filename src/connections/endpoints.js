// const loginEndpoint = "http://172.24.236.31/auth";
// const dataEndpoint = "http://172.24.236.31/data";
// const sensorEndpoint = "http://172.24.236.31/sensor";
const loginEndpoint = "http://172.26.234.2:5000";
const dataEndpoint = "http://172.26.234.2:5000";
// const sensorEndpoint = "http://192.168.43.153:5000";
const sensorEndpoint = "http://172.26.232.93:5000";

const serviceUrls = {
    registerUser: dataEndpoint + "/register",
    unregisterUser: dataEndpoint + "/unregister",
    addPlant: dataEndpoint + "/addPlant",
    removePlant: dataEndpoint + "/removePlant",
    listPlants: dataEndpoint + "/listPlants",
    growthData: dataEndpoint + "/getPlantGrowth",
    getPlantData: dataEndpoint + "/getData",
    getPlantAllData: dataEndpoint + "/getAllData",
    authentication: loginEndpoint + "/login"
};

export {
    dataEndpoint,
    loginEndpoint,
    sensorEndpoint,
    serviceUrls
};