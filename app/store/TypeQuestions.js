Ext.define("eleve.store.TypeQuestions", {
    extend: 'Ext.data.Store',
    alias: 'store.TypeQuestions',
    config: {
        model: 'eleve.model.TypeQuestion',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreTypeQuestion(),
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