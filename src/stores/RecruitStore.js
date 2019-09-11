import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class RecruitStore {
    @observable error = null
    @observable isFetching = false
    @observable recruitList = []

    constructor(root) {
        this.root = root;
    }
    
    @action
    saveRecruit = (params, callback) => {
        this.isFetching = true
        this.error = null
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            let data = { 
                ws: 'fprocess',
                query: 'XJGZUDWD3B9ZVLVIXLYX',
                params: params
            } // web_b_a_insert_banaple_recruit

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                // console.log("RecruitStore saveRecruit ", result.data);
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]RecruitStore.saveRecruit', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    getRecruitList = (params) => {
        this.isFetching = true
        this.error = null
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            let data = { 
                ws: 'fprocess',
                query: 'MGSJ0LVUZXJDOXOK2NMS',
                params: params
            } // web_b_a_select_banaple_recruit_list
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                this.recruitList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]RecruitStore.getRecruitList', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    selectRecruit = (params, callback) => {
        this.isFetching = true
        this.error = null
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            
            let data = { 
                ws: 'fprocess',
                query: 'P7RPPFXL0I01CBJTXBV3',	
                params: params
            } // web_b_a_select_banaple_recruit
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                const dataList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
                callback( dataList[0]);
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]RecruitStore.selectRecruit', e);
            this.error = e
            this.isFetching = false
        }
    }

    
    @action
    deleteRecruit = (params, callback) => {
        this.isFetching = true
        this.error = null
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            let data = { 
                ws: 'fprocess',
                query: 'TRWF3AIUU29VRXGR6RSD',
                params: params
            } //  web_b_a_delete_banaple_recruit

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                // console.log("RecruitStore deleteRecruit ", result.data);
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 1, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]RecruitStore.deleteRecruit', e);
            this.error = e
            this.isFetching = false
        }
    }
}