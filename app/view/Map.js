Ext.define('eleve.view.Map', {
    extend: 'Ext.Panel',
    xtype: 'sessionmap',
    requires: [
        'Ext.TitleBar',
        'Ext.Img',
        'Ext.Anim'
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
                action: 'containerMap',
                items: [
                    {
                        html: '<i class="fa fa-map-marker fa-6">Vous êtes ici</i>',
                        style: 'position:absolute; z-index:10000; top:50%; left:50%;',
                        action: 'mapMarker'
                    },
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
    },
    setPosition: function (position) {
        var scale = 1;
        var me = this;
        var screenw = window.innerWidth;
        var screenh = window.innerHeight;
        console.log('position',position);

        //chargement de la carte
        var map = this.down('[action=map]');
        map.setSrc(position.map.url);
        map.setWidth(position.map.width);
        map.setHeight(position.map.height);

        scale = screenh/position.map.height;

        /*map.setWidth(position.map.width*scale);
        map.setHeight(screenh);
        map.setLeft((screenw-(position.map.width*scale))/2);*/

        move(map.element.dom)
            .to((((position.map.width*scale)/2)-screenw), -screenh/2)
            .scale(scale)
            .duration(0)
            .end();

        map.on({
            painted: function () {
                //positionnement du scroll
                 var posx = parseInt(parseFloat(position.posx)*(parseInt(position.map.width)-screenw));
                 var posy = parseInt(parseFloat(position.posy)*(parseInt(position.map.height)-screenh));
                scale = 1;

                move(map.element.dom)
                    .to(-posx*scale, -posy*scale)
                    .scale(scale)
                    .duration(3000)
                    .end();
            }
        });

        //evenement click du titre
        var tt = $('.fa.fa-map-marker.fa-6');
        console.log('mon maker ', tt);

        tt.click(function () {
            console.log('tap sur le systeme');
            me.down('[action=mapMarker]').fireEvent('tap');
        });
    }
});
