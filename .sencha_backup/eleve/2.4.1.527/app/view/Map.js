Ext.define('eleve.view.Map', {
    extend: 'Ext.Panel',
    xtype: 'sessionmap',
    requires: [
        'Ext.TitleBar',
        'Ext.Img'
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
                width: '100%',
                height: '100%',
                scrollable: true,
                items: [
                    {
                        xtype: 'image',
                        width: 1024,
                        height: 711,
                        src: _prefixDomain+'/Home/1/Formation/Map/BM_Manager_INTER_05_06_0.jpg.limit.1024x1024.jpg',
                        action: 'map'
                    }
                ]
            }
        ],
        listeners: {
            initialize: function () {
                console.log('init map');
                this.down('[xtype=titlebar]').setTitle(eleve.utils.Config.getApplicationName());

            }
        }
    }
});
