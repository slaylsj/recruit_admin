import React from 'react';
import { Button, Modal } from 'semantic-ui-react'
import StartStep from '../StartStep';
import FinishStep from '../FinishStep';
import InterviewStep from '../InterviewStep';

const InterviewPreview = (props) => {
    const { surveyID, open, step, view, nSub } = props.data;
    const { webTitle, nowStepData, stepText, stepCount, company, handlePreViewModalClose, handlePrevStep, handleNextStep } = props;
    const stepClass = (company === "banaple" ? "blue" : company === "banapresso" ? "pink" : "gray");
    return(
        <Modal open={open} onClose={handlePreViewModalClose} className="interview_preview" style={{'left':'auto'}}>
            <header id="m_header">
                <h1>{webTitle}</h1>
                {step > 0? <div className="paging">(<em className={`current ${stepClass}`}>{step < 10 ? '0'+step : step}</em>/{stepCount < 10 ? '0'+stepCount : stepCount})</div> : null }
                <button type="button" className="btn_close close" onClick={handlePreViewModalClose}>
                    <span className="sr-only"><img src="/img/interview/btn_close.png" alt="닫기"/></span>
                </button>
            </header>
            <div id="m_container">
                {view === 'start' ? <StartStep handleNextStep={handleNextStep} startText={stepText.startText} company={company}/> : null}
                {view === 'interview' && step > 0 ? <InterviewStep step={step} stepData={nowStepData} company={company} handlePrevStep={handlePrevStep} handleNextStep={handleNextStep}/> : null }
                {view === 'finish' ? <FinishStep finishText={stepText.finishText} company={company}/> : null }
            </div>
        </Modal>
    )
}

export default InterviewPreview;