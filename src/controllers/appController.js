const bottomHeaderMenu = require("../data/bottomHeaderMenu")
const { getDevSession } = require("../utils/getDevSession")
// const usersQueries = require("./dbQueries/usersQueries")
const branchesQueries = require('../dbQueries/branchesQueries')
const suppliersQueries = require('../dbQueries/suppliersQueries')
const musQueries = require('../dbQueries/measurementUnitsQueries')

// const { validationResult } = require('express-validator')

const appController = {
    login: (req,res) => {
        try{
            req.session.destroy()
            return res.render('login/login',{title:'Multibrand'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    loginProcess: async(req,res) => {
        try{

            // get session if DEV
            getDevSession(req)

            return res.redirect('/menu')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // logout
    logout: async(req,res) => {
        try{

            req.session.destroy()            
            return res.redirect('/')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    selectBranch: async(req,res) => {
        try{

            const filters = { order:[["branch","ASC"]] }
            const branches = await branchesQueries.get({filters})

            return res.render('selectBrunch',{title:'Multibrand',branches})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    setBranch: async(req,res) => {
        try{

            const keys = Object.keys(req.body)
            const idBranch = Number(keys[0])
            const branchData = await branchesQueries.get({filters:{id:idBranch}})
            req.session.branch = branchData[0]
            const redirection = '/importaciones'
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    imports: async(req,res) =>{
        try{

            const selectedItem = 'IMPORTACIONES'
            const suppliers = await suppliersQueries.get({filters:{order:[["supplier","ASC"]]}})
        
            return res.render('imports/imports',{title:'Multibrand', selectedItem, bottomHeaderMenu, suppliers})
        
        }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
        }
    },
    master: async(req,res) =>{
            try{

                // get session if DEV
                getDevSession(req)

                const suppliers = await suppliersQueries.get({filters:{order:[["supplier","ASC"]]}})
                const mus = await musQueries.get({filters:{order:[["measurement_unit","ASC"]]}})
                const selectedItem = 'MAESTRO'
            
                return res.render('master/master',{title:'Multibrand',suppliers, selectedItem, bottomHeaderMenu, mus})
            
            }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
            }
    },
}
module.exports = appController

