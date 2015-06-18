Ext.define("eleve.store.Questions", {
    extend: 'Ext.data.Store',
    alias: 'store.Questions',
    config: {
        model: 'eleve.model.Question',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreQuestion(),
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