const {Tache,validateCreate,validateUpdate}=require('../models/tache_models')
const User=require('../models/userModel')
const joi =require('joi')


const createTache = async (req, res) => {
    const { title, description, user, deadline } = req.body;
  
    const {error}=validateCreate(req.body)
    // if (error){
    //     return res.status(400).send({'message':error.details})
    // }
    const tache = new Tache({
        title,
        description,
        user,
        deadline
    });
    try {
        const savedTache = await tache.save();
        res.status(201).json({data:savedTache,message:'user has benn created with suceess'});
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating the task." });
    }
};


const Taches=async (req,res)=>{
    const userId=req.params.id
    try{
        // const taches= await Tache
        const taches = await Tache.find({user :userId})
        res.status(200).json({taches})
    }catch(error){
        res.status(500).json({ message: error.message || "Some error occurred while creating the task." });
    }
}
const deleteTache = async (req, res) => {
    const tacheId = req.params.id;
   

    try {
        const tache = await Tache.findOne({_id: tacheId});

        // Vérifiez si la tâche existe
        if (!tache) {
            return res.status(404).send({ message: 'Tâche non trouvée' });
        }

    

        // Vérifiez si l'utilisateur est autorisé à supprimer cette tâche
        if (tache.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' });
        }

        await Tache.findByIdAndDelete(tacheId);
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message || "Une erreur s'est produite lors de la suppression de la tâche." });
    }
}

const getTache = async (req, res) => {
    const tacheId = req.params.id;
    try {
        const tache = await Tache.findOne({_id: tacheId});
        // Vérifiez si la tâche existe
        if (!tache) {
            return res.status(404).send({ message: 'Tâche non trouvée' });
        }
        // Vérifiez si l'utilisateur est autorisé à supprimer cette tâche
        if (tache.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' });
        }
        res.status(200).json({tache, message: 'Tâche supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message || "Une erreur s'est produite lors de la suppression de la tâche." });
    }
}

const updateTache=async(req,res)=>{
    const { title, description, user, dedline } = req.body;
    const tacheId=req.params.id
    const tache = await Tache.findOne({_id: tacheId});
        // Vérifiez si la tâche existe
        if (!tache) {
            return res.status(404).send({ message: 'Tâche non trouvée' });
        }
        if (tache.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Vous n\'êtes pas autorisé' });
        }
    const {error}=validateUpdate(req.body)
    if (error){
        return res.status(400).send({'message':error.details})
    }
    try{
        const tache = await Tache.findByIdAndUpdate(tacheId,{$set:{title:title,
            description:description,
            user:user,
            dedline:dedline }},{new:true})
        res.status(200).json({message:'tache has benn updated by sucess',data:tache})
    }catch(error){
        res.status(500).json({ message: error.message || "Some error occurred while creating the task." });
    }
}
module.exports ={
    createTache,
    Taches,
    deleteTache,
    getTache,
    updateTache
}