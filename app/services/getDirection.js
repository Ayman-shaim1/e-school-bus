import axios from "axios";
import environment from "../../environment";
export default async function getDirection(start, destination) {
  const { data } = await axios(
    `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${environment.openrouteapikey}&start=${start}&end=${destination}`
  );
  return data;
}
