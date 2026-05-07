let g = {
    master:[],
    suppliers:[],
    mus:[],
    currenciesExchanges: [],
    branchData: null,
    popups: [copp, fapp, ceipp],
    ceippInputs: [ceippSupplier, ceippItem, ceippDescription, ceippFob, ceippMu, ceippMuPerBox, ceippWeight, ceippVolume, ceippBrand, ceippOrigin, ceippBreaks, ceippSpecialPriceFactor, ceippCfFactor,ceippMeLiFactor,ceippObservations],
    elementsToFormat: [ceippFob, ceippMuPerBox, ceippWeight, ceippVolume, ceippSpecialPriceFactor, ceippCfFactor, ceippMeLiFactor],
    // imports
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        order:'[["id_suppliers","ASC"],["item","ASC"]]',
        supplier_string:'',
        item_string:'',
        description: '',
        volume_null: '',
        weight_null: '',
        last_list_number: 1,
        enabled: 1
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    elementToEdit: null,
    action: null,
    confirmation: null
}

export default g