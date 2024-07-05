const express=require('express')
const{ createTache,Taches,deleteTache,updateTache,getTache}=require('../controllers/tacheController')
const { verifyTokenandauthoraizationTaches,verifyTokenandauthoraization, verifyToken } = require('../middlewares/verifyToken')
const router=express.Router()

router.post('/createTache',verifyTokenandauthoraizationTaches,createTache)
router.get('/Taches/:id',verifyTokenandauthoraization,Taches)
router.get('/getTache/:id',verifyToken,getTache)
router.delete('/deleteTache/:id',verifyToken,deleteTache)
router.put('/updateTache/:id',verifyToken,updateTache)

module.exports=router

