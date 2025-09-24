import axios from 'axios';
import {useNavigate} from "react-router";

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

export const saveItinerary = async (itineraryData) => {
  return await instance.post('trips', itineraryData);
}

export const getAIPlanningRoute = async (searchData) => {
  return await instance.post('route/process',searchData);
}

export const login = async (userData) => {
  return await instance.post('accounts/login', userData);
}