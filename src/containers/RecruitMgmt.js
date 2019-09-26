import React from 'react';
import { Header, Table, Checkbox, Input, Button, Select, Confirm } from 'semantic-ui-react';
import { inject, observer} from 'mobx-react';
import RecruitItemList from '../components/recruit/RecruitItmeList';
import RecruitDetail from '../components/recruit/RecruitDetail';
import AlertModal from '../components/common/AlertModal';
import history from '../history/History';
import Utils from '../utils/Utils';

@inject("recruitStore")
@observer
class RecruitMgmt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchParam : {
                company : "all"
            },
            listCheckValue : 0,
            detailView : false,
            detailData : {},
            confirmModal : {
                open: false,
                message: '해당 공고를 삭제하시겠습니까?'
            },
            alertModal : {
                open : false,
                message : ""
            }
        }
        this.getRecruitList = (params) => this.props.recruitStore.getRecruitList(params);
        this.deleteRecruit = (params, fCallback) => this.props.recruitStore.deleteRecruit(params, fCallback);
    }

    componentDidMount(){
        this.handleSearch();
        // Back button Event
        window.onpopstate = this.onBackButtonEvent;
    }

    componentDidUpdate(preProps, preState){
        if(preState.searchParam.company !== this.state.searchParam.company){
            this.handleSearch();
        }
    }

    // 조회
    handleSearch = () => {
        var params = {
            "nFCode" : "@nFCode",
            "sCompany" : this.state.searchParam.company
        }
        this.getRecruitList(params);
    }

    // 회사구분 변경 이벤트
    handleChangeCompany = (e, {name, value}) => {
        this.setState({
            ...this.state, searchParam : { company : value }
        })
    }

    // 체크박스 선택
    handleClickCheckBox = (e, data) => {
        if(data.checked){
            this.setState({...this.state, listCheckValue : parseInt(data.value) })
        }else{
            this.setState({...this.state, listCheckValue : 0 })
        }
    }

    // 등록
    handleClickAdd = () => {
        history.push("/recruitWrite");
    }

    // 수정
    handleClickModify = () => {
        const recruitID = this.state.listCheckValue;
        if(recruitID === 0){
            this.setState({ ...this.state,  alertModal : { open : true, message : "수정할 항목을 선택하시기 바랍니다." } });
        }else{
            history.push({
                pathname: '/recruitModify/' + recruitID
            });
        }
    }

    // Alert close 
    handleCloseAlertModal = () => {
        this.setState({ ...this.state, alertModal : { open : false, message : "" }});
    }

    // 삭제 클릭
    handleClickDelete = () => {
        const recruitID = this.state.listCheckValue;
        if(recruitID === 0){
            this.setState({ ...this.state,  alertModal : { open : true, message : "삭제할 항목을 선택하시기 바랍니다." } });
        }else{
            this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: true }})
        }
    }

    // 삭제확인
    handleDeleteConfirm = () => {
        this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false }});
        const params = {
            nFCode: "@nFCode",
            nRecruitID : this.state.listCheckValue
        }
        this.deleteRecruit(params, (data) => {
            if(data.return === 0){
                this.setState({ ...this.state, 
                    listCheckValue : 0,
                    detailView : false, detailData : {},
                    alertModal : { open : true, message : "해당공고가 삭제 되었습니다." }
                });
                this.handleSearch();
            }else{
                this.setState({ ...this.state, 
                    alertModal : { open : true, message : "삭제시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 삭제 취소
    handleDeleteCancel = () => this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false }})

    // 상세보기
    handleClickDetail = (recruitID) => {
        // 선택된 데이터 정보 추출.
        const { recruitList } = this.props.recruitStore;
        const targetIndex = recruitList.map( data => { return data.nRecruitID }).indexOf(recruitID);
        let selectData = Object.assign({}, recruitList[targetIndex]);

        // Contetns 파일 내용 셋팅.
        selectData["contents"] = Utils.readFileContentHtml(selectData.sContents);

        this.setState({ ...this.state, listCheckValue : recruitID, detailView : true, detailData : selectData });
    }

    // 뒤로가기
    onBackButtonEvent = (e) => {
        e.preventDefault();
        this.handleGoList();
    }

    handleGoList = () => {
        if(this.state.detailView){
            this.setState({ ...this.state, detailView : false, detailData : {}, listCheckValue : 0 });
        }
    }

    render(){
        const { listCheckValue, detailView, detailData, confirmModal, alertModal } = this.state;
        const { recruitList } = this.props.recruitStore;
        const options = [
            { key: 'gubun1', text: '전체', value: 'all' },
            { key: 'gubun2', text: '바나플', value: 'banaple' },
            { key: 'gubun3', text: '바나플F&B', value: 'banaplefnb' },
            { key: 'gubun4', text: '바나프레소', value: 'banapresso' },
        ]

        return (
            <div className="body-contents">
                <Header as='h2'>채용 공고 관리</Header>

                { detailView ? <RecruitDetail data={detailData} handleGoList={this.handleGoList} handleClickModify={this.handleClickModify} handleClickDelete={this.handleClickDelete} /> : 
                    <div>
                        <div className="controls">
                            <Select name="searchCompany" label='모집분야' required={true} options={options} placeholder='Gender' defaultValue="all" onChange={this.handleChangeCompany} />
                            <Button content='조회' color="blue" onClick={this.handleSearch} />
                            <div className="button-group">
                                <Button content='등록' color="teal" onClick={this.handleClickAdd} />
                                <Button content='수정' color="grey" onClick={this.handleClickModify} />
                                <Button content='삭제' color="delete" onClick={this.handleClickDelete} />
                            </div>
                        </div>
                        <div>
                            <Table color="blue">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell style={{ width:"50px" }}></Table.HeaderCell>
                                        <Table.HeaderCell style={{ width:"60px", textAlign:"center" }} >번호</Table.HeaderCell>
                                        <Table.HeaderCell style={{ width:"150px", textAlign:"center" }} >구분</Table.HeaderCell>
                                        <Table.HeaderCell style={{ width:"100px", textAlign:"center" }} >채용구분 </Table.HeaderCell>
                                        <Table.HeaderCell style={{ textAlign:"center" }} >모집 공고</Table.HeaderCell>
                                        <Table.HeaderCell style={{ width:"200px", textAlign:"center" }} >기간</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <RecruitItemList recruitList={recruitList} listCheckValue={listCheckValue} handleClickCheckBox={this.handleClickCheckBox} handleClickDetail={this.handleClickDetail} />
                            </Table>
                        </div>
                    </div>
                }

                <Confirm open={confirmModal.open} size="tiny" content={confirmModal.message} cancelButton="취소" confirmButton="확인" onCancel={this.handleDeleteCancel} onConfirm={this.handleDeleteConfirm} />
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />
            </div>
        )
    }
}

export default RecruitMgmt;