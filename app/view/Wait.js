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
                style: 'position:absolute; z-index:1; top:45%; left:50%;',
                action: 'mapMarker'
            },
            {
                width: '100%',
                style: 'position:absolute;top:45%;z-index:1;text-align: center;',
                action: 'loadingText',
                html: '<h1>Go back to the ActionMat</h1>'
            }
        ]
    }
});
