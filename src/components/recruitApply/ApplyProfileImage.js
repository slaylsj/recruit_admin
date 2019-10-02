import React from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react'

const ApplyProfileImage = (props) => {
    const { open, profileImageUrl} = props.data;
    const { handleProfileModalClose} = props;
    return(
        <Modal open={open} onClose={handleProfileModalClose} className="apply-download">
            <Modal.Header>본인사진 첨부파일</Modal.Header>
            <Modal.Content>
                <Image src={`/${profileImageUrl}`} rounded size='large' />
            </Modal.Content>
            <Modal.Actions>
                <Button color='grey' onClick={handleProfileModalClose}>닫기</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ApplyProfileImage;