import React from 'react';
import ApplyItem from './ApplyItem';
import { Table } from 'semantic-ui-react';

const ApplyItemList = (props) => {
    const { applyList, totalCnt, activePage, listCheckValue, handleClickCheckBox, handleProfileModalOpen } = props;
    // const totalSize = applyList.length;
    return(
        <Table.Body>
            { 
                applyList.map((data, idx) => { 
                    const seq = totalCnt-(idx+(activePage-1)*10)
                    return <ApplyItem idx={seq} data={data} listCheckValue={listCheckValue} handleClickCheckBox={handleClickCheckBox} handleProfileModalOpen={handleProfileModalOpen} />
                })
            }
        </Table.Body>
    );
}
export default ApplyItemList;