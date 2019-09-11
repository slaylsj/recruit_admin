import React from 'react';
import { Table, Checkbox } from 'semantic-ui-react';

const ItemList = (props) => {
    const { idx, data, listCheckValue, handleClickCheckBox } = props;
    return(
        <Table.Row>
            <Table.Cell textAlign="center"><Checkbox label="" value={data.nSeq} onClick={handleClickCheckBox} checked={ data.nSeq === listCheckValue ? true : false } /></Table.Cell>
            <Table.Cell textAlign="center">{idx}</Table.Cell>
            <Table.Cell><pre className="qna-list-item">{data.sQuestion}</pre></Table.Cell>
            <Table.Cell><pre className="qna-list-item">{data.sAnswer}</pre></Table.Cell>
        </Table.Row>
    );
}
export default ItemList;