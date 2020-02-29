const fs = require('fs');
const baseDir = __dirname.replace(/utils/, '');
const Model = require('./model.js');
const files = fs.readdirSync(baseDir + '/data');
const json_files = files.filter(f => f.endsWith('.json'), files);
// 自动向数据表中添加数据
const addData = () => {
    for (const f of json_files) {
        console.log(`import json data from file ${f}...`);

        const jsonData = require(baseDir + '/data/' + f);
        const { model, data } = jsonData;

        data.forEach(async (item) => {
            await Model[model].create(item);
        });
    }

    console.log('init data ok!');
};

module.exports = () => {
    addData();
};
