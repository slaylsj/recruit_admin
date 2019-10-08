import React from 'react';
import icon_qna from '../../common/image/icon_qna.png';
import logo_banapresso from '../../common/image/banapresso.png';
import logo_banaple from '../../common/image/banaple.png';
import CheckItem from './CheckItem';
import ChoiceItem from './ChoiceItem';
import TextItem from './TextItem';

const InterviewStep = (props) => {
    const { step, stepData, company, handlePrevStep, handleNextStep } = props;
    const { list, sQuestion, nAnswerType } = stepData;
    const btnClass = (company === "banaple" ? "blue" : company === "banapresso" ? "pink" : "wgray");
    const logoImage = (company === "banaple" ? logo_banaple : company === "banapresso" ? logo_banapresso : logo_banaple);
    const step_num = step < 10 ? '0'+step : step;
    const question_view = (step_num, sQuestion) => {
        // return step_num + '. ' + sQuestion.replace(/\n/g, '<br/>');
        return sQuestion.replace(/\n/g, '<br/>');
    }
    return(
        <div className="card on">
            <div className="cont">
                <div className="icon"><img src={icon_qna} alt="" /></div>
                <p className="question"><div dangerouslySetInnerHTML={{ __html: question_view(step_num, sQuestion)}}></div></p>
                <div className="answer ">
                    { nAnswerType === 0 ? <TextItem /> : null }
                    { nAnswerType === 1 ? <ChoiceItem list={list} /> : null }
                    { nAnswerType === 2 ? <CheckItem list={list}  /> : null }
                </div>
            </div>
            <span className="logo"><img src={logoImage} alt="logo" /></span>
            <div className="btn_area">
                <div className="inner">
                    <button type="button" className="btn half prev gray" onClick={handlePrevStep}>이전</button>
                    <button type="button" className={`btn half ${btnClass} next`} onClick={handleNextStep}>다음</button> 
                </div>
            </div>
        </div>
    )
}

export default InterviewStep;