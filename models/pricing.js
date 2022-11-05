'use strict';

module.exports = function (sequelize, DataTypes) {
    var Pricing = sequelize.define(
        'Pricing',
        {
            platform: { type: DataTypes.STRING },
            country: { type: DataTypes.STRING },
            price: { type: DataTypes.FLOAT },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            underscored: true,
            tableName: 'pricing',
        },
    );

    return Pricing;
};