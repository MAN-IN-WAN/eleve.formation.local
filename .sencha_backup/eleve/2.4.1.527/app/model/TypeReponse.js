Ext.define('eleve.model.TypeReponse', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'Description',      type: 'text'}
        ]
    }
});