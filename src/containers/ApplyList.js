import React from 'react';
import { Header, Table, Input, Button, Select, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ApplyItemList from '../components/recruitApply/ApplyItemList'
import AlertModal from '../components/common/AlertModal';
import ApplyDownload from '../components/recruitApply/ApplyDownload';
import ApplyProfileImage from '../components/recruitApply/ApplyProfileImage';
import PaginationTemplet from '../components/common/PaginationTemplet';

@inject("applyStore")
@observer
class ApplyList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listCheckValue : 0,
            searchParam : { 
                company : "all",
                searchText : "",
            },
            pageInfo : {
                pageRow : 10
            },
            profileImageModal : {
                open : false,
                sName : "", 
                nSexType : -1, 
                sBirthDayYear : "", 
                sMemo : "",
                profileImageUrl : "" ,
                resumeUrl : "" , 
                portfolioUrl : "" 
            },
            downloadModal : {
                open : false,
                resumeUrl : "", 
                portfolioUrl : ""
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
        this.getApplyList = (params) => this.props.applyStore.getApplyList(params);
        this.deleteRecruitApply = (params, fCallback) => this.props.applyStore.deleteRecruitApply(params, fCallback);
    }

    componentDidMount(){
        this.handleSearch(1);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.searchParam.company !== this.state.searchParam.company) {
            this.handleSearch(1);
        }else if (prevState.pageInfo.pageRow !== this.state.pageInfo.pageRow) {
            this.handleSearch(1);
        }
    }

    // 조회
    handleSearch = (nPage) => {
        const params = {
            "nFCode" : "@nFCode",
	        "sCompany" : this.state.searchParam.company,
	        "sSearchText" : this.state.searchParam.searchText,
	        "nPage" : nPage,
	        "nPageRow" : this.state.pageInfo.pageRow
        }
        this.getApplyList(params);
    }
    
    // 검색조건 변경 이벤트
    handleChange = (e, {name, value}) => {
        this.setState({...this.state, searchParam : { ...this.state.searchParam, [name]: value }});
    }

    // 페이지 Row 변경.
    handlePageRowChange = (e, {name, value}) => {
        this.setState({...this.state, pageInfo : { ...this.state.pageInfo, [name]: value }});
    }

    // 엔터키 조회
    handleSearchKeyPress = (e) => {
        if(e.key === 'Enter'){
            // this.setState({ ...this.state, pageInfo : { ...this.state.pageInfo, initialPage : 1 }});
            this.handleSearch(1);
        }
    }

    handleClickCheckBox = (e, data) => {
        if(data.checked){
            this.setState({...this.state, listCheckValue : parseInt(data.value) })
        }else{
            this.setState({...this.state, listCheckValue : 0 })
        }
    }
    
    // Alert close 
    handleCloseAlertModal = () => {
        this.setState({ ...this.state, alertModal : { open : false, message : "" }});
    }

    // 삭제 클릭
    handleClickDelete = () => {
        const submitID = this.state.listCheckValue;
        if(submitID === 0){
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
            nSubmitID : this.state.listCheckValue
        }
        this.deleteRecruitApply(params, (data) => {
            if(data.return === 0){
                this.setState({ ...this.state, 
                    listCheckValue : 0,
                    // alertModal : { open : true, message : "해당 지원서가 삭제 되었습니다." }
                });
                this.handleSearch(1);
            }else{
                this.setState({ ...this.state, 
                    alertModal : { open : true, message : "삭제시 문제가 발생하였습니다." }
                });
            }
        });
    }

    // 삭제 취소
    handleDeleteCancel = () => this.setState({...this.state, confirmModal : { ...this.state.confirmModal, open: false }})

    // 프로필사진 모달 열기
    handleProfileModalOpen = (submitID) => {
        const { applyList } = this.props.applyStore;
        // 선택된 데이터 정보 추출.
        const targetQnaIndex = applyList.map( data => { return data.nSubmitID }).indexOf(submitID);
        let selectData = Object.assign({}, applyList[targetQnaIndex]);
        this.setState({ ...this.state, profileImageModal : { 
            open: true, 
            sName : selectData.sName, 
            nSexType : selectData.nSexType, 
            sBirthDayYear : selectData.sBirthDayYear, 
            sMemo : selectData.sMemo,
            profileImageUrl : selectData.sProfileImageUrl,
            resumeUrl : selectData.sResumeUrl , 
            portfolioUrl : selectData.sPortfolioUrl }
        });
    
    }

    // 프로필사진 모달 닫기
    handleProfileModalClose = () => {
        this.setState({ ...this.state, profileImageModal : { 
            open: false, 
            sName : '', 
            nSexType : -1, 
            sBirthDayYear : '', 
            sMemo : '',
            profileImageUrl : '',
            resumeUrl : "" , 
            portfolioUrl : "" }
        });
    }

    // 다운로드 모달 열기
    handleDownModalOpen = () => {
        const submitID = this.state.listCheckValue;
        if(submitID === 0){
            this.setState({ ...this.state,  alertModal : { open : true, message : "다운로드할 항목을 선택하시기 바랍니다." } });
        }else{
            const { applyList } = this.props.applyStore;
            // 선택된 데이터 정보 추출.
            const targetQnaIndex = applyList.map( data => { return data.nSubmitID }).indexOf(submitID);
            let selectData = Object.assign({}, applyList[targetQnaIndex]);
            this.setState({ ...this.state, downloadModal : { open: true, resumeUrl : selectData.sResumeUrl, portfolioUrl : selectData.sPortfolioUrl }});
        }
    }

    // 다운로드 모달 닫기
    handleDownModalClose = () => {
        this.setState({ ...this.state, downloadModal : { open: false, resumeUrl : '', portfolioUrl : '' }});
    }

    // 파일 다운로드
    handleFileDownload = (filePath) => {
        const fileName = filePath.substring(filePath.lastIndexOf("/")+1);
        const url = '/' + encodeURI(filePath);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    };

    // 파일 열기
    handleFileView = (filePath) => {
        const fileName = filePath.substring(filePath.lastIndexOf("/")+1);
        const url = '/' + encodeURI(filePath);
        window.open(url, '_blank');
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', fileName);
        // document.body.appendChild(link);
        // link.click();
    };

    // 페이지 이벤트
    handlePaginationChange = (activePage) => {
        this.handleSearch(activePage);
    }

    render(){
        const { listCheckValue, profileImageModal, downloadModal, confirmModal, alertModal, pageInfo } = this.state;
        const { applyList, totalCnt, activePage } = this.props.applyStore;
        const options = [
            { key: 'gubun1', text: '전체', value: 'all' },
            { key: 'gubun2', text: '바나플', value: 'banaple' },
            { key: 'gubun3', text: '바나플F&B', value: 'banaplefnb' },
            { key: 'gubun4', text: '바나프레소', value: 'banapresso' },
        ]
        const page_options = [
            { key: 'row1', text: '10', value: '10' },
            { key: 'row2', text: '20', value: '20' },
            { key: 'row3', text: '30', value: '30' },
            { key: 'row4', text: '50', value: '50' }
        ]

        return (
            <div className="body-contents">
                <Header as='h2'>지원서 조회</Header>
                <div className="controls">
                    <Select label='모집분야' required={true} options={options} name="company" placeholder='Gender' defaultValue="all" onChange={this.handleChange} />
                    <Input className="wt-title" required={true} name="searchText" placeholder='모집공고 입력' onChange={this.handleChange} onKeyPress={this.handleSearchKeyPress}/>
                    <Button content='조회' color="blue" onClick={() => this.handleSearch(1)} />
                    <div className="button-group">
                        <Button content='다운로드' color="teal" onClick={this.handleDownModalOpen} />
                        <Button content='삭제' color="delete" onClick={this.handleClickDelete} />
                    </div>
                </div>
                <div className="content-data">
                    <Table color="blue" fixed table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{ width:"50px" }}></Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"60px", textAlign:"center" }} >번호</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"120px", textAlign:"center" }} >구분</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"400px", textAlign:"center" }} >모집 공고</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"350px", textAlign:"center" }} >지원자</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"250px", textAlign:"center" }} >연락처</Table.HeaderCell>
                                {/* <Table.HeaderCell style={{ width:"150px", textAlign:"center" }} >출생년도</Table.HeaderCell> */}
                                <Table.HeaderCell style={{ width:"150px", textAlign:"center" }} >이력서 / 포폴</Table.HeaderCell>
                                <Table.HeaderCell style={{ width:"150px", textAlign:"center" }} >지원일자</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign:"center" }} >메모</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <ApplyItemList applyList={applyList} totalCnt={totalCnt} activePage={activePage} listCheckValue={listCheckValue} handleClickCheckBox={this.handleClickCheckBox} handleProfileModalOpen={this.handleProfileModalOpen} />
                    </Table>
                </div>
                <div className="content-pagination">
                    <PaginationTemplet totalCnt={totalCnt} pageInfo={pageInfo} handlePaginationChange={this.handlePaginationChange} />
                    <div className='select-pagerow' >
                        <Select fluid required={true} options={page_options} name="pageRow" defaultValue="10" onChange={this.handlePageRowChange} />
                    </div> 
                </div>

                <ApplyProfileImage data={profileImageModal} handleProfileModalClose={this.handleProfileModalClose} handleFileDownload={this.handleFileView} />
                <ApplyDownload data={downloadModal} handleDownModalClose={this.handleDownModalClose} handleFileDownload={this.handleFileDownload} />
                <Confirm open={confirmModal.open} size="tiny" content={confirmModal.message} cancelButton="취소" confirmButton="확인" onCancel={this.handleDeleteCancel} onConfirm={this.handleDeleteConfirm} />
                <AlertModal open={alertModal.open} message={alertModal.message}  size="mini" closeModal={this.handleCloseAlertModal} />
            </div>
        )
    }
}

export default ApplyList;