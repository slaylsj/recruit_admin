import React from 'react';
import history from '../history/History';
import Utils from '../utils/Utils';
import { Button, Form, Grid, Image, Segment, Message } from 'semantic-ui-react'
import { inject, observer} from 'mobx-react';

@inject("loginStore")
@observer
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginID : "",
            loginPW : "",
            btoken : 0,
            sCToken : "",
            sClientIP : "",
            sMacAddress : "",
            errMsg : ""
        }
        this.getClientIP = (fCallback) => this.props.loginStore.getClientIP(fCallback);
        this.loginProcess = (params, fCallback) => this.props.loginStore.loginProcess(params, fCallback);
    }

    componentDidMount(){
        this.getClientIP(() => {
            //토큰값이 있는경우 자동로그인 시도
            if(Utils.chkToken() === true) {	 
                const params = {
                    sID : "",
                    sPW : "",
                    btoken : 0,
                    sCToken : Utils.getToken(),
                    sIP : this.props.loginStore.clientIP,
                    sMacAddress : "B8:97:5A:EF:8E:F0"
                }
                this.handleLogin(params);
            }
        });
    }
    
    // 등록, 수정 입력
    handleTextChange = (event) => {
        this.setState({ ...this.state, [event.target.id] : event.target.value });
    }

    // 자동로그인 체크
    handleClickCheckBox = (e, data) => {
        if(data.checked){
            this.setState({...this.state, btoken : 1 })
        }else{
            this.setState({...this.state, btoken : 0 })
        }
    }

    // 로그인 버튼 이벤트
    handleClickLogin = () => {
        const params = {
            sID : this.state.loginID,
            sPW : this.state.loginPW,
            btoken : this.state.btoken,
            sCToken : "",
            sIP : this.props.loginStore.clientIP,
            sMacAddress : "B8:97:5A:EF:8E:F0"
        }
        this.handleLogin(params);
    }

    // 로그인 처리.
    handleLogin = (params) => {
        // "params": {"sID": id, "sPW": pw,"btoken" : Token.getIsAuto(),"sCToken" : "", "sIP": clientIP, "sMacAddress": "B8:97:5A:EF:8E:F0"}
        this.loginProcess(params, (data) => {
            if(typeof data.sError !== "undefined" && data.sError === ""){
                if(data.nFCode !== -1){
                    const scale = typeof(Utils.getQueryVariable("scale")) !== "undefined" ? Utils.getQueryVariable("scale") : 1;
                    var now = new Date();
                    var time = now.getTime();
                    var expireTime = time + 1000*36000*2;
                    now.setTime(expireTime);

                    if(data.sToken !== null) Utils.setToken(data.sToken);
                    localStorage.setItem("userID", data.sLoginID);
                    localStorage.setItem("userNm", data.sName);
                    document.cookie = 'scale=' + scale + ';expires=' + now.toGMTString() + ';';
                    history.push("/appList");
                }
            }else{
                Utils.removeToken();
                this.setState({...this.state, errMsg : data.sError })
                setTimeout(() => {
                    this.setState({...this.state, errMsg : "" })
                }, 2000);
            }
        });

    }

    render(){
        const { errMsg } = this.state;
        return(
            <div className='login-form'>
                {/*
                Heads up! The styles below are necessary for the correct render of this example.
                You can do same with CSS, the main idea is that all the elements up to the `Grid`
                below must have a height of 100%.
                */}
                <style>{`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        background-color : #41c2d1;
                        height: 100%;
                    }
                    .ui.large.form { margin-top:20px; }
                    .ui.form .field{ height: 50px; margin: 15px 20px; }
                    .ui.form .field .input{ height: 50px; }
                    .ui.button.banaple-color {
                        background-color : rgb(65, 194, 209);
                        color : rgb(240, 240, 240);
                        height: 50px;
                        width: 402px;
                        margin: 20px;
                    }
                    .ui.button.banaple-color:hover {
                        background-color : rgb(30, 190, 207);
                        color : rgb(240, 240, 240);
                    }
                    .ui.header.banaple-color {
                        color : rgb(65, 194, 209);
                    }
                    .title_logo {
                        width : 200px !important;
                    }
                    .b_title {
                        color : #fff; font-size : 20px; font-weight : 600;
                    }
                `}
                </style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 500 }}>
                        <Image className="title_logo" src='/img/common/txt_banaple.png' verticalAlign='middle'/><span className="b_title">채용관리 시스템</span>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='ID' id="loginID" onChange={this.handleTextChange} />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    id="loginPW" onChange={this.handleTextChange} 
                                />
                                <Button onClick={this.handleClickLogin} className='banaple-color' fluid size='large'>LOGIN</Button>
                                
                                <Form.Checkbox onClick={this.handleClickCheckBox} label='로그인 상태 유지' />

                                { errMsg.length > 0 ? 
                                    <Message negative>
                                        <Message.Header>로그인에 실패 하였습니다.</Message.Header>
                                        <p>{errMsg}</p>
                                    </Message> : null 
                                }
                            </Segment>
                        </Form>
                        <Message info>
                            <p>※ IE에서는 정삭적으로 동작 하지 않을 수 있습니다.<br/> Chrome 브라우저를 이용해 주세요.</p>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login;