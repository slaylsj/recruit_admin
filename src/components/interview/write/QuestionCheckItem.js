import React from 'react';

class QuestionCheckItem extends React.Component{
    handleChange = (e) => {
        const { idx , oIdx, handleOptionInputChange} = this.props;
        handleOptionInputChange(idx, oIdx, e.target.value);
    }

    render(){
        const { data, idx, oIdx, handleDeleteOption } = this.props;
        return(
            <li>
                <input type="checkbox" /> <input className="txt_option" name="sOption" onChange={this.handleChange} type="text" placeholder={`옵션${oIdx+1} 입력`} value={data.sOption}  />
                <button type="button" onClick={() => handleDeleteOption(idx, data.id)}>X</button>
            </li>
        )
    }
}

export default QuestionCheckItem;