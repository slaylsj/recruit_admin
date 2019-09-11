import React from 'react';
import QnaItem from './QnaItem';
import { Table } from 'semantic-ui-react';

const ItemList = (props) => {
    const { qnaList, listCheckValue, handleClickCheckBox } = props;
    const totalSize = qnaList.length;
    return(
        <Table.Body>
            { 
                qnaList.map((data, idx) => { 
                    return <QnaItem idx={totalSize-idx} data={data} listCheckValue={listCheckValue} handleClickCheckBox={handleClickCheckBox}/> 
                })
            }
        </Table.Body>
    );
}
export default ItemList;