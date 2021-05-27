import React from 'react';
import intro_pic_check from '../../common/image/intro_pic_check.png';
import logo_banapresso from '../../common/image/banapresso.png';
import logo_banaple from '../../common/image/banaple.png';

const FinishStep = (props) => {
    const { handleComplete, finishText, company } = props;
    const btnClass = (company === "banaple" ? "blue" : company === "banapresso" ? "pink" : "pink");
    const logoImage = (company === "banaple" ? logo_banaple : company === "banapresso" ? logo_banapresso : logo_banaple);
    return(
        <div className="card intro on">
            <div className="cont">
                <div className="pic"><img src={intro_pic_check} alt="" /></div>
                <p className="txt1"><strong>완료 버튼</strong>을 꼭! 눌러주세요.</p>
                <p className="txt2">{finishText}</p>
            </div>
            <span className="logo"><img src={logoImage} alt="logo" /></span>
            <div className="btn_area">
                <div className="inner">
                    <button type="button" className={`btn full ${btnClass}`} onClick={handleComplete}>완료</button>
                </div>
            </div>
        </div>
    )
}

export default FinishStep;