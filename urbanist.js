Events = new Mongo.Collection("events");

if (Meteor.isClient) {

	Template.allEvents.helpers({
		events: function() {
			return Events.find({}, {$sort: {date : 1}});
		}
	});

	Template.oneEvent.helpers({
		statusIs : function(status) {
			return this.status === status;
		},
		displayDate : function(date) {
			return dateFormat(date, "dddd, mmmm dS");
		}
	});

	Template.body.events({
		'submit .create-event': function(event) {
			event.preventDefault();

			var $eventName = $(event.target).find('#inputEventName');
		    if (! $eventName.val())
		      return;

		  	var $eventDate = $(event.target).find('#inputEventDate');
		    if (! $eventDate.val())
		      return;

		  	Events.insert({
		  		name: $eventName.val(),
		  		date: new Date($eventDate.val()),
		  		guests: []
		  	});

		  	$('#createEvent').modal('hide');
		}
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
  	// If collection is empty then fill it from the json file. 
    if (Events.find().count() === 0) {
		var events_data = JSON.parse(Assets.getText('events.json'));
		events_data.forEach(function(obj) {
			Events.insert(obj);
		})
    }
  });
}