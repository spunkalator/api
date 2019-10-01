const mongoose = require('mongoose');
const Waybill = mongoose.model('Waybill');
const { sendGetRequest} = require('../helpers/utility');

class WaybillService {

    static paginateWaybill(page, limit, match, cb) {

        Waybill.aggregate([
            {$match: match},
            {$group: {_id: '_id', total: {$sum: 1}}}
        ], (err, totalDoc) => {
            const total = totalDoc.length > 0 ? totalDoc[0].total : 0;
            Waybill.aggregate([
                {$match: match},
                {$lookup: {from: 'userroutes', foreignField: '_id', localField: 'route', as: 'route'}},
                // {$unwind: '$route'},
                {$sort: {date: -1}},
                {$skip: page},
                {$limit: limit},
            ], (err, docs) => {
                console.log(err);
                if (err) return cb(err, null);
                let totalPages = ( total % limit ) > 0 ? Math.round(total / limit) + 1 : Math.round(total / limit);
                let paginate = {
                    currentPage: Math.round(page / limit) + 1,
                    totalPages: totalPages,
                    limit,
                    total,
                    waybills: docs
                };

                return cb(null, paginate);
            });
        });
    }

    static getWaybillTrip(token, match, cb){

        console.log(match);
        Waybill.findOne(match, function (err, doc) {
            if (err) {
                return cb(err, null);
            }
            console.log(doc);
            if (doc && doc._id) {

                sendGetRequest({}, token, '/trip/' + doc.tripId , (err, tripData) => {
                    if(err){
                        console.log(err);
                        return cb(err, null);
                    }

                    if(tripData && tripData.trip){
                        return cb(null, {waybill: doc, trip: tripData.trip});
                    } else {
                        return cb(null, null);
                    }
                } );
            } else {
                return cb(null, null);
            }
        });
    }
}

module.exports = WaybillService;