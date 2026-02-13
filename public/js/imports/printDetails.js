import g from "./globals.js"
import gg from "../globals.js"
import { utils } from "./utils.js"

async function printDetails() {
    
    ceippBody.innerHTML = ''
    let html = ''
    g.details = g.details.sort((a, b) => a.item.localeCompare(b.item))
    const data = g.details

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-6-0 body-even' : 'ta-c fs-12 pad-6-0 body-odd'
        const checkStatus = element.pays_duties_tarifs == 1 ? 'checked' : ''

        html += `
            <tr class="pointer" id="ceippTr_${element.idx}">
                <td class="${rowClass}">${element.item}</td>
                <td class="${rowClass}">${element.description}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.mu_quantity)}</td>
                <td class="${rowClass}">${element.mu}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.fob)}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.mu_per_box)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.volume_m3)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.weight_kg)}</td>
                <td class="${rowClass}">${gg.formatter1.format(element.boxes)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.totalFob)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.totalVolume)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.totalWeight)}</td>
                <td class="${rowClass}"><input type="checkbox" class="pointer" ${checkStatus} id="ceippCheck_${element.idx}"></td>
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square fs-12" id="ceippEdit_${element.idx}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can fs-12" id="ceippDestroy_${element.idx}"></i></td>
            </tr>
            `
    })

    ceippBody.innerHTML = html

    // update summary
    utils.updatePoSummary()

    eventListeners(data)
}

function eventListeners(data) {

    data.forEach(element => {

        const edit = document.getElementById('ceippEdit_' + element.idx)
        const destroy = document.getElementById('ceippDestroy_' + element.idx)
        const check = document.getElementById('ceippCheck_' + element.idx)
        const tr = document.getElementById('ceippTr_' + element.idx)

        // edit
        edit.addEventListener('click',async()=>{
            loader.style.display = 'block'
            eippTitle.innerText = 'EDITAR ITEM ' + element.item
            eippFob.value = String(element.fob).replace('.',',')
            eippQty.value = element.mu_quantity
            const fob = Number(g.details.find(d => d.item == element.item).fob)
            const currency = g.importToEdit.supplier_data.currency_data.currency
            eippFobText.innerText = '(FOB lista: ' + currency + ' ' + gg.formatter3.format(fob) + ')'
            eippError.classList.add('not-visibe')
            g.itemToEdit = element            
            eipp.style.display = 'block'
            eippFob.focus()
            loader.style.display = 'none'
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        // destroy
        destroy.addEventListener('click',async()=>{
            loader.style.display = 'block'
            g.details = g.details.filter(i => i.idx != element.idx)
            printDetails()
            loader.style.display = 'none'
        })

        // check
        check.addEventListener('click',async()=>{

            loader.style.display = 'block'
            
            const detail = g.details.find( d => d.idx == element.idx)
            
            if (check.checked) {
                detail.pays_duties_tarifs = 1
            }else{
                detail.pays_duties_tarifs = 0
            }

            // general check
            const payDuties = g.details.filter( d => d.pays_duties_tarifs == 1)

            if (payDuties.length == g.details.length) {
                ceippCheck.checked = true
            }else{
                ceippCheck.checked = false
            }

            loader.style.display = 'none'
        })
    })
}

export { printDetails }