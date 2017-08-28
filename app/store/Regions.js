Ext.define("eleve.store.Regions", {
    extend: 'Ext.data.Store',
    alias: 'store.Regions',
    config: {
        model: 'eleve.model.Region',
        clearOnPageLoad: false,
        pageSize: 30,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreRegion(),
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