'use strict';

module.exports = function (sequelize, DataTypes) {
    var Campaign = sequelize.define(
        'Campaign',
        {
            campaign_name: { type: DataTypes.STRING },
            campaign_icon_url: { type: DataTypes.STRING },
            conversion_event: { type: DataTypes.STRING },
            publisherId: { type: DataTypes.INTEGER },
            remove_at: { type: DataTypes.DATE },
            average_pay_per_install: { 
                type: DataTypes.VIRTUAL,
                get() {
                    return findAvg(this.id)
                    async function findAvg (id) {
                        let creatorsAvg = [];
                        const installs = await db.Install.findAll();
                        const campaign = await db.Campaign.findOne({ where: { id: id }, include: [{model: db.Pricing}, {model: db.Creator}]})
                        await campaign.Creators.forEach(function(creator) {
                            let avg = 0;
                            let numOfInstalls = 0;
                            installs.forEach(function(install) {
                                if (install.creator_id === creator.id) {
                                    campaign.Pricings.forEach(function(price) {
                                        if (install.platform === price.platform && install.country === price.country) {
                                            avg += price.price;
                                            numOfInstalls += 1;
                                        }
                                    })
                                }
                            })
                            avg = avg / numOfInstalls; 
                            creatorsAvg.push({creatorName: `${creator.dataValues.firstname} ${creator.dataValues.lastname}`, avgPrice: avg})
                        })
                    return await creatorsAvg;
                    }
                }
            }
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
