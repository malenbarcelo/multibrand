import g from "./globals.js"

// create edit item popup (ceipp)
async function rippEventListeners() {

    const elementsToChange = [rippTc,rippFreight, rippInsurance, rippForwarder, rippDomesticFreight, rippDispatchExpenses, rippOfficeFees, rippContainerCosts, rippPortExpenses, rippDutiesTariffs, rippContainerInsurance, rippPortContribution, rippOtherExpenses]

    // change element
    elementsToChange.forEach(element => {

        element.addEventListener('change',async()=>{

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
            const fob = g.importToEdit.calculated_data.fob
            const fobArs = tc == null ? null : tc * fob
            const cif = (tc == null || freight == null || insurance == null) ? null : (fobArs + freight + insurance)
            const expenses = (freight == null || insurance == null || forwarder == null || domesticFreight == null || dispatchExpenses == null || officeFees == null || containerCosts == null || portExpenses == null || dutiesTariffs == null || containerInsurance == null || portContribution == null || otherExpenses == null) ? null : (freight + insurance + forwarder + domesticFreight + dispatchExpenses + officeFees + containerCosts + portExpenses + dutiesTariffs + containerInsurance + portContribution + otherExpenses)
            const costs = (cif == null || expenses == null) ? null : (cif + expenses)

            // complete inputs
            rippFobArs.value = fobArs == null ? '' : String(fobArs).replace('.',',')
            rippCif.value = cif == null ? '' : String(cif).replace('.',',')
            rippExpenses.value = expenses == null ? '' : String(expenses).replace('.',',')
            rippCosts.value = costs == null ? '' : String(costs).replace('.',',')

        })
    })
    
}

export { rippEventListeners }