const path = require('path');
const { glob } = require('glob');
const fs = require('fs');
const HTML = require('html-parse-stringify');
const http = require('http');

// TODO 这个是模拟进程一直在跑着，执行process.exit(0)直接中断进程
setInterval(() => {
    console.log(12);
}, 100);

const TYPE = 'tag';
const STYLENAME = 'link';
const SCRIPTNAME = 'script';
const STYLESHEET = 'stylesheet';

// TODO 这个地方是伪代码，可以使用其他的库来实现
function getCDNFile(item) {
    return new Promise((resolve, reject) => {
        http.get(item.link, (err) => {
            if (err) {
                // TODO 这个地方可以接入IM系统或者邮件进行通知
                console.log('cdn错误');
                process.exit(0);
                reject(item.link);
            } else {
                resolve();
            }
        });
    });
}

async function getFileFromCDN(list) {
    for (let i = 0; i < list.length; i++) {
        await getCDNFile(list[i]);
    }
}

async function findFile(target, suffix) {
    return await glob([suffix], {
        cwd: target,
        absolute: true,
        onlyFile: true,
    });
}

async function getTargetFileList(pathList) {
    const fileList = [];
    for (let i = 0; i < pathList.length; i++) {
        const file = await fs.readFileSync(pathList[i], 'utf-8');
        fileList.push(file);
    }
    return fileList;
}

async function parserHTMLAst(fileList) {
    const ASTList = [];
    for (let i = 0; i < fileList.length; i++) {
        const AST = await Promise.resolve(
            HTML.parse(fileList[i].replace(/\n/g, ''))
        );
        ASTList.push(AST);
    }
    return ASTList;
}

function findASTItem(item) {
    const list = [...item];
    const finalList = [];
    while (list.length) {
        const current = list.shift();
        if (
            current.type === TYPE &&
            (current.name === STYLENAME || current.name === SCRIPTNAME)
        ) {
            finalList.push(current);
        }
        if (current.children && current.children.length) {
            list.push(...current.children);
        }
    }
    return finalList;
}

async function batchDealHTMLAST(list) {
    const filterList = list.map((item) => findASTItem(item)).flat();
    return filterList.filter(
        (item) =>
            item.attrs &&
            ((item.name === SCRIPTNAME && item.attrs.src) ||
                (item.name === STYLENAME &&
                    item.attrs.rel === STYLESHEET &&
                    item.attrs.href))
    );
}

function formatAst(list) {
    return list.map((item) => {
        const linkOrSrc = item.attrs.href || item.attrs.src;
        const arr = linkOrSrc.split('/');
        const name = arr[arr.length - 1];
        return {
            name,
            link: linkOrSrc,
        };
    });
}

function judgeCDNImport(list) {
    return list.every(
        (item) => item.link.startsWith('http') || item.link.startsWith('https')
    );
}

/**
 * 第一作用：防止配置上线脚本错误的，
 * 第二作用：可以上物理机的时候检查静态资源是否都已经推送CDN上，下边TODO里面写了
 * @returns {Promise<void>}
 */
async function checkMainFileAssetsIncludeCDN(flag) {
    // 查找要扫描的html地址
    const fileList = await findFile(
        path.join(__dirname, '../lib'),
        '**/*.html'
    );
    // 获取文件内容
    const contentList = await getTargetFileList(fileList);
    // 将HTML文件转换成AST语法树
    const htmlAstList = await parserHTMLAst(contentList);

    console.log('htmlAstList');
    console.log(htmlAstList);

    // 处理AST文件，拿到script和style标签
    const getScriptOrStyleOfAssets = await batchDealHTMLAST(htmlAstList);
    // 格式化拿到的script标签和style标签文件
    const formatList = formatAst(getScriptOrStyleOfAssets);
    // 检查引入的地址是否都是CDN地址
    const result = judgeCDNImport(formatList);
    if (!result) {
        // TODO 这个地方可以接入IM系统或者邮件进行通知
        console.log('有文件不是CDN格式引入的，构建脚本有误');
        process.exit(0);
    }
    if (flag) {
        await getFileFromCDN(formatList);
    }
    console.log('检查文件无误');
}

checkMainFileAssetsIncludeCDN(true);

// 简单实现的插件机制
class CheckCDNAssets {
    apply(compiler) {
        compiler.hooks.done.tapPromise('CheckCDNAssets', async () => {
            return await checkMainFileAssetsIncludeCDN(true);
        });
    }
}
