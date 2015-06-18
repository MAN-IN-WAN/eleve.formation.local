Ext.define('eleve.view.Loading', {
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
                width: '100%',
                style: 'margin-top: 65%;text-align: center;',
                action: 'loadingText',
                html: '<h1>Chargement en cours ...</h1>'
            }
        ]
    }
});
