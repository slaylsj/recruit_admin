import { observable, action } from 'mobx';
import Axios from '../utils/Axios';

export default class LoginStore {
    @observable error = null
    @observable isFetching = false
    @observable clientIP = null
    @observable loginData = {}
    @observable userName = null

    @action
    getClientIP = (callback) => {
        this.isFetching = true
        this.error = null
        try{
            let axiosConfig = {
                headers : {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json; charset=UTF-8"
                }   
            }
            Axios.getJsonp("https://api.ipify.org?format=jsonp", null, axiosConfig, (result) => {
                this.clientIP = result.ip;
                callback();
            },(err) => {
                console.log('[ERROR]LoginStore getClientIP Fail ', err);
                this.clientIP = "127.0.0.1";  
                callback();
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]LoginStore.getClientIP', e);
            this.error = e
            this.isFetching = false
            this.clientIP = "127.0.0.1";  
            callback();
        }
    }

    @action
    loginProcess = (params, callback) => {
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
                query: 'BOKXPLJ7YOJY1F06D110',
                params: params
            } // web_b_a_process_login_manager_add_token

            // @sID NVARCHAR(20),
            // @sPW NVARCHAR(20),
            // @btoken int,	-- 1이면 토큰값 생성 및 저장
            // @sCToken NVARCHAR(40), -- 브라우저에 저장된 토큰값
            // @sIP NVARCHAR(20),
            // @sMacAddress NVARCHAR(20),
            // @nFCode INT OUTPUT,
            // @sLoginID INT OUTPUT,
            // @nMNo INT OUTPUT, -- 0보다 작으면 실패 
            // @sToken NVARCHAR(40) OUTPUT, --생성된 토큰값
            // @sError NVARCHAR(200) OUTPUT --실패시 에러멘트

            data = JSON.stringify(data);
            Axios.post("/login", data, axiosConfig, (result) => {
                const resultData = result.data;
                this.userName = resultData.params.sName;
                callback( resultData.params );
            },(err) => {
                callback( { sError : err.message });
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]LoginStore.loginProcess', e);
            this.error = e
            this.isFetching = false;
            callback( { sError : this.error } );
        }
    }

    @action
    logoutProcess = (params, callback) => {
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
                query: 'BOKXPLJ7YOJY1F06D110',
                params: params
            } // web_b_a_process_login_manager_add_token

            data = JSON.stringify(data);
            Axios.post("/login", data, axiosConfig, (result) => {
                // console.log("LoginStore logoutProcess ", result.data);
                const resultData = result.data;
                this.userName = "";
                callback( resultData.params );
            },(err) => {
                callback( { sError : err.message });
            });
            this.isFetching = false
            
        }catch(e){
            //this.showWarning();
            console.log('[ERROR]LoginStore.logoutProcess', e);
            this.error = e
            this.isFetching = false;
            callback( { sError : this.error } );
        }
    }
}