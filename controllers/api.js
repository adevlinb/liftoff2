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

/*
    TODO implement new endpoints here
 */

exports.indexCampaign = async (req, res) => {
    try {
        const allCampaigns = await db.Campaign.findAll({where: {id: req.params.id}});
        res.status(200).json({
            status: 200,
            allCampaigns
        });
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}
exports.findOneCampaign = async (req, res) => {
    try {
        const campaign = await db.Campaign.findOne({
            where: {id: req.params.id},
            include: {model: db.Media, where: {campaign_id: req.pareams.id}},
            include: {model: db.Pricing, where: {campaign_id: req.pareams.id}},
            include: {model: db.Creator, where: {campaign_id: req.pareams.id}},
        });

        if (!campaign.creator.includes(req.user._id)) {
            res.status(400).json({
                status: 400,
                error: "Authoization Not Allowed"
            });
        } else {
            res.status(200).json({
                status: 200,
                campaign
            })
        }
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
}

exports.createCampaign = async (req, res) => {
    try {
        console.log("create campaign", req.body);
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
        console.log(req.body);
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
        console.log(req.body, "pricing");
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
exports.removePublisher = async (req, res) => {
    try {
        const publisherId = req.params.publisher_id;
        const campaignId = req.params.campaign_id;
        const timestamp = req.query.remove_at
        const today = new Date();
        const campaign = await db.Campaign.findOne({where: { id: campaignId }})
        
        if (campaign.remove_At >= today);
        

}