Ext.define("eleve.store.Categories", {
    extend: 'Ext.data.Store',
    alias: 'store.Cars',
    config: {
        model: 'eleve.model.Categorie',
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: eleve.utils.Config.getStoreCategorie(),
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