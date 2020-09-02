var mongoose = require('mongoose');
var Schema = mongoose.Schema;


export interface Rig{
    name: string;
    ip: string;
    gpus: string[];
}

export const RigSchema = new Schema({
    name: String,
    ip: String,
    gpus: [String]
});

export const RigModel = mongoose.model('RigModel', RigSchema);