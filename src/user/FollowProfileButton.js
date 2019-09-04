import React, { Component } from 'react'
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow)
    };
    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }
    render() {
        const { following } = this.props;
        return (
            <div className="d-inline-block nt-5">
                {
                    !this.props.following ?
                        (
                            <button onClick={this.followClick} className="btn btn-success btn-raised mr-5">
                                Follow
                            </button>
                        ) :
                        (
                            <button onClick={this.unfollowClick} className="btn btn-danger btn-raised mr-5">
                                Unfollow
                            </button>
                        )
                }
            </div>
        )
    }
}

export default FollowProfileButton
