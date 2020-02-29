const { sync } = require('./model.js');
const start = require('./init-data');
// 初始化数据库并创建数据表
sync();

setTimeout((() => {
    // 数据表成功后开始添加数据
    start();
}), 5000);

console.log('init db ok.');
