$(document).ready(function() {

    var ProfileCard = Backbone.Model.extend({});

    var ProfileView = Backbone.View.extend({

        el: $('#card-grid'),

        tagName: 'div',

        template: '<div class="col l4 m6 s12"><div class="card-panel"><div class="row content"><div class="col s3 avatar"><img src="{{profile_picture_url}}" alt="" class="circle responsive-img"></div><div class="col s9 info"><div class="username">{{display_name}}</div><div class="ratio">ratio!</div><a class="modal-trigger waves-effect waves-light  btn light-blue lighten-3" href="#modal1">Details</a></div></div></div></div><div id="modal1" class="modal"><div class="modal-content"><h4>Username</h4><p>Info about the user</p><div class="row"><div class="col s4 graph">Graphs?</div><div class="col s4 graph">Graphs?</div><div class="col s4 graph">Graphs?</div></div></div><div class="modal-footer"><a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Exit</a><a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Pay</a><a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Charge</a></div></div>',

        initialize: function() {
            this.render();
        },

        render: function() {
            // TODO MAKE THIS.MODEL.TOJSON()
            this.$el.append((Mustache.render(this.template, this.model.toJSON())));
            return this;
        },

        hide: function() {
            this.$el.hide();
        },

        show: function() {
            this.$el.show();
        }

    });

    ProfileCollection = Backbone.Collection.extend({
        comparator: function(model) {
            // based on highest paid
        }
    });
 
    var profileCollection = new ProfileCollection();

    ProfileCollectionView = Backbone.View.extend({
        collection: null,

        render: function() {
            this.collection.forEach(function(item) {
                console.log(item);
                var view = new ProfileView({model: item});
            });
        }
    });

    $.ajax({
        type: "GET",
        url: "/friends"
    })
    .done(function(body) {
        var data = body.data;
        for(var i in data) {
            var profileCard = new ProfileCard(data[i]);
            profileCollection.add(profileCard);
        }
        console.log(profileCollection);
        var profileCollectionView = new ProfileCollectionView({collection: profileCollection});
        profileCollectionView.render();
    })
    .fail(function() {
        console.log("FAILED");
    });


});
