import React, { Component } from 'react'
import { list } from './apiPost';
import DefaultPost from '../images/default.jpg';
import { Link } from 'react-router-dom';
// lazy loading an image for even better performance
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// import css
import './Posts.css';

class Posts extends Component {
    state = {
        posts: [],
        loading: true,
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data, loading: false })
            }
        })
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? post.postedBy._id : ""
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown"
                    return (
                        <div className="card col-md-5 p-0 m-4" key={i}>
                            <div className="card-body">
                                <LazyLoadImage
                                    alt={post.title}
                                    effect="blur"
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    className="post-image"
                                    onError={i => i.target.src = `${DefaultPost}`}
                                />
                                {/* <img
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i => i.target.src = `${DefaultPost}`}
                                    className="card-img-top"
                                    style={{ height: "18rem", objectFit: 'cover' }}
                                /> */}
                                <div className="card-body-inner">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">
                                        {post.body.substring(0, 100)}
                                    </p>

                                    {(posterName !== "Unknown") ? (
                                        <p className="font-italic mark">Posted by
                                        <Link to={`/user/${posterId}`}>{`  ${posterName}`}</Link>
                                            <p style={{ float: 'right' }}>on {new Date(post.created).toDateString()}</p>
                                        </p>
                                    ) :
                                        (
                                            <p className="font-italic mark">Posted by
                                        {`  ${posterName}`}
                                            </p>
                                        )
                                    }


                                    <Link to={`/posts/${post._id}`} className="btn btn-raised btn-primary">Read More</Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        const { posts, loading } = this.state;
        if (loading) {
            return (
                <div className="alet alert-info mt-5 d-flex pl-3" style={{ height: '5rem', alignItems: 'center' }}>
                    <h2>Loading</h2>
                </div>
            )
        } else {
            return (
                <div className="container">
                    <h2 className="mt-5 mb-5">Recent post</h2>
                    {this.renderPosts(posts)}
                </div>
            )
        }

    }
}

export default Posts;
