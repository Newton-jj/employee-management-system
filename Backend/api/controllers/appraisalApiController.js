const Appraisal =
require("../../models/appraisalModel");

const { notify } =
require("../../services/notificationService");

const getCategories = async (req, res) => {
    try {
        const categories =
        await Appraisal.getCategories();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAppraisals = async (req, res) => {
    try {
        const result =
        await Appraisal.getAppraisals(req.query);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getEmployeeHistory = async (req, res) => {
    try {
        const appraisals =
        await Appraisal.getEmployeeHistory(req.params.id);

        res.status(200).json({
            success: true,
            count: appraisals.length,
            data: appraisals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createAppraisal = async (req, res) => {
    try {
        const appraisal =
        await Appraisal.createAppraisal(req.body);

        await notify({
            type: "appraisal_created",
            title: "Appraisal Created",
            message: `${appraisal.full_name} received a ${appraisal.rating_label} appraisal.`,
            metadata: {
                appraisalId: appraisal.id,
                employeeId: appraisal.employee_id,
                rating: appraisal.rating
            }
        });

        res.status(201).json({
            success: true,
            message: "Appraisal created",
            data: appraisal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAppraisal = async (req, res) => {
    try {
        const appraisal =
        await Appraisal.updateAppraisal(
            req.params.id,
            req.body
        );

        if (!appraisal) {
            return res.status(404).json({
                success: false,
                message: "Appraisal not found"
            });
        }

        await notify({
            type: "appraisal_updated",
            title: "Appraisal Updated",
            message: `${appraisal.full_name}'s appraisal was updated.`,
            metadata: {
                appraisalId: appraisal.id,
                employeeId: appraisal.employee_id,
                rating: appraisal.rating
            }
        });

        res.status(200).json({
            success: true,
            message: "Appraisal updated",
            data: appraisal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAppraisal = async (req, res) => {
    try {
        const appraisal =
        await Appraisal.deleteAppraisal(req.params.id);

        if (!appraisal) {
            return res.status(404).json({
                success: false,
                message: "Appraisal not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appraisal deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTopPerformers = async (req, res) => {
    try {
        const performers =
        await Appraisal.getTopPerformers(req.query.limit);

        res.status(200).json({
            success: true,
            data: performers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDepartmentAnalytics = async (req, res) => {
    try {
        const analytics =
        await Appraisal.getDepartmentAnalytics();

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDashboardAnalytics = async (req, res) => {
    try {
        const analytics =
        await Appraisal.getDashboardAnalytics();

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCategories,
    getAppraisals,
    getEmployeeHistory,
    createAppraisal,
    updateAppraisal,
    deleteAppraisal,
    getTopPerformers,
    getDepartmentAnalytics,
    getDashboardAnalytics
};
