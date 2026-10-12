import NotificationBell from "./NotificationBell";

function Topbar({

    darkMode = false,

    setDarkMode = () => {}

}) {

    const storedUser =
    localStorage.getItem("user");

    const user =
    storedUser
    ? JSON.parse(storedUser)
    : null;

    return (

        <div className="topbar shadow-sm p-3 d-flex justify-content-between align-items-center">

            <h4>
                Employee Management System
            </h4>

            <div className=
            "d-flex align-items-center gap-3">

                <NotificationBell />

                <button

                className="btn btn-dark"

                onClick={()=>
                setDarkMode((currentMode)=>
                    !currentMode
                )}>

                    {

                    darkMode
                    ? "Light"
                    : "Dark"

                    }

                </button>

                <div>

                    Welcome,

                    <strong>
                        {" "}
                        {user?.username || "Admin"}
                    </strong>

                </div>

            </div>

        </div>
    );
}

export default Topbar;
