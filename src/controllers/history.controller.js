import History from '../models/History.model.js'

export const saveHistory= async(req,res)=>{
  //1. Save search
  try{
    const {from,to}=req.body;
  //2. Check for validation of input
    
    if(!from || !to){
      return res.status(400).json({message: "Both from and to are required"});
    }
    const history= await History.create({
      userId:req.user.id,
      from,
      to
    });
    res.status(201).json({ message: "Search saved", data:history});
  } catch(error){
    res.status(500).json({ message: error.message});
  }
};
export const getHistory= async(req,res)=>{
  //3. Get history logged-in users
  try{
    const history=await History.find({userId:req.user.id})
    .sort({createdAt:-1})
    .limit(10);

    res.json(history)
  }catch(error){
    res.status(500).json({message: error.message});
}
};

