import axios from "axios";

//Defautl config for axios
export default axios.create(
    {
        baseURL: "http://127.0.0.1:3500/",
        //baseURL: "https://ufpspro-production.up.railway.app/",
        responseType: "json",
        timeout: 6000,
        withCredentials: true,
    }
)
