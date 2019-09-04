import React, { Component } from 'react'
import { signup } from '../auth';
import { Link } from 'react-router-dom';

class Signup extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        error: "",
        open: false
    }

    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        this.setState({ [name]: event.target.value });
    }

    clickSubmit = event => {
        event.preventDefault()
        const { name, email, password, open } = this.state;
        const user = {
            name,
            email,
            password
        };
        signup(user)
            .then(data => {
                if (data.errors) {
                    this.setState({
                        error: data.errors
                    })
                }
                else {
                    this.setState({
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        open: true
                    })
                }
            })
    }



    signupform = (name, email, password) => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
                </div>
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
        const { name, email, password, error, open } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>
                {error &&
                    error.map(err => {
                        return (
                            <div className="alert alert-danger">{err.msg}</div>
                        )
                    })
                }
                {open && <div className="alert alert-primary">Your Account has been successfully create please
                <Link to="/signin">SIGN IN</Link>
                </div>
                }
                {this.signupform(name, email, password)}
            </div>
        )
    }
}

export default Signup