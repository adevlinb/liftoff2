'use strict';

let {Sequelize, sequelize} = require('../service/db');

exports.creator = async (req, res) => {
    try {
        const creatorId = req.query.creator_id;
        let user = await db.sequelize.query(
            'SELECT * FROM creator b\n' +
            'WHERE id=$1\n',
            { bind: [creatorId], type: 'RAW' },
        );
        res.send(user[0]);
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
};

exports.indexCampaign = async (req, res) => {
    try {
        const allCampaigns = await db.Campaign.findAll();
        res.status(200).json({
            status: 200,
            allCampaigns,
        });
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}
exports.findOneCampaign = async (req, res) => {
    try {
        const campaignId = req.params.id
        const campaign = await db.Campaign.findOne({
            where: {id: campaignId},
            include: [ {model: db.Media}, {model: db.Pricing}, {model: db.Creator} ]
        });

        const averages =  await campaign.average_pay_per_install
        let creatorInCampaign = campaign.creator.some(function(creator) {
            return creator.id === req.user._id
        })

        if(creatorInCampaign || campaign.publisherId === req.user._id) {
            res.status(200).json({
                status: 200,
                campaign,
                averages
            })
        } else {
            res.status(400).json({
                status: 400,
                error: "Authorization Not Allowed"
            })
        }
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}

exports.createCampaign = async (req, res) => {
    try {
        req.body.publisherId = req.user._id;
        if (req.body.remove_At === null) {
            const date = new Date();
            req.body.remove_At = date.setDate(date.getDate() + 1);
        }
        const newCampaign = await db.Campaign.create(req.body);
        res.status(200).json({
            status: 200,
            newCampaign
        })
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}

exports.addMediaToCompaign = async (req, res) => {
    try {
        req.body.campaign_id = req.params.id;
        const newMedia = await db.Media.create(req.body);
        res.status(200).json({
            status: 200,
            newMedia
        });
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}

exports.addPricingToCampaign = async (req, res) => {
    try {
        req.body.campaign_id = req.params.id;
        const newPricing = await db.Pricing.create(req.body);
        res.status(200).json({
            status: 200,
            newPricing
        });
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}
exports.addCreatorToCampaign = async (req, res) => {
    try {
        const campaign = await db.Campaign.findOne({where: { id: req.params.campaign_id }});
        await campaign.addCreator(req.params.creator_id)
        await campaign.save()
        const updatedCampaign = await db.Campaign.findOne({
            where: { id: req.params.campaign_id },
            include: [{ model: db.Media }, { model: db.Pricing }, { model: db.Creator }]
        });
        res.status(200).json({
            status: 200,
            updatedCampaign
        });
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}


exports.checkToRemovePublisher = async (req, res) => {
    try {
        const publisherId = req.params.publisher_id;
        const campaignId = req.params.campaign_id;
        const campaign = await db.Campaign.findOne({where: { id: campaignId }})
        const date = campaign.remove_At || new Date();
        if (campaign.remove_At <= date) campaign.publisherId = null;
        campaign.save();

    } catch (err) {
        console.log("Error is User: " + err);
    }
}