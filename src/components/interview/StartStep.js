import React from 'react';
import intor_pic from '../../common/image/intor_pic.png';
import logo_banapresso from '../../common/image/banapresso.png';
import logo_banaple from '../../common/image/banaple.png';

const StartStep = (props) => {
    const { handleNextStep, startText, company } = props;
    const btnClass = (company === "banaple" ? "blue" : company === "banapresso" ? "pink" : "wgray");
    const logoImage = (company === "banaple" ? logo_banaple : company === "banapresso" ? logo_banapresso : logo_banaple);
    const setTitleView = (company) => {
        let returnVal = company;
        if(company === "banaple") returnVal = "바나플";
        else if(company === "banapresso") returnVal = "바나프레소 F&B";
        return returnVal;
    }
    return(
        <div className="card intro on">
            <div className="cont">
                <div className="pic"><img src={intor_pic} alt="" /></div>
                <p className="txt1">안녕하세요!<br /><strong>{setTitleView(company)}</strong>입니다. </p>
                <p className="txt2"> {startText} </p>
            </div>
            <span className="logo"><img src={logoImage} alt="logo" /></span>
            <div className="btn_area">
                <div className="inner">
                    <button type="button" className={`btn full ${btnClass} next`} onClick={handleNextStep}>다음</button>
                </div>
            </div>
        </div>
    )
}

export default StartStep;