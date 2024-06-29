const obj2gltf = require('obj2gltf');
const fs = require('fs');
const path = require('path');
const { uploadFile } = require('./aliyun');
const parentDir = path.resolve(__dirname, '..');

// const folderPath = path.resolve(__dirname, './source/model');
// const curentFileName = fs.readdirSync(folderPath)[0];
// const lujing = path.resolve(__dirname, './source/model/', curentFileName);
// const name = lujing.split('.')[0] + '.gltf';

module.exports = function handleObj(path1, curentFileName) {
    return new Promise((resolve) => {
        const name = curentFileName.split('.')[0] + '.gltf';

        console.log('path1');
        console.log(path1);
        obj2gltf(path1).then(async function (gltf) {
            const data = Buffer.from(JSON.stringify(gltf));
            console.log('parentDir');
            console.log(parentDir);
            const path2 = path.resolve(parentDir, './source/model/', name);

            console.log('path2');
            console.log(path2);

            fs.writeFileSync(path2, data);

            // 上传阿里云
            const url = await uploadFile(name, path2);

            resolve({
                name,
                url,
            });
        });
    });
};
