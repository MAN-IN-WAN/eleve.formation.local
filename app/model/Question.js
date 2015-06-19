Ext.define('eleve.model.Question', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Nom',      type: 'string'},
            {name: 'Ordre', type: 'int'},
            {name: 'CategorieId', type: 'int'}
        ]
    },
    /**
     * getPosition
     * Recherche la position sur la carte
     */
    getMapPosition: function (){
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        var cat = catStore.getById(this.get('CategorieId'));
        return  cat.getMapPosition();
    },
    /**
     * getBloquage
     * Recherche la catégorie de bloquage
     */
    getBloquage: function (){
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        var cat = catStore.getById(this.get('CategorieId'));
        return  cat.getBloquage();
    },
    /**
     * getPosition
     * Recherche la catégorie de position
     */
    getPosition: function (){
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        var cat = catStore.getById(this.get('CategorieId'));
        return  cat.getPosition();
    }
});