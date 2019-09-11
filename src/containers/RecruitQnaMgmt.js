import React from 'react';
import { Header, Table, Checkbox, Input, Button, Select, Confirm } from 'semantic-ui-react';
import QnaWrite from '../components/qna/QnaWrite';
import { inject, observer } from 'mobx-react';
import AlertModal from '../components/common/AlertModal';
import QnaItemList from '../components/qna/QnaItmeList';

@inject('qnaStore')
@observer
class RecruitQnaMgmt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listCheckValue : 0,
            confirmModal : {
                open: false,
                message: '해당 Q&A를 삭제하시겠습니까?'
            },
            writeModal : {
                open : false,
                addFlag : false,
                seq : 0,
                question : "",
                answer : ""
            },
            alertModal : {
                open : false,
                message : ""
            }
        }
        this.getQnaList = () => this.props.qnaStore.getQnaList();
        this.saveQna = (params, fCallback) => this.props.qnaStore.saveQna(params, fCallback);
        this.deleteQna = (params, fCallback) => this.props.qnaStore.deleteQna(params, fCallback);
    }

    componentDidMount(){
        this.getQnaList();
    }

    handleClickCheckBox = (e, data) => {
        if(data.checked){
            this.setState({...this.state, listCheckValue : parseInt(data.value) })
        }else{
            this.setState({...this.state, listCheckValue : 0 })
        }
    }

    // 등록, 수정
    handleClickAdd = (addFlag) => {
        if(!addFlag){
            const qnaSeq = this.state.listCheckValue;
            if(qnaSeq === 0){
                this.setState({ ...this.state,  alertModal : { open : true, message : "수정할 항목을 선택하시기 바랍니다." } });
            }else{
                const { qnaList } = this.props.qnaStore;
                
                // 선택된 데이터 정보 추출.
                const targetQnaIndex = qnaList.map( data => { return data.nSeq }).indexOf(qnaSeq);
                let selectData = Object.assign({}, qnaList[targetQnaIndex]);

                this.setState({ ...this.state,  writeModal : { open: true, addFlag : addFlag, seq : selectData.nSeq,
                    question : selectData.sQuestion,
                    answer : selectData.sAnswer }
                });
            }
        }else{
            this.setState({ ...this.state, writeModal : { open: true, addFlag : addFlag, seq : 0, question : "", answer : "" }});
        }
    }

    // 등록, 수정 모달 닫기
    handleWriteModalClose = () => {
        this.setState({ ...this.state, writeModal : { open: false, addFlag : false }});
    }

    // 등록, 수정 입력
    handleTextChange = (event) => {
        this.setState({ ...this.state, writeModal : { ...this.state.writeModal, [event.target.id] : event.target.value }});
    }
    
    // 저장
    handleSaveWrite = () => {
        const params = {
            nFCode: "@nFCode",
            nSeq : this.state.writeModal.seq,
            sQuestion : this.state.writeModal.question,
            sAnswer : this.state.writeModal.answer,
            sLoginID : localStorage.getItem("userID")
        }
        this.saveQna(params, (data) => {
            if(data.return === 0){
                this.setState({ ...this.state, 
                    listCheckValue : 0,
                    writeModal : { open: false, addFlag : false, seq : 0, question : "", answer : "" }, 
                    alertModal : { open : true, message : "Q&A가 저장 되었습니다." }
                });
                this.getQnaList();
            }else{
                this.setState({ ...this.state, 
                    writeModal : { open: false, addFlag : false }, 
                    alertModal : { open : true, message : "저장시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // Alert close 
    handleCloseAlertModal = () => {
        this.setState({ ...this.state, alertModal : { open : false, message : "" }});
    }

    // 삭제
    handleClickDelete = () => {
        const qnaSeq = this.state.listCheckValue;
        if(qnaSeq === 0){
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
            nSeq : this.state.listCheckValue
        }
        this.deleteQna(params, (data) => {
            if(data.return === 0){
                this.setState({ ...this.state, 
                    listCheckValue : 0,
                    writeModal : { open: false, addFlag : false, seq : 0, question : "", answer : "" }, 
                    alertModal : { open : true, message : "Q&A가 삭제 되었습니다." }
                });
                this.getQnaList();
            }else{
                this.setState({ ...this.state, 
                    writeModal : { open: false, addFlag : false }, 
                    alertModal : { open : true, message : "Q&A 삭제시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 삭제취소
    handleDeleteCancel = () => this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false }})

    render(){
        const { confirmModal, listCheckValue, writeModal, alertModal } = this.state;
        const { qnaList } = this.props.qnaStore;
        return (
            <div className="body-contents">
                <Header as='h2'>Q&A 관리</Header>
                <div className="controls">
                    <div className="button-group">
                        <Button content='등록' color="teal" onClick={() => this.handleClickAdd(true)} />
                        <Button content='수정' color="grey" onClick={() => this.handleClickAdd(false)} />
                        <Button content='삭제' color="delete" onClick={this.handleClickDelete} />
                    </div>
                </div>
                <div>
                    <Table color="blue">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{ width:"50px" }}></Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"60px", textAlign:"center" }} >번호</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign:"center" }} >질문</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign:"center" }} >답변</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <QnaItemList qnaList={qnaList} listCheckValue={listCheckValue} handleClickCheckBox={this.handleClickCheckBox} />
                    </Table>
                </div>
                <QnaWrite data={writeModal} handleWriteModalClose={this.handleWriteModalClose} handleSaveWrite={this.handleSaveWrite} handleTextChange={this.handleTextChange} />
                <Confirm open={confirmModal.open} size="tiny" content={confirmModal.message} cancelButton="취소" confirmButton="확인" onCancel={this.handleDeleteCancel} onConfirm={this.handleDeleteConfirm} />
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />
            </div>
        )
    }
}

export default RecruitQnaMgmt;