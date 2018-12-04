const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/CRUD', { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;
    console.error("Base de datos funcionando");
});

let config = {
    nombre: {
        demand: true,
        alias: 'n'
    },
    email: {
        demand: true,
        alias: 'm'
    },
    password: {
        alias: 'p'
    }
}
const argv = require('yargs').command('Crear')
    .command('Crear', 'Crea un usuario nuevo ', config)
    .command('Modificar', 'Modifica un usuario existente.', config)
    .command('Eliminar', 'Elimina un usuario a partir de su correo.', {
        email: {
            demand: true,
            alias: 'm'
        }
    })
    .command('Listar', 'Lista los usuarios existentes.')
    .help()
    .argv;



User = require('./model/usuario');


let comando = argv._[0];

let usuario = new User({
    nombre: argv.nombre,
    email: argv.email,
    password: argv.password
})

let Buscausuario = (correo) => {
    return new Promise((resolve, reject) => {
        console.log(`email ${correo}`);
        User.find({ email: correo }, 'nombre')
            .exec((err, lista) => {
                if (err) {
                    reject(err.errmsg);
                    // return console.log('Error Encontrando el usuario.');
                }

                // User.count({}, (err, cuenta) => {
                // });
                if (err) {
                    reject(err.errmsg);
                    // return console.log('Error Encontrando el usuario.');
                }
                let resp = {
                    ok: true,
                    // cuenta,
                    lista
                }
                console.log(resp.lista[0]._id);
                if (resp.lista.length > 0) {
                    resolve(resp.lista[0]._id);
                } else
                    reject(-1);
            });

    })
};

let operacion = async(comando) => {
    let id = '';
    switch (comando) {
        case 'Crear':
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return console.log(err.errmsg);
                    //return console.log('Error Encontrando el usuario.');
                }
                let resp = {
                    ok: true,
                    usuario: usuarioDB
                }
                console.log('Agregado correctamente', resp);
            })
            break;
        case 'Modificar':
            id = await Buscausuario(usuario.email);
            console.log(`id es: ${id}`);
            if (id !== '-1') {
                let actualiza = {
                    nombre: argv.nombre,
                    email: argv.email,
                    password: argv.password
                }
                User.findByIdAndUpdate(id, actualiza, { new: true }, (err, usuarioDB) => {
                    if (err) {
                        return console.log(err.errmsg);
                        // return console.log('Error Encontrando el usuario.');
                    }
                    let resp = {
                        ok: true,
                        usuario: usuarioDB
                    }
                    console.log('Agregado correctamente', resp);
                })
            }
            break;
        case 'Eliminar':
            id = await Buscausuario(usuario.email);
            if (id !== '-1') {
                User.findByIdAndRemove(id, (err, usuarioDB) => {
                    if (err) {
                        return console.log(err.errmsg);
                        // return console.log('Error Encontrando el usuario.');
                    }
                    let resp = {
                        ok: true,
                        usuario: usuarioDB
                    }
                    console.log('Eliminado correctamente', resp);
                })
            }
            break;
        case 'Listar':
            User.find({})
                .exec((err, lista) => {
                    if (err) {
                        return console.log(err.errmsg);
                        // return console.log('Error Encontrando el usuario.');
                    }

                    User.count({}, (err, cuenta) => {
                        if (err) {
                            return console.log(err.errmsg);
                            // return console.log('Error Encontrando el usuario.');
                        }
                        let resp = {
                            ok: true,
                            cuenta,
                            lista
                        }
                        console.log('Lista Usuarios:' + '\n', resp);
                    })


                })

            break;
        default:
            console.log("Comando no conocido");
    }
}
operacion(comando);