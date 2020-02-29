const fs = require('fs');
const { sync } = require('./sequelize');

const baseDir = __dirname.replace(/utils/, '');
let files = fs.readdirSync(baseDir + '/models');
let js_files = files.filter((f) => f.endsWith('.js'), files);

module.exports = {};
// 自动导入模型层
for (let f of js_files) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(baseDir + '/models/' + f);
}
// 同步模型层至数据库
module.exports.sync = () => {
    sync();
};
