
const { getDevSession } = require("../utils/getDevSession")
const { getMaster } = require("../utils/getMaster")
const currenciesExchangesQueries = require("../dbQueries/currenciesExchangesQueries")
const importsQueries = require("../dbQueries/importsQueries")
const branchesQueries = require("../dbQueries/branchesQueries")

const composedController = {

    getBranch: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            const branch = req.session.branch
            res.status(200).json(branch)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    getMaster: async(req,res) =>{
        try{

            const data = req.body

            const mapData = await getMaster(data, data.idBranch)

            res.status(200).json({data: mapData})

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    getLastCurrenciesExchanges: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            const idBranch = req.session.branch.id

            // get currencies
            const currenciesExchanges = await currenciesExchangesQueries.getLastExchange(idBranch)

            res.status(200).json(currenciesExchanges)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    getPoNumber: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            // get year
            const date = new Date()
            const year = date.getFullYear()

            // get branch data
            const idBranch = req.session.branch.id
            const branchData = await branchesQueries.get({filters:{id:idBranch}})
            const suffix = branchData[0].pos_suffix

            // get year
            const maxPo = await importsQueries.getMaxPo(idBranch)
            const maxPoYear = Number(String(maxPo.po_number).slice(0, 4))

            // get po number
            let poNumber
            if (year == maxPoYear) {
                const number = maxPo.po_number + 1
                poNumber = suffix + '.' + String(number).slice(-2) + '.' + String(number).slice(2, 4)
            }else{
                poNumber = suffix + '.01.' + String(year).slice(2, 4)
            }
            
            res.status(200).json(poNumber)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

}
module.exports = composedController

