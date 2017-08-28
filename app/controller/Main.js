/**
 * @class ActivaStock.controller.Main
 * @extends Ext.app.Controller
 *
 * This is an abstract base class that is extended by both the phone and tablet versions. This controller is
 * never directly instantiated, it just provides a set of common functionality that the phone and tablet
 * subclasses both extend.
 */
Ext.define('eleve.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        /**
         * @private
         */
        viewCache: [],

        refs: {
            map: '[action=map]',
            mapMarker: '[action=mapMarker]',
            nextButton: '[action=nextButton]',
            confirm: '[action=confirm]',
            panneauConfirm: '[action=panneauConfirm]'
        },

        control: {
            map: {
                tap: 'onMapTap'
            },
            mapMarker: {
                tap: 'onMapTap'
            },
            nextButton: {
                release: 'onNextButton'
            },
            confirm: {
                release: 'saveReponse'
            }
        },
        routes: {
            '': 'showRoot',
            'loading': 'showLoading',
            'setteam': 'showSetEquipe',
            'map': 'showMap',
            'wait': 'showWait',
            'fin': 'showFin',
            'question/:id': 'showQuestion'
        }
    },
    /********************************
     * QUESTIONS
     * ******************************/
    /**
     * onMapTap
     * Quand le bouton suivant est cliqué.
     */
    onMapTap: function() {
        console.log('map tap');
        var nq = this.getCurrentQuestion();
        if (nq)
            this.redirectTo('question/'+nq.get('id'));
    },
    /**
     * onNextButton
     * Quand le bouton suivant est cliqué.
      */
     onNextButton: function() {
        var me = this;
        //Vérification des données
        var curview = this._indexViews['eleve.view.Question'];
        var results = curview.getResults();
        console.log('results',results);

        //si erreur
        if (!results) return;

        //affichage du panneau de confirmation
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
        this.getPanneauConfirm().show();
    },
    saveReponse: function () {
        var me = this;

        //Vérification des données
        var curview = this._indexViews['eleve.view.Question'];
        var results = curview.getResults();

        for(var n in results){
            results[n] = Ext.encode(results[n]);
        }


        results.equipe = eleve.utils.Config.getSessionEquipe();
        results.session = eleve.utils.Config.getSessionId();

        //fermeture du panneau
        this.getPanneauConfirm().hide();

        //enregistrement des résultats
        var url = eleve.utils.Config.getResultUrl();
        Ext.Ajax.request({
            url: url,
            useDefaultXhrHeader: false,
            method: 'POST',
            params: results,
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success){
                    console.log('OK OK');
                }

            },
            failure: function(response, opts) {
                //suppression du masque
                //Ext.Msg.alert('Erreur de connexion', 'Il y a un problème ... Veuillez appeler l\'animateur');
                console.log('erreur de connexion');
                //aucune session disponible
                var task = Ext.create('Ext.util.DelayedTask', function() {
                    me.saveReponse();
                }, this);

                //The function will start after 0 milliseconds - so we want to start instantly at first
                task.delay(1000);
            }
        });


        //on vérifie la catégorie de bloquage
        var cq = this.getCurrentQuestion();
        var ccq = cq.getBloquage();

        var nq = this.getNextQuestion();
        if (!nq){
            //redirection vers le message de fin
            me.redirectTo('fin');
            return;
        }
        var cnq = nq.getBloquage();

        //Si il y a un bloquage et qu'il s'agit de la meme catégorie, alors il ne faut rien faire.
        if ((!cnq&&!ccq)||(cnq&&ccq&&cnq.cat==ccq.cat)) {
            //si la position de la question courante est différente de la questio suivante, on affiche la carte
            if (cq.getPosition().cat!=nq.getPosition().cat){
                eleve.utils.Config.setCurrentQuestion(nq.get('Ordre'));
                me.redirectTo('map');
            }else
                me.redirectTo('question/' + nq.get('id'));
        }else {
            eleve.utils.Config.setCurrentQuestion(nq.get('Ordre'));
            me.redirectTo('wait');
        }
    },
    /**
     * getCurrentQuestion
     * recherche de la question courante
     */
    getCurrentQuestion: function () {
        var q = Ext.getStore('Questions');
        var nq = q.findRecord('Ordre', eleve.utils.Config.getCurrentQuestion());
        if (nq) {
            return nq;
        } else {
            console.log('Impossible de trouver la question '+eleve.utils.Config.getCurrentQuestion());
            this.redirectTo('fin');
        }
    },
    /* Ordre de la question courante. */
    /**
     * getNextQuestion
     * recherche de la question suivante
     * @returns {Ext.data.Model|*}
     */
    getNextQuestion: function () {
        var q = Ext.getStore('Questions');
        var nq = q.findRecord('Ordre', parseInt(eleve.utils.Config.getCurrentQuestion()) + 1);
        if (nq) {
            return nq;
        } /*else {
            Ext.Msg.alert('Erreur il n\'y pas de question suivante. Veuillez vérifier l\'ordre des questions...');
        }*/
    },
    /********************************
     * NAVIGATION
     * ******************************/
    /***
     * onBackTap
     * On presse le bouton back
     */
    onBackTap: function ( button, e, eOpts ) {
        console.log('itemtap back');
        //var appHistory = this.getApplication().getHistory();

        // fire previous route
        //appHistory.back();

        // prevent the default navigation view
        // back button behavior from firing
        return false;
    },
    _indexViews: [],
    _currentLevel: 0,
    manageView: function (level,name_view) {
        console.log('---- show view ----', name_view,'level',level);

        var commview;
        //si pas de session active retour à la racine
        if (name_view!="eleve.view.Loading"&&name_view!="eleve.view.SetEquipe"&&!eleve.utils.Config.getSessionActive()){
            console.log('session active NOK redirect to loading');
            this.redirectTo('loading');
            return;
        }

        //si pas chargé alors redirection vers le loading
        if (name_view!="eleve.view.Loading"&&!eleve.utils.Config.getLoaded())
            this.redirectTo('loading');

        //si equipe dejà définie sur la page equipê alors redirection map
        if ((name_view=="eleve.view.SetEquipe"||name_view=="eleve.view.Loading")&&eleve.utils.Config.getSessionActive()&&eleve.utils.Config.getLoaded()&&!this._etapeChecking){
            console.log('session active OK redirect to checkEtape');
            this.redirectTo('wait');
            return;
        }

        //gestion des effets
        switch (this._currentLevel-level){
            case 1:
                //_____________________________________________________________________________________________________________
                //                                                                                                  ANIMATIONS
                Ext.Viewport.getLayout().setAnimation({type: 'slide', direction: 'right'});
                //_____________________________________________________________________________________________________________
                break;
            case -1:
                //_____________________________________________________________________________________________________________
                //                                                                                                  ANIMATIONS
                Ext.Viewport.getLayout().setAnimation({type: 'slide', direction: 'left'});
                //_____________________________________________________________________________________________________________
                break;
            default:
                //_____________________________________________________________________________________________________________
                //                                                                                                  ANIMATIONS
                Ext.Viewport.getLayout().setAnimation({type: 'fade', direction: 'left'});
                //____________________________________________________________________________________________________________
                break;
        }

        //maintenance de l'index des vues chargées
        if (this._indexViews[name_view]){
            console.log();
            commview = this._indexViews[name_view];
        }else{
            this._indexViews[name_view] = commview = Ext.create(name_view);
        }
        Ext.Viewport.setActiveItem(commview);
        this._currentLevel=level;

        return commview;
    },
    /********************************
     * LOADING
     * ******************************/
     _thingsToLoad: 7,
      onLoadStore: function (msg) {
          console.log('load store',this._thingsToLoad, msg);
          this._thingsToLoad--;
          if (this._thingsToLoad==0){
              eleve.utils.Config.setLoaded(true);
              this._loading = false;
              console.log('***** LOADED *****');
              this.redirectTo('setteam');
          }
     },
    /********************************
     * ROUTING
     * ******************************/

    _etapeChecking: false,
    showWait: function () {
        if (!eleve.utils.Config.getLoaded()) {
            this.redirectTo('loading');
            return;
        }
        this._etapeChecking = true;
        console.log('showWait');

        //affichage de l'ecran de loading
        this.manageView(0, 'eleve.view.Wait');

        //récupération de la session
        this.checkEtape();
    },
    checkEtape: function(){
        console.log('check etape');
        var me = this;
        var curview = me._indexViews['eleve.view.Wait'];

        var currentQuestion = me.getCurrentQuestion();
        console.log('check etape',currentQuestion);

        //aucune session disponible
        var task = Ext.create('Ext.util.DelayedTask', function() {
            me.checkEtape();
        }, this);

        //interrogation du serveur pour savoir si l'etape est debloquée
        var url = eleve.utils.Config.getCheckEtapeUrl();
        Ext.Ajax.request({
            url: url,
            useDefaultXhrHeader: false,
            params: {
                session: eleve.utils.Config.getSessionId(),
                equipe: eleve.utils.Config.getSessionEquipe(),
                question:currentQuestion.get('id')
            },
            method: 'POST',
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success){
                    this._etapeChecking = false;

                    //affichage de la map
                    me.redirectTo('map');

                }else{
                    if (!obj.data){
                        //reset de la config
                        eleve.utils.Config.resetSession();
                        Ext.Msg.confirm(
                            "Rechargement nécessaire",
                            obj.msg,
                            function(buttonId) {
                                if (buttonId === 'yes') {
                                    window.location.reload();
                                }
                            }
                        );
                    }else if (!obj.team){
                        //reset de l'equipe et de la question courante
                        Ext.Msg.confirm(
                            "Equipe introuvable",
                            obj.msg,
                            function(buttonId) {
                                eleve.utils.Config.resetTeam();
                                eleve.utils.Config.resetCurrentQuestion();
                                me.redirectTo('setteam');
                            }
                        );
                    // }else if (!obj.etape){
                        /*Ext.Msg.confirm(
                            "Etape incorrecte",
                            obj.msg,
                            function(buttonId) {
                                eleve.utils.Config.resetCurrentQuestion();
                                me.redirectTo('map');
                            }
                        );*/
                    }else {
                        //The function will start after 0 milliseconds - so we want to start instantly at first
                        task.delay(5000);
                    }
                }

            },
            failure: function(response, opts) {
                //suppression du masque
                console.log('Récupération de session erreur ' + response.status);
                /*Ext.Msg.alert('Erreur de connexion', 'Il y a un problème ... Veuillez appeler l\'animateur');*/

                //relance le test si on clique sur la view
                task.delay(5000);
            }
        });
    },
    showLoading: function () {
        console.log('showLoading');

        //affichage de l'ecran de loading
        this.manageView(0, 'eleve.view.Loading');

        //récupération de la session
        this.getSession();
    },
    getSession: function(){
        var me = this;
        var curview = me._indexViews['eleve.view.Loading'];

        //interrogation du serveur pour savoir si il y a une session en cours.
        var url = eleve.utils.Config.getSessionUrl();
        Ext.Ajax.request({
            url: url,
            useDefaultXhrHeader: false,
            method: 'POST',
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success){
                    //affichage du texte de chargement
                    curview.down('[action=loadingText]').setHtml('<h1>Chargement...</h1>');

                    //enregistrement des informations de session
                    eleve.utils.Config.setSessionId(obj.id);
                    eleve.utils.Config.setSessionName(obj.name);
                    console.log('set session information',obj.id, obj.name);

                    //chargement des stores
                    me.loadStores();

                }else{
                    //reset de la configuration stockée
                    if (eleve.utils.Config.getSessionId())
                        eleve.utils.Config.resetSession();

                    //affichage du texte attente de session
                    curview.down('[action=loadingText]').setHtml('<h1>En attente de session...</h1>');

                    //aucune session disponible
                    var task = Ext.create('Ext.util.DelayedTask', function() {
                        me.getSession();
                    }, this);

                    //The function will start after 0 milliseconds - so we want to start instantly at first
                    task.delay(5000);
                }

            },
            failure: function(response, opts) {
                //suppression du masque
                console.log('Récupération de session erreur ' + response.status);
                //Ext.Msg.alert('Erreur de connexion', 'Il y a un problème ... Veuillez appeler l\'animateur');

                //aucune session disponible
                var task = Ext.create('Ext.util.DelayedTask', function() {
                    me.getSession();
                }, this);

                //The function will start after 0 milliseconds - so we want to start instantly at first
                task.delay(5000);
            }
        });
    },
    _loading: false,
    loadStores: function () {
        if (this._loading) return;
        this._loading = true;
        var me = this;

        //chargement des stores
        var categories = Ext.getStore('Categories');
        categories.on({
            load: function () {
                me.onLoadStore('categories');
                categories.removeListener('load');
            }
        });
        categories.load();
        var maps = Ext.getStore('Maps');
        maps.on({
            load: function () {
                me.onLoadStore('maps');
                maps.removeListener('load');
            }
        });
        maps.load();
        var questions = Ext.getStore('Questions');
        questions.on({
            load: function () {
                me.onLoadStore('questions');
                questions.removeListener('load');
            }
        });
        questions.load();
        var typequestions = Ext.getStore('TypeQuestions');
        typequestions.on({
            load: function () {
                me.onLoadStore('typequestions');
                typequestions.removeListener('load');
            }
        });
        typequestions.load();
        var typequestionvaleurs = Ext.getStore('TypeQuestionValeurs');
        typequestionvaleurs.on({
            load: function () {
                me.onLoadStore('typequestionvaleurs');
                typequestionvaleurs.removeListener('load');
            }
        });
        typequestionvaleurs.load();
        var typereponses = Ext.getStore('TypeReponses');
        typereponses.on({
            load: function () {
                me.onLoadStore('typereponses');
                typereponses.removeListener('load');
            }
        });
        typereponses.load();
        var regions = Ext.getStore('Regions');
        regions.on({
            load: function () {
                me.onLoadStore('regions');
                regions.removeListener('load');
            }
        });
        regions.load();
    },
    showRoot: function () {
        this.redirectTo('loading');
    },
    showSetEquipe: function () {
        if (!eleve.utils.Config.getLoaded()) {
            this.redirectTo('loading');
            return;
        }

        this.manageView(0, 'eleve.view.SetEquipe');
    },
    showFin: function () {
        if (!eleve.utils.Config.getLoaded()) {
            this.redirectTo('loading');
            return;
        }
        this.manageView(0, 'eleve.view.Fin');
    },
    showMap: function () {
        if (!eleve.utils.Config.getLoaded()) {
            this.redirectTo('loading');
            return;
        }
        var question = this.getCurrentQuestion();
        console.log('Question',question);

        var position = question.getMapPosition();
        var curview = this.manageView(0, 'eleve.view.Map');
        curview.setPosition(position);

    },
    showQuestion: function (id) {
        if (!eleve.utils.Config.getLoaded()) {
            this.redirectTo('loading');
            return;
        }
        var ficheview = this.manageView(0, 'eleve.view.Question');
        var questionStore = Ext.getStore('Questions');
        var record = questionStore.getById(id);
        eleve.utils.Config.setCurrentQuestion(record.get('Ordre'));
        ficheview.setRecord(record);
    }
});