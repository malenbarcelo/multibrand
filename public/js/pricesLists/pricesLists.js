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

    // filter drawer
    openFilters.addEventListener('click', () => {
        filterDrawer.classList.add('fd-open')
        filterDrawerOverlay.classList.add('fd-visible')
    })

    filterDrawerClose.addEventListener('click', () => {
        filterDrawer.classList.remove('fd-open')
        filterDrawerOverlay.classList.remove('fd-visible')
    })

    filterDrawerOverlay.addEventListener('click', () => {
        filterDrawer.classList.remove('fd-open')
        filterDrawerOverlay.classList.remove('fd-visible')
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterDrawer.classList.contains('fd-open')) {
            filterDrawer.classList.remove('fd-open')
            filterDrawerOverlay.classList.remove('fd-visible')
        }
    })

    // enter to apply
    const filterInputs = [listName, category, supplier, item, description]
    filterInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                applyFilters.click()
            }
        })
    })

    // apply filters
    applyFilters.addEventListener('click', async () => {
        loader.style.display = 'block'

        g.filters.list_name = listName.value
        g.filters.category_name = category.value
        g.filters.id_suppliers = supplier.value
        g.filters.item_string = item.value
        g.filters.description = description.value

        await utils.resetData()

        const hasFilters = listName.value || category.value || supplier.value || item.value || description.value
        if (hasFilters) {
            openFilters.classList.add('filter-active')
            clearFiltersBtn.classList.remove('not-visible')
        } else {
            openFilters.classList.remove('filter-active')
            clearFiltersBtn.classList.add('not-visible')
        }

        filterDrawer.classList.remove('fd-open')
        filterDrawerOverlay.classList.remove('fd-visible')
        loader.style.display = 'none'
    })

    // clear filters
    clearFilters.addEventListener('click', async () => {
        loader.style.display = 'block'

        listName.value = ''
        category.value = ''
        supplier.value = ''
        item.value = ''
        description.value = ''
        g.filters.list_name = ''
        g.filters.category_name = ''
        g.filters.id_suppliers = ''
        g.filters.item_string = ''
        g.filters.description = ''

        await utils.resetData()

        openFilters.classList.remove('filter-active')
        clearFiltersBtn.classList.add('not-visible')

        filterDrawer.classList.remove('fd-open')
        filterDrawerOverlay.classList.remove('fd-visible')
        loader.style.display = 'none'
    })

    // clear filters from button outside drawer
    clearFiltersBtn.addEventListener('click', async () => {
        clearFilters.click()
    })

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

    // print erp prices
    printErp.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        const response = await fetch(domain + 'composed/print-erp',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
        })

        if (response.ok) {
            const contentType = response.headers.get('Content-Type')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = contentType.includes('zip') ? 'Flexxus Listas.zip' : 'Listas Defontana.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } else {
            console.error('Error al descargar el archivo:', response.statusText)
        }

        loader.style.display = 'none'
    })

    // download prices lists
    download.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        const data = {
            list_name: g.filters.list_name,
            category_name: g.filters.category_name,
            id_suppliers: g.filters.id_suppliers,
            item_string: g.filters.item_string,
            description: g.filters.description,
            enabled: g.filters.enabled,
            order: g.filters.order
        }

        const response = await fetch(domain + 'composed/download-prices-lists',{
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






