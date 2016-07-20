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
            var curview = Ext.Viewport.getActiveItem();
            //masquage de la vue en cours pendant le chargement
            curview.setMasked({
                indicator: false,
                 message: 'Loading team ...'
            });
            Ext.Ajax.request({
                url: url,
                useDefaultXhrHeader: false,
                method: 'POST',
                params: {
                    num: num
                },
                success: function(response, opts) {
                    curview.setMasked(null);
                    var obj = Ext.decode(response.responseText);
                    if (obj.success){
                        //enregistrement des informations de session
                        eleve.utils.Config.setSessionEquipe(num);
                        console.log('set team OK');

                        //définition de la question courrante
                        eleve.utils.Config.setCurrentQuestion(obj.currentquestion);

                        //redirection
                        me.redirectTo('map');
                    }else{
                        console.log('Enregistrement Equipe erreur du serveur');
                        Ext.Msg.alert('Error when setting the team', 'This team is already connected. Please check your number on table.');
                    }
                },
                failure: function(response, opts) {
                    curview.setMasked(null);
                    //suppression du masque
                    console.log('Enregistrement Equipe erreur ' + response.status);
                    Ext.Msg.alert('Error when setting the team', 'There is a problem ... Please call the facilitator');
                }
            });
        }else{
            console.log('Enregistrement Equipe erreur :' + num);
            Ext.Msg.alert('Error when setting the team', 'Please check your team number');
        }
    }
});