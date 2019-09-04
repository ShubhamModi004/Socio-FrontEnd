import React, { Component } from 'react'
import { list } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';

class Users extends Component {
    state = {
        users: [],
        loading: true
    }

    componentDidMount() {
        list().then(data => {
            console.log(data);
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data, loading: false })
            }
        })
    }

    renderUsers = users => (
        <div className="row">

            {users && users.length ?
                users.map((user, i) => (
                    <div>
                        <h2 className="mt-5 mb-5">Users</h2>
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
                            </div>
                        </div>
                    </div>
                )) :
                <div className="jumbotron">
                    <h2>No Users found</h2>
                </div>
            }
        </div>

    )

    render() {
        const { users, loading } = this.state;
        if (loading) {
            return (
                <div className="jumbotron">
                    <h2>Loading</h2>
                </div>
            )
        } else {
            return (
                <div className="container">
                    {this.renderUsers(users)}
                </div>
            )
        }

    }
}

export default Users
