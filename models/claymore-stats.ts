var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const StatSchema = new Schema({
    name: String,
    ethShares: Number,
    dcrShares: Number,
    ethRejects: Number,
    dcrRejects: Number,
    ethInvalid: Number,
    dcrInvalid: Number,
    ethHash: [],
    dcrHash: [],
    temps: [],
    fans: [],
    pools: String,
    ver: String,
    timestamp:  { type: Number, index: true },
    uptime: Number,
    ip: String,
});

export const ClaymoreStat = mongoose.model('ClaymoreStat', StatSchema);