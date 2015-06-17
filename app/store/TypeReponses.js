Ext.define("eleve.store.TypeReponses", {
    extend: 'Ext.data.Store',
    alias: 'store.TypeReponses',
    config: {
        model: 'eleve.model.TypeReponse',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreTypeReponse(),
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