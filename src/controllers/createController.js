const masterQueries = require("../dbQueries/masterQueries")
const importsQueries = require("../dbQueries/importsQueries")
const importsDetailsQueries = require("../dbQueries/importsDetailsQueries")
const { getDevSession } = require("../utils/getDevSession")

const createController = {

    master: async(req,res) =>{
        try{

            const data = req.body

            await masterQueries.create([data])
            
            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },

    import: async(req,res) =>{
        try{

            const data = req.body

            // get session if DEV
            getDevSession(req)

            // get branch data
            const idBranch = req.session.branch.id

            // add id to data
            data.id_branches = idBranch

            // create po
            const createdData = await importsQueries.create([data])

            // add id to details
            data.details.forEach(detail => {
                detail.id_imports = createdData[0].id
            })

            // create details
            await importsDetailsQueries.create(data.details)

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
}
module.exports = createController

