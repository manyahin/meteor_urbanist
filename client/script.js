$(function() {
	// Setup datepicker.
	$('#inputEventDate').datepicker({
		orientation: 'top'
	});

	// Release inputs and session if a user cancel modal.
	$('#manageEvent, #manageGuest').on('hidden.bs.modal', function (event) {
		// Release editing key. 
	  	Session.set('editing_key', false);
	  	Session.set('parent_id', false);
	  	Session.set('status', false);
	  	Session.set('guest_name', false);
	  	// Release inputs for Event.
	  	$('#inputEventName').val('');
	  	$('#inputEventDate').val('');
	    // Release inputs for Guest.
	  	$('#inputGuestName').val('');
	  	$('#inputGuestPicture').val('');
	  	$('#inputGuestStatus').val('');
	});	
})

