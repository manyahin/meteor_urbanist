Events = new Mongo.Collection("events");

if (Meteor.isClient) {
	// Template allEvents.
	Template.allEvents.helpers({
		events: function() {
			return Events.find({}, {$sort: {date : 1}});
		}
	});

	// Template oneEvent.
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
			Session.set('parent_id', this._id);
			Session.set('status', 'add_guest');
		},
		'click button.edit-event': function(event, obj) {
			Session.set('editing_key', this._id);
			// Fill inputs with data from collection.
			$('#inputEventName').val(this.name);
			$('#inputEventDate').val(dateFormat(this.date, "mm/dd/yyyy"));
		}
	});

	// Template Guest
	Template.guest.events({
		'click .edit-guest': function(event, obj) {
			Session.set('parent_id', this._parent_id);
			Session.set('status', 'edit_guest');
			// Its here to fix holl in my head.
			// Really because i don't know why name is lost
			// after modal is opened. 
			Session.set('guestName', this.name);
			// Fill inputs with data from collection.
			$('#inputGuestName').val(this.name);
		  	$('#inputGuestPicture').val(this.picture);
		  	$('#inputGuestStatus').val(this.status);
		}
	})

	// Template body.
	Template.body.helpers({
		// Return value if its edit mode.
		editing_key : function() {
			return Session.get('editing_key');
		},
		manage_guest : function() {
			return Session.get('status') === 'edit_guest';
		},
		getName : function() {
			return Session.get('guestName');
		}
	});
	Template.body.events({
		// Delete event.
		'click .delete-event': function(event) {
			event.preventDefault();
			// Get event _id from Session.
			var _id_event = Session.get('editing_key');
			// Remove event from database.
			Events.remove({_id: _id_event});
			// Release editing key. 
		  	Session.set('editing_key', false);
			// Close modal.
			$('#manageEvent').modal('hide');
		},
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
		  	// Get event _id from Session.
		  	var _id_event = Session.get('editing_key');
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
		  	} else {
		  		// Insert new entity to database.
		  		Events.insert({
			  		name: $eventName.val(),
			  		date: new Date($eventDate.val()),
			  		guests: []
			  	});
		  	}
		  	// Close modal.
		  	$('#manageEvent').modal('hide');
		},
		// Add or Edit guest.
		'submit .manage-guest': function(event) {
			event.preventDefault();
			// Get and check form values.
			var $guestName = $(event.target).find('#inputGuestName');
		    if (! $guestName.val())
		      return;
		  	var $guestPicture = $(event.target).find('#inputGuestPicture');
		    if (! $guestPicture.val())
		      return;
		    var $guestStatus = $(event.target).find('#inputGuestStatus');
		    if (! $guestStatus.val())
		      return;
		  	// Update event, etc add a guest. 
		  	if (Session.get('status') === 'add_guest') {
				// Create a new guest.
				Events.update(
			  		{
						_id: Session.get('parent_id')
					},
					{
				  		$push : {
				  			guests: {
				  				_parent_id: Session.get('parent_id'),
				  				name: $guestName.val(),
						  		picture: $guestPicture.val(),
						  		status: $guestStatus.val()
						  	}
				  		}
				  	}
			  	);
		  	} else if (Session.get('status') === 'edit_guest') {
				// Update old entity in database.
				Meteor.call('update_guest', Session.get('parent_id'), $guestName.val(), $guestPicture.val(), $guestStatus.val());
				// Events.update(
			 //  		{
				// 		_id: Session.get('parent_id'),
				// 		"guests.name": $guestName.val(),
				// 	},
				// 	{
				//   		$set : {
				//   			"guests.$.picture": $guestPicture.val(),
				//   			"guests.$.status": $guestStatus.val()
				//   		}
				//   	}
			 //  	);
		  	} 
		  	
		  	// Close modal.
		  	$('#manageGuest').modal('hide');
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

  // Its fix error about unauthorized [403]
  Meteor.methods({
  	update_guest: function (parent_id, guest_name, guest_picture, guest_status) {
		Events.update(
	  		{
				_id: parent_id,
				"guests.name": guest_name,
			},
			{
		  		$set : {
		  			"guests.$.picture": guest_picture,
		  			"guests.$.status": guest_status
		  		}
		  	}
	  	);
	}
  });

}