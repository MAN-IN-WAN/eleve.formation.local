Ext.define('eleve.view.Fin', {
    extend: 'Ext.Panel',
    xtype: 'fin',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        title: 'Fin',
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: eleve.utils.Config.getAppTitle(),
                style: {
                    'background-color' :'#388e6b',
                    'background-image' : 'linear-gradient(to top, #f2fafd, #68c5b6 10%, #f2fafd 98%)'
                }
            },
            {
                width: '100%',
                style: 'margin-top: 200px;text-align: center;',
                // html: '<h1>End of the interactive animation</h1><h2>Thank you for your participation.</h2>'
                html: '<h1>Fin de l\'animation interactive</h1><h2>Nous vous remercions pour votre participation.</h2>'
            }
        ]
    }
});
