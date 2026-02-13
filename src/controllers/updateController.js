const masterQueries = require("../dbQueries/masterQueries")
const importsQueries = require("../dbQueries/importsQueries")
const importsDetailsQueries = require("../dbQueries/importsDetailsQueries")

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

    import: async(req,res) =>{
        try{

            const data = req.body

            await importsQueries.update(data.condition,data.data)

            if (data.updateDetails) {
                for (const element of data.data) {

                    // delete details
                    await importsDetailsQueries.delete('id_imports', element.id)

                    // add id
                    element.dataToUpdate.details.forEach(detail => {
                        detail.id_imports = element.id
                    })

                    // create details
                    await importsDetailsQueries.create(element.dataToUpdate.details)
                }
            }
            
            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
}
module.exports = updateController

