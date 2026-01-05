import History from '../models/History.model.js'

export const saveHistory= async(req,res)=>{
  try{
    const {from,to}=req.body;

    if(!from || !to){
      return res.status(400).json({message: "Both from and to are required"});
    }
    const history= await History.create({
      userID:req.user.id,
      from,
      to
    });
    res.status(201).json({ message: "Search saved", data:history});
  } catch(error){
    res.status500).json({ message: error.message});
  }
};
export const getHistory= async(req,res)=>{
  try{
    const history=await History.find({userID:req.user.id})
    .sort({createdAt:-1})
    .limit(10);

    res.json(history)
  }catch(error){
    res.status(500).json({message: error.message});
}
};
