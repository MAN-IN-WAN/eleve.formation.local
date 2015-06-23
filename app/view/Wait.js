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
                style: 'position:absolute; z-index:1; top:50%; left:50%;',
                action: 'mapMarker'
            },
            {
                width: '100%',
                style: 'margin-top: 400px;text-align: center;',
                action: 'loadingText',
                html: '<h1>Merci, veuillez continuer sur le parcours.</h1>'
            }
        ]
    }
});
