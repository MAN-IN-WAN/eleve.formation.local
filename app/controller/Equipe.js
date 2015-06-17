Ext.define('eleve.controller.Equipe', {
    extend: 'Ext.app.Controller',

    config: {
        /**
         * @private
         */
        viewCache: [],

        refs: {
            equipeFieldset: '[action=equipefieldset]',
            equipeInput: '#equipeinput',
            equipeSubmit: '[action=validerequipe]'
        },

        control: {
            equipeSubmit:{
                release: 'onSubmitEquipe'
            }
        }
    },
    onSubmitEquipe: function () {
        var num = parseInt(this.getEquipeInput().getValue());
        console.log('submit equipe :'+ num);
        if (num>0) {
            //vérification de l'équipe auprès du serveur
            var url = eleve.utils.Config.getSubmitTeamUrl();
            var me  = this;
            Ext.Ajax.request({
                url: url,
                useDefaultXhrHeader: false,
                method: 'POST',
                params: {
                    num: num
                },
                success: function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success){
                        //enregistrement des informations de session
                        eleve.utils.Config.setSessionEquipe(num);
                        console.log('set team OK');

                        //redirection
                        me.redirectTo('map');
                    }else{
                        console.log('Enregistrement Equipe erreur du serveur');
                        Ext.Msg.alert('Erreur de définition de l\'équipe', 'Cette équipe est déjà connectée. Veuillez vérifier votre numéro sur la table.');
                    }
                },
                failure: function(response, opts) {
                    //suppression du masque
                    console.log('Enregistrement Equipe erreur ' + response.status);
                    Ext.Msg.alert('Erreur de définition de l\'équipe', 'Il y a un problème ... Veuillez appeler l\'animateur');
                }
            });
        }else{
            console.log('Enregistrement Equipe erreur :' + num);
            Ext.Msg.alert('Erreur de saisie de l\'équipe', 'Veuillez vérrifier votre numéro d\'équipe');
        }
    }
});