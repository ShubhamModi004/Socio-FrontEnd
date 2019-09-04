import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuthenticated } from '../auth'

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900' }
    else return { color: "#ffffff" }
};



const Menu = ({ history }) => {
    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className="nav-link" to="/" style={isActive(history, "/")}>HOME</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/users" style={isActive(history, "/users")}>Users</Link>
                </li>
                {isAuthenticated() &&
                    <Fragment>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/findpeople`} style={isActive(history, `/findpeople`)}>Find People</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/post/create`} style={isActive(history, `/post/create`)}>Create Post</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)}>{`${isAuthenticated().user.name}'s profile`}</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => signout(() => history.push('/'))} style={(isActive(history, "/signout"), { cursor: "pointer", color: "#fff" })}>SIGN OUT</a>
                        </li>


                    </Fragment>
                }
                {!isAuthenticated() &&
                    (<Fragment>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signin" style={isActive(history, "/signin")}>SIGN IN</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" style={isActive(history, "/signup")}>SIGN UP</Link>
                        </li>
                    </Fragment>
                    )}
            </ul>
        </div>
    )
}


export default withRouter(Menu)
