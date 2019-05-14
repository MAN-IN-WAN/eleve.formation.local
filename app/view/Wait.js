Ext.define('eleve.view.Wait', {
    extend: 'Ext.Panel',
    xtype: 'loading',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        title: 'Chargement des données',
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: eleve.utils.Config.getAppTitle()
            },
            {
                html: '<i class="fa fa-users fa-6"></i>',
                style: 'position:absolute; z-index:1; top:35%; left:50%;',
                action: 'mapMarker'
            },
            {
                width: '100%',
                style: 'position:absolute;top:35%;z-index:1;text-align: center;',
                action: 'loadingText',
                // html: '<h1>Go back to the ActionMat</h1>'
                html: ''
            }
        ],
        listeners: {
            painted: function () {
                if(eleve.utils.Config.getCurrentQuestion() == 1){
                    this.down('[action=loadingText]').setHtml('<h1>Bienvenue</h1>' +
                        '<div class="filler">' +
                        '<p class="filler-desc">L\'étape est actuellement verrouillée. Lorsqu\'elle sera débloquée par votre animateur la transition se fera automatiquement. <br> Il n\'est pas nécessaire de rafraîchir la page.</p>' +
                        '<p class="filler-image"><img src="resources/img/spinner.gif"></pclass>' +
                        '</div>');
                }else{
                    this.down('[action=loadingText]').setHtml('<h1>Retournez au JuSt Mat</h1>' +
                        '<div class="filler">' +
                        '<p class="filler-desc">L\'étape est actuellement verrouillée. Lorsqu\'elle sera débloquée par votre animateur la transition se fera automatiquement. <br> Il n\'est pas nécessaire de rafraîchir la page.</p>' +
                        '<p class="filler-image"><img src="resources/img/spinner.gif"></pclass>' +
                        '</div>');
                }
            }
        }
    }
});
