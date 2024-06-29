const fs = require('fs');
const path = require('path');
const parentDir = path.resolve(__dirname, '..');

// 要写入的 JSON 数据
const jsonData = {
    name: 'John Doe',
    age: 30,
    city: 'New York',
};

function toJson(data) {
    // JSON 数据转换为字符串
    const jsonString = JSON.stringify(data, null, 2); // null, 2 参数用于格式化输出，使 JSON 更易读

    const p = path.resolve(parentDir, './dist/data.json');

    // 写入 JSON 数据到文件
    fs.writeFile(p, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('JSON file has been saved.');
        }
    });
}

module.exports = { toJson };
