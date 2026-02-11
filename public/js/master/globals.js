let g = {
    master:[],
    suppliers:[],
    mus:[],
    currenciesExchanges: [],
    branchData: null,
    popups: [copp, fapp, ceipp],
    ceippInputs: [ceippSupplier, ceippItem, ceippDescription, ceippFob, ceippMu, ceippMuPerBox, ceippWeight, ceippVolume, ceippBrand, ceippOrigin, ceippBreaks, ceippSpecialPriceFactor],
    // imports
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        order:'[["item","ASC"]]',
        id_suppliers:'',
        item_string:'',
        description: '',
        enabled: 1
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // main table tooltips
    tooltips: [
        {
            icon:eippIcon,
            right:'6.5%',
        },
        {
            icon:dippIcon,
            right:'3%',
        },
    ],
    elementToEdit: null,
    action: null,
    confirmation: null
}

export default g