import React from 'react';
import { Header, Button } from 'semantic-ui-react';

const RecruitDetail = (props) => {
    const { sTitle, sContents, contents, dtEndView, nFinishDay, nRecruitType} = props.data;
    const { handleGoList, handleClickModify, handleClickDelete} = props;
    const finishDay = (day) => {
        let returnVal = "";
        if(day < 0) returnVal = "접수마감";
        else if(day === 0) returnVal = "D-day";
        else returnVal = "D-" + day;
        return returnVal;
    }
    return(
        <div className="rec-content">
            <div className="rec-div">
				<h2 className="title">{sTitle}</h2>
				<span className="date"> ~ {nRecruitType === 1 ? '' : dtEndView}</span>
				<span className="dday">{nRecruitType === 1 ? '상시채용' : finishDay(nFinishDay)}</span>
			</div>

            <div className="content">
				<div className="pop_cont board_view" dangerouslySetInnerHTML={ {__html: contents} }>
				</div>
                <div className="button-group button-right">
                    <Button content='수정' color="teal" onClick={handleClickModify} />
                    <Button content='삭제' color="delete" onClick={handleClickDelete} />
                </div>
                <hr/>
				<div className="button-center">
                    <Button color="grey" onClick={handleGoList} >목록</Button>
				</div>
			</div>
        </div>
    )
}

export default RecruitDetail;