const { sequelize } = require('./sequelize');

// 查询数据
const QUERY = (sql) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }))
        } catch (e) {
            reject(e)
        }
    });
};

module.exports = {
    QUERY
};
