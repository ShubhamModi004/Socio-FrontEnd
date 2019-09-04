import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class ProfileTabs extends Component {
    render() {
        const { following, followers, posts } = this.props
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        {followers ? (
                            <div>
                                <h3 className="text-primary">Followers</h3>
                                <hr />
                            </div>
                        ) : (
                                <div className="col-md-4">
                                    <h3>Loading</h3>
                                </div>
                            )
                        }
                        {followers && followers.map((person, i) => (
                            <div key={i} >
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <div className="row" style={{ height: '2rem', marginBottom: '1.2rem' }}>
                                            <div className="col-md-2" style={{ height: '3rem', width: '3rem' }}>
                                                <img className="img-circle" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} />
                                            </div>
                                            <div className="col-md-10 d-flex" style={{ alignItems: 'flex-end' }}>
                                                <p>{person.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="col-md-4">
                        {following ? (
                            <div>
                                <h3 className="text-primary">Following</h3>
                                <hr />
                            </div>
                        ) : (
                                <div className="col-md-4">
                                    <h3>Loading</h3>
                                </div>
                            )
                        }
                        {following && following.map((person, i) => (
                            <div key={i} >
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <div className="row" style={{ height: '2rem', marginBottom: '1.2rem' }}>
                                            <div className="col-md-2" style={{ height: '3rem', width: '3rem' }}>
                                                <img className="img-circle" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} />
                                            </div>
                                            <div className="col-md-10 d-flex" style={{ alignItems: 'flex-end' }}>
                                                <p>{person.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        {posts ? (
                            <div>
                                <h3 className="text-primary">Posts</h3>
                                <hr />
                            </div>
                        ) : (
                                <div className="col-md-4">
                                    <h3>Loading</h3>
                                </div>
                            )
                        }
                        {posts && posts.map((post, i) => (
                            <div key={i} >
                                <div>
                                    <Link to={`/posts/${post._id}`}>
                                        <div className="row" style={{ height: '2rem', marginBottom: '1.2rem' }}>
                                            <div className="col-md-10 d-flex" style={{ alignItems: 'flex-end' }}>
                                                <h6>{post.title}</h6>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}


export default ProfileTabs;