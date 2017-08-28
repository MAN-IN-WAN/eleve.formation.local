Ext.define('eleve.view.Question', {
    extend: 'Ext.Panel',
    xtype: 'question',
    requires: [
        'Ext.TitleBar',
        'Ext.Img',
        'Ext.field.Slider',
        'Ext.form.TextArea',
        'Ext.field.Toggle',
        'Ext.field.Number',
        'Ext.ActionSheet'
    ],
    config: {
        title: 'Carte Pédagogique',
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: eleve.utils.Config.getApplicationName()
            },
            {
                action: 'panneauConfirm',
                xtype: 'actionsheet',
                text: 'Etes-vous sûr ?',
                showAnimation : null,
                hideAnimation : null,
                hideOnMaskTap: true,
                hidden: true,
                items: [
                    {
                        text: 'Êtes-vous sûr ?     OUI',
                        ui  : 'confirm',
                        action: 'confirm',
                        handler: function () {
                            this.up('[xtype=question]').down('[action=scrollableContainer]').getScrollable().getScroller().scrollTo(0,0,true);
                            this.up('[action=panneauConfirm]').hide();
                        }
                    },
                    {
                        ui: 'decline',
                        text: 'Êtes-vous sûr ?     NON',
                        handler: function () {
                            this.up('[xtype=question]').down('[action=scrollableContainer]').getScrollable().getScroller().scrollTo(0,0,true);
                            this.up('[action=panneauConfirm]').hide();
                        }
                    }
                ]
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
                        style: 'overflow:hidden;margin: 20px;',
                        html: ''
                    },
                    {
                        xtype: 'panel',
                        height: '100px',
                        hidden: true,
                        scrollable: true,
                        style: 'margin-top: 10px;text-align:center;',
                        action: 'questionImage',
                        html: ''
                    },
                    {
                        style: 'margin-top: 20px;',
                        action: 'questionTitle',
                        html: ''
                    },
                    {
                        action: 'questionContainer'
                    },
                    {
                        xtype: 'button',
                        action: 'nextButton',
                        text: 'Veuillez confirmer',
                        ui: 'decline'
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

        //mise à jour du titre de l'application
        this.down('[xtype=titlebar]').setTitle(eleve.utils.Config.getApplicationName());

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
            if (record.get('Image')) {
                this.down('[action=questionImage]').setHidden(false);
                this.down('[action=questionImage]').setHtml('<img src="' + _prefixDomain + '/' + record.get('Image') + '" />');
            }else this.down('[action=questionImage]').setHidden(true);

            //génératio ndu titre de la question
            this.down('[action=questionTitle]').setHtml('<h1>'+record.get('Nom')+'</h1>');

            //Récupération du/des types questions
            var tqStore = Ext.getStore('TypeQuestions');
            var me = this;
            tqStore.clearFilter();
            tqStore.filter(new Ext.util.Filter({
                property: 'QuestionId',
                value: record.get('id'),
                exactMatch: true
            }));




            tqStore.each(function (item,index){
                console.log(item);
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
                        Ext.getCmp('texte-'+item.get('id')).focus();
                        break;
                    case "4": //Booleen
                        /*me.down('[action=questionContainer]').add({
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
                        });*/
                        me.down('[action=questionContainer]').add({
                            xtype: 'fieldset',
                            id: 'booleen-'+item.get('id'),
                            cls: 'booleen-fieldset',
                            items: [
                                {
                                    xtype   : 'radiofield',
                                    name    : 'boolean',
                                    value   : '1',
                                    label   : 'Oui',
                                    cls: 'booleen-oui',
                                    listeners: {
                                        change: function (tf){
                                            console.log('OUI toggle change',tf.isChecked());
                                            if (tf.isChecked()){
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
                                },
                                {
                                    xtype : 'radiofield',
                                    name  : 'boolean',
                                    value : '2',
                                    cls: 'booleen-non',
                                    label : 'Non'
                                }
                            ]
                        });
                        break;
                    case "5": //Sélection
                        var tqv = Ext.getStore('TypeQuestionValeurs');
                        tqv.filter('TypeQuestionId',item.get('id'));
                        var opts= [];
                        tqv.each(function (item, index){
                            opts.push({
                                name: 'question_'+record.get('Id'),
                                value: item.get('id'),
                                label: ((item.get('Image').length)?'<img style="float: left;margin:0 20px;" src="' + _prefixDomain + '/'+item.get('Image')+'" />'+item.get('Valeur'):item.get('Valeur'))
                            });
                        });
                        if (item.get('Nom'))
                            me.down('[action=questionContainer]').add({
                               html: '<h1>'+item.get('Nom')+'</h1>'
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
                    case "6": //Pourcentage
                        me.down('[action=questionContainer]').add({
                            xtype: 'numberfield',
                            id: 'pct-'+item.get('id'),
                            label: item.get('Nom'),
                            labelWidth: '70%',
                            placeHolder: '0',
                            minValue: 0,
                            maxValue:100,
                            stepValue: 5,
                            width: '100%',
                            html:'<span style="position:absolute;right:50px;top:13px">%</span>'
                        });

                        break;
                    case "7": //TroisCriteres dont 1

                        console.log(record);
                        var label = '<i class="fa fa-pencil" aria-hidden="true"></i>';
                        switch(record.get('Couleur')){
                            case 'vert':
                                classe = 'labelVert';
                                me.down('[action=questionTitle]').setHtml('<h1 style="color:#fff;background-color:#7eb105;">'+record.get('Nom')+'</h1>');
                                break;
                            case 'rouge':
                                classe = 'labelRouge';
                                me.down('[action=questionTitle]').setHtml('<h1 style="color:#fff;background-color:#e00606;">'+record.get('Nom')+'</h1>');
                                break;
                        }

                        me.down('[action=questionContainer]').add(
                            [{
                                xtype: 'fieldset',
                                id: 'tri-'+item.get('id'),
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: label,
                                        cls: 'triblock',
                                        labelCls: classe,
                                        labelWidth : '80px',
                                        required: true,
                                        id: 'tri-'+item.get('id')+'-1'
                                    },{
                                        xtype: 'textfield',
                                        label: label,
                                        cls: 'triblock',
                                        labelCls: classe,
                                        labelWidth : '80px',
                                        id: 'tri-'+item.get('id')+'-2'
                                    },{
                                        xtype: 'textfield',
                                        label: label,
                                        cls: 'triblock',
                                        labelCls: classe,
                                        labelWidth : '80px',
                                        id: 'tri-'+item.get('id')+'-3'
                                    }
                                ]
                            }]
                        );
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
        var results = {};

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
                    results['qi_'+item.get('id')] = jauge.val();
                    break;
                case "2": //Echelle
                    var echelle = Ext.getCmp('echelle-'+item.get('id'));
                    results['qi_'+item.get('id')] = echelle.getValue()[0];
                    break;
                case "3": //Texte
                    var texte = Ext.getCmp('texte-'+item.get('id'));
                    results['qi_'+item.get('id')] = texte.getValue();
                    if (!texte.getValue().length&&
                        ((item.get('AfficheOui')&&me._lastBoolean&&me._lastBoolean.getGroupValue()==1)||
                        (me._lastBoolean&&me._lastBoolean.getGroupValue()==2&&item.get('AfficheNon'))||
                        (me._lastBoolean&&!item.get('AfficheOui')&&!item.get('AfficheNon'))||
                        !me._lastBoolean)){
                        me._error = true;
                        //Ext.Msg.alert('', 'Please check your inputs. All fields are mandatory.');
                        Ext.Msg.alert('', 'Veuillez vérifier votre formulaire. Tous les champs sont obligatoires.');
                    }
                    break;
                case "4": //Booleen
                    var booleen = Ext.getCmp('booleen-'+item.get('id')).query('radiofield');
                    if (!booleen[0].getGroupValue()){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez choisir un item de la liste.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = (booleen[0].getGroupValue()==2)?0:booleen[0].getGroupValue();
                    me._lastBoolean = booleen[0];
                    break;
                case "5": //Sélection
                    var selection = Ext.getCmp('selection-'+item.get('id')).query('radiofield');
                    if (!selection[0].getGroupValue()){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez choisir un item de la liste.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = selection[0].getGroupValue();
                    break;
                case "6": //Pourcentage
                    var pctgs = Ext.getCmp('pct-'+item.get('id'));
                    if (!(pctgs.getValue()>0) && !(pctgs.getValue()===0)){
                        me._error = true;
                        //Ext.Msg.alert('', 'Please check your inputs. All fields are mandatory.');
                        Ext.Msg.alert('', 'Veuillez vérifier votre formulaire. Tous les champs sont obligatoires.');
                    }
                    results['qi_'+item.get('id')] = pctgs.getValue();
                    break;
                case "7": //TroisCriteres dont 1
                    var tri = Ext.getCmp('tri-'+item.get('id')).query('textfield');
                    var res = [];
                    for(var n in tri){
                        var sItem = tri[n];
                        if(sItem.getValue())
                            res.push(sItem.getValue());
                    };
                    if (!res.length){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez renseigner au moins un item de la liste.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = res;
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
