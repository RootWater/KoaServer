const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuid = require('node-uuid');
const MYSQL_CONFIG = require('../config/mysql_config');
// 打开数据库连接
const sequelize = new Sequelize(MYSQL_CONFIG.database, MYSQL_CONFIG.username, MYSQL_CONFIG.password, {
    hots: MYSQL_CONFIG.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        ideal: 30000
    }
});

const ID_TYPE = Sequelize.STRING(50);

function generateId() {
    return uuid.v4();
}
// 统一模型定义
function defineModel(name, attributes) {
    let attrs = {};

    for (let key in attributes) {
        let value = attributes[key];

        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createdOn = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedOn = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };

    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();

                if (obj.isNewRecord) {
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createdOn = now;
                    obj.updatedOn = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

const exp = {
    Op,
    sequelize,
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: true }); //{ force: true }
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (const type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;
