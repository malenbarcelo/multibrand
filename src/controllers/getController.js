const masterQueries = require("../dbQueries/masterQueries")
const importsQueries = require("../dbQueries/importsQueries")
const suppliersQueries = require("../dbQueries/suppliersQueries")
const musQueries = require("../dbQueries/measurementUnitsQueries")
const { getMaster } = require("../utils/getMaster")
const { getImports } = require("../utils/getImports")
const { getDevSession } = require("../utils/getDevSession")

const getController = {

    master: async(req,res) =>{
        try{

            const { page, size, order, id_suppliers, item_string, item, description, enabled  } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // branch id
            getDevSession(req)
            const idBranch = req.session.branch.id
            filters.id_branches = idBranch
            
            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id_suppliers) {
                filters.id_suppliers = id_suppliers
            }

            if (item) {
                filters.item = item
            }

            if (item_string) {
                filters.item_string = item_string
            }

            if (description) {
                filters.description = description
            }

            if (enabled) {
                filters.enabled = enabled
            }

            // get data
            let data = await masterQueries.get({ limit, offset, filters })

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            // add data
            data = await getMaster(data, idBranch)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    suppliers: async(req,res) =>{
        try{

            const { supplier_name, id, order} = req.query
            const filters = {}

            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            // get data
            let data = await suppliersQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    measurementUnits: async(req,res) =>{
        try{

            const { id, order} = req.query
            const filters = {}

            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            // get data
            let data = await musQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    imports: async(req,res) =>{
        try{

            const { page, size, id, order, po_string, id_suppliers, item_string, import_status, enabled  } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // branch id
            getDevSession(req)
            const idBranch = req.session.branch.id
            filters.id_branches = idBranch
            
            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            if (po_string) {
                filters.po_string = po_string
            }

            if (id_suppliers) {
                filters.id_suppliers = id_suppliers
            }

            if (item_string) {
                filters.item_string = item_string
            }

            if (import_status) {
                filters.import_status = import_status
            }

            if (enabled) {
                filters.enabled = enabled
            }

            // get data
            let data = await importsQueries.get({ limit, offset, filters })

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            // add data
            data = await getImports(data, idBranch)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
}
module.exports = getController

