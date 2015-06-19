Ext.define('eleve.model.Categorie', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',          type: 'int'},
            {name: 'Prefixe',      type: 'string'},
            {name: 'Nom',      type: 'string'},
            {name: 'PosX',       type: 'float', defaultValue:0 },
            {name: 'PosY',       type: 'float', defaultValue:0},
            {name: 'Bloque', type: 'bool'},
            {name: 'Afficher', type: 'bool'},
            {name: 'Position', type: 'bool'},
            {name: 'ProjetId', type: 'int'},
            {name: 'MapId', type: 'int'},
            {name: 'CategorieId', type: 'int'}
        ]
    },
    /**
     * getMapPosition
     * Recherche la position sur la carte
     */
    getMapPosition: function (){
        if (this.get('Position')){
            //recherche de la map associée
            var mapStore = Ext.getStore('Maps');
            var map = mapStore.getById(this.get('MapId'));

            //c'est la catégorie significative
            return {
                posx: (this.get('PosX')!=null)?this.get('PosX'): 0,
                posy: (this.get('PosY')!=null)?this.get('PosY'): 0,
                map:{
                    url: _prefixDomain+'/'+map.get('Fichier')+'.limit.1024x1024.jpg',
                    width: map.get('Largeur'),
                    height: map.get('Hauteur')
                }
            };
        }
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        catStore.clearFilter();
        var cat = catStore.getById(this.get('CategorieId'));
        if (cat)
            return cat.getMapPosition();
    },
    /**
     * getBloquage
     * Recherche la position sur la carte
     */
    getBloquage: function (){
        if (this.get('Bloque')){
            //c'est la catégorie significative
            return {
                cat: this.get('id')
            };
        }
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        catStore.clearFilter();
        var cat = catStore.getById(this.get('CategorieId'));
        if (cat)
            return cat.getBloquage();
    },
    /**
     * getPosition
     * Recherche la position sur la carte
     */
    getPosition: function (){
        if (this.get('Position')){
            //c'est la catégorie significative
            return {
                cat: this.get('id')
            };
        }
        //recherche de la categorie significative de manière récursive
        var catStore = Ext.getStore('Categories');
        catStore.clearFilter();
        var cat = catStore.getById(this.get('CategorieId'));
        if (cat)
            return cat.getPosition();
    }
});