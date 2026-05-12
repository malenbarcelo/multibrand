import g from "./globals.js"
import { printTable } from "./printTable.js"
// import { utils } from "./utils.js"
import { gu } from "../globalUtils.js"
import { domain } from "../domain.js"

// popups
// import { ceippEventListeners} from "./masterCEIPP.js"
// import { coppEventListeners} from "./masterCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.currencies = await (await fetch(`${domain}composed/get-last-currencies-exchanges`)).json()

    // print table
    printTable()

    // close popups
    gu.closePopups(g.popups)

    // close with escape
    gu.closeWithEscape(g.popups)

    // allows only number with ',' and 3 decimals
    gu.replaceDotWithComa(g.elementsToFormat,3)

    // popups event listeners
    // ceippEventListeners()
    // coppEventListeners()

    // create item
    // create.addEventListener("click", async() => {
    //     g.action = 'create'
    //     ceippTitle.innerText = 'CREAR ITEM'
    //     ceippDestroy.classList.add('not-visible')
    //     ceipp.style.display = 'block'
    //     ceippContent.scrollTop = 0
    //     ceippSupplier.value = ''
    //     ceippSupplier.disabled = false
    //     ceippSupplierLabel.style.display = 'block'
    //     ceippError.classList.add('not-visible')
    //     gu.clearInputs(g.ceippInputs)
    //     // clear disabled inputs
    //     ceippFreight.value = ''
    //     ceippCif.value = ''
    //     ceippImportDuty.value = ''
    //     ceippVolumeExpenses.value = ''
    //     ceippPriceExpenses.value = ''
    //     ceippCoefFactor.value = ''
    //     ceippMuCost.value = ''
    //     ceippUnitCost.value = ''
    //     ceippSuggestedPrice.value = ''
    //     ceippExchange.value = ''
    //     ceippSuggestedPriceLocalCurrency.value = ''
    //     ceippSellsPriceLocalCurrency.value = ''
    //     ceippMargin.value = ''
    //     ceippSupplier.dispatchEvent(new Event('change'))
    //     ceippSupplier.focus()
    // })

    loader.style.display = 'none'
    
})





