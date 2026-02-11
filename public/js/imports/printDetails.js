import g from "./globals.js"
import gg from "../globals.js"
import { utils } from "./utils.js"

async function printDetails() {
    
    ceippBody.innerHTML = ''
    let html = ''
    const data = g.details

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-6-0 body-even' : 'ta-c fs-12 pad-6-0 body-odd'
        
        html += `
            <tr class="pointer" id="tr_${element.idx}">
                <td class="${rowClass}">${element.item}</td>
                <td class="${rowClass}">${element.description}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.mu_quantity)}</td>
                <td class="${rowClass}">${element.mu}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.fob)}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.mu_per_box)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.volume_m3)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.weight_kg)}</td>
                <td class="${rowClass}">${gg.formatter1.format(element.boxes)}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.totalFob)}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.totalVolume)}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.totalWeight)}</td>
                <td class="${rowClass}"><input type="checkbox" class="pointer" id="check_${element.idx}"></td>
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square fs-12" id="edit_${element.idx}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can fs-12" id="destroy_${element.idx}"></i></td>
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

        const edit = document.getElementById('edit_' + element.idx)
        const destroy = document.getElementById('destroy_' + element.idx)
        const tr = document.getElementById('tr_' + element.idx)

        // edit
        edit.addEventListener('click',async()=>{
            // eippFob.value = 
            // ceippSupplier.focus()
            eipp.style.display = 'block'
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        // destroy
        destroy.addEventListener('click',async()=>{
            g.details = g.details.filter(i => i.idx != element.idx)
            printDetails()
        })
    })
}

export { printDetails }