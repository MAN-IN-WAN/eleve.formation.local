Ext.define('eleve.view.SetEquipe', {
    xtype: 'setteam',
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.Spinner',
        'Ext.field.Password',
        'Ext.field.Email',
        'Ext.field.Url',
        'Ext.field.DatePicker',
        'Ext.field.Select',
        'Ext.field.Hidden',
        'Ext.field.Radio',
        'Ext.field.Select'
    ],
    config: {
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: '',
                style: {
                    'background-color' :'#388e6b',
                    'background-image': 'linear-gradient(top, #42b18a,#1676b9 3%,#388e6b) !important'
                }
            },
            {
                xtype: 'fieldset',
                action: 'equipefieldset',
                instructions: '',
                defaults: {
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype         : 'textfield',
                        name : 'lastname',
                        label: 'Equipe',
                        cls: 'ypm-input',
                        clearIcon: false,
                        placeHolder: 'Numéro de table',
                        autoCapitalize: false,
                        required      : true,
                        id: 'equipeinput'
                    },
                    {
                        xtype         : 'selectfield',
                        name : 'region',
                        label: 'Region',
                        cls: 'ypm-select',
                        clearIcon: false,
                        required      : true,
                        id: 'regionselect'
                    },
                    {
                        xtype: 'button',
                        action: 'validerequipe',
                        text: 'Enregistrer',
                        cls: 'ypm-button valider-inscription'
                    }
                ]
            }
        ],
        listeners: {
            initialize: function () {
                console.log('init now');
                this.down('[xtype=titlebar]').setTitle(eleve.utils.Config.getApplicationName());
                var regStore = Ext.getStore('Regions');
                var me = this;
                var opts = new Array({
                    text:'Choississez une région',
                    value: 0
                });
                regStore.each(function (item,index){
                    opts.push({
                        'text':item.get('Nom'),
                        'value': item.get('id')
                    });
                    console.log(item);
                });
                me.down('[xtype=selectfield]').setOptions(opts);

            }
        }
    }
});