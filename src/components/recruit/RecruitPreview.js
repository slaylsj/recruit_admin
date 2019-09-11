import React from 'react';
import { Modal } from 'semantic-ui-react'
import ButtonClose from '../../common/image/btn_close.png';

const RecruitPreview = ({editorID, data, previewData, handlePreviewModalClose}) => {
    const { title, recruitType, endDate, oEditors } = previewData;
    const contentHtml = oEditors.getById[editorID].getIR();
    const endDateView = (date) => {
        if(date === "") return "-";
        var week = ['일','월','화','수','목','금','토'];
        let returnVal = date + " ("+ week[new Date(date).getDay()]+")";
        return returnVal;
    }
    const finishDay = (date) => {
        if(date === "") return "-";
        var endDateTime = new Date(date).getTime();
        var now = new Date().getTime(); 
        var distance = endDateTime - now; 
        var day = Math.ceil(distance / (1000 * 60 * 60 * 24)); 

        let returnVal = "";
        if(day < 0) returnVal = "마감";
        else if(day === 0) returnVal = "D - day";
        else returnVal = "D - " + day;
        return returnVal;
    }
    
    return(
        <Modal open={data.open} onClose={handlePreviewModalClose}>
            {/* <div className="pop_wrap"> */}
                <div className="popup">
                    <div className="pop_hd">
                        <h2 className="title">{title}</h2>
                        <span className="date"> ~ {recruitType === 0 ? endDateView(endDate) : '채용시까지'}</span>
                        <span className="dday">{recruitType === 0 ? finishDay(endDate) : ''}</span>
                        <a href className="btn_close" onClick={handlePreviewModalClose}><img src={ButtonClose} alt="닫기" /></a>
                    </div>
                    
                    <div className="pop_bd recruit_step1" >
                        <div className="pop_cont board_view" dangerouslySetInnerHTML={ {__html: contentHtml} }></div>
                        <div className="btn_area">
                            <button type="button" className="btn_ty1" onClick={handlePreviewModalClose} >닫기</button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </Modal>
    )
}

export default RecruitPreview;