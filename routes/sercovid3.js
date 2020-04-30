var express = require('express');
var router = express.Router();

const Individu = require('../models/Individu')
const NotificationClient = require('../models/NotificationClient')
const ProcheIndividu = require('../models/ProcheIndividu')

const TransformDate = require('../config/transform_date')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SERCOVID-2' });
})

router.get('/:apikey/user_connect', (req, res, next) => {
    var apikey = req.params.apikey

    Individu.findByOneField('cle_api', apikey, (futindividu) => {
        if (futindividu.length === 1) {
            Individu.replaceByOneField(futindividu[0].codeIndividu, 'est_actif', 1, (msg) => {
                console.log(msg)

                var result = {
                    status: 1
                }

                res.json(result)
            })
        } else {
            var result = {
                status: 0,
                error: "Clé api incorrecte."
            }

            res.json(result)
        }
    })
})

router.get('/:apikey/user_deconnect', (req, res, next) => {
    var apikey = req.params.apikey

    Individu.findByOneField('cle_api', apikey, (futindividu) => {
        if (futindividu.length === 1) {
            Individu.replaceByOneField(futindividu[0].codeIndividu, 'est_actif', 0, (msg) => {
                console.log(msg)

                var result = {
                    status: 1
                }

                res.json(result)
            })
        } else {
            var result = {
                status: 0,
                error: "Clé api incorrecte."
            }

            res.json(result)
        }
    })
})

router.get('/:apikey/check_notifications', (req, res, next) => {
    var apikey = req.params.apikey

    Individu.findByOneField('cle_api', apikey, (futindividu) => {
        if (futindividu.length === 1) {
            NotificationClient.all((futnotification) => {
                if (futnotification.length !== 0) {
                    var nouvelles = []
                    var nouvelle
                    futnotification.forEach(notification => {
                        var date = new Date(notification.dateRegister)
                        var today = new Date();
                        if(date.getDate() == today.getDate() && date.getMonth()  == today.getMonth() && date.getFullYear() == today.getFullYear()) {
                            nouvelle = notification
                            nouvelles.push(nouvelle)
                        }
                    });
                    var result = {
                        status: 1,
                        pack: {
                            notifications: nouvelles
                        }
                    }
                } else {
                    var result = {
                        status: 0,
                        error: "Aucune notification disponible"
                    }
                }
            })
        } else {
            var result = {
                status: 0,
                error: "cle api invalide"
            }
        }
        res.json(result)
    })
    
})

router.get('/check_user/:telephone/:motdepasse', (req, res, next) => {
    var telephone = req.params.telephone
    var motdepasse = req.params.motdepasse

    Individu.findByTwoField('telephone', parseInt(telephone), 'motdepasse', motdepasse, (futindividu) => {
        if (futindividu.length !== 0) {
            var result = {
                status: 1,
                pack: {
                    individu: futindividu[0]
                }
            }
        } else {
            var result = {
                status: 0,
                error: "Individu inconnu"
            }
        }

        res.json(result)
    })
})

router.get('/:apikey/check_status/:codeindividu', (req, res, next) => {
    var apikey = req.params.apikey
    var codeindividu = req.params.codeindividu

    Individu.findByOneField('code_individu', codeindividu, (futindividu) => {
        if (futindividu.length !== 0) {
            if (futindividu[0].cleApi === apikey) {
                var result = {
                    status: 1,
                    pack: {
                        statut: futindividu.statut
                    }
                }
            } else {
                var result = {
                    status: 0,
                    error: "Clé api incorrecte"
                }
            }
        } else {
            var result = {
                status: 0,
                error: "Aucun individu"
            }
        }
    })

    res.json(result)

})

router.get('/:apikey/warning_arearisk/:codeindividu', (req, res, next) => {
    var apikey = req.params.apikey
    var codeindividu = req.params.codeindividu

    //code ici

    if(1) {
        var result = {
            status: 1,
            //autre chose
        }
    } else {
        var result = {
            status: 0
        }
    }

    res.json(result)

})

router.get('/register_user/:nom/:prenom/:sexe/:age/:ville_residence/:telephone/:motdepasse', (req, res, next) => {
    var nom = req.params.nom
    var prenom = req.params.prenom
    var sexe = req.params.sexe
    var age = req.params.age
    var ville_residence = req.params.ville_residence
    var telephone = req.params.telephone
    var motdepasse = req.params.motdepasse
    var codeIndividu = Individu.genCodeIndividu()
    var cleApi = Individu.genCleApi()

    var individu = {
        codeIndividu: codeIndividu,
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        age: parseInt(age),
        villeResidence: ville_residence,
        telephone: parseInt(telephone),
        motdepasse: motdepasse,
        cleApi: cleApi
    }

    Individu.create(individu, (msg) => {
        console.log(msg)
        var result = {
            status: 1
        }

        res.json(result)
    })

    /**
    if(1){
        var result = {
            status: 1,
            //autre chose
        }
    } else {
        var result = {
            status: 0
        }
    } */
})

router.post('/register_user', (req, res, next) => {

    var content = req.body

    //console.log(content)

    var nom = content.nom
    var prenom = content.prenom
    var sexe = content.sexe
    var age = content.age
    var ville_residence = content.ville_residence
    var telephone = content.telephone
    var telephone1 = content.telephone1
    var telephone2 = content.telephone2
    var telephone3 = content.telephone3
    var motdepasse = content.motdepasse
    var phoneparrain = content.phoneparrain
    var codeIndividu = Individu.genCodeIndividu()
    var cleApi = Individu.genCleApi()

    var autrephone = {
        telephone1: telephone1,
        telephone2: telephone2,
        telephone3: telephone3,
    }

    console.log(phoneparrain)

    var individu = {
        codeIndividu: codeIndividu,
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        age: parseInt(age),
        villeResidence: ville_residence,
        telephone: parseInt(telephone),
        autrephone: "{}",
        phoneparrain: parseInt(phoneparrain),
        motdepasse: motdepasse,
        cleApi: cleApi
    }

    console.log(individu)

    

    Individu.create(individu, (msg) => {
        console.log(msg)
        var result = {
            status: 1
        }

        res.json(result)
    })
})

router.get('/:apikey/register_proche/:lien/:telephone', (req, res, next) => {
    var apikey = req.params.apikey
    var lien = req.params.lien
    var telephone = req.params.telephone

    Individu.findByOneField('cle_api', apikey, (futindividu) => {
        if (futindividu.length === 1) {
            var proche = {
                codeProcheIndividu: ProcheIndividu.genCodeProcheIndividu(),
                codeIndividu: futindividu[0].codeIndividu,
                lien: lien,
                telephone: telephone
            }
            ProcheIndividu.create(proche, (msg) => {
                console.log(msg)
            })
        } else {
            var result = {
                status: 0,
                error: "cle api invalide"
            }
        }
        res.json(result)
    })
})

router.get('/:apikey/list_proche', (req, res, next) => {
    var apikey = req.params.apikey
    Individu.findByOneField('cle_api', apikey, (futindividu) => {

        if (futindividu.length === 1) {
            ProcheIndividu.findByOneField('code_individu', futindividu[0].codeIndividu, (futproche) => {
                if (futproche.length !== 0) {
                    var result = {
                        status: 1,
                        pack: {
                            proches: futproche
                        }
                    }
                    console.log(result)
                    res.json(result)
                } else {
                    var result = {
                        status: 0,
                        error: "Aucun proche"
                    }
                    console.log(result)
                    res.json(result)
                }
            })
        } else {
            var result = {
                status: 0,
                error: "cle api invalide"
            }
            console.log(result)
            res.json(result)
        }
    })
})

router.get('/check_phone/:telephone', (req, res, next) => {
    var telephone = req.params.telephone

    Individu.findByOneField('telephone', parseInt(telephone), (futindividu) => {
        if (futindividu.length === 1) {
            var result = {
                status: 1
            }
            res.json(result)
        } else {
            var error = "Numéro encore inconnu"
            var result = {
                status: 0,
                error: error
            }
            res.json(result)
        }
    })
})


router.get('/verif_user/:telephone', (req, res, next) => {
    var telephone = req.params.telephone

    Individu.findByOneField('telephone', parseInt(telephone), (futindividu) => {
        if (futindividu.length === 1) {
            var result = {
                status: 1
            }
            res.json(result)
        } else {
            var error = "Parrain inconnue"
            var result = {
                status: 0,
                error: error
            }
            res.json(result)
        }
    })
})

router.get('/warning_new_notification/:codenotif', (req, res, next) => {
    var codenotif = req.params.codenotif

    NotificationClient.findByOneField('code_notification', codenotif, (futnotifs) => {
        if (futnotifs.length === 1) {
            res.send(futnotifs[0])
            console.log(io)

            io.on("connection", (userSocket) => {
                /*
                userSocket.on("send_message", (data) => {
                    userSocket.broadcast.emit("receive_message", data)
                })
                */
               userSocket.broadcast.emit("receive_message", codenotif)
            })
        } else {
            res.send("nok")
        }
    })
})

router.get('/:apikey/allnotifs', (req, res, next) => {
    var apikey = req.params.apikey

    Individu.findByOneField('cle_api', apikey, (futindividu) => {
        if(futindividu.length === 1) {
            var aptoday = new Date()
            var aptomorow = new Date()
            var aftomorow = aptomorow.setTime(aptomorow.getTime() + 24 * 3600 * 1000);
             
            var aftoday = TransformDate.transform(aptoday)
            var aftomorow = TransformDate.transform(new Date(aftomorow))

            console.log(aftoday)

            NotificationClient.allBetween('date_register', aftoday, aftomorow, (futnotifs) => {
                console.log(futnotifs)
                if (futnotifs.length !== 0 && futnotifs !== null) {
                    var result = {
                        status: 1,
                        pack: futnotifs
                    }
                    res.json(result)
                } else {
                    var result = {
                        status: 0,
                        error: "Aucune notification actuellement"
                    }
                    res.json(result)
                }
            })
        } else {
            console.log("Attention clé api inconnue")
            var result = {
                status: 0,
                error: "Attention clé api inconnue"
            }
            res.json(result)
        }
    })
})



module.exports = router;