import React from 'react';
import { Table, Checkbox, Header, Image } from 'semantic-ui-react';
import img_noprofile from '../../common/image/img_noprofile.png';

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
        const getSexType = (type) => {
            if(type === 0) return '(남)'
            else if(type === 1) return '(여)'
            else return ''
        }
        rows.push(
            <Table.Row>
                <Table.Cell textAlign="center"><Checkbox label="" value={data.nSubmitID} onClick={handleClickCheckBox} checked={ data.nSubmitID === listCheckValue ? true : false } /></Table.Cell>
                <Table.Cell textAlign="center">{idx}</Table.Cell>
                <Table.Cell textAlign="center">{companyNm(data.sCompany)}</Table.Cell>
                <Table.Cell >{data.sTitle}</Table.Cell>
                <Table.Cell >[모집분야] {data.sPartList}<br/>[지원분야] {data.sSubmitPartList}</Table.Cell>
                {/* <Table.Cell textAlign="center">{data.sName} </Table.Cell> */}
                <Table.Cell className="cursor-pointer" textAlign="center" onClick={() => handleProfileModalOpen(data.nSubmitID)}>
                <Header as='h4' image>
                    {data.sProfileImageUrl !== '' ? <Image src={`/${data.sProfileImageUrl}`} rounded size='mini' /> : <Image src={img_noprofile} rounded size='mini' />}
                    <Header.Content>
                        {data.sName} 
                        <Header.Subheader>{data.sBirthDayYear}{data.sBirthDayYear.length > 0? '년' : ''} {getSexType(data.nSexType)}</Header.Subheader>
                    </Header.Content>
                </Header>
                </Table.Cell>
                <Table.Cell textAlign="center">{data.sPhone}</Table.Cell>
                {/* <Table.Cell textAlign="center">{data.sBirthDayYear}{data.sBirthDayYear.length > 0? '년' : ''}</Table.Cell> */}
                <Table.Cell textAlign="center" className="list-col">{data.sResumeUrl !== '' ? <span className="on">O</span> : <span className="off">X</span>} / {data.sPortfolioUrl !== '' ? <span className="on1">O</span> : <span className="off">X</span>}</Table.Cell>
                <Table.Cell textAlign="center">{data.dtSubmitDate}</Table.Cell>
                <Table.Cell className="cursor-pointer white-space-pre" onClick={() => handleProfileModalOpen(data.nSubmitID)}>{data.sMemo}</Table.Cell>
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