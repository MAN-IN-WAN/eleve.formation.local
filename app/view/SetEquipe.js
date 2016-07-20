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
        'Ext.field.Radio'
    ],
    config: {
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: ''
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
                        placeHolder: 'Table number',
                        autoCapitalize: false,
                        required      : true,
                        id: 'equipeinput'
                    },
                    {
                        xtype: 'button',
                        action: 'validerequipe',
                        text: 'Register',
                        cls: 'ypm-button valider-inscription'
                    }
                ]
            }
        ],
        listeners: {
            initialize: function () {
                console.log('init now');
                this.down('[xtype=titlebar]').setTitle(eleve.utils.Config.getApplicationName());

            }
        }
    }
});