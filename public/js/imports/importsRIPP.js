import g from "./globals.js"
import gg from "../globals.js"

// create edit item popup (ceipp)
async function rippEventListeners() {

    const elementsToChange = [rippTc,rippFreight, rippInsurance, rippForwarder, rippDomesticFreight, rippDispatchExpenses, rippOfficeFees, rippContainerCosts, rippPortExpenses, rippDutiesTariffs, rippContainerInsurance, rippPortContribution, rippOtherExpenses]

    // change element
    elementsToChange.forEach(element => {

        element.addEventListener('change',async()=>{

            loader.style.display = 'block'

            // inputs
            const tc = rippTc.value == '' ? null : Number(rippTc.value.replace(',','.'))
            const freight = rippFreight.value == '' ? null : Number(rippFreight.value.replace(',','.'))
            const insurance = rippInsurance.value == '' ? null : Number(rippInsurance.value.replace(',','.'))
            const forwarder = rippForwarder.value == '' ? null : Number(rippForwarder.value.replace(',','.'))
            const domesticFreight = rippDomesticFreight.value == '' ? null : Number(rippDomesticFreight.value.replace(',','.'))
            const dispatchExpenses = rippDispatchExpenses.value == '' ? null : Number(rippDispatchExpenses.value.replace(',','.'))
            const officeFees = rippOfficeFees.value == '' ? null : Number(rippOfficeFees.value.replace(',','.'))
            const containerCosts = rippContainerCosts.value == '' ? null : Number(rippContainerCosts.value.replace(',','.'))
            const portExpenses = rippPortExpenses.value == '' ? null : Number(rippPortExpenses.value.replace(',','.'))
            const dutiesTariffs = rippDutiesTariffs.value == '' ? null : Number(rippDutiesTariffs.value.replace(',','.'))
            const containerInsurance = rippContainerInsurance.value == '' ? null : Number(rippContainerInsurance.value.replace(',','.'))
            const portContribution = rippPortContribution.value == '' ? null : Number(rippPortContribution.value.replace(',','.'))
            const otherExpenses = rippOtherExpenses.value == '' ? null : Number(rippOtherExpenses.value.replace(',','.'))

            // calculations
            const nullInputs = elementsToChange.some(i => i.value == '')
            const fob = g.importToEdit.calculated_data.fob
            const fobLocalCurrency = tc == null ? null : tc * fob
            const cif = (tc == null || freight == null || insurance == null) ? null : (fobLocalCurrency + freight + insurance)
            const expenses = nullInputs ? null : (freight + insurance + forwarder + domesticFreight + dispatchExpenses + officeFees + containerCosts + portExpenses + dutiesTariffs + containerInsurance + portContribution + otherExpenses)
            const costs = nullInputs ? null : (fobLocalCurrency + expenses)
            const volumeExpenses = nullInputs ? null : (forwarder + domesticFreight + portExpenses + containerInsurance + portContribution + otherExpenses)
            const priceExpenses = nullInputs ? null : (dispatchExpenses + officeFees + containerCosts)
            const cost = nullInputs ? null : (costs / tc)
            const costVsFob = nullInputs ? null : (cost / fob - 1)

            // complete inputs
            rippFobLocalCurrency.value = fobLocalCurrency == null ? '' : gg.formatter2.format(fobLocalCurrency)
            rippCif.value = cif == null ? '' : gg.formatter2.format(cif)
            rippExpenses.value = expenses == null ? '' : gg.formatter2.format(expenses)
            rippCosts.value = costs == null ? '' : gg.formatter2.format(costs)
            rippVolumeExpenses.value = nullInputs ? '' : gg.formatter2.format(volumeExpenses)
            rippPriceExpenses.value = nullInputs ? '' : gg.formatter2.format(priceExpenses)
            rippCost.value = nullInputs ? '' : gg.formatter2.format(cost)
            rippCostVsFob.value = nullInputs ? '' : gg.formatter2.format(costVsFob*100)
            rippRealVsEstimated.value = nullInputs ? '' : gg.formatter2.format((cost / g.importToEdit.calculated_data.estimated_cost - 1)*100)

            if (!nullInputs) {
                if (cost > g.importToEdit.calculated_data.estimated_cost) {
                    rippRealVsEstimated.classList.add('fc-error')
                    rippRealVsEstimated.classList.remove('fc-green')
                } else {
                    rippRealVsEstimated.classList.remove('fc-error')
                    rippRealVsEstimated.classList.add('fc-green')
                }
            }

            loader.style.display = 'none'

        })
    })

    // save changes
    rippAccept.addEventListener('click',async()=>{
        const nullInputs = elementsToChange.some(i => i.value == '')
        if (nullInputs || rippDate.value == '') {
            rippError.classList.remove('not-visible')
        }else{
            rippError.classList.add('not-visible')
            coppText.innerHTML = '¿Confirma que desea guardar los datos?'
            copp.style.display = 'block'
        }
        
    })
    
}

export { rippEventListeners }