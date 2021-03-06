import React from 'react';
import RecruitItem from './RecruitItem';
import { Table } from 'semantic-ui-react';

const RecruitItemList = (props) => {
    const { recruitList, listCheckValue, handleClickCheckBox, handleClickDetail, handleCopyUrl } = props;
    const totalSize = recruitList.length;
    return(
        <Table.Body>
            { 
                recruitList.map((data, idx) => { 
                    return <RecruitItem idx={totalSize-idx} data={data} listCheckValue={listCheckValue} handleClickCheckBox={handleClickCheckBox} handleClickDetail={handleClickDetail} handleCopyUrl={handleCopyUrl}/> 
                })
            }
        </Table.Body>
    );
}
export default RecruitItemList;