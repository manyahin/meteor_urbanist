Events = new Mongo.Collection("events");

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