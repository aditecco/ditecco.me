
/* ---------------------------------
[WIP] toggle all
--------------------------------- */

var toggleAll = function() {
	var hidden = $('.story-block-body');
	var toggleAllBtn = $('.full-story').find('#js-toggle-all-stories');

	toggleAllBtn.on('click', function(e) {
		e.preventDefault();

		var getText = $(this).text(),
		btnLabels = [
			'click here to show all sections.',
			'click here to hide all sections.',
			'clicca qui per mostrare tutte le sezioni.',
			'clicca qui per nascondere tutte le sezioni.'
		];

		switch(getText) {
			case btnLabels[0]:
				e.preventDefault();
				$(this).closest('.full-story').find('.story-block-body').show();
				$(this).text(btnLabels[1]);
				break;
			case btnLabels[1]:
				e.preventDefault();
				$(this).closest('.full-story').find('.story-block-body').hide();
				$(this).text(btnLabels[0]);
				break;
			case btnLabels[2]:
				e.preventDefault();
				$(this).closest('.full-story').find('.story-block-body').show();
				$(this).text(btnLabels[3]);
				break;
			case btnLabels[3]:
				e.preventDefault();
				$(this).closest('.full-story').find('.story-block-body').hide();
				$(this).text(btnLabels[2]);
				break;
		}
	});
}(); // IIFE
