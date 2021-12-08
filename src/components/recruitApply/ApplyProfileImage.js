import React from 'react';
import { Button, Image, Modal, Item } from 'semantic-ui-react'
import img_noprofile from '../../common/image/img_noprofile.png';

const ApplyProfileImage = (props) => {
    const { data, handleFileDownload, handleRecruitComplete } = props;
    const { nSubmitID, open, profileImageUrl, resumeUrl, portfolioUrl, sName, nSexType, sBirthDayYear, sMemo, sTitle, sPartList, sSubmitPartList, bComplete} = data;
     
    const { handleProfileModalClose} = props;
    const getSexType = (type) => {
        if(type === 0) return '(남)'
        else if(type === 1) return '(여)'
        else return ''
    }
    return(
        <Modal open={open} onClose={handleProfileModalClose} className="applicant-info">
            <Modal.Header>지원자 정보
                <div className="download-layer">
                    { portfolioUrl !== ''? <div className="portfolio active" onClick={()=>handleFileDownload(portfolioUrl)}>포트폴리오</div> : null }
                    { resumeUrl !== ''? <div className="resume active" onClick={()=>handleFileDownload(resumeUrl)}>이력서</div> : null }
                </div>
            </Modal.Header>
            <Modal.Header>
                <div>
                    <h4 style={{ 'marginBottom' : '5px'}}>{sTitle}</h4>
                    <h5 style={{ 'marginTop' : '0px'}}>
                        [모집분야] {sPartList}<br/>
                        [지원분야] {sSubmitPartList}
                    </h5>
                </div>
            </Modal.Header>
            <Modal.Content>
                <Item.Group>
                    <Item>
                        {profileImageUrl !== '' ? <Item.Image size='medium' src={`/${profileImageUrl}`} /> : <Item.Image size='medium' src={img_noprofile} /> }
                        <Item.Content>
                            <Item.Header>{sName} - {getSexType(nSexType)} {sBirthDayYear}{sBirthDayYear.length > 0? '년' : ''} </Item.Header>
                            <Item.Description style={{ 'height':'475px', 'overflowY' : 'auto'}}>
                            <p style={{ 'whiteSpace':'pre-line'}}>{sMemo}</p>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Modal.Content>
            <Modal.Actions>
                { bComplete !== "1" && <Button color='green' onClick={() => handleRecruitComplete(nSubmitID)}>완료</Button> }
                <Button color='grey' onClick={handleProfileModalClose}>닫기</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ApplyProfileImage;