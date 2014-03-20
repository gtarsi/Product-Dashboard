App = Ember.Application.create();

App.Router.map(function() {

this.resource('test');

/*
	this.resource('posts', function() {
		this.resource('post', {path: ':post_id'});	
	});*/
	
});


App.TestRoute = Ember.Route.extend({
	model: function() {

		return d3.csv('data/test_data.csv', function(d) {
			console.log(d);
			return {
				patientid: d.PATIENT_ID
			};
		});


/*

		var data =   [{
      title: "Tomster",
      url: "http://emberjs.com/images/about/ember-productivity-sm.png"
    }, {
      title: "Eiffel Tower",
      url: "http://emberjs.com/images/about/ember-structure-sm.png"
    }];
*/


	}


});




/*

App.PostsRoute = Ember.Route.extend({
		model: function() {
			return $.getJSON('http://tomdale.net/api/get_recent_posts/?callback=?').then(function(data) {
				return data.posts.map(function(post) {
					post.body = post.content;
					return post;
				});
			});
		}
});


App.PostRoute = Ember.Route.extend({
	model: function(params) {
			return $.getJSON('http://tomdale.net/api/get_post/?id='+params.post_id+'&callback=?').then(function(data) {
				data.post.body = data.post.content;
				return data.post;
			});

			// posts.findBy('id', params.post_id);
	}
});

App.PostController = Ember.ObjectController.extend({
	isEditing: false,

	actions: {
			edit: function() {
				this.set('isEditing',true);
			},

			doneEditing: function() {
				this.set('isEditing', false);
			}
	}
});


Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});


var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
	return new Handlebars.SafeString(showdown.makeHtml(input));
});




var posts = [{
		id: '1',
		title: "Rails is Omakase",
		author: {name: "d2h"},
		date: new Date('12-27-2012'),
		excerpt: "There <h1>are</h1> lots of a la carte software environments in this world. Places where in on",
		body: "I want this for my ORM, I want that for me template language, and let's finish it off with something."

}, {
		id:'2',
		title: "The Parley Letter",
		author: {name: "hello"},
		date: new Date('12-28-2012'),
		excerpt: "There are not many ways for this to work",
		body: "I want this also for my ORM"
}];*/
