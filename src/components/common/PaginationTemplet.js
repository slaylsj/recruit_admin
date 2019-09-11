import React from 'react';
import { Pagination } from 'semantic-ui-react';

class PaginationTemplet extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activePage: 1,
            boundaryRange: 1,
            siblingRange: 3,
            showEllipsis: true,
            firstItem: false, 
            lastItem: false, 
            prevItem: true, 
            nextItem: true
        }
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({...this.state, activePage : activePage });
        this.props.handlePaginationChange(activePage);
    }
    
    render(){
        const { activePage, boundaryRange, siblingRange, showEllipsis, firstItem, lastItem, prevItem, nextItem } = this.state;
        const { totalCnt, pageInfo } = this.props;
        const totalPages = Math.ceil(totalCnt/pageInfo.pageRow);
        return(
            <Pagination 
                activePage={activePage}
                boundaryRange={boundaryRange}
                ellipsisItem={showEllipsis}
                firstItem={firstItem ? undefined : null}
                lastItem={lastItem ? undefined : null}
                prevItem={prevItem ? undefined : null}
                nextItem={nextItem ? undefined : null}
                siblingRange={siblingRange}
                totalPages={totalPages}
                onPageChange={this.handlePaginationChange}
            />
        );
    }
}

export default PaginationTemplet;