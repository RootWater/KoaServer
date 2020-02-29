const fs = require('fs');
const baseDir = __dirname.replace(/routes/, '');
// 添加映射
function addMapping(router, mapping) {
    const { model } = mapping; // 获取模型名

    delete mapping.model;

    for (const url in mapping) {
        if (mapping[url]) {
            router.all(`/koa/${model}/${url}`, mapping[url]);
        } else {
            console.log(`Invalid URL: ${url}`);
        }
    }
}
// 自动添加控制层
function addControllers(router, dir) {
    const files = fs.readdirSync(`${baseDir}${dir}`);
    const js_files = files.filter(f => f.endsWith('.js'));

    for (const f of js_files) {
        console.log(`process controller: ${f}...`);

        const mapping = require(`${baseDir}${dir}/${f}`);

        addMapping(router, mapping);
    }
}
// 导出模型层
module.exports = function (dir = 'controllers') {
    const router = require('koa-router')();

    addControllers(router, dir);

    return router;
};
