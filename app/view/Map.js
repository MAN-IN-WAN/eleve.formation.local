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
                        html: '<i class="fa fa-map-marker fa-6">You are here</i>',
                        style: 'position:absolute; z-index:10000; top:50%; left:50%;',
                        action: 'mapMarker'
                    },{
                        xtype: 'image',
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
        var screenh = window.innerHeight - 50;
        console.log('position',position);

        this.down('[action=map]').destroy();

        //chargement de la carte
        var map = this.down('[action=containerMap]').add({
            xtype: 'image',
            width: position.map.width,
            height: position.map.height,
            src: position.map.url,
            action: 'map'
        });

        //scale = screenh/position.map.height;

        var allX = Math.floor((position.map.width/2) - (((position.map.width) - (screenw/scale))/2));
        var allY = Math.floor( (position.map.height/2) - (((position.map.height) - (screenh/scale))/2));

        move(map.element.dom)
            .to(-Math.floor(position.map.width/2), -Math.floor(position.map.height/2))
            .scale(scale)
            .to(allX , allY)
            .duration(1)
            .end();
        map.on('painted',
            function () {
                console.log('painted map', scale);
                scale = 1;
                allX = -(position.map.width / 2) + (screenw * scale) / 2;
                allY = -(position.map.height / 2) + (screenh * scale) / 2;

                //positionnement du scroll
                var posx = allX - ((position.posx - 0.5) * (position.map.width));
                var posy = allY - ((position.posy-0.5) * (position.map.height));

                console.log(position.posx,position.posy,allX, allY, posx,posy,'posy',Math.abs(position.posy-0.5), 'débattement',(position.map.height - screenh*scale));
                move(map.element.dom)
                    .scale(scale)
                    .to(posx, posy)
                    .duration(3000)
                    .end();
            }
        ,this,{single: true});
        //evenement click du titre
        var tt = $('.fa.fa-map-marker.fa-6');
        console.log('mon maker ', tt);

        tt.click(function () {
            console.log('tap sur le systeme');
            me.down('[action=mapMarker]').fireEvent('tap');
        });

    }
});
