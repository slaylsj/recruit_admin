import React from 'react';
import { Table, Checkbox, Header, Image } from 'semantic-ui-react';

const ApplyItem = (props) => {
    const { idx, data, listCheckValue, handleClickCheckBox, handleProfileModalOpen } = props;
    const companyNm = (company) => {
        let returnVal = "";
        if(company === 'banaple') returnVal = '바나플';
        else if(company === 'banaplefnb') returnVal = '바나플F&B';
        else if(company === 'banapresso') returnVal = '바나프레소';
        else returnVal = company;
        return returnVal;
    }
    const renderOrderItems = (data, listCheckValue, handleClickCheckBox) => {
        const rows = []
        rows.push(
            <Table.Row>
                <Table.Cell textAlign="center"><Checkbox label="" value={data.nSubmitID} onClick={handleClickCheckBox} checked={ data.nSubmitID === listCheckValue ? true : false } /></Table.Cell>
                <Table.Cell textAlign="center">{idx}</Table.Cell>
                <Table.Cell textAlign="center">{companyNm(data.sCompany)}</Table.Cell>
                <Table.Cell >{data.sTitle}</Table.Cell>
                {/* <Table.Cell textAlign="center">{data.sName} </Table.Cell> */}
                <Table.Cell textAlign="center">
                <Header as='h4' image>
                    {data.sProfileImageUrl !== '' ? <Image className="img-profile" src={`/${data.sProfileImageUrl}`} rounded size='mini' onClick={() => handleProfileModalOpen(data.nSubmitID)}/> : null}
                    <Header.Content>
                        {data.sName} <Header.Subheader>{data.sBirthDayYear}{data.sBirthDayYear.length > 0? '년' : ''}</Header.Subheader>
                    </Header.Content>
                </Header>
                </Table.Cell>
                <Table.Cell textAlign="center">{data.sPhone}</Table.Cell>
                {/* <Table.Cell textAlign="center">{data.sBirthDayYear}{data.sBirthDayYear.length > 0? '년' : ''}</Table.Cell> */}
                <Table.Cell textAlign="center">{data.sResumeUrl !== '' ? 'O' : 'X'} / {data.sPortfolioUrl !== '' ? 'O' : 'X'}</Table.Cell>
                <Table.Cell textAlign="center">{data.dtSubmitDate}</Table.Cell>
                <Table.Cell >{data.sMemo}</Table.Cell>
            </Table.Row>
        )
        // rows.push(
        //     <Table.Row>
        //         <Table.Cell rowSpan="2" textAlign="center"><Checkbox label="" value={data.nSubmitID} onClick={handleClickCheckBox} checked={ data.nSubmitID === listCheckValue ? true : false } /></Table.Cell>
        //         <Table.Cell rowSpan="2" textAlign="center">{idx}</Table.Cell>
        //         <Table.Cell rowSpan="2" textAlign="center">{data.sCompany === "banaple" ? "바나플" : "바나플F&B"}</Table.Cell>
        //         <Table.Cell rowSpan="2">{data.sTitle}</Table.Cell>
        //         <Table.Cell rowSpan="2" textAlign="center">{data.sName}</Table.Cell>
        //         <Table.Cell textAlign="center">{data.sPhone}</Table.Cell>
        //         <Table.Cell rowSpan="2" textAlign="center">{data.sResumeUrl !== '' ? 'O' : 'X'} / {data.sPortfolioUrl !== '' ? 'O' : 'X'}</Table.Cell>
        //         <Table.Cell rowSpan="2" textAlign="center">{data.dtSubmitDate}</Table.Cell>
        //         <Table.Cell rowSpan="2">{data.sMemo}</Table.Cell>
        //     </Table.Row>
        // )
        // rows.push(
        //     <Table.Row>
        //         <Table.Cell textAlign="center">{data.sEmail}</Table.Cell>
        //     </Table.Row>
        // )
        return rows
      }
    return(
        renderOrderItems(data, listCheckValue, handleClickCheckBox)
    );
}
export default ApplyItem;