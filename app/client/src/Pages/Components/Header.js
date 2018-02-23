import React from 'react';
import PropTypes from 'prop-types';
import {NavLink, Link} from 'react-router-dom';
import UserStore from "../../Stores/UserStore";

class Header extends React.Component {

    render() {
        return (
            <div className="Comp-Header header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Home</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link" exact to="/document">My documents</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" exact to="/document/shared">Shared documents</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" exact to="/document/history">Last documents</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="form-inline">
                            {this.props.user !== null && <div className="navbar-nav dropdown">
                                <button type="button" className="nav-item btn btn-info btn-sm dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                    {this.props.user.username}
                                </button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item disabled">Settings</a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#logout" onClick={() => UserStore.logOut()}>Logout</a>
                                </div>
                            </div>}
                            {this.props.user === null &&
                            <NavLink to={'/sign-in'} className={'btn btn-info btn-sm'}>Sign In</NavLink>}
                        </div>
                        <div className="btn-group navbar-nav">

                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

Header.propTypes = {
    user: PropTypes.object,
};

Header.defaultProps = {
    user: null
};

export default Header;
