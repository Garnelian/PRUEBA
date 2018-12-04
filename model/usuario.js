const mongoose = require('mongoose');

let schema = mongoose.Schema;

let usuarioschema = new schema({
    nombre: {
        type: String,
        required: [true, "nombre es requerido"]
    },
    email: {
        type: String,
        unique: true,
        required: false
    },
    password: {
        type: String,
        required: [true, "contraseña es requerida"]
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Usuario', usuarioschema);