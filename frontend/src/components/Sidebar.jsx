import {
    Link
}
from "react-router-dom";

function Sidebar() {

    const logout = () => {

        localStorage.clear();

        window.location.href = "/";
    };

    return (

        <div className="sidebar p-3">

            <h3 className="mb-4">

                EMS ⚡

            </h3>

            <ul className=
            "nav flex-column">

                <li className="nav-item">

                    <Link
                    to="/dashboard"
                    className="nav-link">

                        📊 Dashboard

                    </Link>

                </li>

                <li className="nav-item">

                    <Link
                    to="/employees"
                    className="nav-link">

                        👥 Employees

                    </Link>

                </li>

                <li className="nav-item">

                    <Link
                    to="/attendance"
                    className="nav-link">

                        Attendance

                    </Link>

                </li>

                <li className="nav-item">

                    <Link
                    to="/appraisals"
                    className="nav-link">

                        Appraisals

                    </Link>

                </li>

                <li className="nav-item mt-4">

                    <button

                    className=
                    "btn btn-danger w-100"

                    onClick={logout}>

                        Logout

                    </button>

                </li>

            </ul>

        </div>
    );
}

export default Sidebar;
