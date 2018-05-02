import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import withStyles from 'material-ui/styles/withStyles';
import Table, {TableRow, TableBody, TableCell, TableFooter, TablePagination} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Hidden from 'material-ui/Hidden';
import Tooltip from 'material-ui/Tooltip';

import MaterialLink from '../../../Components/MaterialLink';
import DocumentTableHeader from './DocumentTableHeader';

const styles = theme => ({
    table: {
        overflow: 'visible'
    },
    'table-responsive': {
        maxWidth: '100vw',
        overflow: 'auto'
    }
});

class DocumentTable extends React.Component {

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
        const {classes, t} = this.props;

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
                                        to={'/document/' + document._id}>{document.title || t('documentTable.unnamedDocument')}</MaterialLink></TableCell>
                                    <TableCell>
                                        <Tooltip title={(document.lastAccessed) ? moment(document.lastAccessed).format('llll') : t('documentTable.neverAccessed')}>
                                            <div>
                                                {(document.lastAccessed) ? moment(document.lastAccessed).fromNow() : t('documentTable.neverAccessed')}
                                            </div>
                                        </Tooltip>
                                    </TableCell>
                                    <Hidden xsDown>
                                        <Hidden smDown>
                                            <TableCell>
                                                <Tooltip title={moment(document.lastChange).format('llll')}>
                                                    <div>{moment(document.lastChange).fromNow()}</div>
                                                </Tooltip>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell>
                                            <Tooltip title={moment(document.createdDate).format('llll')}>
                                                <div>{moment(document.createdDate).format('L')}</div>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{document.owner}</TableCell>
                                        <Hidden smDown>
                                            <TableCell>{(document.from) ? document.from : t('documentTable.notShared')}</TableCell>
                                        </Hidden>
                                    </Hidden>
                                </TableRow>
                            );
                        })}
                        {sortedDocuments.length === 0 && <TableRow>
                            <TableCell colSpan={numOfColumns}>
                                <Typography align="center">{t('documentTable.no_documents')}</Typography>
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
                                labelDisplayedRows={(data) => t('documentTable.displayedRows', data)}
                                labelRowsPerPage={t('documentTable.rowsPerPageLabel')}
                                backIconButtonProps={{
                                    'aria-label': t('documentTable.prev_label'),
                                }}
                                nextIconButtonProps={{
                                    'aria-label': t('documentTable.next_label'),
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

DocumentTable.propTypes = {
    documents: PropTypes.array.isRequired,
};

DocumentTable.defaultProps = {
    documents: []
};

export default translate()(withStyles(styles)(DocumentTable));
