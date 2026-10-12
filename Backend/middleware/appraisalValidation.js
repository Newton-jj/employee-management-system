const allowedRecommendations = [
    "Promotion Recommended",
    "Salary Review Recommended",
    "Needs Improvement",
    "Training Required"
];

const validateAppraisal = (req, res, next) => {
    const {
        employee_id,
        reviewer_name,
        rating,
        category_id,
        appraisal_date,
        recommendation_status
    } = req.body;

    const errors = [];

    if (!employee_id) {
        errors.push("Employee is required");
    }

    if (!reviewer_name || reviewer_name.trim().length < 2) {
        errors.push("Reviewer name is required");
    }

    if (!category_id) {
        errors.push("Performance category is required");
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        errors.push("Rating must be an integer from 1 to 5");
    }

    if (!appraisal_date) {
        errors.push("Appraisal date is required");
    }

    if (!allowedRecommendations.includes(recommendation_status)) {
        errors.push("Recommendation status is invalid");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

module.exports = {
    allowedRecommendations,
    validateAppraisal
};
