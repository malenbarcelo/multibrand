import g from "./globals.js"
import { utils } from "./utils.js"
import { printTable } from "./printTable.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"

// popups
import { spppEventListeners} from "./pricesListsSPPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // reset data
    g.filters.size = 25
    utils.resetData()

    // // show tooltips
    // gu.showTooltips(g.tooltips,219,150)

    // close popups
    gu.closePopups(g.popups)

    // close with escape
    gu.closeWithEscape(g.popups)

    // // allows only number with ',' and 3 decimals
    // gu.replaceDotWithComa(g.elementsToFormat,3)

    // popups event listeners
    spppEventListeners()
    
    // add page with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await utils.getData()                    
                    g.data = [...g.data, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    // // filters
    // const filters = [supplier, item, description]

    // for (const filter of filters) {
        
    //     filter.addEventListener("change", async () => {
            
    //         // show loader
    //         loader.style.display = 'block'

    //         //complete filters
    //         g.filters.id_suppliers = supplier.value
    //         g.filters.item_string = item.value
    //         g.filters.description = description.value
            
    //         await utils.resetData()

    //         // hide loader
    //         loader.style.display = 'none'
    //     })
    // }

    // // unfilter event listener
    // unfilter.addEventListener("click", async() => {        
        
    //     // show loader
    //     loader.style.display = 'block'
        
    //     // reset filters
    //     gu.clearInputs(filters)
    //     g.filters.id_suppliers = ''
    //     g.filters.item_string = ''
    //     g.filters.description = ''
        
    //     await utils.resetData()
        
    //     // hide loader
    //     loader.style.display = 'none'
    // })

    // print prices for customers in excel
    printExcel.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        const response = await fetch(domain + 'composed/print-excel',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Lista de precios Distribuidor.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } else {
            console.error('Error al descargar el archivo:', response.statusText)
        }

        loader.style.display = 'none'
    })

    // print prices for customers in pdf
    printPdf.addEventListener('click',async()=>{
        spppError.classList.add('not-visible')
        sppp.style.display = 'block'
    })

    loader.style.display = 'none'
    
})






