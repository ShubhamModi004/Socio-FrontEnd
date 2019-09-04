import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';


class Profile extends Component {
    state = {
        user: { following: [], follower: [] },
        redirectToSignin: false,
        following: false,
        error: "",
        posts: ""
    }

    checkFollow = user => {
        const jwt = isAuthenticated();
        if (user.followers) {
            const match = user.followers.find(follower => {
                return follower._id === jwt.user._id
            })
            return match;
        }
    }

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let following = this.checkFollow(data);

                    this.setState({ user: data, following: following });
                }
            })
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true })
                } else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    this.loadPosts(data._id)
                }
            });
    };
    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ posts: data })
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.location.key !== this.props.location.key) {
            window.location.reload();
        }
    };

    render() {
        const { redirectToSignin, user, posts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile
        return (
            <div className="container">
                <div className="row" style={{ position: 'relative' }}>
                    <h2 className="mt-5 mb-5" style={{ width: '100%' }}>Profile</h2>
                    <div className="col-md-6">
                        <div className="">
                            <img src={photoUrl} alt={user.name} className="card-img-top" style={{ height: "25rem", objectFit: 'cover' }} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="lead mt-5">
                            <p>Hello {user.name}</p>
                            <p>Email {user.email}</p>
                            <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                        </div>
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div className="d-inline-block mt-5">
                                    <Link
                                        className="btn btn-raised btn-success mr-5"
                                        to={`/user/edit/${user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton} />)
                        }
                        <hr />

                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5">
                        <hr />
                        <p className="lead text-center">{user.about}</p>
                        <hr />
                    </div>
                </div>
                <ProfileTabs followers={user.followers} following={user.following} posts={posts} />
            </div>
        )
    }
}

export default Profile;