/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
Ext.application({
    name: 'eleve',

    requires: [
        'Ext.MessageBox',
        'eleve.utils.Config',
        'Ext.util.DelayedTask'
    ],
    models: [
        'Categorie',
        'Map',
        'Question',
        'TypeQuestion',
        'TypeQuestionValeur',
        'TypeReponse'
    ],
    stores: [
        'Categories',
        'Maps',
        'Questions',
        'TypeQuestions',
        'TypeQuestionValeurs',
        'TypeReponses'
    ],
    views: [
        'Loading',
        'SetEquipe',
        'Map',
        'Question',
        'Fin',
        'Wait'
    ],
    controllers: [
        'Main',
        'Equipe'
    ],
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        //message box traduction
        var MB = Ext.MessageBox;
        Ext.apply(MB, {
            YES: { text: 'Oui', itemId: 'yes', ui: 'action' }
        });
        Ext.apply(MB, {
            NO: { text: 'Non', itemId: 'no' }
        });
        Ext.apply(MB, {
            YESNO: [Ext.MessageBox.NO, Ext.MessageBox.YES]
        });

        //message box dont close workaround
        Ext.override(Ext.MessageBox, {
            hide:  function() {
                if (this.activeAnimation && this.activeAnimation._onEnd) {
                    this.activeAnimation._onEnd();
                }
                return this.callParent(arguments);
            }
        });

        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        //Accès de l'interfaces
        eleve.utils.Config.setApp(this);

        //initialisation de la session
        eleve.utils.Config.initSession();
    },
    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },
    listeners: {
        disconnect: function () {
            this.redirectTo('loading');
        }
    }
});
