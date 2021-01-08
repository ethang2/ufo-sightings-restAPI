const express = require('express');
const UFOSighting = require('../models/UFOSighting');
const router = express.Router();

const sequelize = require('../config/database');

const Sequelize = require('sequelize');
const { Op } = Sequelize;
const {QueryTypes} = sequelize;

router.use(express.json());

// get a list of sightings from db
router
    .get('/ufosightings', (req, res) => {
        let filter = {};
        const {sightingID} = req.query;
        const {type} = req.query;
        const {order} = req.query;
        let page = (req.query.page) ? req.query.page : 1;

        if (sightingID) {
            filter = {
                where: {
                    id: sightingID
                }
            };
        } else if (type && order) {
            filter = {
                order: [
                    [type, order]
                ],
                offset: (page - 1) * 20,
                limit: 20
            };
        } else {
            filter = {
                offset: (page - 1) * 50,
                limit: 50
            }
        }

        UFOSighting.findAll(filter)
        .then(ufoSigthings => res.json(ufoSigthings));
    })
    .post('/ufosightings', async (req, res) => {
        const body = req.body;
        const ufoSighting = await UFOSighting.build({
            dateTime: body.dateTime,
            city: body.city,
            state: body.state,
            shape: body.shape,
            duration: body.duration,
            summary: body.summary,
            datePosted: body.datePosted,
            latitude: body.latitude,
            longitude: body.longitude
        });
        await ufoSighting.save();
    });

router.get('/ufosightings/recent', (req, res) => {
    UFOSighting.findAll({
        limit: 20,
        order: [
            ['datePosted', 'DESC']
        ]
    }).then(ufoSigthings => res.json(ufoSigthings));
});

router.get('/ufosightings/shapes', async (req, res) => {
    const shape = req.query.shape;
    let query;
    let page = (req.query.page) ? req.query.page : 1;

    if (shape) {
        query = await UFOSighting.findAll({
            where: {
                shape: req.query.shape.toLowerCase()
            },
            limit: 20,
            offset: (page - 1) * 20,
            order: [
                ['datePosted', 'DESC']
            ]
        });
    } else {
        query = await sequelize.query("SELECT DISTINCT shape FROM UFOSightings ORDER BY shape ASC");
    }

    res.json(query);
});

router.get('/ufosightings/event-dates', async (req, res) => {
    const year = req.query.year;
    const month = req.query.month;
    let page = (req.query.page) ? req.query.page : 1;
    let query;

    if (year && month) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE YEAR(dateTime) LIKE '%${year}%' AND MONTH(dateTime) LIKE '%${month}%' ORDER BY dateTime DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else if (year) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE YEAR(dateTime) LIKE '%${year}%' ORDER BY dateTime DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else if (month) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE MONTH(dateTime) LIKE '%${month}%' ORDER BY dateTime DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else {
        query = await sequelize.query("SELECT DISTINCT YEAR(dateTime) AS 'year' FROM UFOSightings ORDER BY year DESC");
    }
    
    res.json(query);
});

router.get('/ufosightings/dates-posted', async (req, res) => {
    const year = req.query.year;
    const month = req.query.month;
    let page = (req.query.page) ? req.query.page : 1;
    let query;

    if (year && month) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE YEAR(datePosted) LIKE '%${year}%' AND MONTH(datePosted) LIKE '%${month}%' ORDER BY datePosted DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else if (year) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE YEAR(datePosted) LIKE '%${year}%' ORDER BY datePosted DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else if (month) {
        query = await sequelize.query(`SELECT * FROM UFOSightings WHERE MONTH(datePosted) LIKE '%${month}%' ORDER BY datePosted DESC OFFSET ${(page - 1) * 20} ROWS FETCH NEXT 20 ROWS ONLY`, {type: QueryTypes.SELECT});
    } else {
        query = await sequelize.query("SELECT DISTINCT YEAR(datePosted) AS 'year' FROM UFOSightings ORDER BY year DESC");
    }

    res.json(query);
});

router.get('/ufosightings/states', async (req, res) => {
    const state = req.query.state;
    let query;
    let page = (req.query.page) ? req.query.page : 1;

    if (state) {
        query = await UFOSighting.findAll({
            where: {
                state: req.query.state.toUpperCase()
            },
            limit: 20,
            offset: (page - 1) * 20,
            order: [
                ['datePosted', 'DESC']
            ]
        });
    } else {
        query = await sequelize.query("SELECT DISTINCT state FROM UFOSightings ORDER BY state ASC");
    }

    res.json(query);
});

router.get('/ufosightings/latlong', async (req, res) => {
    res.json(await sequelize.query("SELECT id, latitude, longitude FROM UFOSightings"));
});

router.get('/ufosightings/most-frequent/:data', async (req, res) => {
    const data = req.params.data.toLowerCase();
    res.json(await sequelize.query(`
        SELECT TOP(3) ${data}, COUNT(${data}) AS occurrences  
        FROM UFOSightings
        GROUP BY ${data}
        ORDER BY occurrences DESC
    `));
});

module.exports = router;