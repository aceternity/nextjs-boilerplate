import axios, { AxiosInstance } from "axios";

class AxoisClient {
  static client: AxoisClient;

  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({ baseURL: '/' });
    this.axios.defaults.timeout = 35000;
  }

  setBearerToken = (token: string) => {
    this.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  static getInstance = () => {
    if (!AxoisClient.client) {
      AxoisClient.client = new AxoisClient();
    }
    return AxoisClient.client.axios;
  };
}

export default AxoisClient;
