const {User,validateCreate,validateUpdate,validateLogin}=require('../models/userModel')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken'); // Si vous utilisez JWT pour générer des tokens
const verifyToken=require('../middlewares/verifyToken')
require('dotenv').config();


// create user 
const createUser=async(req,res)=>{
    const {error}=validateCreate(req.body)
    if (error){
        return res.status(400).send({'message':error.details})
    }
   
    const userverify=await User.findOne({email:req.body.email})
    if(userverify){
        return res.status(400).send({message:'this user alredy exist'})
    }
    const salt=await bcrypt.genSalt(10)
    req.body.password =await bcrypt.hash(req.body.password,salt)

    const user_data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    }
    try{
      const user=new User(user_data)
      const data=await user.save()
      const token = jwt.sign({ _id: user._id, email: user.email,name:user.name }, process.env.JWT_SECRET_KEY);
      const {password , ...other} = data._doc
      res.status(201).send({
        message:'user created with sucess',
        data:{...other,token}
      })

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating the user."
        });
    }
}
// fin create user 


//fin Login user 
const LoginUSer=async(req,res)=>{
    try{
            const {error}=validateLogin(req.body)
            if (error){
                return res.status(400).send({'message':error.details})
            }
          
            const user=await User.findOne({email:req.body.email})
            if(! user){
                return res.status(400).send({message:'email or password not valid'})
            }
            const ispassword=await bcrypt.compare(req.body.password,user.password)
            if(!ispassword){
                return res.status(400).send({message:'email or password not valid'})
            }
            const token = jwt.sign({ _id: user._id, email: user.email,name:user.name }, process.env.JWT_SECRET_KEY);
            const {password , ...other} = user._doc
            res.status(201).send({
                message:'Login success',
                data:{...other,token}
            })
    }catch(error){

                res.status(500).send({
                message: error.message || "Some error occurred while creating the user."
            });
    }
}
// fin create user 

// getUsers 
const getUsers=async(req,res)=>{
    try{
        const users=await User.find().select('-password')
        res.status(200).send(users)
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred to find all users."
        });
    }
}
//  fin getUsers 

// getUserById 
const getUserById=async(req,res)=>{
    const id=req.params.id
    if(!id){
            return res.status(400).send({
                    message:"verifer votre id"
            });
    }
    try{
        const user=await User.findById(id)
        if(!user){
            return res.status(404).send({
                message: "user non trouve."
            });
        }
        const{password,...other}=user
        res.status(200).send(...other)
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred to find all users."
        });
    }
}
// fin getUserById 

// updateUser 
const updateUser = async (req, res) => {    
    const { error } = validateUpdate(req.body);
    if (error) {
        return res.status(400).send({ 'message': error.details });
    }
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        const { password, ...other } = updatedUser._doc;
        res.status(200).send({
            message: "User updated successfully",
            user: other
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while updating the user."
        });
    }
}
// fin updateUser 

// deleteUser 
const deleteUser=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
      
        if(!user){
            return res.status(404).send({
                message: "user non trouve."
            });
        }
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'user has deleted with successufl'})
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred "
        });
    }
}
// fin deleteUser 

// VErify token 
const verifytoken=async(req,res)=>{
    const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    res.json({ message: 'Token is valid', user: decoded });
  });
}


module.exports ={
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    LoginUSer,
    verifytoken
}
