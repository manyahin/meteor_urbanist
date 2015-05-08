Events = new Mongo.Collection("events");

if (Meteor.isClient) {

	Template.allEvents.helpers({
		events: function() {
			return Events.find({});
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