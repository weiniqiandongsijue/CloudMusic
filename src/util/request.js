import axios from "axios";

//导入拦截器
const http = axios.create({
    baseURL:'http://localhost:3000',
    timeout:10000,
    withCredentials:true
})

//请求拦截器
http.interceptors.request.use(
    function(config){
        return config;
    },
    function(error){
        return Promise.reject(error);
    });

//响应拦截器
http.interceptors.response.use(
    function(response){
        return response;
    },
    function(error){
        return Promise.reject(error);
    })

export default http