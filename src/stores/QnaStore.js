import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class QnaStore {
    @observable error = null
    @observable isFetching = false
    @observable qnaList = []

    constructor(root) {
        this.root = root;
    }

    @action
    getQnaList = () => {
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
                query: 'NKHA5MR8JS463N5FZD4S',	
                params: {
                    nFCode: "@nFCode"
                }
            } // web_b_a_select_banaple_recruit_qna
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                this.qnaList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                }, null);
                //console.log("qnaList : " , this.qnaList);
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]QnaStore.getQnaList', e);
            this.error = e
            this.isFetching = false
        }
    }
    
    @action
    saveQna = (params, callback) => {
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
                query: 'JK8GJMTFF1RGGSFOK88K',
                params: params
            } //web_b_a_insert_banaple_recruit_qna

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                // console.log("QnaStore saveQna ", result.data);
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 1, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]QnaStore.saveQna', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    deleteQna = (params, callback) => {
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
                query: 'BJGQNFXABELVV2FPIPTU',
                params: params
            } // web_b_a_delete_banaple_recruit_qna

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                // console.log("QnaStore deleteQna ", result.data);
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 1, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]QnaStore.deleteQna', e);
            this.error = e
            this.isFetching = false
        }
    }
}