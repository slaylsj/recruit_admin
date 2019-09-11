import React from 'react';
import { Header, Form, Button } from 'semantic-ui-react';
// import { DateInput } from 'semantic-ui-calendar-react';
import DatePicker from "react-datepicker";
import { inject, observer } from 'mobx-react';
import AlertModal from '../components/common/AlertModal';
import history from '../history/History';
import SmartEditor from '../components/common/SmartEditor';
import ScriptLoader from '../components/common/ScriptLoader';
import RecruitPreview from '../components/recruit/RecruitPreview';
import "react-datepicker/dist/react-datepicker.css";

@inject("recruitStore")
@observer
class RecruitModify extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            recruitID : 0,
            company : 'banaple',
            title: '',
            recruitType : 0,
            endDate: '',
            contents : '',
            editorEnable : false,
            oEditors : [],
            editorID : 'ir2',
            alertModal : {
                nextState : false,
                open : false,
                message : ""
            },
            previewModal : {
                open : false
            },
        };
        this.selectRecruit = (params, fCallback) => this.props.recruitStore.selectRecruit(params, fCallback);
        this.saveRecruit = (params, fCallback) => this.props.recruitStore.saveRecruit(params, fCallback);
    }

    componentDidMount(){
        const { recruitID } = this.props.match.params;
        if(typeof recruitID !== "undefined" && recruitID > 0){
            var params = {
                "nFCode" : "@nFCode",
                "nRecruitID" : recruitID
            }
            this.selectRecruit(params, (data) => {
                this.setState({
                    ...this.state,
                    recruitID : data.nRecruitID,
                    company : data.sCompany,
                    title: data.sTitle,
                    recruitType : data.nRecruitType,
                    endDate: new Date(data.sEndDate),
                    contents : data.sContents,
                    editorEnable : true
                })
            });
        }else{
            this.setState({
                ...this.state,
                editorEnable : true
            })
        }
    }

    handleChange = (e, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({...this.state, [name]: value });
        }
    }

    handleDateChange = (date) => {
        this.setState({...this.state, endDate: date });
    }

    handleSave = (e) => {
        e.preventDefault();

        this.state.oEditors.getById["ir2"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.

        const params = {
            // nFCode: "@nFCode",
            nRecruitID : this.state.recruitID,
            sCompany : this.state.company,
            nRecruitType : this.state.recruitType,
            sTitle : this.state.title,
            // sContents : this.state.contents,
            sContents : document.getElementById("ir2").value,
            dtEnd : this.state.endDate,
            sLoginID : localStorage.getItem("userID")
        }
       
        this.saveRecruit(params, (data) => {
            if(data.return === 1){
                this.setState({ ...this.state, 
                    alertModal : { nextState: true, open : true, message : "채용공고가 저장 되었습니다." }
                });
            }else{
                this.setState({ ...this.state, 
                    alertModal : { nextState: false, open : true, message : "채용공고가 저장시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 취소
    handleModifyCancel = () => {
        history.push("/recruitMgmt");
    }

    // editor 변경 이벤트
    handleChangeContents = (contents) => {
        this.setState({...this.state, contents: contents });
    }

    // Alert close 
    handleCloseAlertModal = () => {
        if(this.state.alertModal.nextState){
            history.push("/recruitMgmt");
        }else{
            this.setState({ ...this.state, alertModal : { nextState: false, open : false, message : "" }});
        }
    }

    // 미리보기
    handlePreviewModalOpen =() => {
        this.setState({...this.state, previewModal : { open : true}});
    }

    // 미리보기 close
    handlePreviewModalClose =() => {
        this.setState({...this.state, previewModal : { open : false}});
    }

    render() {
        const { company, title, contents, recruitType, endDate, editorEnable, alertModal, oEditors, previewModal, editorID } = this.state
        const previewData = { title: title,
            recruitType : recruitType,
            endDate: endDate,
            oEditors: oEditors
        }
        const options = [
            { key: 'r1', text: '정시', value: 0 },
            { key: 'r2', text: '상시', value: 1 },
        ]
        return (
            <div className="body-contents">
                <Header as='h2'>채용 공고 수정</Header>

                <div id="recruit-write">
                    <Form autoComplete="off" >
                        <Form.Group inline>
                            <label className="recruit-label">구분</label>
                            <Form.Radio
                                label='바나플'
                                name='company'
                                value='banaple'
                                checked={company === 'banaple'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label='바나플 F&B'
                                name='company'
                                value='banaplefnb'
                                checked={company === 'banaplefnb'}
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">제목</label>
                            <Form.Input className="wt-title " required={true} name="title" placeholder='채용공고명' onChange={this.handleChange} defaultValue={title} value={title} />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">채용구분</label>
                            <Form.Select className="select-type" required={true} fluid options={options} placeholder='선택' name="recruitType" value={recruitType} defaultValue={recruitType} onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">마감일</label>
                            {/* <DateInput className="wt-date" required={true}  fluid 
                                name="endDate"
                                dateFormat="YYYY-MM-DD"
                                placeholder="공고마감일"
                                value={endDate}
                                closable={true}
                                closeOnMouseLeave={false}
                                iconPosition="right"
                                popupPosition="bottom left"
                                onChange={this.handleChange} 
                            /> */}
                            <DatePicker
                                dateFormat="yyyy-MM-dd"
                                selected={endDate}
                                onChange={this.handleDateChange}
                            />
                            <label className="wt-date-text">마감시간은 해당 마감일 23:59분까지</label>
                        </Form.Group>

                        {/* { editorEnable ? <DraftEditor contentsHtml={contents} handleChangeContents={this.handleChangeContents} /> : null } */}
                        <ScriptLoader 
                            url={`/lib/smarteditor/js/service/HuskyEZCreator.js`}
                            loading={<p>Editor Loading...</p>}
                            errror={<p>Editor Load Error</p>}>
                            <SmartEditor editorID={editorID} oEditors={oEditors} contentsHtml={contents} handlePreviewModalOpen={this.handlePreviewModalOpen} />
                        </ScriptLoader>

                        <div className="button-group" style={{textAlign: "center"}}>
                            <Button color="grey" className="wt-btn-preview" onClick={this.handlePreviewModalOpen} >미리보기</Button>
                            <Button className="wt-btn-save" onClick={this.handleSave} primary >등록</Button>
                            <Button color="grey" className="wt-btn-preview" onClick={this.handleModifyCancel} >취소</Button>
                        </div>
                    </Form>
                </div>
                { previewModal.open ? 
                    <RecruitPreview editorID={editorID} data={previewModal} previewData={previewData} handlePreviewModalClose={this.handlePreviewModalClose} /> : null
                }
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />
            </div>
        )
    }
}

export default RecruitModify;