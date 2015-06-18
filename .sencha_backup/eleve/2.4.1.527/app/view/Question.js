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
                        text: 'Suivant'
                    }
                ]
            }
        ]
    },
    setRecord: function (record) {
        //reset la fiche
        this.resetView();

        //intiilisation de la question
        console.log('affichage de la question',record);
        if (record) {
            //génération du fil d'ariane.
            //a partir de la question recherche de la catégorie directement reliée.
            var catStore = Ext.getStore('Categories');
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
                console.log(index,item);

                //Ajout du titre de typeQuestion si il y a
                me.down('[action=questionContainer]').add({html: '<h2>'+item.get('Nom')+'</h2>'});

                //ajout des typeQuestion
                switch (item.get('TypeReponse')) {
                    case "1": //Jauge
                        console.log('creation nde la jauge');
                        me.down('[action=scrollableContainer]').setScrollable(false);
                        me.down('[action=questionContainer]').add({
                            html: '<input type="text" class="dial" value="0">'
                        });
                        $(".dial").knob({
                            'width': '100%',
                            'min':0,
                            'max':100,
                            'angleOffset': -90,
                            'angleArc': 180,
                            'thickness': 0.7,
                            'cursor': true,
                            'fgColor': '#000',
                            'value': 0/*,
                            'bgColor': 'transparent'*/
                        });
                        break;
                    case "2": //Echelle
                        me.down('[action=questionContainer]').add({
                            xtype: 'sliderfield',
                            maxValue: 5,
                            labelWidth: 0,
                            html: '<table width="100%"><tr><td width="14%" align="center">1</td><td width="14%" align="center">2</td><td width="14%" align="center">3</td><td width="14%" align="center">4</td><td width="14%" align="center">5</td><td width="14%" align="center">6</td></tr></table>'
                        });
                        break;
                    case "3": //Texte
                        me.down('[action=questionContainer]').add({
                            xtype: 'textareafield',
                            labelWidth: 0
                        });
                        break;
                    case "4": //Booleen
                        me.down('[action=questionContainer]').add({
                            xtype: 'togglefield',
                            labelWidth: 0
                        });
                        break;
                }
            });

            //evenement sur le bouton
            //recherche de la question suivante
            var q = Ext.getStore('Questions');
            var nq = q.findRecord('Ordre',parseInt(record.get('Ordre'))+1);
            if (nq) {
                this.down('[xtype=button]').setRecord(nq);
            }else{
                Ext.Msg.alert('Erreur il n\'y pas de question suivante. Veuillez vérifier l\'ordre des questions...');
            }
        }
    },
    getCatHistory: function (id) {
        var catStore = Ext.getStore('Categories');
        var c = catStore.getById(id);
        var out = [
            '<ul><li '+(!c.get('CategorieId')? 'id="breadcrumb"':'')+'>'+ c.get('Nom'),
            '</li></ul>'
        ];

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
