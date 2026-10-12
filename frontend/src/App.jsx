import {
    BrowserRouter,
    Routes,
    Route
}
from "react-router-dom";

import {
    useState
}
from "react";

import Dashboard
from "./pages/dashboard";

import Employees
from "./pages/Employees";

import Attendance
from "./pages/Attendance";

import Appraisals
from "./pages/Appraisals";

import EmployeePerformance
from "./pages/EmployeePerformance";

import Login
from "./pages/login";

import ProtectedRoute
from "./components/ProtectedRoute";

function App() {

    const [darkMode,
    setDarkMode] = useState(false);

    return (

        <div className={
            darkMode
            ? "dark-mode"
            : ""
        }>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/"
                        element={<Login />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>

                                <Dashboard
                                    darkMode={darkMode}
                                    setDarkMode={
                                        setDarkMode
                                    }
                                />

                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employees"
                        element={
                            <ProtectedRoute>

                                <Employees
                                    darkMode={darkMode}
                                    setDarkMode={
                                        setDarkMode
                                    }
                                />

                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/attendance"
                        element={
                            <ProtectedRoute>

                                <Attendance
                                    darkMode={darkMode}
                                    setDarkMode={
                                        setDarkMode
                                    }
                                />

                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appraisals"
                        element={
                            <ProtectedRoute>

                                <Appraisals
                                    darkMode={darkMode}
                                    setDarkMode={
                                        setDarkMode
                                    }
                                />

                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appraisals/employee/:id"
                        element={
                            <ProtectedRoute>

                                <EmployeePerformance
                                    darkMode={darkMode}
                                    setDarkMode={
                                        setDarkMode
                                    }
                                />

                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </BrowserRouter>

        </div>
    );
}

export default App;
