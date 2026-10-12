import {
    useState
}
from "react";

function EmployeeModal({
    onSave
}) {

    const [formData,
    setFormData] = useState({

        full_name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: ""
    });

    const handleChange =
    (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value
        });
    };

    const handleSubmit =
    (e) => {

        e.preventDefault();

        onSave(formData);
    };

    return (

        <div className=
        "card p-4 shadow mb-4">

            <h4 className="mb-3">
                Add Employee
            </h4>

            <form
            onSubmit={handleSubmit}>

                <div className="row">

                    <div className="col-md-6 mb-3">

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            className="form-control"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="form-control"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            className="form-control"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <input
                            type="text"
                            name="position"
                            placeholder="Position"
                            className="form-control"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            className="form-control"
                            min="0"
                            step="0.01"
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <button className=
                "btn btn-dark">

                    Save Employee

                </button>

            </form>

        </div>
    );
}

export default EmployeeModal;
