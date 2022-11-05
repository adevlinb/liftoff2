'use strict';

module.exports = function (sequelize, DataTypes) {
    var Campaign = sequelize.define(
        'Campaign',
        {
            campaign_name: { type: DataTypes.STRING },
            campaign_icon_url: { type: DataTypes.STRING },
            conversion_event: { type: DataTypes.STRING },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            underscored: true,
            tableName: 'campaign',
        },
    );

    return Campaign;
};