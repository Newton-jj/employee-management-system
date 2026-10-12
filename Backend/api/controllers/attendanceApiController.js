const Attendance =
require("../../models/attendanceModel");

const { notify } =
require("../../services/notificationService");

const getAttendance = async (req, res) => {
    try {
        const records =
        await Attendance.getAttendance(req.query);

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const markAttendance = async (req, res) => {
    try {
        const record =
        await Attendance.markAttendance(req.body);

        await notify({
            type: "attendance_marked",
            title: "Attendance Marked",
            message: `${record.full_name} marked as ${record.status}.`,
            metadata: {
                employeeId: record.employee_id,
                attendanceId: record.id,
                date: record.attendance_date,
                status: record.status
            }
        });

        res.status(201).json({
            success: true,
            message: "Attendance marked",
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const record =
        await Attendance.updateAttendance({
            id: req.params.id,
            status: req.body.status,
            notes: req.body.notes
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }

        await notify({
            type: "attendance_updated",
            title: "Attendance Updated",
            message: `${record.full_name} is now marked as ${record.status}.`,
            metadata: {
                employeeId: record.employee_id,
                attendanceId: record.id,
                date: record.attendance_date,
                status: record.status
            }
        });

        res.status(200).json({
            success: true,
            message: "Attendance updated",
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAttendance = async (req, res) => {
    try {
        const record =
        await Attendance.deleteAttendance(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance deleted"
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
        const records =
        await Attendance.getEmployeeHistory(req.params.id);

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const analytics =
        await Attendance.getAnalytics(req.query);

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
    getAttendance,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    getEmployeeHistory,
    getAnalytics
};
