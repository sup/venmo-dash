$(document).ready(function() {

    var ProfileCard = Backbone.Model.extend({});

    var InputModel = Backbone.Model.extend({
        initialize: function() {
            console.log(this);
        }
    });

    var ModalView = Backbone.View.extend({

        el: $('#main-view-anchor'),

        tagName: 'div',

        template: '<ul id="popout" class="collapsible popout animated zoomIn" data-collapsible="accordion"><li><div class="collapsible-header"><i class="material-icons">payment</i>Schedule Payments and Charges</div><div class="collapsible-body"><div id="form-row" class="row"><div id="form-col" class="col s12"><div class="card-panel"><h5>Scheduled Payment/Charge</h5><div class="row"><form class="col s12"><div class="row"><div class="input-field col s3"><input id="email" type="text" class="validate"><label for="email">Email</label></div><div class="input-field col s3"><input id="amount" type="number" min="0.01" step="0.01" max="2500" value="" /><label for="amount">Amount</label></div><div class="input-field col s3"><input id="date" type="date" class="datepicker"></div><div class="input-field col s3"><input id="time" type="text"><label for="time">Time</label></div><div class="input-field col s12"><input id="note" type="text" class="validate"><label for="note">Note</label></div></div><div class="switch"><label>Private<input id="social" type="checkbox"><span class="lever"></span>Public</label></div></form></div><a id="pay" class=" waves-effect waves-light deep-orange lighten-2 btn-flat">Pay</a><a id="charge" class=" waves-effect waves-light light-green lighten-2 btn-flat">Charge</a></div></div></div></div></li><li><div class="collapsible-header"><i class="material-icons">replay</i>Recurring Payments and Charges</div><div class="collapsible-body"><div id="form-row" class="row"><div id="form-col" class="col s12"><div class="card-panel"><h5>Recurring Payment/Charge</h5><div class="row"><form class="col s12"><div class="row"><div class="input-field col s3"><input id="email" type="text" class="validate"><label for="email">Email</label></div><div class="input-field col s3"><input id="amount" type="number" min="0.01" step="0.01" max="2500" value="" /><label for="amount">Amount</label></div><div class="input-field col s3"><input id="date" type="date" class="datepicker"></div><div class="input-field col s3"><input id="time" type="text"><label for="time">Time</label></div><div class="input-field col s12"><input id="note" type="text" class="validate"><label for="note">Note</label></div></div><div class="switch"><label>Private<input id="social" type="checkbox"><span class="lever"></span>Public</label></div></form></div><a id="pay" class=" waves-effect waves-light deep-orange lighten-2 btn-flat">Pay</a><a id="charge" class=" waves-effect waves-light light-green lighten-2 btn-flat">Charge</a></div></div></div></div></li></ul>',

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.append(this.template);
        }
   
    });

    var ProfileView = Backbone.View.extend({

        el: $('#card-grid'),

        tagName: 'div',

        template: '<div id="{{profile.username}}"class="col l4 m6 s12 animated zoomIn"><div class="card-panel"><div class="row content"><div class="col s3 avatar"><img src="{{profile.profile_picture_url}}" alt="" class="circle responsive-img"></div><div class="col s9 info"><div class="username">{{profile.display_name}}</div><div class="progress"> <div class="progress-bar progress-bar-success" style="width: {{graph.payedPercent}}%"> <span class="sr-only">${{graph.payed}}</span> </div> <div class="progress-bar progress-bar-danger" style="width: {{graph.chargedPercent}}%"> <span class="sr-only">${{graph.charged}}</span> </div> </div></div></div></div></div>',

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.append((Mustache.render(this.template, this.model.toJSON())));
            return this;
        },

        hide: function() {
            $('#'+this.model.attributes.profile.username).hide();
        },

        show: function() {
            $('#'+this.model.attributes.profile.username).show();
        }

    });

    var MainView = Backbone.View.extend({

        el: $('#main-view-anchor'),

        template: '<div id="maincard" class="col s12 animated zoomIn"> <div class="card-panel"> <div id="maincardcontent" class="row content"> <div class="col s3 avatar-div"> <img src="http://communications.iu.edu/img/photos/people/placeholder.jpg" alt="" class="avatar responsive-img"> </div> <div class="col s5 info"> <h3 class="username">{{profile.venmo.display_name}}</h3> <div class="email">{{profile.email}}</div><div class="balance"><span class="green-font">${{profile.balance}}</span></div> <div class="highlights">graph?</div></div><div class="col s4"> <div id="my-graph" class="ct-chart ct-perfect-fourth"></div> </div> </div> </div> </div>',

        initialize: function() {
            console.log(this.model);
            this.render();
            var graph_data = this.model.toJSON().graph;
            new Chartist.Pie('.ct-chart', {
            series: [graph_data.payed, graph_data.charged],
            labels: ["$"+graph_data.payed.toFixed(2), "$"+graph_data.charged.toFixed(2)],
            }, {
                donut: true,
                donutWidth: 35,
            });
        },

        render: function() {
            // TODO MAKE THIS.MODEL.TOJSON()
            this.$el.append((Mustache.render(this.template, this.model.toJSON())));
            //var graph_data = this.model.toJSON().graph;
            return this;
        },

    });

    ProfileCollection = Backbone.Collection.extend({
        comparator: function(model) {
            // based on highest paid
        }
    });
 
    var profileCollection = new ProfileCollection();

    ProfileCollectionView = Backbone.View.extend({
        
        collection: null,

        viewCollection: null,

        el: 'body',

        bindings: {
            '#search': 'inputVal'
        },

        initialize: function() {
            this.model = new InputModel({});
            this.listenTo(this.model, {
                'change:inputVal': this.updateText
            });
            this.inputVal = $('#search').val();
            this.stickit();
        },

        updateText: function(e) {
            console.log("updatedText");
            this.inputVal = $('#search').val();
            this.filter();
        },

        render: function() {
            var viewCollection = [];
            this.collection.forEach(function(item) {
                var view = new ProfileView({model: item});
                viewCollection.push(view);
            });
            this.viewCollection = viewCollection;
        },

        filter: function() {
            var inputValue = this.inputVal.toLowerCase();
            this.viewCollection.forEach(function(item) {
                var username = item.model.attributes.profile.display_name.toLowerCase();
                if(username.indexOf(inputValue) > -1 || username.length === 0) {
                    item.show();
                } else {
                    item.hide();
                }
            });
        }
    });


    $.ajax({
        type: "GET",
        url: "/profile"
    })
    .done(function(body) {
        var MainCard = new ProfileCard(body);
        var MainCardView = new MainView({model: MainCard});
        // Update graph with graph data
        //var modalView = new ModalView({model: {}});

        $.ajax({
            type: "GET",
            url: "/friends"
        })
        .done(function(body) {
            var data = body;
            console.log(body);
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
    })
    .fail(function() {
        console.log("PROFILE FAILED");
    });

});
