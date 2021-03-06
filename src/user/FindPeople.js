import React, { Component } from 'react'
import { findPeople } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { follow, unfollow } from "./apiUser";

class FindPeople extends Component {
    state = {
        users: [],
        loading: true,
        open: false,
        followMessage: '',
    }


    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token;
        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users
                    toFollow.splice(i, 1)
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`
                    })
                }
            })
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data, loading: false })
            }
        })
    }

    renderUsers = users => (
        <div className="row">
            {users.map((user, i) => (
                <div className="card col-md-5 p-0 m-4" key={i}>
                    <img
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        alt={user.name}
                        className="card-img-top"
                        style={{ height: "18rem", objectFit: 'cover' }}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                    <div className="card-body-inner">
                        <h5 className="card-title">{user.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
                        <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary">View Profile</Link>
                        <button onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-info float-right btn-sm">
                            Follow
                        </button>
                    </div>
                </div>
            ))}
        </div>

    )

    render() {
        const { users, loading, open, followMessage } = this.state;
        if (loading) {
            return (
                <div className="jumbotron">
                    <h2>Loading</h2>
                </div>
            )
        } else {
            return (
                <div className="container">
                    <h2 className="mt-5 mb-5">Find People</h2>
                    <div>
                        {open && (
                            <div className="alert alert-success">
                                {followMessage}
                            </div>
                        )}
                    </div>
                    {this.renderUsers(users)}
                </div>
            )
        }

    }
}

export default FindPeople
