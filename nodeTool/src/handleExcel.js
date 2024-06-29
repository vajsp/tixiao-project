const xlsx = require('node-xlsx');
const fs = require('fs');

function handleExcel(ph) {
    return new Promise((resolve) => {
        // 读取 Excel 文件
        const workSheetsFromFile = xlsx.parse(fs.readFileSync(ph));
        const obj = {};
        // workSheetsFromFile 是一个数组，每个元素对应一个 sheet
        workSheetsFromFile.forEach((sheet) => {
            console.log('Sheet name:', sheet.name);
            console.log('Rows:', sheet.data);
            obj.name = sheet.name;
            obj.data = sheet.data;
        });
        resolve(obj);
    });
}

module.exports = { handleExcel };
