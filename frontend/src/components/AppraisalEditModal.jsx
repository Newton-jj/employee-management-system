import { useEffect, useState } from "react";

const recommendations = [
    "Promotion Recommended",
    "Salary Review Recommended",
    "Needs Improvement",
    "Training Required"
];

function AppraisalEditModal({
    appraisal,
    employees,
    categories,
    onClose,
    onSave
}) {

    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (appraisal) {
            setFormData({
                employee_id: appraisal.employee_id,
                category_id: appraisal.category_id,
                reviewer_name: appraisal.reviewer_name,
                rating: appraisal.rating,
                comments: appraisal.comments || "",
                appraisal_date:
                appraisal.appraisal_date?.slice(0, 10),
                department: appraisal.department || "",
                recommendation_status:
                appraisal.recommendation_status
            });
        }
    }, [appraisal]);

    if (!appraisal || !formData) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(appraisal.id, formData);
    };

    return (

        <div className="modal-backdrop-custom">

            <div className="appraisal-modal">

                <div className="d-flex justify-content-between mb-3">
                    <h4>Edit Appraisal</h4>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <form
                    className="appraisal-form"
                    onSubmit={handleSubmit}
                >

                    <select
                        name="employee_id"
                        className="form-control"
                        value={formData.employee_id}
                        onChange={handleChange}
                    >
                        {employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.id}
                            >
                                {employee.full_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="category_id"
                        className="form-control"
                        value={formData.category_id}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="reviewer_name"
                        className="form-control"
                        value={formData.reviewer_name}
                        onChange={handleChange}
                    />

                    <select
                        name="rating"
                        className="form-control"
                        value={formData.rating}
                        onChange={handleChange}
                    >
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>

                    <input
                        type="date"
                        name="appraisal_date"
                        className="form-control"
                        value={formData.appraisal_date}
                        onChange={handleChange}
                    />

                    <input
                        name="department"
                        className="form-control"
                        value={formData.department}
                        onChange={handleChange}
                    />

                    <select
                        name="recommendation_status"
                        className="form-control"
                        value={formData.recommendation_status}
                        onChange={handleChange}
                    >
                        {recommendations.map((recommendation) => (
                            <option
                                key={recommendation}
                                value={recommendation}
                            >
                                {recommendation}
                            </option>
                        ))}
                    </select>

                    <textarea
                        name="comments"
                        className="form-control appraisal-comments"
                        value={formData.comments}
                        onChange={handleChange}
                    />

                    <button className="btn btn-dark">
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AppraisalEditModal;
