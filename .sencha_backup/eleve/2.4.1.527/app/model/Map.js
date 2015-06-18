Ext.define('eleve.model.Map', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'Fichier',       type: 'string'},
            {name: 'Largeur',       type: 'int'},
            {name: 'Hauteur',       type: 'int'}
        ]
    }
});