Ext.define("eleve.store.TypeQuestionValeurs", {
    extend: 'Ext.data.Store',
    alias: 'store.TypeQuestionValeurs',
    config: {
        model: 'eleve.model.TypeQuestionValeur',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreTypeQuestionValeur(),
            method: 'POST',
            actionMethods: {
                create : 'POST',
                read   : 'POST', // by default GET
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});