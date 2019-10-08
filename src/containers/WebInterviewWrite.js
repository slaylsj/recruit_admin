import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import QuestionItemList from '../components/interview/write/QuestionItemList';
import InterviewPreview from '../components/interview/write/InterviewPreview';
import InterviewHistoryView from '../components/interview/write/InterviewHistoryView';
import AlertModal from '../components/common/AlertModal';
import history from '../history/History';

@inject("interviewStore")
@observer
class WebInterviewWrite extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            surveyID : 0,
            company : 'banaple',
            title : '',
            web_title : '',
            explanation : '',
            footer : '',
            questionList : [],
            alertModal : {
                nextState : false,
                open : false,
                message : ""
            },
            preViewModal : {
                surveyID : 0,
                open : false,
                step : 0,
                view : 'start',   // start, interview, finish, error, complete
            },
            historyViewModal : {
                open : false,
                type : 0
            }
        };

        this.selectInterview= (params, fCallback) => this.props.interviewStore.selectInterview(params, fCallback);
        this.saveInterview= (params, fCallback) => this.props.interviewStore.saveInterview(params, fCallback);
        this.deleteInterviewStep = (params, fCallback) => this.props.interviewStore.deleteInterviewStep(params, fCallback);
        this.saveInterviewStep= (params, fCallback) => this.props.interviewStore.saveInterviewStep(params, fCallback);
        this.saveInterviewStepItem= (params, fCallback) => this.props.interviewStore.saveInterviewStepItem(params, fCallback);
        this.setInterviewPreviewData = (params, fCallback) => this.props.interviewStore.setInterviewPreviewData(params, fCallback);
        this.getTotalStepCnt = () => this.props.interviewStore.getTotalStepCnt();
        this.setStepData = (step, fcallback) => this.props.interviewStore.setStepData(step, fcallback);
        this.getInterviewHistory = (params, fCallback) => this.props.interviewStore.getInterviewHistory(params, fCallback);
    }

    componentDidMount(){
        const { surveyID } = this.props.match.params;
        // 수정인경우.
        if(typeof surveyID !== "undefined" && surveyID > 0){
            var params = {
                "nFCode" : "@nFCode",
                "nSurveyID" : parseInt(surveyID)
            }
            this.selectInterview(params, (data, interviewInfo) => {
                if(data.return === 0){
                    let surveyID = 0, tmpStepID = 0;
                    let company = '', title = '', web_title = '', explanation = '', footer = '';
                    let data_questionList = [];
                    let questionObj = {};
                    interviewInfo.forEach((data, idx) => {
                        if(idx === 0){
                            surveyID = data.nSurveyID;
                            company = data.sCompany;
                            title = data.sTitle;
                            web_title = data.sWebTitle;
                            explanation = data.sExplanation;
                            footer = data.sFooter;
                        }

                        // 문항이 없는 경우.
                        if(tmpStepID === data.nStepID){
                            if(data.nStepID === 0){
                                questionObj = {
                                    id : 0,
                                    stepID : 0,
                                    question : '',
                                    answer_type : 1, // 0 : 주관식, 1: 객관식, 2: 체크박스
                                    option_1 : [
                                        { id: 0, nOption : 0, sOption : '' },
                                        { id: 1, nOption : 0, sOption : '' },
                                        { id: 2, nOption : 0, sOption : '' },
                                    ],
                                    option_2 : []
                                }
                            }else{
                                if(data.nAnswerType > 0) questionObj[`option_${data.nAnswerType}`].push({ id: questionObj[`option_${data.nAnswerType}`].length, nOption : data.nOption, sOption : data.sOption });
                            }
                        }else{
                            if(tmpStepID > 0){
                                if(questionObj.answer_type === 1){
                                    questionObj['option_2'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                                }else if(questionObj.answer_type === 2){
                                    questionObj['option_1'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                                }else {
                                    questionObj['option_1'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                                    questionObj['option_2'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                                }
                                data_questionList.push(questionObj);
                                questionObj = {};
                            }
                            questionObj['id'] = data_questionList.length;
                            questionObj['stepID'] = data.nStepID;
                            questionObj['question'] = data.sQuestion;
                            questionObj['answer_type'] = data.nAnswerType;
                            questionObj['option_1'] = [];
                            questionObj['option_2'] = [];
                            if(data.nAnswerType > 0) questionObj['option_'+data.nAnswerType].push({ id: questionObj['option_'+data.nAnswerType].length, nOption : data.nOption, sOption : data.sOption });
                            
                            tmpStepID = data.nStepID;
                        }
                    });
                    
                    // 마지막 문항 push
                    if(questionObj.answer_type === 1){
                        questionObj['option_2'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                    }else if(questionObj.answer_type === 2){
                        questionObj['option_1'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                    }else {
                        questionObj['option_1'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                        questionObj['option_2'] = [{ id: 0, nOption : 0, sOption : '' }, { id: 1, nOption : 0, sOption : '' }, { id: 2, nOption : 0, sOption : '' }];
                    }
                    data_questionList.push(questionObj);

                    // console.log("data_questionList", data_questionList);
                    this.setState({
                        ...this.state,
                        surveyID : surveyID,
                        company : company,
                        title : title,
                        web_title : web_title,
                        explanation : explanation,
                        footer : footer,
                        questionList : this.state.questionList.concat(data_questionList)
                    });
                }
            });
        // 등록인경우.
        }else{
            this.setState({
                ...this.state,
                questionList : this.state.questionList.concat({
                    id : 0,
                    stepID : 0,
                    question : '',
                    answer_type : 1, // 0 : 주관식, 1: 객관식, 2: 체크박스
                    option_1 : [
                        { id: 0, nOption : 0, sOption : '' },
                        { id: 1, nOption : 0, sOption : '' },
                        { id: 2, nOption : 0, sOption : '' },
                    ],
                    option_2 : [
                        { id: 0, nOption : 0, sOption : '' },
                        { id: 1, nOption : 0, sOption : '' },
                        { id: 2, nOption : 0, sOption : '' },
                    ]
                })
            });
        }
    }

    handleChange = (e, {name, value}) => {
        if(name === 'title'){
            this.setState({...this.state, [name]: value, 'web_title' : value });
        }else if(this.state.hasOwnProperty(name)) {
            this.setState({...this.state, [name]: value });
        }
    }

    handleTextChange = (e) => {
        this.setState({ ...this.state, [e.target.id] : e.target.value });
    }

    // 문항 추가.
    handleCreateQuestion = () => {
        const { questionList } = this.state;
        let id = questionList.reduce((maxId, data) => { return  maxId < data.id ? data.id : maxId; }, 0) + 1;
        this.setState({ ...this.state, questionList : questionList.concat({
            id : id,
            stepID : 0,
            question : '',
            answer_type : 1, // 0 : 주관식, 1: 객관식, 2: 체크박스
            option_1 : [
                { id: 0, nOption : 0, sOption : '' },
                { id: 1, nOption : 0, sOption : '' },
                { id: 2, nOption : 0, sOption : '' },
            ],
            option_2 : [
                { id: 0, nOption : 0, sOption : '' },
                { id: 1, nOption : 0, sOption : '' },
                { id: 2, nOption : 0, sOption : '' },
            ]
        })});
    }

    // 문항 삭제.
    handleDeleteQuestion = (id) => {
        const { questionList } = this.state;
        this.setState({ ...this.state, questionList : questionList.filter(question => question.id !== id)});
    }

    // 문항 순서 변경.
    handleChangePosition = (idx, type) => {
        const { questionList } = this.state;
        const questionObj = questionList[idx];
        if(type === 'up'){
            if(questionList.length > 1){
                const questionNextList = questionList.splice(idx+1,questionList.length);
                const questionPreList = questionList.splice(0, idx-1);
                const questionChangeObj = questionList.splice(0, 1);
                this.setState({ ...this.state, questionList : questionList.splice(0, -1).concat(questionPreList).concat(questionObj).concat(questionChangeObj).concat(questionNextList)});
            }
        }else if(type === 'down'){
            const questionNextList = questionList.splice(idx+2,questionList.length);
            const questionChangeObj = questionList.splice(idx+1, idx+2);
            const questionPreList = questionList.splice(0, idx);
            this.setState({ ...this.state, questionList : questionList.splice(0, -1).concat(questionPreList).concat(questionChangeObj).concat(questionObj).concat(questionNextList)});
        }
    }
    
    // 문항 변경 이벤트
    handleChangeQuestion = (tIdx, tName, value) => {
        const { questionList } = this.state;
        this.setState({ ...this.state, questionList : questionList.map((data, idx) => {
                return (idx === tIdx ? {...data, [tName] : value, option_1 : data.option_1, option_2 : data.option_2 } : data )
            }) 
        });
    }


    // 옵션 추가
    handleCreateOption = (tIdx) => {
        const { questionList } = this.state;
        const option_name = 'option_' + questionList[tIdx].answer_type;
        let id = questionList[tIdx][option_name].reduce((maxId, data) => { return  maxId < data.id ? data.id : maxId; }, 0) + 1;
        this.setState({ ...this.state, questionList : questionList.map((data, idx) => {
                if(idx === tIdx){
                    if(data.answer_type === 1){
                        return {...data
                            , option_1 : data.option_1.concat({ id: id, nOption : 0, sOption : '' })
                            , option_2 : data.option_2 } 
                    }else if(data.answer_type === 2){
                        return {...data
                            , option_1 : data.option_1
                            , option_2 : data.option_2.concat({ id: id, nOption : 0, sOption : '' }) }
                    }else{
                        return data;
                    }
                }else{
                    return data;
                }
            })
        });
    }

    // 옵션 삭제
    handleDeleteOption = (tIdx, id) => {
        const { questionList } = this.state;
        this.setState({ ...this.state, questionList : questionList.map((data, idx) => {
                if(idx === tIdx){
                    if(data.answer_type === 1){
                        return {...data
                            , option_1 : data.option_1.filter( option => option.id !== id)
                            , option_2 : data.option_2 } 
                    }else if(data.answer_type === 2){
                        return {...data
                            , option_1 : data.option_1
                            , option_2 : data.option_2.filter( option => option.id !== id) }
                    }else{
                        return data;
                    }
                }else{
                    return data;
                }
            }) 
        });
    }

    // 옵션명 변경 이벤트
    handleOptionInputChange = (tIdx, oIdx, sOption) => {
        const { questionList } = this.state;
        this.setState({ ...this.state, questionList : questionList.map((data, idx) => {
                if(data.answer_type === 1){
                    return (idx === tIdx ? {...data
                        , option_1 : data.option_1.map( (d, i) => (i === oIdx ? {...d, sOption : sOption } : d ))
                        , option_2 : data.option_2 } : data )
                }else if(data.answer_type === 2){
                    return (idx === tIdx ? {...data
                        , option_1 : data.option_1
                        , option_2 : data.option_2.map( (d, i) => (i === oIdx ? {...d, sOption : sOption } : d )) } : data )
                }else{
                    return data;
                }
            }) 
        });
    }

    // 저장
    handleSave = (e) => {
        e.preventDefault();
        const { surveyID, company, title, web_title, explanation, footer, questionList } = this.state;
            
        // 입력 값 체크.
        let validationCheck = false, msg = '';
        if(title === ''){
            validationCheck = true; msg = '설문제목을 입력 하시기 바랍니다.';
        }else if(web_title === ''){
            validationCheck = true; msg = '설문제목(웹)을 입력 하시기 바랍니다.';
        }else if(explanation === ''){
            validationCheck = true; msg = '설문시 설명을 입력 하시기 바랍니다.';
        }else if(footer === ''){
            validationCheck = true; msg = '끝맺음을 입력 하시기 바랍니다.';
        }
        questionList.forEach(data => {
            if(data.question === ''){
                validationCheck = true; msg = '문항내용을 입력 하시기 바랍니다.';
            }
        });

        if(validationCheck){
            this.setState({ ...this.state, 
                alertModal : { nextState: false, open : true, message : msg }
            });
            return false;
        }

        const params = {
            nFCode: "@nFCode",
            nSurveyID: parseInt(surveyID),
            sCompany : company,
            sTitle: title,
            sWebTitle : web_title,
            sExplanation: explanation,
            sFooter: footer,
            sLoginID: localStorage.getItem("userID")
        }

        this.saveInterview(params, (data) => {
            if(data.return === 0){
                const nSurveyID = data.params.nSurveyID_OUTPUT;
                var interview_step_delete_params = {
                    nFCode: "@nFCode",
                    nSurveyID: nSurveyID
                };
                this.deleteInterviewStep(interview_step_delete_params, (data) => {
                    if(data.return === 0){
                        this.nextSaveInterviewStep(nSurveyID);
                    }else {
                        alert("면접 설문 등록에 실패했습니다.[기존 문항 삭제 오류]");
                    }
                });
            }else{
                this.setState({ ...this.state, 
                    alertModal : { nextState: false, open : true, message : "웹설문 내용 저장시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 문항, 옵션 저장.
    nextSaveInterviewStep = (nSurveyID) => {
        const { questionList } = this.state;
        // 저장할 문항 갯수
        const reqSaveQuestionTotCnt = questionList.length;
        let reqSaveQuestionCnt = 0;
        let reqSaveQptionTotCnt = 0;
        let reqSaveQptionCnt = 0;
        // 문항 목록.
        questionList.forEach( (q_data, idx) => {
            const seq = idx+1;
            const question = q_data.question;
            const answer_type = q_data.answer_type;

            if(answer_type === 1){
                q_data.option_1.forEach( opt => {
                    if(opt.sOption !== '') reqSaveQptionTotCnt++;
                });
            }else if(answer_type === 2){
                q_data.option_2.forEach( opt => {
                    if(opt.sOption !== '') reqSaveQptionTotCnt++;
                });
            }

            const interview_save_params = {
                nFCode: "@nFCode",
                nSurveyID: parseInt(nSurveyID),
                nSeq: parseInt(seq),
                sQuestion: question,
                nAnswerType: parseInt(answer_type),
                sLoginID: localStorage.getItem("userID")
            };

            // 객관식, 체크박스 인 경우에만 옵션 저장.
            if(answer_type === 1 || answer_type === 2){
                this.saveInterviewStep(interview_save_params, (data) => {
                    if(data.return === 0){
                        const nStepID = data.params.nStepID_OUTPUT;
                        reqSaveQuestionCnt++;

                        // 옵션 목록.
                        let option_idx = 0;
                        if(reqSaveQptionTotCnt > 0){
                            const optionListName = 'option_' + answer_type;
                            q_data[optionListName].forEach( opt => {
                                const option = opt.sOption;
                                if(option !== ""){
                                    option_idx++;
                                    const interview_step_item_save_params = {
                                        nFCode: "@nFCode",
                                        nStepID: nStepID,
                                        nOption: option_idx,
                                        sOption: option,
                                        sLoginID: localStorage.getItem("userID")
                                    }

                                    this.saveInterviewStepItem(interview_step_item_save_params, (data) => {
                                        if(data.return === 0){
                                            reqSaveQptionCnt++;
                                            // console.log(reqSaveQuestionTotCnt, ' : ' , reqSaveQuestionCnt, ' : ', reqSaveQptionTotCnt, ' : ' , reqSaveQptionCnt);
                                            if(reqSaveQuestionTotCnt === reqSaveQuestionCnt && reqSaveQptionTotCnt === reqSaveQptionCnt){
                                                this.setState({ ...this.state, 
                                                    alertModal : { nextState: true, open : true, message : "면접 사전 설문 등록이 완료 되었습니다." }
                                                });
                                            }
                                        } else {
                                            this.setState({ ...this.state, 
                                                alertModal : { nextState: false, open : true, message : "면접 설문 등록에 실패했습니다.[문항 옵션 등록 오류]" }
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            this.setState({ ...this.state, 
                                alertModal : { nextState: true, open : true, message : "면접 사전 설문 등록이 완료 되었습니다." }
                            });
                        }

                    } else {
                        this.setState({ ...this.state, 
                            alertModal : { nextState: false, open : true, message : "면접 설문 등록에 실패했습니다.[문항 등록 오류]" }
                        });
                    }
                });
            }else{
                this.saveInterviewStep(interview_save_params, (data) => {
                    if(data.return === 0){
                        reqSaveQuestionCnt++;
                        // console.log(reqSaveQuestionTotCnt, ' : ' , reqSaveQuestionCnt, ' : ', reqSaveQptionTotCnt, ' : ' , reqSaveQptionCnt);
                        if(reqSaveQuestionTotCnt === reqSaveQuestionCnt && reqSaveQptionTotCnt === reqSaveQptionCnt){
                            this.setState({ ...this.state, 
                                alertModal : { nextState: true, open : true, message : "면접 사전 설문 등록이 완료 되었습니다." }
                            });
                        }
                    } else {
                        this.setState({ ...this.state, 
                            alertModal : { nextState: false, open : true, message : "면접 설문 등록에 실패했습니다.[주관식 문항 등록 오류]" }
                        });
                    }
                });
            }
        });
    }
    
    // Alert close 
    handleCloseAlertModal = () => {
        if(this.state.alertModal.nextState){
            history.push("/interviewMgmt");
        }else{
            this.setState({ ...this.state, alertModal : { nextState: false, open : false, message : "" }});
        }
    }

    // 미리보기
    handlePreviewModalOpen = () => {
        this.setInterviewPreviewData(this.state, () => {
            this.setState({ ...this.state, preViewModal : { surveyID : 0, open: true, step : 0, view : 'start' }});
        });
    }

    // 미리보기 모달 닫기
    handlePreViewModalClose = () => {
        this.setState({ ...this.state, preViewModal : { surveyID : 0, open: false, step : 0, view : 'start' }});
    }

    // 이전 단계
    handlePrevStep = () => {
        const prevStep = this.state.preViewModal.step-1;
        if(prevStep > 0){
           this.setStepData(prevStep-1, () => {
                this.setState({...this.state, preViewModal : { ...this.state.preViewModal, open : true, step : prevStep, view : 'interview'}});
            });
        }else{
            this.setState({...this.state, preViewModal : { ...this.state.preViewModal, open : true, step : 0, view : 'start' }});
        }
    }

    // 다음 단계
    handleNextStep = () => {
        const nextStep = this.state.preViewModal.step+1;
        if(this.getTotalStepCnt() < nextStep){
            this.setState({...this.state, preViewModal : { ...this.state.preViewModal, open : true, step : 0, view : 'finish'}});
        }else{
            this.setStepData(nextStep-1, () => {
                this.setState({...this.state, preViewModal : { ...this.state.preViewModal, open : true,  step : nextStep, view : 'interview' }});
            });
        }
    }

    // 이전 히스토리 모달
    handleQuestionHistory = (nType, tIdx) => {
        // nType - 0: 설명, 1: 끝맺음, 2: 문항.
        const params = {
            nFCode: '@nFCode',
            nType : nType
        }
        this.getInterviewHistory(params, (data) => {
            if(data.return === 1){
                this.setState({...this.state, historyViewModal : { open : true, type : nType, tIdx : tIdx}})
            }else{
                this.setState({ ...this.state, 
                    alertModal : { nextState: false, open : true, message : data.sError }
                });
            }
        });
    }

    // 이력 내용 선택
    handleSelectHistory = (nType, sText) => {
        if(nType === 0){ // 설문지 설명
            this.setState({ ...this.state, explanation : sText, historyViewModal : { open : false, type : 0, tIdx : 0 }});
        }else if(nType === 1){ // 끝맺음
            this.setState({ ...this.state, footer : sText, historyViewModal : { open : false, type : 0, tIdx : 0 }});
        }else if(nType === 2){ // 문항
            const { questionList, historyViewModal } = this.state;
            const { tIdx } = historyViewModal;
            this.setState({ ...this.state, historyViewModal : { open : false, type : 0, tIdx : 0 }, questionList : questionList.map((data, idx) => {
                    return (idx === tIdx ? {...data, 'question' : sText, option_1 : data.option_1, option_2 : data.option_2 } : data )
                }) 
            });
        }
    }

    // 미리보기 모달 닫기
    handleQuestionHistoryClose = () => {
        this.setState({ ...this.state, historyViewModal : { open : false, type : 0, tIdx : 0 }});
    }


    render(){
        const { company, title, web_title, explanation, footer, questionList, preViewModal, alertModal, historyViewModal } = this.state
        const { interviewList, totalCnt, activePage, nowStepData, stepText, stepCount, historyList} = this.props.interviewStore;
        const options = [
            { key: 'gubun1', text: '바나플', value: 'banaple' },
            { key: 'gubun2', text: '바나프레소', value: 'banapresso' }
        ]

        return (
            <div className="body-contents">
                <h2>설문 웹페이지 만들기</h2>

                <div id="recruit-write" style={{width:"1100px"}}>
                    <Form autoComplete="off" >
                        <Form.Group inline>
                            <label className="recruit-label">설문 구분</label>
                            <Form.Select required={true} options={options} name="company" placeholder='Gender' defaultValue={company} onChange={this.handleChange} /> 
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">설문 제목</label>
                            <Form.Input className="wt-title" required={true} name="title" placeholder='채용공고명' onChange={this.handleChange} value={title} />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">설문 제목(웹)</label>
                            <Form.Input className="wt-title" required={true} name="web_title" placeholder='채용공고명' onChange={this.handleChange} value={web_title} />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">설문지 설명</label>
                            <div className="field">
                                <textarea className="wt-textarea" id="explanation" placeholder="설문 안내 문구 또는 인사말을 입력하세요. (200자 이내)" onChange={this.handleTextChange} style={{height:"80px"}} value={explanation}></textarea>
                                <span className="btn-history" data-type="0" onClick={() => this.handleQuestionHistory(0, 0)}>* 이전 설명 보기</span>
                            </div>
                        </Form.Group>

                        <Form.Group inline className="interview_write_container">
                            <label className="recruit-label">문항</label>
                            <QuestionItemList questionList={questionList} handleCreateQuestion={this.handleCreateQuestion} handleDeleteQuestion={this.handleDeleteQuestion} handleChangePosition={this.handleChangePosition} handleChangeQuestion={this.handleChangeQuestion} 
                                handleCreateOption={this.handleCreateOption} handleDeleteOption={this.handleDeleteOption} handleOptionInputChange={this.handleOptionInputChange} handleQuestionHistory={this.handleQuestionHistory}/>
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">끝맺음</label>
                            <div className="field">
                                <textarea className="wt-textarea" id="footer" placeholder="안내 문구 또는 맺음말을 입력하세요. (200자 이내)" onChange={this.handleTextChange} style={{height:"80px"}} value={footer}></textarea>
                                <span className="btn-history" data-type="0" onClick={() => this.handleQuestionHistory(1, 0)}>* 이전 끝맺음 보기</span>
                            </div>
                        </Form.Group>

                        <div className="button-group" style={{textAlign: "center", "marginTop":"50px"}}>
                            <Button color="teal" className="wt-btn-preview" onClick={this.handlePreviewModalOpen} >미리보기</Button>
                            <Button color="blue" className="wt-btn-save" onClick={this.handleSave} >완료</Button>
                            <Button color="grey" className="wt-btn-preview" onClick={() => history.push('/interviewMgmt')} >취소</Button>
                        </div>
                    </Form>
                </div>
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />

                {/* 미리보기 */}
                <InterviewPreview data={preViewModal} nowStepData={nowStepData} stepText={stepText} stepCount={stepCount} company={company} webTitle={web_title} handlePreViewModalClose={this.handlePreViewModalClose} 
                    handlePrevStep={this.handlePrevStep} handleNextStep={this.handleNextStep} />

                {/* 이력보기 */}
                <InterviewHistoryView data={historyViewModal} dataList={historyList} handleSelectHistory={this.handleSelectHistory} handleQuestionHistoryClose={this.handleQuestionHistoryClose} />
            </div>
        )
    }
}

export default WebInterviewWrite;