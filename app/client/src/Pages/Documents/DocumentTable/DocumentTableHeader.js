import React from 'react';
import PropTypes from 'prop-types';

import {TableHead, TableRow, TableCell, TableSortLabel} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Hidden from "material-ui/Hidden";

const columnData = [
    {id: 'title', numeric: false, disablePadding: false, label: 'Title'},
    {id: 'lastAccessed', numeric: false, disablePadding: false, label: 'Last accessed'},
    {id: 'lastChange', numeric: false, disablePadding: false, label: 'Last changed'},
    {id: 'createdDate', numeric: false, disablePadding: false, label: 'Created'},
    {id: 'owner', numeric: false, disablePadding: false, label: 'Owner'},
    {id: 'from', numeric: false, disablePadding: false, label: 'Shared by'},
];

class DocumentTableHeader extends React.Component {

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {order, orderBy} = this.props;

        return (
            <TableHead>
                <TableRow>
                    {columnData.map((column, index) => {
                        return (
                            <Hidden xsDown={index > 1} smDown={[2, 5].includes(index)} key={column.id}>
                                <TableCell
                                    numeric={column.numeric}
                                    padding={column.disablePadding ? 'none' : 'default'}
                                    sortDirection={orderBy === column.id ? order : false}
                                    style={{whiteSpace: 'nowrap'}}
                                >
                                    <Tooltip
                                        title="Sort"
                                        placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={order}
                                            onClick={this.createSortHandler(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                            </Hidden>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

DocumentTableHeader.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default DocumentTableHeader;
