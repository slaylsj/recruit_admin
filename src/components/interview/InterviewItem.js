import React from 'react';
import { Table, Checkbox } from 'semantic-ui-react';

const InterviewItem = (props) => {
    const { idx, data, checkboxList, handleClickCheckBox, handlePreViewModalOpen } = props;
    const companyNm = (company) => {
        let returnVal = "";
        if(company === 'banaple') returnVal = '바나플';
        else if(company === 'banapresso') returnVal = '바나프레소';
        else returnVal = company;
        return returnVal;
    }
    const renderOrderItems = (data, handleClickCheckBox) => {
        const rows = []
        rows.push(
            <Table.Row>
                <Table.Cell textAlign="center"><Checkbox label="" value={data.nSurveyID} onClick={handleClickCheckBox} checked={checkboxList.filter(val => val === data.nSurveyID).length > 0 ? true : false}/></Table.Cell>
                <Table.Cell textAlign="center">{idx}</Table.Cell>
                <Table.Cell textAlign="center">{companyNm(data.sCompany)}</Table.Cell>
                <Table.Cell className=""><a href onClick={() => handlePreViewModalOpen(data.nSurveyID)}>{data.sTitle}</a></Table.Cell>
                <Table.Cell textAlign="center">{data.dtCreateDate}</Table.Cell>
                <Table.Cell textAlign="center">{data.sCreateLoginID}</Table.Cell>
                <Table.Cell textAlign="center">{data.nStepCnt}개</Table.Cell>
            </Table.Row>
        )
        return rows
      }
    return(
        renderOrderItems(data, handleClickCheckBox)
    );
}
export default InterviewItem;