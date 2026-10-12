import { useState }
from "react";

import { useNavigate }
from "react-router-dom";

import { loginUser }
from "../services/authService";

function Login() {

    const navigate =
    useNavigate();

    const [email,
    setEmail] = useState("");

    const [password,
    setPassword] = useState("");

    const [error,
    setError] = useState("");

    const handleLogin =
    async (e) => {

        e.preventDefault();

        try {

            const data =
            await loginUser(
                email,
                password
            );

            // Save token
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                "Invalid credentials"
            );
        }
    };

    return (

        <div className="container">

            <div className="row vh-100
                            justify-content-center
                            align-items-center">

                <div className="col-md-4">

                    <div className="card shadow p-4">

                        <h2 className="mb-4 text-center">
                            EMS Login
                        </h2>

                        {error && (

                            <div className=
                            "alert alert-danger">

                                {error}

                            </div>
                        )}

                        <form
                        onSubmit={handleLogin}>

                            <div className="mb-3">

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e)=>
                                    setEmail(
                                    e.target.value
                                    )}
                                />

                            </div>

                            <div className="mb-3">

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e)=>
                                    setPassword(
                                    e.target.value
                                    )}
                                />

                            </div>

                            <button
                            className=
                            "btn btn-dark w-100">

                                Login

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;