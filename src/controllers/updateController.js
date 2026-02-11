const masterQueries = require("../dbQueries/masterQueries")

const updateController = {

    master: async(req,res) =>{
        try{

            const data = req.body

            await masterQueries.update(data.condition,data.data)
            
            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
}
module.exports = updateController

