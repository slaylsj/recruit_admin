import React from 'react';
import { Button, Header, Image, Modal, Form, TextArea } from 'semantic-ui-react'

const QnaWrite = (props) => {
    const { open, addFlag, question, answer } = props.data;
    const { handleWriteModalClose, handleSaveWrite, handleTextChange} = props;
    return(
        <div>
        {/* <Button onClick={this.show(true)}>Default</Button>
        <Button onClick={this.show('inverted')}>Inverted</Button>
        <Button onClick={this.show('blurring')}>Blurring</Button> */}

        <Modal open={open} onClose={handleWriteModalClose}>
          <Modal.Header>QnA {addFlag?'등록':'수정'}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Group inline>
                        <TextArea className="qna-textarea" id="question" onChange={handleTextChange} placeholder='질문 입력' value={question}/>
                    </Form.Group>
                    <Form.Group inline>
                        <TextArea className="qna-textarea" id="answer" onChange={handleTextChange} placeholder='답변 입력' value={answer}/>
                    </Form.Group>
                </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={handleWriteModalClose}>취소</Button>
            <Button
              positive
              content="확인"
              onClick={handleSaveWrite}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
}

export default QnaWrite;