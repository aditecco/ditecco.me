
/* ========================
dtc-resume-main.js
======================== */

// install babel in order to use ES6
$(document).ready(function() {
	// don't select directly
	$('.story-block-body').hide();
	$('.story-block-header').on('click', function() {
		$(this).next().slideToggle();
	})
});
