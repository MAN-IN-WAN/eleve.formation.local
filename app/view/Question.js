Ext.define('eleve.view.Question', {
    extend: 'Ext.Panel',
    xtype: 'question',
    requires: [
        'Ext.TitleBar',
        'Ext.Img',
        'Ext.field.Slider',
        'Ext.form.TextArea',
        'Ext.field.Toggle'
    ],
    config: {
        title: 'Carte Pédagogique',
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: eleve.utils.Config.getAppTitle()
            },
            {
                xtype: 'panel',
                style: 'margin: 0 20px;',
                action: 'scrollableContainer',
                height: '100%',
                scrollable: true,
                items: [
                    {
                        action: 'catHistory',
                        style: 'overflow:hidden;',
                        html: ''
                    },
                    {
                        style: 'margin-top: 10px;',
                        action: 'questionTitle',
                        html: ''
                    },
                    {
                        action: 'questionContainer'
                    },
                    {
                        xtype: 'button',
                        action: 'nextButton',
                        text: 'Suivant',
                        handler: function (){
                            this.up('[action=scrollableContainer]').getScrollable().getScroller().scrollTo(0,0,true);
                        }
                    }
                ]
            }
        ]
    },
    setRecord: function (record) {
        //sauvegarde de l'enregistrement
        this._record = record;

        //reset la fiche
        this.resetView();

        //intiilisation de la question
        console.log('affichage de la question',record);
        if (record) {
            //génération du fil d'ariane.
            //a partir de la question recherche de la catégorie directement reliée.
            var catStore = Ext.getStore('Categories');
            catStore.clearFilter();
            var c = catStore.getById(record.get('CategorieId'));
            console.log('categorie id ', c.get('id'));

            var h = this.getCatHistory(c.get('id'));
            this.down('[action=catHistory]').setHtml(h[0]+h[1]);

            //génératio ndu titre de la question
            this.down('[action=questionTitle]').setHtml('<h1>'+record.get('Nom')+'</h1>');

            //Récupération du/des types questions
            var tqStore = Ext.getStore('TypeQuestions');
            var me = this;
            tqStore.filter('QuestionId',record.get('id'));
            tqStore.each(function (item,index){

                //ajout des typeQuestion
                switch (item.get('TypeReponse')) {
                    case "1": //Jauge
                        if (item.get('Nom').length)
                            //Ajout du titre de typeQuestion si il y a
                            me.down('[action=questionContainer]').add({html: '<h2>'+item.get('Nom')+'</h2>'});

                            //me.down('[action=scrollableContainer]').setScrollable(false);
                            me.down('[action=questionContainer]').add({
                            style: 'text-align: center',
                            html: '<input type="text" class="dial" value="0" data-cursor="true" id="jauge-'+item.get('id')+'">'
                        });
                        $(".dial").knob({
                            'width': '100%',
                            'min':0,
                            'max':100,
                            'angleOffset': -90,
                            'angleArc': 180,
                            'value': 0,
                            'thickness': 0.6,
                            'fgColor': '#4d4d4d',
                            'bgColor': 'transparent'
                        });
                        break;
                    case "2": //Echelle
                        me.down('[action=questionContainer]').add({
                            xtype: 'sliderfield',
                            maxValue: 5,
                            labelAlign: 'top',
                            id: 'echelle-'+item.get('id'),
                            label:item.get('Nom'),
                            html: '<table width="100%"><tr><td width="14%" align="center">1</td><td width="14%" align="center">2</td><td width="14%" align="center">3</td><td width="14%" align="center">4</td><td width="14%" align="center">5</td><td width="14%" align="center">6</td></tr></table>'
                        });
                        break;
                    case "3": //Texte
                        var temp = {
                            xtype: 'textareafield',
                            labelAlign: 'top',
                            id: 'texte-'+item.get('id'),
                            label:item.get('Nom')
                        };
                        if (item.get('AfficheOui')){
                            temp.action = 'AfficheOui';
                            temp.hidden = true;
                        }
                        if (item.get('AfficheNon')){
                            temp.action = 'AfficheNon';
                            temp.hidden = true;
                        }
                        me.down('[action=questionContainer]').add(temp);
                        break;
                    case "4": //Booleen
                        me.down('[action=questionContainer]').add({
                            xtype: 'togglefield',
                            label:item.get('Nom'),
                            id: 'booleen-'+item.get('id'),
                            listeners: {
                                change: function (tf){
                                    console.log('toggle change',tf.getValue());
                                    if (tf.getValue()){
                                        //reponse vrai on affiche les éléments correspondants
                                        Ext.each(me.query('[action=AfficheOui]'),function (it2){
                                            it2.setHidden(false);
                                        });
                                        Ext.each(me.query('[action=AfficheNon]'),function (it3) {
                                            it3.setHidden(true);
                                        });
                                    }else{
                                        Ext.each(me.query('[action=AfficheOui]'),function (it2){
                                            it2.setHidden(true);
                                        });
                                        Ext.each(me.query('[action=AfficheNon]'),function (it3) {
                                            it3.setHidden(false);
                                        });
                                    }
                                }
                            }
                        });
                        break;
                    case "5": //Sélection
                        var tqv = Ext.getStore('TypeQuestionValeurs');
                        var opts= [];
                        tqv.each(function (item, index){
                            opts.push({
                                name: 'question_'+record.get('Id'),
                                value: item.get('id'),
                                label: item.get('Valeur')
                            });
                        });
                        me.down('[action=questionContainer]').add({
                            xtype: 'fieldset',
                            id: 'selection-'+item.get('id'),
                            defaults: {
                                xtype: 'radiofield',
                                labelWidth: '70%'
                            },
                            items: opts
                        });
                        break;
                }
            });
        }
    },
    _error: false,
    _lastBoolean: null,
    getResults: function () {
        this._error = false;
        this._lastBoolean = null;

        //recupération du record
        var record = this._record;
        var results = [];

        //Récupération du/des types questions
        var tqStore = Ext.getStore('TypeQuestions');
        var me = this;
        tqStore.filter('QuestionId',record.get('id'));
        tqStore.each(function (item,index){

            //ajout des typeQuestion
            switch (item.get('TypeReponse')) {
                case "1": //Jauge
                    //récupération de l'id
                    var jauge = $('#jauge-'+item.get('id'));
                    results[item.get('id')] = jauge.val();
                    break;
                case "2": //Echelle
                    var echelle = Ext.getCmp('echelle-'+item.get('id'));
                    results[item.get('id')] = echelle.getValue()[0];
                    break;
                case "3": //Texte
                    var texte = Ext.getCmp('texte-'+item.get('id'));
                    results[item.get('id')] = texte.getValue();
                    if (!texte.getValue().length&&
                        ((item.get('AfficheOui')&&me._lastBoolean&&me._lastBoolean.getValue())||
                        (me._lastBoolean&&!me._lastBoolean.getValue()&&item.get('AfficheNon'))||
                        (me._lastBoolean&&!item.get('AfficheOui')&&!item.get('AfficheNon'))||
                        !me._lastBoolean)){
                        me._error = true;
                        Ext.Msg.alert('Problème de saisie', 'Veuillez vérifier votre saisie. Tous les champs sont obligatoires');
                    }
                    break;
                case "4": //Booleen
                    var booleen = Ext.getCmp('booleen-'+item.get('id'));
                    results[item.get('id')] = booleen.getValue();
                    me._lastBoolean = booleen;
                    break;
                case "5": //Sélection
                    var selection = Ext.getCmp('selection-'+item.get('id')).query('radiofield');
                    if (!selection[0].getGroupValue()){
                        Ext.Msg.alert('Problème de saisie','Veuillez choisir un élément de la liste.');
                        me._error = true;
                    }
                    results[item.get('id')] = selection[0].getGroupValue();
                    break;
            }
        });
        if (this._error) return false;
        else return results;
    },
    getCatHistory: function (id) {
        var out;
        var catStore = Ext.getStore('Categories');
        var c = catStore.getById(id);
        if (c.get('Afficher')) {
            out = [
                '<ul ' + (!c.get('CategorieId') ? 'id="breadcrumb"' : '') + '><li><div class="arrow-right"></div>' + c.get('Nom'),
                '</li></ul>'
            ];
        }else out = ['',''];

        //si il y a un parent on concatène la chaine
        if (c.get('CategorieId')){
            p = this.getCatHistory(c.get('CategorieId'));
            out[0]  = p[0] + out[0];
            out[1]  = out[1] + p[1];
        }
        return out;
    },
    resetView: function () {
        this.down('[action=questionContainer]').removeAll();
    }
});
