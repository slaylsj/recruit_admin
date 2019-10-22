import React from 'react';
import { Button, Modal, List } from 'semantic-ui-react'

const InterviewHistoryView = (props) => {
    const { data, dataList, handleSelectHistory, handleQuestionHistoryClose } = props;
    const { open, type } = data;
    const viewTitle = (type) => {
        let returnVal = '';
        if(type === 0) returnVal = '이전 설문지 설명 내역';
        if(type === 1) returnVal = '이전 끝맺음 내역';
        if(type === 2) returnVal = '이전 문항 내역';
        return returnVal;
    }
    const viewAnswerType = (answerType) => {
        let returnVal = '';
        if(answerType === 0) returnVal = '[주관식 질문] ';
        if(answerType === 1) returnVal = '[객관식 질문] ';
        if(answerType === 2) returnVal = '[체크박스 질문] ';
        return returnVal;
    }
    return(
        <Modal open={open} onClose={handleQuestionHistoryClose} className="interview-history">
            <Modal.Header>{viewTitle(type)}</Modal.Header>
            <Modal.Content className="history-list">
                <List divided verticalAlign='middle'>
                    {dataList.map(dataObj => 
                        <List.Item>
                            <List.Content floated='right'>
                                <Button color="teal" onClick={() => handleSelectHistory(type, dataObj.nStepID, dataObj.nAnswerType, dataObj.sText)}>선택</Button>
                            </List.Content>
                            <List.Content><span className="h-title">{viewAnswerType(dataObj.nAnswerType)}</span>{dataObj.sText}</List.Content>
                        </List.Item>
                    )}
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button color='grey' onClick={handleQuestionHistoryClose}>닫기</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default InterviewHistoryView;