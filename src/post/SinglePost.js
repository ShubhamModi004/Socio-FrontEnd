import React, { Component, Fragment } from 'react'
import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth'
import Comment from './Comment';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

class SinglePost extends Component {
    state = {
        post: "",
        loading: true,
        deleted: false,
        redirectToHome: false,
        like: false,
        likes: 0,
        redirectToSignin: false,
        comments: []
    }
    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ post: data, loading: false, likes: data.likes.length, like: this.checkLike(data.likes), comments: data.comments })
            }
        })
    }
    updateComments = comments => {
        this.setState({ comments });
    };

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match;
    }
    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token
        let answer = window.confirm(
            "Are you sure you want to delete the post"
        )
        if (answer) {
            remove(postId, token).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ deleted: true, redirectToHome: true })
                }
            })
        }

    }
    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({
                redirectToSignin: true
            })
        }
        let callApi = this.state.like ? unlike : like
        const userId = isAuthenticated && isAuthenticated().user._id
        const postId = this.state.post._id
        const token = isAuthenticated().token

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        })
    }


    renderPost = (post) => {
        const { likes, like } = this.state;
        const posterId = post.postedBy
            ? `/user/${post.postedBy._id}`
            : "";
        const posterName = post.postedBy
            ? post.postedBy.name
            : " Unknown";
        return (
            <div className="card p-0 m-4">
                <div className="card-body">
                    <LazyLoadImage
                        alt={post.title}
                        effect="blur"
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        className="post-image"
                    />
                    <div className="card-body-inner">
                        <h5 className="card-title">{post.title}</h5>

                        {like ?
                            (
                                <h3 onClick={this.likeToggle}>
                                    <i className="fa fa-thumbs-up text-success   bg-dark" style={{ padding: '10px', borderRadius: '50%' }} />{' '}{likes} Likes
                            </h3>
                            ) :
                            (
                                <h3 onClick={this.likeToggle}>
                                    <i className="fa fa-thumbs-up text-warning   bg-dark" style={{ padding: '10px', borderRadius: '50%' }} />{' '}{likes} Likes
                                </h3>
                            )
                        }

                        <p className="card-text">
                            {post.body}
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

                        <div className="d-inline-block">
                            <Link to={`/`} className="btn btn-raised btn-primary mr-5">Back to Home</Link>
                            {isAuthenticated().user &&
                                isAuthenticated().user._id === post.postedBy._id && (
                                    <Fragment>
                                        <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5">Update Post</Link>
                                        <button onClick={() => this.deletePost()} className="btn btn-raised btn-danger">DELETE POST</button>
                                    </Fragment>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { post, loading, redirectToHome, redirectToSignin, comments } = this.state;
        if (redirectToHome) {
            return (
                <Redirect to={`/`} />
            )
        }
        if (redirectToSignin) {
            return (
                <Redirect to={`/signin`} />
            )
        }
        if (loading) {
            return (
                <div className="jumbotron">
                    <h2>Loading</h2>
                </div>
            )
        } else {
            return (
                <div className="container mt-5 mb-3">
                    <h3 className="display-2">{post.title}</h3>
                    {this.renderPost(post)}
                    <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
                </div>
            )
        }
    }
}

export default SinglePost;
