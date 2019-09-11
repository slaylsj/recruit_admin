import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class ApplyStore {
    @observable error = null
    @observable isFetching = false
    @observable applyList = []
    @observable totalCnt = 0
    @observable activePage = 1

    constructor(root) {
        this.root = root;
    }
    
    @action
    getApplyList = (params) => {
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
                query: 'A9KBJKEV3EWO7JKSMVEH',
                params: params
            } // web_b_a_select_banaple_recruit_submit_list
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                this.totalCnt = result.data.params.nTotalCnt;
                this.activePage = result.data.params.nActivePage;
                this.applyList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]ApplyStore.getApplyList', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    deleteRecruitApply = (params, callback) => {
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
                query: 'MDSZFUKWUKJ6EOEVGHAT',
                params: params
            } // web_b_a_delete_banaple_recruit_submit

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
            console.log('[ERROR]ApplyStore.deleteRecruitApply', e);
            this.error = e
            this.isFetching = false
        }
    }
}