import React from 'react';
import { Header, Form, Button, List } from 'semantic-ui-react';
// import { DateInput } from 'semantic-ui-calendar-react';
import DatePicker from "react-datepicker";
// import DraftEditor from '../components/common/DraftEditor';
import { inject, observer } from 'mobx-react';
import AlertModal from '../components/common/AlertModal';
import history from '../history/History';
import SmartEditor from '../components/common/SmartEditor';
import ScriptLoader from '../components/common/ScriptLoader';
import RecruitPreview from '../components/recruit/RecruitPreview';
import Utils from '../utils/Utils';
import "react-datepicker/dist/react-datepicker.css";

@inject("recruitStore")
@observer
class RecruitWrite extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            recruitID : 0,
            company : 'banaple',
            group : '',
            txt_group : '',
            job : '',
            txt_job : '',
            title: '',
            recruitType : 0,
            endDate: '',
            contents : '',
            chkResume : false,
            chkProfileImage : false,
            chkPortfolio : false,
            chkPortfolioChoise : false,
            chkDirect : true,
            chkJobkorea : false,
            chkAlbamon : false,
            txtJobkoreaUrl : '',
            txtAlbamonUrl : '',
            recruitPartList : [""],
            chkBannerView : false,
            oEditors : [],
            editorID : 'ir1',
            alertModal : {
                nextState : false,
                open : false,
                message : ""
            },
            previewModal : {
                open : false
            }
        };

        this.selectDepartment = (fCallback) => this.props.recruitStore.selectDepartment(fCallback);
        this.setDeptGroupList = (param) => this.props.recruitStore.setDeptGroupList(param);
        this.setDeptJobList = (param) => this.props.recruitStore.setDeptJobList(param);
        // this.selectRecruit = (params, fCallback) => this.props.recruitStore.selectRecruit(params, fCallback);
        this.saveRecruit = (params, fCallback) => this.props.recruitStore.saveRecruit(params, fCallback);
    }

    componentDidMount(){
        this.selectDepartment(() => {
            const { company } = this.state;
            this.setDeptGroupList(company);
        });
    }

    handleChange = (e, {name, value}) => {
        if(name === 'company'){
            this.setDeptGroupList(value);
            this.setState({...this.state, [name]: value, group : '', txt_group : '', job : '', txt_job : ''});
        }else if(name === 'group'){
            this.setDeptJobList(value);
            this.setState({...this.state, [name]: value, job : '', txt_job : ''});
        }else if(name === 'recruitType'){
            if( value === 1) this.setState({...this.state, [name]: value, endDate : '2029-12-31'});
            else this.setState({...this.state, [name]: value, endDate : ''});
        }else if(this.state.hasOwnProperty(name)) {
            this.setState({...this.state, [name]: value });
        }
    }

    handleCheckboxChange = (e, data) => {
        const { name, checked } = data;
        if (this.state.hasOwnProperty(name)) {
            this.setState({...this.state, [name]: checked });
        }
    }

    handleDateChange = (date) => {
        const timezoneDate = new Date(date.getTime() + 9*60*60*1000);
        this.setState({...this.state, endDate: timezoneDate});
    }

    handleRecruitPartAdd = () => {
        const { recruitPartList } = this.state;
        this.setState({ ...this.state, recruitPartList : recruitPartList.concat('')});
    }

    handleRecruitPartDel = (tIdx) => {
        const { recruitPartList } = this.state;
        if(recruitPartList.length === 1) return false;
        this.setState({ ...this.state, recruitPartList : recruitPartList.filter((val, idx) => idx !== tIdx)});
    }

    handleChangeRecruitPart = (tIdx, tVal) => {
        const { recruitPartList } = this.state;
        this.setState({ ...this.state, recruitPartList : recruitPartList.map((val, idx) => 
            {
                return (idx === tIdx ? tVal.replace(/,/g,'.') : val)
            })
        });
    }

    handleSave = (e) => {
        e.preventDefault();

        const { recruitID, company, group, txt_group, job, txt_job, recruitType, title, chkResume, chkProfileImage, chkPortfolio, chkPortfolioChoise, endDate,
            chkDirect, chkJobkorea, chkAlbamon, txtJobkoreaUrl, txtAlbamonUrl, recruitPartList, chkBannerView } = this.state;
        let param_group = group, param_job = job;

        // 입력 값 체크.
        let validationCheck = false, msg = '';
        if(title === ''){
            validationCheck = true; msg = '공고명을 입력 하시기 바랍니다.';
        }else if(recruitType === 0 && endDate === ''){
            validationCheck = true; msg = '마감일을 입력 하시기 바랍니다.';
        }else if(group === ''){
            validationCheck = true; msg = '부서를 선택 하시기 바랍니다.';
        }else if(group === '직접입력'){
            if(txt_group === ''){
                validationCheck = true; msg = '부서명을 직접입력 하시기 바랍니다.';
            }else{
                param_group = txt_group;
            }
        }
        
        if(!validationCheck && chkJobkorea && txtJobkoreaUrl === ''){
            validationCheck = true; msg = '잡코리아 URL을 입력 하시기 바랍니다.';
        }
        if(!validationCheck && chkAlbamon && txtAlbamonUrl === ''){
            validationCheck = true; msg = '알바몬 URL을 입력 하시기 바랍니다.';
        }

        if(!validationCheck && job === ''){
            validationCheck = true; msg = '직무를 선택 하시기 바랍니다.';
        }else if(!validationCheck && job === '직접입력'){
            if(txt_job === ''){
                validationCheck = true; msg = '직무명을 직접입력 하시기 바랍니다.';
            }else{
                param_job = txt_job;
            }
        } 
        if(validationCheck){
            this.setState({ ...this.state, 
                alertModal : { nextState: false, open : true, message : msg }
            });
            return false;
        }

        this.state.oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.

        // Editor 내용 파일 정보.
        const contentsBlob = new Blob([document.getElementById("ir1").value], {type: "text/plain;charset=utf-8"});
        const contetsFileNm = Utils.createFileNm('contents_','txt');
        
        // Editor 내용 파일로 저장.
        Utils.saveFileContentHtml(contentsBlob, contetsFileNm).then(content_url => {
            // Editor 내용 파일로 저장 성공 시 채용정보 저장.
            const params = {
                // nFCode: "@nFCode",
                nRecruitID : recruitID,
                sCompany : company,
                sGroup : param_group,
                sJob : param_job,
                nRecruitType : recruitType,
                sTitle : title,
                // sContents : this.state.contents,
                // sContents : document.getElementById("ir1").value,
                sContents : content_url,
                bResume : chkResume,
                bProfileImage : chkProfileImage,
                bPortfolio : chkPortfolio,
                bPortfolioChoise : chkPortfolioChoise,
                bDirect : chkDirect,
                bJobkorea : chkJobkorea, 
                bAlbamon : chkAlbamon,
                sJobkoreaUrl : chkJobkorea ? txtJobkoreaUrl : '',
                sAlbamonUrl : chkAlbamon ? txtAlbamonUrl : '',
                sRecruitPartList : recruitPartList.join(','),
                dtEnd : endDate,
                bBannerView : chkBannerView,
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
        const { company, group, txt_group, job, txt_job, title, contents, chkResume, chkProfileImage, chkPortfolio, chkPortfolioChoise, chkDirect, chkJobkorea, chkAlbamon, txtJobkoreaUrl, txtAlbamonUrl, 
                recruitType, endDate, alertModal, oEditors, previewModal, editorID, recruitPartList, chkBannerView } = this.state
        const { groupList, jobList } = this.props.recruitStore;

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
                <Header as='h2'>채용 공고 등록</Header>

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
                            <Form.Radio
                                label='바나프레소'
                                name='company'
                                value='banapresso'
                                checked={company === 'banapresso'}
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">배너 노출</label>
                            <Form.Checkbox className="banner-view" label='* 체크 시 홈페이지 메인 화면에 배너로 노출 됩니다.' name='chkBannerView' checked={chkBannerView} onChange={this.handleCheckboxChange}/>
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">공고명</label>
                            <Form.Input className="wt-title " required={true} name="title" placeholder='채용공고명' onChange={this.handleChange} defaultValue={title} value={title} />
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">공고방식</label>
                            <Form.Select className="select-type" required={true} fluid options={options} placeholder='선택' name="recruitType" value={recruitType} defaultValue={recruitType} onChange={this.handleChange}/>
                            {recruitType === 0 ? 
                            <label className="recruit-label-2">마감일</label>
                            // {/* <DateInput className="wt-date" required={true}  fluid 
                            //     name="endDate"
                            //     dateFormat="YYYY-MM-DD"
                            //     placeholder="공고마감일"
                            //     value={endDate}
                            //     closable={true}
                            //     closeOnMouseLeave={false}
                            //     iconPosition="right"
                            //     popupPosition="bottom left"
                            //     onChange={this.handleChange} 
                            // /> */}
                            : null }
                            {recruitType === 0 ? 
                            <DatePicker
                                selected={endDate}
                                onChange={this.handleDateChange}
                                dateFormat="yyyy-MM-dd"
                            /> : null }
                            {recruitType === 0 ? 
                            <label className="wt-date-text">마감시간은 해당 마감일 23:59분까지</label>
                            : null }
                        </Form.Group>
                        
                        <Form.Group inline>
                            <label className="recruit-label">부서</label>
                            <Form.Select className="select-type" required={true} fluid options={groupList} placeholder='선택' name="group" value={group} defaultValue={group} onChange={this.handleChange}/>
                            { group === '직접입력' ? <Form.Input className="wt-group" required={true} name="txt_group" placeholder='부서명' onChange={this.handleChange} defaultValue={txt_group} value={txt_group} /> : null }
                            <label className="recruit-label-2">직무</label>
                            <Form.Select className="select-type" required={true} fluid options={jobList} placeholder='선택' name="job" value={job} defaultValue={job} onChange={this.handleChange}/>
                            { job === '직접입력' ? <Form.Input className="wt-group" required={true} name="txt_job" placeholder='직무명' onChange={this.handleChange} defaultValue={txt_job} value={txt_job} /> : null }
                        </Form.Group>

                        <Form.Group inline className="apply-div">
                            <label className="recruit-label">지원유형</label>
                            <Form.Checkbox className="apply-type" label='본사지원' name='chkDirect' checked={chkDirect} onChange={this.handleCheckboxChange}/>
                        </Form.Group>

                        <Form.Group inline className="apply-div">
                            <label className="recruit-label">&nbsp;</label>
                            <Form.Checkbox className="apply-type" label='잡코리아' name='chkJobkorea' checked={chkJobkorea} onChange={this.handleCheckboxChange}/>
                            <Form.Input className="wt-title " required={true} name="txtJobkoreaUrl" placeholder='잡코리아 URL' onChange={this.handleChange} defaultValue={txtJobkoreaUrl} value={txtJobkoreaUrl} disabled={!chkJobkorea && true}/>
                        </Form.Group>
                        
                        <Form.Group inline> 
                            <label className="recruit-label">&nbsp;</label>
                            <Form.Checkbox className="apply-type" label='알바몬' name='chkAlbamon' checked={chkAlbamon} onChange={this.handleCheckboxChange}/>
                            <Form.Input className="wt-title " required={true} name="txtAlbamonUrl" placeholder='알바몬 URL' onChange={this.handleChange} defaultValue={txtAlbamonUrl} value={txtAlbamonUrl} disabled={!chkAlbamon && true} />
                        </Form.Group>

                        <Form.Group className="recruit_part">
                            <label className="recruit-label">모집분야</label>
                            <ul className="recruit_ul">
                                { recruitPartList.map((val, idx) => 
                                    <li>
                                        <div>
                                            <input type="text" value={val} onChange={(e) => this.handleChangeRecruitPart(idx, e.target.value)}></input> <Button className="btn_recruit_add" onClick={() => this.handleRecruitPartDel(idx)}>-</Button>
                                            { recruitPartList.length-1 === idx ? <Button className="btn_recruit_add" onClick={this.handleRecruitPartAdd} >+</Button> : null}
                                        </div>
                                    </li>
                                    )
                                }
                            </ul>
                        </Form.Group>

                        <Form.Group inline>
                            <label className="recruit-label">첨부유형</label>
                            <Form.Checkbox
                                label='이력서'
                                name='chkResume'
                                checked={chkResume}
                                onChange={this.handleCheckboxChange}
                            />
                            <Form.Checkbox
                                label='본인사진'
                                name='chkProfileImage'
                                checked={chkProfileImage}
                                onChange={this.handleCheckboxChange}
                            />
                            <Form.Checkbox
                                label='포트폴리오(필수)'
                                name='chkPortfolio'
                                checked={chkPortfolio}
                                onChange={this.handleCheckboxChange}
                            />
                            <Form.Checkbox
                                label='포트폴리오(선택)'
                                name='chkPortfolioChoise'
                                checked={chkPortfolioChoise}
                                onChange={this.handleCheckboxChange}
                            />
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

export default RecruitWrite;