const bottomHeaderMenu = [
    {
        id:1,
        name:'MAESTRO',
        href:'/maestro',
        subitems:[]
    },
    {
        id:2,
        name:'IMPORTACIONES',
        href:'/importaciones',
        subitems:[]
    },
    {
        id:3,
        name:'DATOS GENERALES',
        href:'',
        subitems:[
            {
                id:1,
                name:'FACTORES POR COEFICIENTE',
                href:'/factores-coeficiente'
            },
            {
                id:2,
                name:'FACTORES POR VOLUMEN',
                href:'/factores-volumen'
            },
            {
                id:3,
                name:'MONEDAS',
                href:'/monedas'
            },
            {
                id:4,
                name:'PROVEEDORES',
                href:'/proveedores'
            }
        ]
    }
]

module.exports = bottomHeaderMenu

