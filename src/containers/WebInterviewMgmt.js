import React from 'react';
import { Header, Table, Input, Button, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import AlertModal from '../components/common/AlertModal';
import InterviewItemList from '../components/interview/InterviewItemList'
import InterviewStepView from '../components/interview/InterviewStepView';
import PaginationTemplet from '../components/common/PaginationTemplet';
import history from '../history/History';

@inject("interviewStore")
@observer
class WebInterviewMgmt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checkboxList : [],
            searchParam : { 
                company : "all",
                searchText : "",
            },
            pageInfo : {
                pageRow : 50
            },
            preViewModal : {
                surveyID : 0,
                open : false,
                step : 0,
                view : 'start',   // start, interview, finish, error, complete
            },
            confirmModal : {
                open: false,
                message: '해당 지원서를 삭제하시겠습니까?'
            },
            alertModal : {
                open : false,
                message : ""
            }
        }
        this.getInterviewList = (params) => this.props.interviewStore.getInterviewList(params);
        this.getInterviewStepList = (params, fCallback) => this.props.interviewStore.getInterviewStepList(params, fCallback);
        this.getTotalStepCnt = () => this.props.interviewStore.getTotalStepCnt();
        this.setStepData = (step, fcallback) => this.props.interviewStore.setStepData(step, fcallback);
        this.deleteInterview = (params, fCallback) => this.props.interviewStore.deleteInterview(params, fCallback);
    }

    componentDidMount(){
        this.handleSearch(1);
    }

    // componentDidUpdate(prevProps, prevState){
    //     if (prevState.searchParam.company !== this.state.searchParam.company) {
    //         this.handleSearch(1);
    //     }
    // }

    // 조회
    handleSearch = (nPage) => {
        const {checkboxList} = this.state;
        this.setState({...this.state,  checkboxList : checkboxList.filter(v => false)});
        const params = {
            "nFCode" : "@nFCode",
	        "sSearchText" : this.state.searchParam.searchText,
	        "nPage" : nPage,
	        "nPageRow" : this.state.pageInfo.pageRow
        }
        this.getInterviewList(params);
    } 

    // 검색조건 변경 이벤트
    handleChange = (e, {name, value}) => {
        this.setState({...this.state, searchParam : { ...this.state.searchParam, [name]: value }});
    }

    // 엔터키 조회
    handleSearchKeyPress = (e) => {
        if(e.key === 'Enter'){
            this.handleSearch(1);
        }
    }

    // 체크박스 클릭.
    handleClickCheckBox = (e, data) => {
        const {checkboxList} = this.state;
        if(data.checked){
            this.setState({ ...this.state, checkboxList : checkboxList.concat(parseInt(data.value))})
        }else{
            this.setState({ ...this.state, checkboxList : checkboxList.filter(val => val !== parseInt(data.value))})
        }
    }

    // 만들기
    handleClickAdd = () => {
        history.push("/interviewWrite");
    }

    // 삭제 클릭
    handleClickDelete = () => {
        const {checkboxList} = this.state;
        if(checkboxList.length === 0){
            this.setState({ ...this.state,  alertModal : { open : true, message : "삭제할 항목을 선택하시기 바랍니다." } });
        }else{
            this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: true }})
        }
    }

    // 삭제확인
    handleDeleteConfirm = () => {
        const {checkboxList} = this.state;
        
        const params = {
            nFCode: "@nFCode",
            sSurveyIDList : checkboxList.join(",")
        }
                
        this.deleteInterview(params, (data) => {
            if(data.return === 0){
                // this.setState({ ...this.state);
                this.handleSearch(1);
                this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false },
                    // alertModal : { open : true, message : "삭제 되었습니다." } 
                });
            }else{
                this.setState({ ...this.state, 
                    alertModal : { open : true, message : "면접 설문 삭제시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 삭제 취소
    handleDeleteCancel = () => this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false }})

    // Alert close 
    handleCloseAlertModal = () => {
        this.setState({ ...this.state, alertModal : { open : false, message : "" }});
    }
    
    // 미리보기 모달 열기
    handlePreViewModalOpen = (surveyID) => {
        // 면접 설문 정보 조회.
        this.getInterviewStepList({ nFCode: "@nFCode", nSurveyID : surveyID}, (result) => {
            if(result.return === 1){
                this.setState({ ...this.state, preViewModal : { surveyID : surveyID, open: true, step : 0, view : 'start' }});
            }else{
                // this.setState({...this.state, step : -1, view : 'error'});
            }
        });
    }

    // 미리보기 모달 닫기
    handlePreViewModalClose = () => {
        this.setState({ ...this.state, preViewModal : { surveyID : 0, open: false, step : 0, view : 'start' }});
    }

    // 처음으로
    handlePreViewStart = () => {
        this.setState({ ...this.state, preViewModal : { ...this.state.preViewModal, open: true, step : 0, view : 'start' }});
    }

    // 수정
    handleInterviewModify = (nSurveyID) => {
        history.push({
            pathname: '/interviewModify/' + nSurveyID
        });
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

    // 페이지 이벤트
    handlePaginationChange = (activePage) => {
        this.handleSearch(activePage);
    }

    render(){
        const { checkboxList, preViewModal, confirmModal, alertModal, pageInfo } = this.state;
        const { interviewList, totalCnt, activePage, nowStepData, stepText, stepCount, company, webTitle} = this.props.interviewStore;
        // const options = [
        //     { key: 'gubun1', text: '전체', value: 'all' },
        //     { key: 'gubun2', text: '바나플', value: 'banaple' },
        //     { key: 'gubun3', text: '바나프레소', value: 'banapresso' },
        // ]

        return (
            <div className="body-contents">
                <Header as='h2'>웹설문 페이지 관리</Header>
                <div className="controls">
                    {/* <Select label='설문구분' required={true} options={options} name="company" placeholder='Gender' defaultValue="all" onChange={this.handleChange} /> */}
                    <Input className="wt-title" required={true} name="searchText" placeholder='검색어 입력' onChange={this.handleChange} onKeyPress={this.handleSearchKeyPress}/>
                    <Button content='조회' color="blue" onClick={() => this.handleSearch(1)} />
                    <Button content='만들기' color="teal" onClick={this.handleClickAdd} />
                    <Button content='삭제' color="delete" onClick={this.handleClickDelete} />
                    {/* <div className="button-group">
                        <Button content='만들기' color="teal" onClick={this.handleClickAdd} />
                        <Button content='삭제' color="delete" onClick={this.handleClickDelete} />
                    </div> */}
                </div>
                <div className="content-data">
                    <Table color="blue">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{ width:"50px" }}></Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"60px", textAlign:"center" }} >번호</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"250px", textAlign:"center" }} >구분</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign:"center" }} >제목</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"250px", textAlign:"center" }} >작성일</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"250px", textAlign:"center" }} >작성자</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"250px", textAlign:"center" }} >설문 문항</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <InterviewItemList interviewList={interviewList} totalCnt={totalCnt} checkboxList={checkboxList} activePage={activePage} handleClickCheckBox={this.handleClickCheckBox} handlePreViewModalOpen={this.handlePreViewModalOpen} />
                    </Table>
                </div>
                <div className="content-pagination">
                    <PaginationTemplet totalCnt={totalCnt} pageInfo={pageInfo} handlePaginationChange={this.handlePaginationChange} />
                </div>

                <InterviewStepView data={preViewModal} nowStepData={nowStepData} stepText={stepText} stepCount={stepCount} company={company} webTitle={webTitle} handlePreViewModalClose={this.handlePreViewModalClose} 
                    handlePrevStep={this.handlePrevStep} handleNextStep={this.handleNextStep} handlePreViewStart={this.handlePreViewStart} handleInterviewModify={this.handleInterviewModify}/>
                <Confirm open={confirmModal.open} size="tiny" content={confirmModal.message} cancelButton="취소" confirmButton="확인" onCancel={this.handleDeleteCancel} onConfirm={this.handleDeleteConfirm} />
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />
            </div>
        )
    }
}

export default WebInterviewMgmt;