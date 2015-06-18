Ext.define('eleve.model.Categorie', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'PosX',       type: 'float'},
            {name: 'PosY',       type: 'float'},
            {name: 'ProjetId', type: 'int'},
            {name: 'MapId', type: 'int'},
            {name: 'CategorieId', type: 'int'}
        ]
    }
});