import axios from "axios";
import { serviceUrls } from "connections/endpoints";

var token = window.sessionStorage.jwtToken;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': token,
};

export const serviceApi = {
  registerUser(data){
    return axios.post(`${serviceUrls.registerUser}`,data, { headers });
  },
  unregisterUser(data){
    return axios.post(`${serviceUrls.unregisterUser}`,data, { headers });
  },
  addPlant(data){
    return axios.post(`${serviceUrls.addPlant}`,data, { headers });
  },
  removePlant(id,method){
    return axios.get(`${serviceUrls.removePlant}?plantId=${id}&&deleteMethod=${method}`, { headers });
  },
  listPlants() {
    return axios.get(`${serviceUrls.listPlants}`, { headers });
  },
  getGrowthData() {
    return axios.get(`${serviceUrls.growthData}`, { headers });
  },
  getPlantById(id) {
    //Format : ?plantId=52
    return axios.get(`${serviceUrls.getPlantAllData}?plantId=${id}`, { headers });
  },
  getPlantOnDate(id, date) {
    //Format : ?plantId=52&date=2019-06-05
    return axios.get(`${serviceUrls.getPlantData}?plantId=${id}&&date=${date}`, { headers });
  },

  toPlantDataModel(data) {
    return {
      plantId: data["plantId"],
      numLeaf: data["noLeaf"],
      regions: data["regions"],
      maskArea: data["maskArea"],
      totalArea: data["totalArea"],
      greenPerc: data["greenPercentage"],
      inputUrl: data["inputUrl"],
      outputUrl: data["outputUrl"],
    }
  },
  toPlantRegionModel(regions) {
    return regions.map((region, i) => {
      return {
        colour: region["color"],
        label: region["label"],
        score: region["score"],
        maskArea: region["maskArea"],
        key: i
      }
    })
  }
}