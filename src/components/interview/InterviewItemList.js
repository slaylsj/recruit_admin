import React from 'react';
import InterviewItem from './InterviewItem';
import { Table } from 'semantic-ui-react';

const InterviewItemList = (props) => {
    const { interviewList, totalCnt, checkboxList, activePage, handleClickCheckBox, handlePreViewModalOpen } = props;
    // const totalSize = interviewList.length;
    return(
        <Table.Body>
            { 
                interviewList.map((data, idx) => { 
                    const seq = totalCnt-(idx+(activePage-1)*50)
                    return <InterviewItem idx={seq} data={data} checkboxList={checkboxList} handleClickCheckBox={handleClickCheckBox} handlePreViewModalOpen={handlePreViewModalOpen} />
                })
            }
        </Table.Body>
    );
}
export default InterviewItemList;