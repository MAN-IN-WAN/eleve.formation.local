Ext.define('eleve.model.TypeQuestionValeur', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Valeur',      type: 'string'},
            {name: 'Image',      type: 'string'},
            {name: 'TypeQuestionId',      type: 'int'}
        ]
    }
});