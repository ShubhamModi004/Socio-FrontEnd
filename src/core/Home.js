import React from 'react'
import Posts from '../post/Posts';

const Home = props => {
    return (
        <div>
            <div className="jumbotron">
                <h2>Welcome to our FrontEnd</h2>
            </div>
            <div className="container">
                <Posts />
            </div>
        </div>
    )
}

export default Home
