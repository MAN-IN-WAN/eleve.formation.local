Ext.define('eleve.utils.Config', {
    singleton : true,
    mixins: ['Ext.mixin.Observable'],
    alias : 'utils.Config',
    config : {
        /**
         * global config
         */
        appTitle: 'EDF',
        loaded: false,
        /**
         * Urls
         */
        sessionUrl: _prefixDomain+'/Formation/Session/getCurrentSession.json',
        sessionCheckUrl: _prefixDomain+'/Formation/Session/checkSession.json',
        submitTeamUrl: _prefixDomain+'/Formation/Session/registerTeam.json',
        resultUrl: _prefixDomain+'/Formation/Session/setResult.json',
        checkEtapeUrl: _prefixDomain+'/Formation/Session/checkEtape.json',
        /**
         * session definition
         */
        sessionActive: false,
        sessionId: null,
        sessionName: null,
        sessionEquipe: null,
        currentQuestion: -1,
        /**
         * views
         */
        mainView:null,
        /**
         * Root app
         */
        app:null,
        /**
         * stores
         */
        storeCategorie: _prefixDomain+'/Formation/Session/getCategories.json',
        storeMap: _prefixDomain+'/Formation/Session/getMaps.json',
        storeQuestion:  _prefixDomain+'/Formation/Session/getQuestions.json',
        storeTypeQuestion:  _prefixDomain+'/Formation/Session/getTypeQuestions.json',
        storeTypeQuestionValeur:  _prefixDomain+'/Formation/Session/getTypeQuestionValeurs.json',
        storeTypeReponse:  _prefixDomain+'/Formation/Session/getTypeReponses.json'
    },
    updateCurrentQuestion: function (o) {
        console.log('current question', o);
        if (o>0) {
            localStorage.setItem('currentquestion', o);
        }else if (o==-1){
            var p = localStorage.getItem('currentquestion');
            console.log('storage question', p);
            if (parseInt(p)>parseInt(o)) {
                this.setCurrentQuestion(p);
            }else this.setCurrentQuestion(1);
        }
    },
    updateSessionEquipe: function (o) {
        localStorage.setItem('equipe',o);
        //vérification de la validité
        if (this.getSessionEquipe()>0&&this.getSessionId()>0) {
            this.setSessionActive(true);
        }
    },
    updateSessionId: function (o) {
        console.log('sessionid',o);
        if (o!=undefined)
            localStorage.setItem('sessionid',o);
    },
    updateSessionName: function (o) {
        console.log('sessionname',o);
        if (o!=undefined)
            localStorage.setItem('sessionname',o);
    },
    initSession: function () {
        console.log('localstorage',localStorage.getItem('equipe'),localStorage.getItem('sessionname'),localStorage.getItem('sessionid'));
        //récupération du storage local
        this.setSessionEquipe(localStorage.getItem('equipe'));
        this.setSessionName(localStorage.getItem('sessionname'));
        this.setSessionId(localStorage.getItem('sessionid'));

        //vérification de la validité
        if (this.getSessionEquipe()>0&&this.getSessionId()>0) {
            this.setSessionActive(true);
        }
        console.log('session detail XXX',this.getSessionEquipe(),this.getSessionId(),this.getSessionName(),this.getSessionActive(),this.getCurrentQuestion());

        //vérification de la validité serveur
        if (this.getSessionActive()) {
            console.log('check server session');
            var url = eleve.utils.Config.getSessionCheckUrl();
            var me = this;
            Ext.Ajax.request({
                url: url,
                useDefaultXhrHeader: false,
                params: {
                    sessionId: this.getSessionId(),
                    equipeId:  this.getSessionEquipe()
                },
                method: 'POST',
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        console.log('session OK');
                    } else {
                        //session incorrecte
                        me.resetSession();
                    }

                },
                failure: function (response, opts) {
                    //suppression du masque
                    console.log('Récupération de session erreur ' + response.status);
                    Ext.Msg.alert('Erreur de connexion', 'Il y a un problème ... Veuillez appeler l\'animateur');
                }
            });
        }
    },
    resetSession: function () {
        console.log('==> reset session');

        //reset localstorage
        localStorage.removeItem('equipe');
        localStorage.removeItem('sessionid');
        localStorage.removeItem('sessionname');
        localStorage.removeItem('currentquestion');

        //reset local vars
        this.setSessionEquipe(null);
        this.setSessionId(null);
        this.setSessionName(null);

        //disconnect
        this.getApp().fireEvent('disconnect');
    },
    getApplicationName: function (){
        console.log('getsession name'+this.getSessionName());
        return this.getAppTitle()+' - '+this.getSessionName();
    },
    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    hideMenu: function () {

    }
});