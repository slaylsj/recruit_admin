import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionItemList = (props) => {
    const { questionList, handleCreateQuestion, handleDeleteQuestion, handleChangePosition, handleChangeQuestion, handleCreateOption, handleDeleteOption, handleOptionInputChange, handleQuestionHistory } = props;
    return(
        <div className="form-group question_wrap col-sm-6">
            <ul className="question_list">
                { questionList.map((data, idx) => 
                    <QuestionItem key={`question_${idx}`} idx={idx} data={data} handleCreateQuestion={handleCreateQuestion} handleDeleteQuestion={handleDeleteQuestion} handleChangePosition={handleChangePosition} handleChangeQuestion={handleChangeQuestion} 
                        handleCreateOption={handleCreateOption} handleDeleteOption={handleDeleteOption} handleOptionInputChange={handleOptionInputChange} handleQuestionHistory={handleQuestionHistory}/>
                    )
                }
            </ul>
        </div>
    )
}

export default QuestionItemList;