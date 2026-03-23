const beneficiaryService = require('../services/beneficiary.services');
const ExcelJS = require('exceljs');

// fetch all beneficiaries
exports.getAllBeneficiaries = async (req, res) => {
    try {
        const [rows] = await beneficiaryService.getAllBeneficiaries();
        res.json(rows);
    } catch (err) {
        console.error("FETCH ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// return count of approved beneficiaries (for dashboard)
exports.getCount = async (req, res) => {
    try {
        const count = await beneficiaryService.getApprovedCount();
        res.json({ count });
    } catch (err) {
        console.error("COUNT ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// export beneficiaries to excel
exports.exportBeneficiaries = async (req, res) => {
    try {
        const [rows] = await beneficiaryService.getAllBeneficiaries();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Beneficiaries');

        if (rows.length > 0) {
            worksheet.columns = Object.keys(rows[0]).map((key) => ({ header: key, key }));
            rows.forEach((row) => worksheet.addRow(row));
        }

        res.setHeader('Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=beneficiaries.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('EXPORT ERROR:', err.message);
        res.status(500).json({ message: 'Failed to create export file.' });
    }
};

exports.getBeneficiaryApplicationDetails = async (req, res) => {
    try {
        const applicationId = Number(req.params.applicationId);
        if (!applicationId) {
            return res.status(400).json({ message: 'applicationId is required' });
        }

        const details = await beneficiaryService.getBeneficiaryApplicationDetails(applicationId);
        if (!details) {
            return res.status(404).json({ message: 'Beneficiary application not found' });
        }

        res.json(details);
    } catch (err) {
        console.error('DETAIL FETCH ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
};