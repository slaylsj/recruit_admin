import React from 'react';
import { Button, Image, Modal, Item } from 'semantic-ui-react'

const ApplyProfileImage = (props) => {
    const { open, profileImageUrl, sName, nSexType, sBirthDayYear, sMemo} = props.data;
    const { handleProfileModalClose} = props;
    const getSexType = (type) => {
        if(type === 0) return '(남)'
        else if(type === 1) return '(여)'
        else return ''
    }
    return(
        <Modal open={open} onClose={handleProfileModalClose} className="applicant-info">
            <Modal.Header>지원자 정보</Modal.Header>
            <Modal.Content>
                <Item.Group>
                    <Item>
                        <Item.Image size='medium' src={`/${profileImageUrl}`} />
                        <Item.Content>
                            <Item.Header as='a'>{sName} - {getSexType(nSexType)} {sBirthDayYear}{sBirthDayYear.length > 0? '년' : ''} </Item.Header>
                            <Item.Description>
                            <p>{sMemo}</p>
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