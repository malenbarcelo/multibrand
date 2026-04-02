import g from "./globals.js"
import { printTable } from "./printTable.js"
import { utils } from "./utils.js"
import { gu } from "../globalUtils.js"
import { domain } from "../domain.js"

// popups
import { ceippEventListeners} from "./masterCEIPP.js"
import { coppEventListeners} from "./masterCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 25
    g.master = await utils.getData()
    g.suppliers = await (await fetch(`${domain}get/suppliers`)).json()
    g.branchData = await (await fetch(`${domain}composed/get-branch`)).json()
    g.mus = await (await fetch(`${domain}get/measurement-units`)).json()
    g.currenciesExchanges = await (await fetch(`${domain}composed/get-last-currencies-exchanges`)).json()
    
    // print table
    printTable()

    // show tooltips
    gu.showTooltips(g.tooltips,219,150)

    // close popups
    gu.closePopups(g.popups)

    // close with escape
    gu.closeWithEscape(g.popups)

    // allows only number with ',' and 3 decimals
    gu.replaceDotWithComa(g.elementsToFormat,3)

    // popups event listeners
    ceippEventListeners()
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
                    g.master = [...g.master, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    // filters
    const filters = [supplier, item, description]

    for (const filter of filters) {
        
        filter.addEventListener("change", async () => {
            
            // show loader
            loader.style.display = 'block'

            //complete filters
            g.filters.id_suppliers = supplier.value
            g.filters.item_string = item.value
            g.filters.description = description.value
            
            await utils.resetData()

            // hide loader
            loader.style.display = 'none'
        })
    }

    // unfilter event listener
    unfilter.addEventListener("click", async() => {        
        
        // show loader
        loader.style.display = 'block'
        
        // reset filters
        gu.clearInputs(filters)
        g.filters.id_suppliers = ''
        g.filters.item_string = ''
        g.filters.description = ''
        
        await utils.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })

    // create item
    create.addEventListener("click", async() => {
        g.action = 'create'
        ceippTitle.innerText = 'CREAR ITEM'
        ceippDestroy.classList.add('not-visible')
        ceipp.style.display = 'block'
        ceippContent.scrollTop = 0
        ceippSupplier.value = ''
        ceippSupplier.disabled = false
        ceippSupplierLabel.style.display = 'block'
        ceippError.classList.add('not-visible')
        gu.clearInputs(g.ceippInputs)
        ceippSupplier.dispatchEvent(new Event('change'))
        ceippSupplier.focus()
    })

    // download master
    download.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        const data = {
            id_suppliers: g.filters.id_suppliers,
            item_string: g.filters.item_string,
            description: g.filters.description,
            last_list_number: g.filters.last_list_number,
            enabled: g.filters.enabled,
            order: [["id_suppliers","ASC"],["item","ASC"]]  
        }

        const response = await fetch(domain + 'composed/download-master',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Lista de precios.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo:', response.statusText);
        }

        loader.style.display = 'none'
    })

    loader.style.display = 'none'
    
})





