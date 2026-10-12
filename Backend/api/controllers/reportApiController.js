const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const Employee = require("../../models/employeeModel");

const reportDate = () => new Date().toISOString().slice(0, 10);

const money = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

const employeeRows = (employees) =>
    employees.map((employee) => ({
        fullName: employee.full_name || "N/A",
        email: employee.email || "N/A",
        department: employee.department || "Unassigned",
        position: employee.position || "N/A",
        salary: Number(employee.salary || 0)
    }));

const setDownloadHeaders = (res, type, filename) => {
    res.setHeader("Content-Type", type);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
    );
};

const addPdfHeader = (doc, title, subtitle) => {
    doc
        .fontSize(20)
        .fillColor("#111827")
        .text("Employee Management System", { align: "center" });

    doc
        .moveDown(0.3)
        .fontSize(14)
        .fillColor("#374151")
        .text(title, { align: "center" });

    doc
        .moveDown(0.2)
        .fontSize(9)
        .fillColor("#6b7280")
        .text(subtitle, { align: "center" });

    doc
        .moveDown()
        .strokeColor("#d1d5db")
        .lineWidth(1)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown();
};

const ensurePdfSpace = (doc, nextRowHeight = 24) => {
    const bottom = doc.page.height - doc.page.margins.bottom;

    if (doc.y + nextRowHeight > bottom) {
        doc.addPage();
    }
};

const drawEmployeeTableHeader = (doc, columns) => {
    const startY = doc.y;

    doc
        .rect(doc.page.margins.left, startY - 4, 690, 22)
        .fill("#111827");

    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");

    columns.forEach((column) => {
        doc.text(column.label, column.x, startY, {
            width: column.width
        });
    });

    doc
        .font("Helvetica")
        .fillColor("#111827")
        .moveDown(0.8);
};

const exportEmployeesPdf = async (req, res) => {
    try {
        const employees = employeeRows(
            await Employee.getAllEmployees()
        );

        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 40
        });

        setDownloadHeaders(
            res,
            "application/pdf",
            `employee-report-${reportDate()}.pdf`
        );

        doc.pipe(res);

        addPdfHeader(
            doc,
            "Employee Details Report",
            `Generated on ${new Date().toLocaleString()}`
        );

        const columns = [
            { label: "Full Name", x: 40, width: 135 },
            { label: "Email", x: 180, width: 175 },
            { label: "Department", x: 360, width: 110 },
            { label: "Position", x: 475, width: 115 },
            { label: "Salary", x: 595, width: 100 }
        ];

        drawEmployeeTableHeader(doc, columns);

        employees.forEach((employee, index) => {
            ensurePdfSpace(doc);

            const y = doc.y;

            if (index % 2 === 0) {
                doc
                    .rect(40, y - 4, 690, 22)
                    .fill("#f9fafb");
            }

            doc.fillColor("#111827").fontSize(8);

            doc.text(employee.fullName, 40, y, { width: 135 });
            doc.text(employee.email, 180, y, { width: 175 });
            doc.text(employee.department, 360, y, { width: 110 });
            doc.text(employee.position, 475, y, { width: 115 });
            doc.text(money(employee.salary), 595, y, { width: 100 });
            doc.moveDown(0.8);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const exportEmployeesExcel = async (req, res) => {
    try {
        const employees = employeeRows(
            await Employee.getAllEmployees()
        );

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Employee Management System";
        workbook.created = new Date();

        const sheet = workbook.addWorksheet("Employee Report", {
            views: [{ state: "frozen", ySplit: 3 }]
        });

        sheet.mergeCells("A1:E1");
        sheet.getCell("A1").value = "Employee Management System";
        sheet.getCell("A1").font = {
            bold: true,
            size: 18,
            color: { argb: "FFFFFFFF" }
        };
        sheet.getCell("A1").alignment = { horizontal: "center" };
        sheet.getCell("A1").fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF111827" }
        };

        sheet.mergeCells("A2:E2");
        sheet.getCell("A2").value =
        `Employee Details Report - Generated ${new Date().toLocaleString()}`;
        sheet.getCell("A2").alignment = { horizontal: "center" };

        sheet.addRow([]);

        const headerRow = sheet.addRow([
            "Full Name",
            "Email",
            "Department",
            "Position",
            "Salary"
        ]);

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF2563EB" }
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        employees.forEach((employee) => {
            sheet.addRow([
                employee.fullName,
                employee.email,
                employee.department,
                employee.position,
                employee.salary
            ]);
        });

        sheet.getColumn(1).width = 28;
        sheet.getColumn(2).width = 34;
        sheet.getColumn(3).width = 22;
        sheet.getColumn(4).width = 22;
        sheet.getColumn(5).width = 16;
        sheet.getColumn(5).numFmt = "$#,##0.00";

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 4) {
                row.eachCell((cell) => {
                    cell.border = {
                        bottom: { style: "hair" }
                    };
                });
            }
        });

        setDownloadHeaders(
            res,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            `employee-report-${reportDate()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const exportPayrollPdf = async (req, res) => {
    try {
        const employees = employeeRows(
            await Employee.getAllEmployees()
        );

        const totalPayroll = employees.reduce(
            (sum, employee) => sum + employee.salary,
            0
        );

        const departmentSummary = employees.reduce((summary, employee) => {
            if (!summary[employee.department]) {
                summary[employee.department] = {
                    count: 0,
                    payroll: 0
                };
            }

            summary[employee.department].count += 1;
            summary[employee.department].payroll += employee.salary;

            return summary;
        }, {});

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        setDownloadHeaders(
            res,
            "application/pdf",
            `payroll-summary-${reportDate()}.pdf`
        );

        doc.pipe(res);

        addPdfHeader(
            doc,
            "Printable Payroll Summary",
            `Generated on ${new Date().toLocaleString()}`
        );

        doc
            .fontSize(12)
            .fillColor("#111827")
            .font("Helvetica-Bold")
            .text("Summary");

        doc.moveDown(0.5).font("Helvetica").fontSize(10);
        doc.text(`Total Employees: ${employees.length}`);
        doc.text(`Total Payroll: ${money(totalPayroll)}`);
        doc.text(
            `Average Salary: ${
                employees.length
                ? money(totalPayroll / employees.length)
                : money(0)
            }`
        );

        doc.moveDown();
        doc.font("Helvetica-Bold").text("Payroll by Department");
        doc.moveDown(0.5);

        Object.entries(departmentSummary).forEach(([department, summary]) => {
            ensurePdfSpace(doc);

            doc
                .font("Helvetica")
                .fontSize(10)
                .text(
                    `${department}: ${summary.count} employees - ${money(summary.payroll)}`
                );
        });

        doc.moveDown();
        doc.font("Helvetica-Bold").text("Employee Payroll Details");
        doc.moveDown(0.5);

        employees.forEach((employee) => {
            ensurePdfSpace(doc, 40);

            doc
                .font("Helvetica")
                .fontSize(9)
                .text(
                    `${employee.fullName} | ${employee.department} | ${employee.position} | ${money(employee.salary)}`
                );
        });

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    exportEmployeesPdf,
    exportEmployeesExcel,
    exportPayrollPdf
};
