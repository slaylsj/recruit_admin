import React from 'react';

class QuestionTextarea extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            textareaHeight : '50px'
        }
        this.textareaRef = React.createRef();
    }

    // 초기값에 따른 사이즈 변경
    componentDidMount(){
        this.setState({ textareaHeight : 12+this.textareaRef.current.scrollHeight+'px' }) 
    }
    
    // 이전 문항 선택시 사이즈 변경 처리
    componentDidUpdate(prevProps, prevState){
        if (prevProps.question !== this.props.question) {
            this.setState({ textareaHeight : '1px' }) 
        }
        if (this.state.textareaHeight === '1px'){
            this.setState({ textareaHeight : 12+this.textareaRef.current.scrollHeight+'px' }) 
        }
    }

    // value 입력시 사이즈 변경.
    handleTextareaAutoHeight = (e, idx) => {
        const { handleChangeQuestion } = this.props;
        e.target.style.height = '1px';
        e.target.style.height = 12+e.target.scrollHeight+'px';
        handleChangeQuestion(idx, e.target.name, e.target.value);
    }

    render(){
        const { textareaHeight } = this.state;
        const { idx, question } = this.props;
        return(
            <textarea ref={this.textareaRef} className="txt_question" placeholder="설문 내용을 입력하세요." name="question" style={{"height": textareaHeight }} onChange={(e) => this.handleTextareaAutoHeight(e, idx)} value={question}></textarea>
        )
    }
}

export default QuestionTextarea;