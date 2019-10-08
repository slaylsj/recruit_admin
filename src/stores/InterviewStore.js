import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class InterviewStore {
    @observable error = null
    @observable isFetching = false
    @observable interviewList = []
    @observable totalCnt = 0
    @observable activePage = 1
    @observable historyList = []
    
    @observable webTitle = null
    @observable company = null
    @observable stepText = {}
    @observable interviewStepData = {}
    @observable stepCount = 0
    @observable nowStepData = {}
    @observable interviewAnswer = {}

    constructor(root) {
        this.root = root;
    }
    
    @action
    setStepData = (step, callback) => {
        let stepKey = Object.keys(this.interviewStepData);
        this.nowStepData = this.interviewStepData[stepKey[step]];
        callback();
    }

    @action
    getTotalStepCnt = () => {
        return this.stepCount;
    }

    @action
    getInterviewList = (params) => {
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
                query: 'EE1AAQJU4ZZQG1EQ72IP',
                params: params
            } // web_select_banapresso_interview_list
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                this.totalCnt = result.data.params.nTotalCnt;
                this.activePage = result.data.params.nActivePage;
                this.interviewList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.getInterviewList', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    setInterviewPreviewData = (previewData, callback) => {
        const { questionList, explanation, footer } = previewData;
        var step_data = {
            "startStep": null,
            "finishStep" : null,
            "step" : {}
        };
        questionList.forEach((dataObj, idx) => {
            if(idx === 0){
                step_data["startStep"] = explanation; 
                step_data["finishStep"] = footer; 
            }
            step_data["step"]["step_"+idx] = {};
            step_data["step"]["step_"+idx]["list"] = [];
            step_data["step"]["step_"+idx]["nAnswerType"] = dataObj.answer_type;
            step_data["step"]["step_"+idx]["sQuestion"] = dataObj.question;

            if(dataObj.answer_type === 1){
                step_data["step"]["step_"+idx]["list"] = dataObj.option_1.map(d => {
                    d.nStepID = d.id;
                    return d;
                });
            }else if(dataObj.answer_type === 2){
                step_data["step"]["step_"+idx]["list"] = dataObj.option_2.map(d => {
                    d.nStepID = d.id;
                    return d;
                });
            }
        });
        this.stepText = { "startText" : step_data["startStep"], "finishText" : step_data["finishStep"]}
        this.interviewStepData = step_data["step"];
        this.stepCount = Object.keys(this.interviewStepData).length;
        callback();
    }

    @action
    getInterviewStepList = (params, callback) => {
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
                query: 'LYYFYJJHYLV4MQTDVVV7',
                params: params
            } // web_select_banapresso_interview_step_list
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });

                let interviewStepList = result.data.rows.map((rowObj, idx) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });

                var step_data = {
                    "startStep": null,
                    "finishStep" : null,
                    "step" : {}
                };
                interviewStepList.forEach((dataObj, idx) => {
                    if(idx === 0){
                        this.company = dataObj.sCompany; 
                        this.webTitle = dataObj.sWebTitle; 
                        step_data["startStep"] = dataObj.sExplanation; 
                        step_data["finishStep"] = dataObj.sFooter; 
                    }
                    if(typeof step_data["step"]["step_"+dataObj.nStepID] !== "undefined"){
                        step_data["step"]["step_"+dataObj.nStepID]["list"].push(dataObj);
                    }else{
                        step_data["step"]["step_"+dataObj.nStepID] = {};
                        step_data["step"]["step_"+dataObj.nStepID]["list"] = [];
                        step_data["step"]["step_"+dataObj.nStepID]["list"].push(dataObj);
                        step_data["step"]["step_"+dataObj.nStepID]["nAnswerType"] = dataObj.nAnswerType;
                        step_data["step"]["step_"+dataObj.nStepID]["sQuestion"] = dataObj.sQuestion;

                        // 답변 Object 생성.
                        this.interviewAnswer["step_"+dataObj.nStepID] = {
                            'nStepID' : 0,
                            'nAnswerType' : 0,
                            'nAnswerOption' : 0,
                            'sAnswerCheckList' : '',
                            'sAnswer' : ''
                        };
                    }
                });
                this.stepText = { "startText" : step_data["startStep"], "finishText" : step_data["finishStep"]}
                this.interviewStepData = step_data["step"];
                this.stepCount = Object.keys(this.interviewStepData).length;

                callback( { return : 1, sError : ''});

            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStroe.getInterviewStepList', e);
            this.error = e
            this.isFetching = false
        }
    }
    
    @action
    deleteInterview = (params, callback) => {
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
                query: 'QK5Y98Q8FOVM537T2L7F',
                params: params
            } // web_delete_banapresso_interview

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
            console.log('[ERROR]InterviewStore.deleteRecruitApply', e);
            this.error = e
            this.isFetching = false
        }
    }
    
    @action
    selectInterview = (params, callback) => {
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
                query: 'LYYFYJJHYLV4MQTDVVV7',
                params: params
            } // web_select_banapresso_interview_step_list
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                const interviewInfo = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
                callback(result.data, interviewInfo);
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.selectInterview', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    saveInterview = (params, callback) => {
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
                query: 'DDJP8H2VCNPZDWVIV8JA',
                params: params
            } // web_save_banapresso_interview

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.saveInterview', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    deleteInterviewStep = (params, callback) => {
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
                query: 'QWZ0PGIGECXHELAKBAA6',
                params: params
            } // web_delete_banapresso_interview_step

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.deleteInterviewStep', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    saveInterviewStep = (params, callback) => {
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
                query: 'FVCVUMWE25GOELPZD9PW',
                params: params
            } // web_insert_banapresso_interview_step

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.saveInterviewStep', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    saveInterviewStepItem = (params, callback) => {
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
                query: 'X6PGBPCVE1FFJMHVN9YJ',
                params: params
            } // web_insert_banapresso_interview_step_item

            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                callback( result.data );
            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStore.saveInterviewStepItem', e);
            this.error = e
            this.isFetching = false
        }
    }

    @action
    getInterviewHistory = (params, callback) => {
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
                query: 'ZUZNNEXG6STC29QKZWPL',
                params: params
            } // web_select_interview_history
            data = JSON.stringify(data);
            Axios.post("/query", data, axiosConfig, (result) => {
                const columns = result.data.columns.map(d => { return d.name });
                this.historyList = result.data.rows.map((rowObj) => {
                    let obj = {};
                    columns.forEach((element, idx) => { obj[element] = rowObj[idx] });
                    return obj;
                });
                callback( { return : 1, sError : ''});

            }, (err) => {
                const errMsg = "처리중에 문제가 발생하였습니다. ["+ err.message +"]";
                callback( { return : 0, sError : errMsg});
            });
            this.isFetching = false
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]InterviewStroe.getInterviewHistory', e);
            this.error = e
            this.isFetching = false
        }
    }
}