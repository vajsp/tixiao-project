const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

const config = {
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
    bucket: 'betamanager-test',
    accessKeyId: 'STS.NTZGb6o91doPcvJ2TmZREL9fi',
    accessKeySecret: '2by4xVDzWgnh2ntxykSswfmfHJFEzUeW3jiUohLjn9n9',
    stsToken:
        'CAIS2AJ1q6Ft5B2yfSjIr5fvDNiCguYQ0627YVD71lQ4Vt1po/zNizz2IHxIeXlsBuEcsPownWhS6/wblrh+W4NIX0rNaY5t9ZlN9wqkbtJABx1rB+ZW5qe+EE2/VjTZvqaLEcibIfrZfvCyESOm8gZ43br9cxi7QlWhKufnoJV7b9MRLGLaBHg8c7UwHAZ5r9IAPnb8LOukNgWQ4lDdF011oAFx+wgdgOadupTBukGD1gGil7ZO9tiufcKeApMybMslYbCcx/drc6fN6ilU5iVR+b1+5K4+omub44HBXAgLvUvZarKOr4c2NnxwYqkrBqhDt+Pgkv51vOPekYntwgpKJ/tSVynP+CkGTG0qmIlDX/ROltaTUxylurjnvYlkJoXaLzlSso8ezlDFhqvs7bAIC1C8ZObus3OpCUyIQOOei4oNuqFu5A7LkLTHWR7hCtv2304wwUQbMStAXxqAAXIusOh1fenyEHZ96L1sCU4ROSJHriUNoQ91fUgN0kHppepBUWhtZrKOzu6caAdS8MaKVuY2pTl12MnpD0LnfZcptsYadZYxyYdlW+7J9Ii4ljZVG8eprjim9RHerY8nRbzv2KaJsnnO9kqZt7uLFpOW3N7IdJOJ6M/+Rub9ppBlIAA=',
};

// 阿里云 OSS 访问信息，需要替换为实际的信息
// const client = new OSS({
//     region: 'your-region', // OSS Bucket 所在地域
//     accessKeyId: 'your-access-key-id',
//     accessKeySecret: 'your-access-key-secret',
//     bucket: 'your-bucket-name', // 需要上传的 OSS Bucket 名称
// });

const client = new OSS({ ...config });

// 获取当前目录的父目录路径
// const parentDir = path.resolve(__dirname, '..');
// const folderPath = path.resolve(parentDir, './source/model');
// const curentFileName = fs.readdirSync(folderPath)[0];

// console.log(curentFileName);
// const parentDir1 = path.resolve(folderPath, curentFileName);

// // 本地文件路径
// const localFilePath = parentDir1; // 需要上传的本地文件路径
// // 阿里云 OSS 中的存储路径和文件名
// const remoteFilePath = '123.gltf'; // 远程存储路径和文件名

/**
 *
 * @param {*} remoteFileName 远程名称 '123.gltf'
 * @param {*} localFilePath 当前名称路径
 */
async function uploadFile(remoteFileName, localFilePath) {
    try {
        // 上传文件
        const result = await client.put(remoteFileName, localFilePath);
        console.log('File uploaded successfully:', result.url);
        return result.url;
    } catch (err) {
        console.error('Error uploading file:', err);
        return null;
    }
}

module.exports = { uploadFile };

// // 执行上传
// uploadFile();
