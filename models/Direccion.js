const mongoose = require('mongoose')

const direccionSchena = new mongoose.Schema({
    calle:{type:String,require:true},
    numeroDeCasa:{type:String,require:true},
    last:{type:Number},
    long:{type:Number}
})
module.exports = direccionSchena;
