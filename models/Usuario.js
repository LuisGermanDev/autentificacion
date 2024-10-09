const mongoose = require('mongoose')

const direccionSchena = require('./Direccion')
const usuarioSchena = new mongoose.Schema({
    nombre:{type:String,require:true},
    email:{type:String,require :true ,unique:true},
    password:{type:String,require : true},
    direcciones:[direccionSchena]
});

const Usuario = mongoose.model('Usuario',usuarioSchena);
module.exports = Usuario;