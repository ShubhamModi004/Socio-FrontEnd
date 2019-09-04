import React, { Component } from 'react'
import { Link, Redirect } from "react-router-dom";
import { signin } from '../auth';

import SocialLogin from "./SocialLogin";

class Signin extends Component {

    state = {
        email: "",
        password: "",
        error: "",
        redirectToReferer: false,
        loading: false
    }

    componentWillMount() {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('jwt')
            if (token) {
                this.setState({ redirectToReferer: true })
            }
        }
    }


    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        this.setState({ [name]: event.target.value });
    }


    authenticate = (jwt, next) => {
        if (typeof window !== "undefined") {
            localStorage.setItem('jwt', JSON.stringify(jwt))
            this.setState({ redirectToReferer: true })
        }
    }

    clickSubmit = event => {
        event.preventDefault()
        this.setState({ loading: true })
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        signin(user)
            .then(data => {
                if (data.errors) {
                    this.setState({
                        error: data.errors,
                        loading: false
                    })
                } else {
                    // authenticate the user
                    this.authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    })
                    // redirect
                }
            })
    }



    signinform = (email, password) => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
                </div>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            </form>
        )
    }

    render() {
        const { email, password, error, redirectToReferer, loading } = this.state;
        if (redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signin</h2>
                {error &&
                    error.map(err => {
                        return (
                            <div className="alert alert-danger">{err}</div>
                        )
                    })
                }
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading</h2>
                </div> : null}
                {this.signinform(email, password)}
                <div className="d-flex" style={{ justifyContent: 'space-around' }}>
                    <SocialLogin />
                    <p>
                        <Link to="/forgot-password" className="text-danger">
                            {" "}
                            Forgot Password
                    </Link>
                    </p>
                </div>
            </div>
        )
    }
}

export default Signin