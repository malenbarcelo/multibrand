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

    // apply filters
    const filterInputs = [supplier, item, description, volumeFilter, weightFilter]
    filterInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                applyFilters.click()
            }
        })
    })

    applyFilters.addEventListener('click', async () => {
        loader.style.display = 'block'

        g.filters.id_suppliers = supplier.value
        g.filters.item_string = item.value
        g.filters.description = description.value
        g.filters.volume_null = volumeFilter.checked ? 'null' : ''
        g.filters.weight_null = weightFilter.checked ? 'null' : ''

        await utils.resetData()

        // update filter button state
        const hasFilters = supplier.value || item.value || description.value || volumeFilter.checked || weightFilter.checked
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

        supplier.value = ''
        item.value = ''
        description.value = ''
        volumeFilter.checked = false
        weightFilter.checked = false
        g.filters.id_suppliers = ''
        g.filters.item_string = ''
        g.filters.description = ''
        g.filters.volume_null = ''
        g.filters.weight_null = ''

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
        // clear disabled inputs
        ceippFreight.value = ''
        ceippCif.value = ''
        ceippImportDuty.value = ''
        ceippVolumeExpenses.value = ''
        ceippPriceExpenses.value = ''
        ceippCoefFactor.value = ''
        ceippMuCost.value = ''
        ceippUnitCost.value = ''
        ceippSuggestedPrice.value = ''
        ceippExchange.value = ''
        ceippSuggestedPriceLocalCurrency.value = ''
        ceippSellsPriceLocalCurrency.value = ''
        ceippMargin.value = ''
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





