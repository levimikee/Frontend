import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";

import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";
import storePersist from "@/redux/storePersist";
import { getCookie, setCookie, deleteCookie } from "./cookie";





export const login = async (loginAdminData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
      loginAdminData
    );
    token.set(response.data.result.token);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = async () => {
  const headersInstance = { [ACCESS_TOKEN_NAME]: getCookie(ACCESS_TOKEN_NAME) };
  
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      ...headersInstance,
    },
  }); 
  try {
    await axiosInstance.post(
      API_BASE_URL + "logout",
      {}
    );
  } catch (error) {
  }
  token.remove();
  storePersist.clear();
  // redirect to login forcing a reload
  window.location.href = "/"; 
};

export const token = {
  get: () => {
    return getCookie(ACCESS_TOKEN_NAME);
  },
  set: (token) => {
    return setCookie(ACCESS_TOKEN_NAME, token);
  },
  remove: () => {
    return deleteCookie(ACCESS_TOKEN_NAME);
  },
};
