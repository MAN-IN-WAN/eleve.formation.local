Ext.define('eleve.model.Question', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'Ordre', type: 'int'},
            {name: 'CategorieId', type: 'int'}
        ]
    }
});