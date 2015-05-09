$(function() {
	// Setup datepicker.
	$('#inputEventDate').datepicker({
		orientation: 'top'
	});

	// Release inputs and session edit key if user cancel edit modal.
	$('#manageEvent').on('hidden.bs.modal', function (event) {
		// Release editing key. 
	  	Session.set('editing_event_key', false);
	  	// Release inputs.
	  	$('#inputEventName').val('');
	  	$('#inputEventDate').val('');
	})	
})

