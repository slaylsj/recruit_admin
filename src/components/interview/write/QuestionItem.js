import React from 'react';
import QuestionChoiceItem from './QuestionChoiceItem';
import QuestionCheckItem from './QuestionCheckItem';
import QuestionTextarea from './QuestionTextarea';

const QuestionItem = (props) => {
    const { idx, data, handleCreateQuestion, handleDeleteQuestion, handleChangePosition, handleChangeQuestion, handleCreateOption, handleDeleteOption, handleOptionInputChange, handleQuestionHistory } = props;
    const { id, question, answer_type, option_1, option_2 } = data;

    return(
        <li>
            <span className="num">문항 <span className="question_num">{idx+1}</span></span>
            {/* <textarea className="txt_question" placeholder="설문 내용을 입력하세요." name="question" style={{"height":"50px"}} onChange={(e) => handleTextareaAutoHeight(e, idx)} value={question}></textarea> */}
            <QuestionTextarea idx={idx} question={question} handleChangeQuestion={handleChangeQuestion}/>
            <span data-type="2" className="btn-history btn-question" onClick={() => handleQuestionHistory(2, idx)}>* 이전 문항 보기</span>
            <ul className="item_sel answer_type">
                <li value="1" className={answer_type === 1 ? 'on' : ''} onClick={(e) => handleChangeQuestion(idx, "answer_type", parseInt(e.target.value))} ><img src="/img/interview/ico_radio.png" alt="" /> 객관식 질문</li>
                <li value="2" className={answer_type === 2 ? 'on' : ''} onClick={(e) => handleChangeQuestion(idx, "answer_type", parseInt(e.target.value))}><img src="/img/interview/ico_check.png" alt="" /> 체크박스</li>
                <li value="0" className={answer_type === 0 ? 'on' : ''} onClick={(e) => handleChangeQuestion(idx, "answer_type", parseInt(e.target.value))}>= 주관식 질문</li>
            </ul>
            <div className="item_type">
                <div className={answer_type === 1 ? 'on' : ''}>
                    <div className="btn_option" onClick={() => handleCreateOption(idx)}><span className="add_option">옵션추가</span></div>
                    <ul className="item_list">
                        { option_1.map((data,oIdx) => <QuestionChoiceItem key={`choice_${oIdx}`} data={data} idx={idx} oIdx={oIdx} handleOptionInputChange={handleOptionInputChange} handleDeleteOption={handleDeleteOption}/> ) }
                    </ul>
                </div>

                <div className={answer_type === 2 ? 'on' : ''}>
                    <div className="btn_option" onClick={() => handleCreateOption(idx)}><span className="add_option">옵션추가</span></div>
                    <ul className="item_list">
                        { option_2.map((data,oIdx) => <QuestionCheckItem key={`checkopt_${oIdx}`} data={data} idx={idx} oIdx={oIdx} handleOptionInputChange={handleOptionInputChange} handleDeleteOption={handleDeleteOption} /> ) }
                    </ul>
                </div>
                
                <div className={answer_type === 0 ? 'on' : ''}>
                    <textarea placeholder="500자 이내" style={{"resize": "none", "height":"80px", "minHeight":"80px"}} disabled={true}></textarea>
                </div>
            </div>
            <div className="btn_group">
                <button type="button" className="btn_add" onClick={handleCreateQuestion}>+</button>
                <button type="button" className="btn_del" onClick={() => handleDeleteQuestion(id)}>-</button>
                <div className="prev_next">
                    <button type="button" className="btn_prev" onClick={() => handleChangePosition(idx, 'up')}>▲</button>
                    <button type="button" className="btn_next" onClick={() => handleChangePosition(idx, 'down')}>▼</button>
                </div>
            </div>
        </li>
    )
}

export default QuestionItem;