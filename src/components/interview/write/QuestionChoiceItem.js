import React from 'react';

class QuestionChoiceItem extends React.Component{
    handleChange = (e) => {
        const { idx , oIdx, handleOptionInputChange} = this.props;
        handleOptionInputChange(idx, oIdx, e.target.value);
    }

    render(){
        const { data, idx, oIdx, handleDeleteOption } = this.props;
        return(
            <li>
                <input type="radio" name="ch_item" /> <input className="txt_option" type="text" name="sOption" onChange={this.handleChange}  placeholder={`옵션${oIdx+1} 입력`} value={data.sOption}/>
                <button type="button" onClick={() => handleDeleteOption(idx, data.id)}>X</button>
            </li>
        )
    }
}

export default QuestionChoiceItem;