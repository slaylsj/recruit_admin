import axios from 'axios';
import axios_jsonp from 'axios-jsonp-pro';

export default class Axios {
    static get = (url, params, axiosConfig, callback) => {
        return axios.get(url, params, axiosConfig)
        .then( function(json) {
            callback(json);
        })
        .catch((err) => { console.log("Axios[GET] Error : ", err) });
    };

    static post = (url, params, axiosConfig, callback, errCallback) => {
        return axios.post(url, params, axiosConfig)
        .then( function(json) {
            callback(json);
        })
        .catch((err) => { 
            if(typeof errCallback !== "undefined"){
               errCallback(err) 
            }else {
                console.log("Axios[POST] Error : ", err) 
                if(err.response.status === 600){
                    window.location.href = "/index";
                }
            }
        });
    };

    static getJsonp = (url, params, axiosConfig, callback, errCallback) => {
        return axios_jsonp.jsonp(url, params, axiosConfig)
        .then( function(json) {
            callback(json);
        })
        .catch((err) => { typeof errCallback !== "undefined" ?  errCallback(err) : console.log("Axios[JSONP] Error : ", err) });
    };
}