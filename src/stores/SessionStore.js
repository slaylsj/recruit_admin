import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class SessionStore {
    @observable error = null
    @observable isFetching = false

    constructor(root) {
        this.root = root;
    }
    
    @action
    sessionPing = () => {
        this.isFetching = true
        this.error = null
        // console.log("sessionPing!!!!");
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            let data = { 
                ws: 'fprocess',
                query: 'QM9E4VJWKKGAL4QUWTZ9',
                params: {
                    "nFCode" : "@nFCode"
                }
            } // web_b_a_select_banaple_recruit_ping

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
            }, (err) => {
                console.log(err);
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]SessionStore.sessionPing', e);
            this.error = e
            this.isFetching = false
        }
    }
}