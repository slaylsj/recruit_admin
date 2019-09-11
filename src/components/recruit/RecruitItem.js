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
    return(
        <Table.Row>
            <Table.Cell textAlign="center"><Checkbox label="" value={data.nRecruitID} onClick={handleClickCheckBox} checked={ data.nRecruitID === listCheckValue ? true : false } /></Table.Cell>
            <Table.Cell textAlign="center">{idx}</Table.Cell>
            <Table.Cell textAlign="center">{data.sCompany === "banaple" ? "바나플" : "바나플F&B"}</Table.Cell>
            <Table.Cell textAlign="center">{data.nRecruitType === 0 ? "정시" : "상시"}</Table.Cell>
            <Table.Cell className="rec-title" onClick={() => handleClickDetail(data.nRecruitID)}><b>{data.sTitle}</b><br/> ~ {data.dtEndView}</Table.Cell>
            <Table.Cell textAlign="center">{finishDay(data.nFinishDay)}</Table.Cell>
        </Table.Row>
    );
}
export default RecruitItem;