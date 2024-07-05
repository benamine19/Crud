const express=require('express')
const {createUser,getUsers,getUserById,updateUser,deleteUser,LoginUSer,verifytoken}=require('../controllers/userController')
const {verifyToken,verifyTokenandauthoraization}=require('../middlewares/verifyToken')
const router=express.Router()

router.post('/createUser',createUser)
router.post('/LoginUSer',LoginUSer)
router.post('/verifytoken',verifytoken)
router.get('/getUsers',getUsers)
router.get('/getUserById/:id',getUserById)
router.put('/updateUser/:id',verifyTokenandauthoraization,updateUser)
router.delete('/deleteUser/:id',deleteUser)

module.exports=router


