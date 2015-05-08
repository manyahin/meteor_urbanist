Events = new Mongo.Collection("events");

if (Meteor.isClient) {

	// allEvents template.
	Template.allEvents.helpers({
		events: function() {
			return Events.find({}, {$sort: {date : 1}});
		}
	});

	// oneEvent template.
	Template.oneEvent.helpers({
		statusIs : function(status) {
			return this.status === status;
		},
		displayDate : function(date) {
			return dateFormat(date, "dddd, mmmm dS");
		}
	});

	Template.oneEvent.events({
		'click button.add-guest': function(event) {
			Session.set('editing_key', this._id);
		}
	});

	// body template.
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
		},
		'submit .add-guest': function(event) {
			event.preventDefault();

			var $guestName = $(event.target).find('#inputGuestName');
		    if (! $guestName.val())
		      return;

		  	var $guestPicture = $(event.target).find('#inputGuestPicture');
		    if (! $guestPicture.val())
		      return;

		    var $guestStatus = $(event.target).find('#inputGuestStatus');
		    if (! $guestStatus.val())
		      return;

		  	console.log(Session.get('editing_key'), {
			  				name: $guestName.val(),
					  		picture: $guestPicture.val(),
					  		status: $guestStatus.val()
					  	});

		  	Events.update(
		  		{
					_id: Session.get('editing_key')
				},
				{
			  		$push : {
			  			guests: {
			  				name: $guestName.val(),
					  		picture: $guestPicture.val(),
					  		status: $guestStatus.val()
					  	}
			  		}
			  	}
		  	);

		  	Session.set('editing_key', null);

		  	$('#addGuest').modal('hide');
		},
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