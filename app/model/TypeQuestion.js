Ext.define('eleve.model.TypeQuestion', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'TypeReponse',      type: 'string'},
            {name: 'AfficheOui',      type: 'bool'},
            {name: 'AfficheNon',      type: 'bool'},
            {name: 'QuestionId',      type: 'int'}
        ]
    }
});