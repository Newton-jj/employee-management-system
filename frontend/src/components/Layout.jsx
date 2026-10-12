import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

function Layout({

    children,

    darkMode,

    setDarkMode

}) {

    return (

        <div className="d-flex">

            <Sidebar />

            <div className="flex-grow-1">

                <Topbar

                    darkMode={darkMode}

                    setDarkMode={
                        setDarkMode
                    }

                />

                <div className="p-4">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default Layout;