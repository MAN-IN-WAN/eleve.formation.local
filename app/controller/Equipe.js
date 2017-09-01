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
            equipeSubmit: '[action=validerequipe]',
            regionSelect: '#regionselect'
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

        if (num>0 ) {

            //vérification de l'équipe auprès du serveur
            var url = eleve.utils.Config.getSubmitTeamUrl();
            var me  = this;
            var curview = Ext.Viewport.getActiveItem();
            //masquage de la vue en cours pendant le chargement
            curview.setMasked({
                indicator: false,
                 message: 'Chargement de l\'équipe ...'
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
                        me.redirectTo('wait');
                    }else{
                        console.log('Enregistrement Equipe erreur du serveur');
                        //Ext.Msg.alert('Error when setting the team', 'This team is already connected. Please check your number on table.');
                        Ext.Msg.alert('Erreur lors de la définiton de l\'équipe', 'Cette équipe est déja connectée. Vérifiez votre numéro sur la table.');
                    }
                },
                failure: function(response, opts) {
                    curview.setMasked(null);
                    //suppression du masque
                    console.log('Enregistrement Equipe erreur ' + response.status);
                    //Ext.Msg.alert('Error when setting the team', 'There is a problem ... Please call the facilitator');
                    Ext.Msg.alert('Erreur lors de la définiton de l\'équipe', 'Il y a un problème ... Veuillez appeler un animateur');
                }
            });
        }else{
            console.log('Enregistrement Equipe erreur :' + num);
            //Ext.Msg.alert('Error when setting the team and/or region', 'Please check your team number / selected region');
            Ext.Msg.alert('Erreur lors de la définiton de l\'équipe et/ou de la région', 'Vueillez vérifier votre numéro d\'équipe / région séléctionnée');
        }
    }
});