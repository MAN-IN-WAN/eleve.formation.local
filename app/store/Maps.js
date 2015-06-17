Ext.define("eleve.store.Maps", {
    extend: 'Ext.data.Store',
    alias: 'store.Maps',
    config: {
        model: 'eleve.model.Map',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreMap(),
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