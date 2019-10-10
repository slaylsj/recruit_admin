import React from 'react';

class QuestionTextarea extends React.Component{
    constructor(props){
        super(props)
        this.textareaRef = React.createRef();
    }

    // 초기값에 따른 사이즈 변경
    componentDidMount(){
        this.textareaRef.current.style.height = '1px';
        this.textareaRef.current.style.height = 12+this.textareaRef.current.scrollHeight+'px';
    }
    
    // 이전 문항 선택시 사이즈 변경 처리
    componentDidUpdate(prevProps, prevState){
        if (prevProps.question !== this.props.question) {
            this.textareaRef.current.style.height = '1px';
            this.textareaRef.current.style.height = 12+this.textareaRef.current.scrollHeight+'px';
        }
    }

    render(){
        const { idx, question, handleChangeQuestion } = this.props;
        return(
            <textarea ref={this.textareaRef} className="txt_question" placeholder="설문 내용을 입력하세요." name="question" style={{"height": "50px" }} onChange={(e) => handleChangeQuestion(idx, e.target.name, e.target.value)} value={question}></textarea>
        )
    }
}

export default QuestionTextarea;