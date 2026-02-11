import g from "./globals.js"
import { utils } from "./utils.js"
import { gu } from "../globalUtils.js"
import { domain } from "../domain.js"
import { printImports } from "./printImports.js"
import { printDetails } from "./printDetails.js"

// popups
import { ceippEventListeners} from "./importsCEIPP.js"
import { ssppEventListeners} from "./importsSSPP.js"
import { coppEventListeners} from "./importsCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 20
    g.suppliers = await (await fetch(`${domain}get/suppliers`)).json()
    g.branchData = await (await fetch(`${domain}composed/get-branch`)).json()

    // get data
    await utils.resetData()

    console.log(g.imports)

    // show tooltips
    gu.showTooltips(g.tooltips,217,150)

    // close popups
    gu.closePopups(g.popups)

    // close with escape
    gu.closeWithEscape(g.popups)

    // popups event listeners
    ceippEventListeners()
    ssppEventListeners()
    coppEventListeners()

    // add page with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await utils.getData()                    
                    g.imports = [...g.imports, ...newData]
                    printImports()
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
    //     g.filters.item = ''
        
    //     await utils.resetData()
        
    //     // hide loader
    //     loader.style.display = 'none'
    // })

    // create po
    create.addEventListener("click", async() => {
        ssppSupplier.value = ''
        ssppError.classList.remove('not-visible')
        sspp.style.display = 'block'
    })

    loader.style.display = 'none'
    
})





