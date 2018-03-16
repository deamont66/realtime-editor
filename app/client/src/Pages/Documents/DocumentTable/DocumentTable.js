import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

import withStyles from 'material-ui/styles/withStyles';
import Table, {TableRow, TableBody, TableCell, TableFooter, TablePagination} from 'material-ui/Table';
import Typography from "material-ui/Typography";
import Hidden from "material-ui/Hidden";

import MaterialLink from "../../../Components/MaterialLink";
import DocumentTableHeader from "./DocumentTableHeader";

const styles = theme => ({
    table: {
        overflow: 'visible'
    },
    'table-responsive': {
        maxWidth: '100vw',
        overflow: 'auto'
    }
});

class DocumentList extends React.Component {

    constructor() {
        super();

        this.state = {
            order: 'desc',
            orderBy: 'lastAccessed',
            rowsPerPage: 10,
            page: 0
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    render() {
        const {classes} = this.props;

        const sortedDocuments =
            this.state.order === 'desc'
                ? this.props.documents.sort((a, b) => (b[this.state.orderBy] < a[this.state.orderBy] ? -1 : 1))
                : this.props.documents.sort((a, b) => (a[this.state.orderBy] < b[this.state.orderBy] ? -1 : 1));

        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, Math.max(sortedDocuments.length, 1) - this.state.page * this.state.rowsPerPage);
        const numOfColumns = 6;
        return (
            <div className={classes['table-responsive']}>
                <Table className={classes.table}>
                    <DocumentTableHeader order={this.state.order} orderBy={this.state.orderBy}
                                         onRequestSort={this.handleRequestSort}/>
                    <TableBody>
                        {sortedDocuments.map(document => {
                            return (
                                <TableRow key={document._id}>
                                    <TableCell><MaterialLink
                                        to={'/document/' + document._id}>{document.title}</MaterialLink></TableCell>
                                    <TableCell>{moment(document.lastAccessed).fromNow()}</TableCell>
                                    <Hidden xsDown>
                                        <Hidden smDown>
                                            <TableCell>{moment(document.lastChange).fromNow()}</TableCell>
                                        </Hidden>
                                        <TableCell>{moment(document.createdDate).format('L')}</TableCell>
                                        <TableCell>{document.owner && document.owner.username}</TableCell>
                                        <Hidden smDown>
                                            <TableCell>{document.from && document.from.username}</TableCell>
                                        </Hidden>
                                    </Hidden>
                                </TableRow>
                            );
                        })}
                        {sortedDocuments.length === 0 && <TableRow>
                            <TableCell colSpan={numOfColumns}>
                                <Typography align="center">There are no documents</Typography>

                            </TableCell>
                        </TableRow>}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 49 * emptyRows}}>
                                <TableCell colSpan={numOfColumns}/>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={numOfColumns}
                                count={this.props.documents.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                backIconButtonProps={{
                                    'aria-label': 'Previous Page',
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'Next Page',
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

DocumentList.propTypes = {
    documents: PropTypes.array.isRequired,
};

DocumentList.defaultProps = {
    documents: []
};

export default withStyles(styles)(DocumentList);
