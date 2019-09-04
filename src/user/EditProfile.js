import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';

class EditProfile extends Component {

    state = {
        id: "",
        name: "",
        email: "",
        password: "",
        error: "",
        about: "",
        fileSize: 0,
        redirectToProfile: false,
        loading: false
    }
    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true })
                } else {
                    this.setState({ id: data._id, name: data.name, email: data.email, error: "", about: data.about })
                }
            })
    }
    handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        const fileSize = name === 'photo' ? event.target.files[0].size : 0

        this.userData.set(name, value)
        this.setState({ error: "" })
        this.setState({ [name]: value, fileSize: fileSize });
    }
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
                .then(data => {
                    console.log(data);
                    if (data.errors) {
                        this.setState({
                            error: data.errors
                        })
                    }
                    else {
                        updateUser(data, () => {
                            this.setState({
                                redirectToProfile: true,
                                loading: false
                            })
                        })
                    }
                })
        }
    }

    editForm = (name, email, password, about) => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Profile Pic</label>
                    <input onChange={this.handleChange("photo")} type="file" className="form-control" accept="image/*" />
                </div>

                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
                </div>
                <div className="form-group">
                    <label className="text-muted">About</label>
                    <textarea onChange={this.handleChange("about")} type="text" className="form-control" value={about} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
                </div>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
            </form>
        )
    }

    isValid = () => {
        const { name, email, password, fileSize, about } = this.state;
        if (fileSize > 500000) {
            this.setState({ error: "File size should be less than 500kb", loading: false })
            return false
        }
        //
        if (name.length === 0) {
            this.setState({ error: "Name is required", loading: false })
            return false
        }
        // email @domain.com
        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
            this.setState({ error: "Please enter a valid email", loading: false })
            return false
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG", loading: false })
            return false
        }
        return true;
    }




    render() {

        const { id, name, email, password, redirectToProfile, redirect, error, loading, about } = this.state;
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading</h2>
                </div> : null}
                <img style={{ height: "8rem" }} src={photoUrl} alt={name} class="img-thumbnail" />
                {this.editForm(name, email, password, about)}
            </div>
        )
    }
}


export default EditProfile

