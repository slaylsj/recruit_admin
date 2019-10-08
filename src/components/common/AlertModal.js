import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const AlertModal = (props) => {
    // SIZE : mini, tiny, small, large, fullscreen
    const { open, message, size, closeModal } = props
    return (
        <div>
            <Modal size={size} open={open} onClose={closeModal}>
            <Modal.Header>알림</Modal.Header>
            <Modal.Content>
                <p>{message}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button positive content='확인' onClick={closeModal} />
            </Modal.Actions>
            </Modal>
        </div>
    )
}

export default AlertModal;