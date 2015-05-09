var editing_event_key = false;

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
		'click button.add-guest': function(event, obj) {
			Session.set('editing_key', this._id);
		},
		'click button.edit-link': function(event, obj) {
			Session.set('editing_event_key', this._id);
			// Fill inputs with data from collection.
			$('#inputEventName').val(this.name);
			$('#inputEventDate').val(dateFormat(this.date, "mm/dd/yyyy"));
		}
	});

	// body template.
	Template.body.helpers({
		editing_event_key : function() {
			return Session.get('editing_event_key');
		}
	});
	Template.body.events({
		// Add or Edit event.
		'submit .manage-event': function(event) {
			event.preventDefault();

			// Get and check form values.
			var $eventName = $(event.target).find('#inputEventName');
		    if (! $eventName.val())
		      return;
		  	var $eventDate = $(event.target).find('#inputEventDate');
		    if (! $eventDate.val())
		      return;

		  	var _id_event = Session.get('editing_event_key');
		  	if (_id_event) {
		  		// Update old entity in database.
		  		Events.update({
		  			_id: _id_event
		  		}, {
		  			$set : {
		  				name: $eventName.val(),
		  				date: new Date($eventDate.val())
		  			}
		  		})
		  		// Release editing key. 
		  		Session.set('editing_event_key', false);
		  	} else {
		  		// Insert new entity to database.
		  		Events.insert({
			  		name: $eventName.val(),
			  		date: new Date($eventDate.val()),
			  		guests: []
			  	});
		  	}

		  	// Release inputs.
		  	$eventName.val('');
		  	$eventDate.val('');

		  	// Close modal.
		  	$('#manageEvent').modal('hide');
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

		  	$guestName.val('');
		  	$guestPicture.val('');
		  	$guestStatus.val('');

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