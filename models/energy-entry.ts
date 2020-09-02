var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const EnergyEntrySchema = new Schema({
    name: String,
    ip: String,
    deviceName: String,
    current: Number,
    voltage: Number,
    power: Number,
    total: Number,
    err_code: Number,
    timestamp: Number,
});

export const EnergyEntryModel = mongoose.model('EnergyEntry', EnergyEntrySchema);