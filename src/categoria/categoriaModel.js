const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es requerido'],
    },
    descripcion: {
        type: String
    },

});

categoriaSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });


module.exports = mongoose.model('Categoria', categoriaSchema);