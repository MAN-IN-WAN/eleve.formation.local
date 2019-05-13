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
        console.error('++'+record.get('Prefixe')+'++');

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

            var totalQuestions = tqStore.getCount();
            var parts = ["A","B","C","D","E","F","G","H"];

            tqStore.each(function (item,index){
                //Gestion des question multiparticipant
                var nbTq = 1;
                if(item.get('MultiPart')) nbTq = 4;
                console.log('>>>>>>>>>>>',item,index,nbTq);

                var itemIndex = index;
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
                        if (item.get('Nom'))
                            me.down('[action=questionContainer]').add({
                                html: '<h4>'+item.get('Nom')+'</h4>'
                            });
                        me.down('[action=questionContainer]').add({
                            xtype: 'fieldset',
                            id: 'booleen-'+item.get('id'),
                            cls: 'booleen-fieldset',
                            items: [
                                {
                                    xtype   : 'radiofield',
                                    name    : 'boolean_'+item.get('id'),
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
                                    name  : 'boolean_'+item.get('id'),
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
                        console.log(tqv);
                        tqv.each(function (item, index){
                            console.log(item);
                            opts.push({
                                name: 'question_'+record.get('id'),
                                value: item.get('id'),
                                label: ((item.get('Image').length)?'<img style="float: left;margin:0 20px;" src="' + _prefixDomain + '/'+item.get('Image')+'" />'+item.get('Valeur'):item.get('Valeur'))
                            });
                        });
                        if (item.get('Nom'))
                            me.down('[action=questionContainer]').add({
                               html: '<h4>'+item.get('Nom')+'</h4>'
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
                    case "8": //Cercle score
                        console.log('rrrr',item,record);
                        var params = item.get('Parametres');
                        var color = '#888';
                        if(params.Couleur != undefined){
                            color = params.Couleur;
                        }
                        var inputs = params.Titres;
                        var label = '';
                        var disabled = false;
                        var value = 0;

                        me.down('[action=questionContainer]').add(
                            [{
                                xtype: 'panel',
                                id: 'cerclescore-'+item.get('id')+'-title',
                                title: item.get('Nom'),
                                html: '<h4>'+item.get('Nom')+'</h4>',
                                style: {margin: '15px 0', maxWidth:"300px"}
                            }]
                        );

                        for(var i =0; i< inputs.length; i++){

                            label = inputs[i];
                            var its =[{
                                xtype: 'panel',
                                flex: 1,
                                html: label,
                                style: {color: color,textAlign:'center',padding: "5px",borderBottom:"1px solid #ddd"},
                                cls:'cerclescoreHeader'
                            }];
                            for(var m = params.Min; m <= params.Max;m++){
                                var it = {
                                    xtype: 'radiofield',
                                    label: ''+m,
                                    cls: 'cerclescoreradio',
                                    labelCls: 'cerclescoreradiolabel',
                                    labelWidth: 'auto',
                                    name:'cerclescore-'+item.get('id')+'-'+i,
                                    id: 'cerclescore-'+item.get('id')+'-'+i+'-'+m,
                                    data: {next : i+1},
                                    listeners: {
                                        change: function (tf){
                                            console.log(tf);
                                            //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                            if (tf.isChecked()){
                                                var elem = tf.element;
                                                var itlock =0; //securité
                                                var elemPrev = tf.element;
                                                while(elemPrev != undefined && elemPrev != null && itlock < 10){
                                                    elemPrev.down('.cerclescoreradiolabel').addCls('active');
                                                    var prev = elemPrev.prev('.cerclescoreradio');
                                                    elemPrev = prev;
                                                    itlock++;
                                                }
                                                var itlock2 =0; //securité
                                                var elemNext = tf.element;
                                                while(elemNext != undefined && elemNext != null && itlock2 < 10){
                                                    var next = elemNext.next('.cerclescoreradio');
                                                    elemNext = next;
                                                    if(next)
                                                        elemNext.down('.cerclescoreradiolabel').removeCls('active');
                                                    itlock2++;
                                                }
                                                var par = tf.element.parent('.cerclescore-fieldset');
                                                var next = tf.element.parent('.cerclescore-fieldset').next('.cerclescore-fieldset');
                                                var off =[0,1];
                                                if(next) {
                                                    off = next.getOffsetsTo(par);
                                                }

                                                var scroller = me.down('[action=scrollableContainer]').getScrollable().getScroller();
                                                var data = tf.getData();
                                                if( (totalQuestions - 1) == itemIndex && data.next > inputs.length-3) return; // QuickFix pour eviter des scrolls quand ca peu plus scroller
                                                if(data.next < inputs.length){
                                                    scroller.scrollBy(0,off[1],true);
                                                } else{
                                                    scroller.scrollBy(0,132,true);
                                                }
                                            }else{
                                                //tf.label.removeCls('active');
                                            }
                                        }
                                    },
                                    value:m
                                };
                                its.push(it);
                            }


                            me.down('[action=questionContainer]').add(
                                [{
                                    xtype: 'fieldset',
                                    id: 'cerclescore-'+item.get('id')+'-'+i,
                                    style: {marginBottom: '15px', borderColor:color},
                                    cls: 'cerclescore-fieldset',
                                    items: its
                                }]
                            );


                        }
                        break;
                    case "9": //Plusoumoins
                        var params = item.get('Parametres');
                        var bgolor = '#888';
                        if(params.Couleur != undefined){
                            bgColor = params.Couleur;
                        }
                        var inputs = params.Titres;
                        var label = '';
                        me.down('[action=questionContainer]').add(
                            [{
                                xtype: 'panel',
                                id: 'plusmoins-'+item.get('id'),
                                scrollable: 'horizontal',
                                height:  '70px',
                                style: { marginBottom: '15px', overflow:'hidden'},
                            }]
                        );
                        me.down('#plusmoins-'+item.get('id')).add([{
                            xtype: 'panel',
                            id: 'plusmoins-'+item.get('id')+'scroller',
                            width:'900px',
                            style:{position:'relative'},
                            cls: 'flexContainer bgLine'
                        }]);

                        for(var i =0; i< inputs.length; i++){
                            label = inputs[i];
                            me.down('#plusmoins-'+item.get('id')+'scroller').add(
                                [{
                                    xtype: 'fieldset',
                                    id: 'plusmoins-'+item.get('id')+'-'+i,
                                    width: '30%',
                                    height : '60px',
                                    style: { display: 'inline-block'},
                                    items: [
                                        {
                                            xtype: 'panel',
                                            flex: 1,
                                            html: label,
                                            style: {backgroundColor: bgColor,textAlign:'center',padding: "5px"},
                                            cls:'plusmoinsHeader'
                                        },{
                                            xtype: 'radiofield',
                                            label: '--',
                                            cls: 'plusmoins',
                                            labelCls: 'plusmoinslabel',
                                            required: true,
                                            labelWidth: 'auto',
                                            name:'plusmoins-'+item.get('id')+'-'+i,
                                            id: 'plusmoins-'+item.get('id')+'-'+i+'-1',
                                            data: {next : i+1},
                                            listeners: {
                                                change: function (tf){
                                                    //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                    if (tf.isChecked()){
                                                        tf.label.addCls('active');
                                                        var scroller = me.down('#plusmoins-'+item.get('id')).getScrollable().getScroller();
                                                        var data = tf.getData();
                                                        if(data.next < inputs.length){
                                                            scroller.scrollTo(300*data.next,0,true);
                                                        } else{
                                                            //console.log('end of line');
                                                        }

                                                    }else{
                                                        tf.label.removeCls('active');
                                                    }
                                                }
                                            },
                                            value:0
                                        },{
                                            xtype: 'radiofield',
                                            label: '-',
                                            cls: 'plusmoins',
                                            labelCls: 'plusmoinslabel',
                                            required: true,
                                            labelWidth: 'auto',
                                            name:'plusmoins-'+item.get('id')+'-'+i,
                                            id: 'plusmoins-'+item.get('id')+'-'+i+'-2',
                                            data: {next : i+1},
                                            listeners: {
                                                change: function (tf){
                                                    //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                    if (tf.isChecked()){
                                                        tf.label.addCls('active');
                                                        var scroller = me.down('#plusmoins-'+item.get('id')).getScrollable().getScroller();
                                                        var data = tf.getData();
                                                        if(data.next < inputs.length){
                                                            scroller.scrollTo(300*data.next,0,true);
                                                        } else{
                                                            //console.log('end of line');
                                                        }

                                                    }else{
                                                        tf.label.removeCls('active');
                                                    }
                                                }
                                            },
                                            value:1
                                        },{
                                            xtype: 'radiofield',
                                            label: '=',
                                            cls: 'plusmoins',
                                            labelCls: 'plusmoinslabel',
                                            required: true,
                                            labelWidth: 'auto',
                                            name:'plusmoins-'+item.get('id')+'-'+i,
                                            id: 'plusmoins-'+item.get('id')+'-'+i+'-3',
                                            data: {next : i+1},
                                            listeners: {
                                                change: function (tf){
                                                    //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                    if (tf.isChecked()){
                                                        tf.label.addCls('active');
                                                        var scroller = me.down('#plusmoins-'+item.get('id')).getScrollable().getScroller();
                                                        var data = tf.getData();
                                                        if(data.next < inputs.length){
                                                            scroller.scrollTo(300*data.next,0,true);
                                                        } else{
                                                            //console.log('end of line');
                                                        }

                                                    }else{
                                                        tf.label.removeCls('active');
                                                    }
                                                }
                                            }
                                            ,
                                            value:2
                                        },{
                                            xtype: 'radiofield',
                                            label: '+',
                                            cls: 'plusmoins',
                                            labelCls: 'plusmoinslabel',
                                            required: true,
                                            labelWidth: 'auto',
                                            name:'plusmoins-'+item.get('id')+'-'+i,
                                            id: 'plusmoins-'+item.get('id')+'-'+i+'-4',
                                            data: {next : i+1},
                                            listeners: {
                                                change: function (tf){
                                                    //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                    if (tf.isChecked()){
                                                        tf.label.addCls('active');
                                                        var scroller = me.down('#plusmoins-'+item.get('id')).getScrollable().getScroller();
                                                        var data = tf.getData();
                                                        if(data.next < inputs.length){
                                                            scroller.scrollTo(300*data.next,0,true);
                                                        } else{
                                                            //console.log('end of line');
                                                        }

                                                    }else{
                                                        tf.label.removeCls('active');
                                                    }
                                                }
                                            },
                                            value:3
                                        },{
                                            xtype: 'radiofield',
                                            label: '++',
                                            cls: 'plusmoins',
                                            labelCls: 'plusmoinslabel',
                                            required: true,
                                            labelWidth: 'auto',
                                            name:'plusmoins-'+item.get('id')+'-'+i,
                                            id: 'plusmoins-'+item.get('id')+'-'+i+'-5',
                                            data: {next : i+1},
                                            listeners: {
                                                change: function (tf){
                                                    //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                    if (tf.isChecked()){
                                                        tf.label.addCls('active');
                                                        var scroller = me.down('#plusmoins-'+item.get('id')).getScrollable().getScroller();
                                                        var data = tf.getData();
                                                        if(data.next < inputs.length){
                                                            scroller.scrollTo(300*data.next,0,true);
                                                        } else{
                                                            //console.log('end of line');
                                                        }

                                                    }else{
                                                        tf.label.removeCls('active');
                                                    }
                                                }
                                            },
                                            value:4
                                        }
                                    ]
                                }]
                            );
                        }


                        break;
                    case "10": //Graph score MultiParticipant Géré
                        var params = item.get('Parametres');
                        var color = '#888';

                        var inputs = params.Titres;
                        var label = '';
                        var disabled = false;
                        var value = 0;

                        me.down('[action=questionContainer]').add(
                            [{
                                xtype: 'panel',
                                id: 'cerclescore-'+item.get('id')+'-title',
                                title: item.get('Nom'),
                                html: '<h4>'+item.get('Nom')+'</h4>',
                                style: {margin: '15px 0', maxWidth:"300px"}
                            }]
                        );
                        for(var nb = 0; nb < nbTq; nb ++) {
                            if(nbTq > 1){
                                me.down('[action=questionContainer]').add(
                                    [{
                                        xtype: 'panel',
                                        id: 'cerclescore-'+item.get('id')+'-stitle-'+nb,
                                        title: item.get('Nom'),
                                        html: '<h5> Participant '+ parts[parseInt(nb)] +'</h5>',
                                        style: {margin: '5px 0', maxWidth:"300px"}
                                    }]
                                );
                            }

                            for (var i = 0; i < inputs.length; i++) {
                                if (params.Couleurs != undefined && params.Couleurs[i] != undefined) {
                                    color = params.Couleurs[i];
                                }
                                label = inputs[i];
                                var its = [{
                                    xtype: 'panel',
                                    flex: 1,
                                    html: label,
                                    style: {
                                        color: color,
                                        textAlign: 'center',
                                        padding: "5px",
                                        borderBottom: "1px solid #ddd"
                                    },
                                    cls: 'graphscoreHeader'
                                }];
                                for (var m = params.Min; m <= params.Max; m++) {
                                    var it = {
                                        xtype: 'radiofield',
                                        label: '' + m,
                                        cls: 'graphscoreradio',
                                        labelCls: 'graphscoreradiolabel',
                                        labelWidth: 'auto',
                                        name: 'graphscore-' + item.get('id') + '-' + i + '-' + nb,
                                        id: 'graphscore-' + item.get('id') + '-' + i + '-' + nb + '-' + m ,
                                        data: {next: i + 1, nextTq: nb},
                                        listeners: {
                                            change: function (tf) {
                                                //console.log('OUI toggle change',tf.getData(),tf.isChecked());
                                                if (tf.isChecked()) {

                                                    tf.label.addCls('active');
                                                    var scroller = me.down('[action=scrollableContainer]').getScrollable().getScroller();
                                                    var data = tf.getData();
                                                    if ((totalQuestions - 1) == itemIndex && data.next > inputs.length - 3 && data.nextTq == ( nbTq - 1 ) ) {
                                                        return; // QuickFix pour eviter des scrolls quand ca peu plus scroller
                                                    }
                                                    if (data.next < inputs.length) {
                                                        scroller.scrollBy(0, 90, true);
                                                    } else {
                                                        scroller.scrollBy(0, 132, true);
                                                    }
                                                } else {
                                                    tf.label.removeCls('active');
                                                }
                                            }
                                        },
                                        value: m
                                    };
                                    its.push(it);
                                }


                                me.down('[action=questionContainer]').add(
                                    [{
                                        xtype: 'fieldset',
                                        id: 'graphscore-' + item.get('id') + '-' + i + '-' + nb,
                                        style: {marginBottom: '15px', borderColor: color},
                                        cls: 'graphscore-fieldset',
                                        items: its
                                    }]
                                );


                            }
                        }
                        break;
                    case "11": //Stickers

                        console.log(item.get('TypeReponse'),record);
                        break;
                    case "12": //3pourcent
                        var params = item.get('Parametres');
                        var color = '#888';

                        var inputs = params.Titres;
                        var label = '';
                        var disabled = false;
                        var value = 0;
                        for(var nb = 0; nb < nbTq; nb ++) {

                            if (nbTq > 1) {
                                me.down('[action=questionContainer]').add(
                                    [{
                                        xtype: 'panel',
                                        id: 'multipercent-' + item.get('id') + '-stitle-' + nb,
                                        title: item.get('Nom'),
                                        html: '<h5> Participant ' + parts[parseInt(nb)] + '</h5>',
                                        style: {margin: '5px 0', maxWidth: "300px"}
                                    }]
                                );
                            }
                            me.down('[action=questionContainer]').add(
                                [{
                                    xtype: 'fieldset',
                                    id: 'multipercent-' + item.get('id') + '-' + nb
                                }]
                            );

                            for (var i = 0; i < inputs.length; i++) {

                                if (i == (inputs.length - 1)) {
                                    disabled = true;
                                    value = 100;
                                } else{
                                    disabled = false;
                                    value = 0
                                }
                                if (params.Couleurs != undefined && params.Couleurs[i] != undefined) {
                                    color = params.Couleurs[i];
                                }
                                label = inputs[i];
                                console.error('in'+label);
                                me.down('#multipercent-' + item.get('id') + '-' + nb).add(
                                    [{
                                        xtype: 'sliderfield',
                                        label: label,
                                        cls: 'multipercent',
                                        labelCls: 'multipercentlabel',
                                        name: 'multipercent-' + item.get('id') + '-' + i + '-' + nb,
                                        id: 'multipercent-' + item.get('id') + '-' + i + '-' + nb + '_slider',
                                        style: {color: color, marginBottom: "5px", border: 'none !important'},
                                        disabled: disabled,
                                        labelWidth: '30%',
                                        value: value,
                                        data:{nb:nb},
                                        listeners: {
                                            change: function (tf) {
                                                //console.log('OUI toggle change',tf.getData(),tf.getValue());
                                                var data = tf.getData();
                                                //console.log('******************************','#multipercent-' + item.get('id') + '-' + data.nb,me.down('#multipercent-' + item.get('id') + '-' + data.nb));
                                                var otherFields = me.down('#multipercent-' + item.get('id') + '-' + data.nb ).query('sliderfield');
                                                var sum = 0;
                                                for (var m = 0; m < otherFields.length - 1; m++) {
                                                    sum += parseInt(otherFields[m].getValue());
                                                }
                                                if (sum <= 100) {
                                                    otherFields[otherFields.length - 1].setValue(100 - sum);
                                                } else {
                                                    var diff = sum - 100;
                                                    otherFields[otherFields.length - 1].setValue(0);
                                                    tf.setValue(parseInt(tf.getValue()) - diff);
                                                }

                                                //Modif du texte affiché
                                                for (var n = 0; n < otherFields.length; n++) {
                                                    var val = otherFields[n].getValue();
                                                    var dis = otherFields[n].getName();
                                                    //console.log('disss', dis, '#' + dis + '_show');

                                                    var div = Ext.get(dis + '_show').down('span');
                                                    div.setHtml(val);
                                                }
                                            }
                                        },
                                        html: '<p id="multipercent-' + item.get('id') + '-' + i + '-' + nb + '_show"><span>' + value + '</span>%</p>'
                                    }]
                                );
                            }
                        }

                        console.log(item.get('TypeReponse'),record);
                        break;
                    case "13": //multiselect
                        var params = item.get('Parametres');
                        var qty = 3;
                        if(params != null && params.Quantite != undefined) qty = params.Quantite;
                        var tqv = Ext.getStore('TypeQuestionValeurs');
                        tqv.filter('TypeQuestionId',item.get('id'));
                        var opts= [];
                        var qst = item;
                        tqv.each(function (item, index){
                            opts.push({
                                name: 'multiselect'+record.get('Id'),
                                value: item.get('id'),
                                label: ((item.get('Image').length)?'<img style="float: left;margin:0 20px;" src="' + _prefixDomain + '/'+item.get('Image')+'" />'+item.get('Valeur'):item.get('Valeur')),
                                listeners: {
                                    change: function (tf) {
                                        console.log(tf,tf.isChecked() );
                                        if(tf.isChecked()) {
                                            var selection = me.down('#multiselect-'+qst.get('id')).query('checkboxfield');
                                            var temp = [];
                                            for(var n = 0; n < selection.length ;n++){
                                                if (selection[n].isChecked())
                                                    temp.push(selection[n].getValue());
                                            }
                                            if(temp.length > qty){
                                                Ext.Msg.alert('','Vous avez déjà sélectionné '+qty+' item'+(qty > 1 ? 's':'' )+'.');
                                                tf.uncheck();
                                            }
                                        }
                                    }
                                }
                            });
                        });
                        if (item.get('Nom'))
                            me.down('[action=questionContainer]').add({
                                html: '<h4>'+item.get('Nom')+'</h4>'
                            });
                        me.down('[action=questionContainer]').add({
                            xtype: 'fieldset',
                            id: 'multiselect-'+item.get('id'),
                            defaults: {
                                xtype: 'checkboxfield',
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
        var results = {};

        //Récupération du/des types questions
        var tqStore = Ext.getStore('TypeQuestions');
        var me = this;
        tqStore.filter('QuestionId',record.get('id'));

        tqStore.each(function (item,index){
            var nbTq = 1;
            if(item.get('MultiPart')) nbTq = 4;
            console.log('>>>>>>>>>>>',item,index,nbTq);

            //ajout des typeQuestion
            switch (item.get('TypeReponse')) {
                case "1": //Jauge
                    var jauge = $('#jauge-'+item.get('id'));//récupération de l'id
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
                case "8": //Cercle score
                    var params = item.get('Parametres');
                    var inputs = params.Titres;
                    var res = [];

                    for(var i =0; i< inputs.length; i++){
                        var temp = Ext.getCmp('cerclescore-'+item.get('id')+'-'+i).query('radiofield');
                        console.log(temp,temp[0].getGroupValue());
                        if(temp[0].getGroupValue() !== false && temp[0].getGroupValue() !== null && temp[0].getGroupValue() !== undefined )
                            res.push(temp[0].getGroupValue());
                    }
                    if (res.length != inputs.length){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez noter chacun des aspects.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = res;
                    break;
                case "9": //Plusoumoins
                    var params = item.get('Parametres');
                    var inputs = params.Titres;
                    var res = [];

                    for(var i =0; i< inputs.length; i++){
                        var temp = Ext.getCmp('plusmoins-'+item.get('id')+'-'+i).query('radiofield');
                        if(temp[0].getGroupValue() !== false && temp[0].getGroupValue() !== null && temp[0].getGroupValue() !== undefined )
                            res.push(temp[0].getGroupValue());
                    }
                    if (res.length != inputs.length){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez donner une note à l\'ensemble des champs.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = res;

                    break;
                case "10": //Graph score
                    var params = item.get('Parametres');
                    var inputs = params.Titres;
                    var res = [];
                    for(var nb = 0; nb < nbTq; nb ++) {
                        var midRes = [];
                        for (var i = 0; i < inputs.length; i++) {
                            var temp = Ext.getCmp('graphscore-' + item.get('id') + '-' + i + '-' + nb).query('radiofield');
                            //console.log(temp, temp[0].getGroupValue());
                            if (temp[0].getGroupValue() !== false && temp[0].getGroupValue() !== null && temp[0].getGroupValue() !== undefined)
                                midRes.push(temp[0].getGroupValue());
                        }
                        if(midRes.length == inputs.length)
                            res.push(midRes);
                    }
                    if (res.length < 1){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        if(nbTq == 1) {
                            Ext.Msg.alert('', 'Veuillez noter chacun des aspects.');
                        } else {
                            Ext.Msg.alert('', 'Veuillez noter chacun des pour au moins l\'un des participants.');
                        }
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = res;
                    break;
                case "11": //Stickers

                    console.log('***********************************************************',item,record);
                    break;
                case "12": //3pourcent

                    var res = [];
                    for(var nb = 0; nb < nbTq; nb ++) {
                        var sum = 0;
                        var midRes = [];
                        var fields = me.down('#multipercent-' + item.get('id') + '-' + nb ).query('sliderfield');
                        for (var m = 0; m < fields.length; m++) {
                            midRes.push(parseInt(fields[m].getValue()));
                            sum += parseInt(fields[m].getValue());
                        }
                        if (sum != 100) {
                            Ext.Msg.alert('', 'La somme des pourcentages doit valoir 100%');
                            me._error = true;
                        } else{
                            res.push(midRes);
                        }
                    }

                    results['qi_'+item.get('id')] = res;
                    break;
                case "13": //multiselect
                    var res = [];
                    var params = item.get('Parametres');
                    var qty = 3;
                    if(params != null && params.Quantite != undefined) qty = params.Quantite;
                    var selection = me.down('#multiselect-'+item.get('id')).query('checkboxfield');
                    for(var n = 0; n < selection.length ;n++){
                        if (selection[n].isChecked())
                            res.push(selection[n].getValue());
                    }

                    if (res.length != qty){
                        //Ext.Msg.alert('','Please select an item in the list.');
                        Ext.Msg.alert('','Veuillez choisir '+qty+' item'+(qty > 1 ? 's':'' )+'.');
                        me._error = true;
                    }
                    results['qi_'+item.get('id')] = res;
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
