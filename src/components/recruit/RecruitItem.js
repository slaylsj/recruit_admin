import React from 'react';
import { Table, Checkbox } from 'semantic-ui-react';

const RecruitItem = (props) => {
    const { idx, data, listCheckValue, handleClickCheckBox, handleClickDetail } = props;
    const finishDay = (day) => {
        let returnVal = "";
        if(day < 0) returnVal = "접수마감";
        else if(day === 0) returnVal = "D-day";
        else returnVal = "D-" + day;
        return returnVal;
    }
    const companyNm = (company) => {
        let returnVal = "";
        if(company === 'banaple') returnVal = '바나플';
        else if(company === 'banaplefnb') returnVal = '바나플F&B';
        else if(company === 'banapresso') returnVal = '바나프레소';
        else returnVal = company;
        return returnVal;
    }
    return(
        <Table.Row>
            <Table.Cell textAlign="center"><Checkbox label="" value={data.nRecruitID} onClick={handleClickCheckBox} checked={ data.nRecruitID === listCheckValue ? true : false } /></Table.Cell>
            <Table.Cell textAlign="center">{idx}</Table.Cell>
            <Table.Cell textAlign="center">{companyNm(data.sCompany)}</Table.Cell>
            <Table.Cell textAlign="center">{data.nRecruitType === 0 ? "정시" : "상시"}</Table.Cell>
            <Table.Cell className="rec-title" onClick={() => handleClickDetail(data.nRecruitID)}><b>{data.sTitle}</b><br/> ~ {data.dtEndView}</Table.Cell>
            <Table.Cell textAlign="center">{finishDay(data.nFinishDay)}</Table.Cell>
        </Table.Row>
    );
}
export default RecruitItem;