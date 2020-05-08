import React from 'react';
import { Button, Image, Modal, Item } from 'semantic-ui-react'

const ApplyProfileImage = (props) => {
    const { data, handleFileDownload } = props;
    const { open, profileImageUrl, resumeUrl, portfolioUrl, sName, nSexType, sBirthDayYear, sMemo} = data;
     
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
            <Modal.Content>
                <Item.Group>
                    <Item>
                        <Item.Image size='medium' src={`/${profileImageUrl}`} />
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
                <Button color='grey' onClick={handleProfileModalClose}>닫기</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ApplyProfileImage;