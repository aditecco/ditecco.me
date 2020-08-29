
/* ========================
dtc-resume-print.js
======================== */

// VERY [WIP]!
$(document).ready(function() {
	const printButton = $('#js-print-button');

	// provide a way to revert these changes!
	printButton.on('click', function(e) {
		e.preventDefault;

		if ($(this).text() === 'Print version') {
			// append print CSS
			$('head').append('<link>');
			$('head').children().last().attr({
				href: '/resume/css/dtc-resume-print.css',
				rel: 'stylesheet',
				type: 'text/css'
			});

			// show hidden content
			$('.story-block-body').show();

			// inject print-specific content
			$('.container').first().append('<hr class="section-separator">');

			// - contact section
			const t = $('.outline-block.quick-outline--contact');
			let c = `
				<ul class='contact-list'>
					<li>
						<h5>e-mail</h5>
						<a href="mailto:alessandro@ditecco.me">alessandro@ditecco.me</a>
					</li>
					<li>
						<h5>website</h5>
						<a href="http://www.ditecco.me">ditecco.me</a>
					</li>
					<li>
						<h5>design portfolio</h5>
						<a href="http://www.simplest.io">simplest.io</a>
					</li>
				</ul>
			`;

			// we save the prev state
			let bkp = $('.quick-outline--contact-inner').html();

			// use .detach()
			$(t).find('.quick-outline--contact-inner').remove();
			$(t).append(c);

			// [WIP] strip unneeded text from links
			/* ---------------------------------

			switch (stopLight) {
				case "green":
					console.log("Go!");
					break;
				case "yellow":
					console.log("Slow down");
					break;
				case "red":
					console.log("Stop!");
				default:
					console.log("Does not compute");
					break;
			}

			initial hrefs as an array:
			[
				'http://www.simplest.io/?ref=dtc-resume',
				'http://localhost:3000/archive/geekville/en/',
				'http://localhost:3000/archive/the-collective/',
				'http://localhost:3000/archive/the-digital-league/',
				'http://www.ninjamarketing.it/author/alessandro-ditecco/',
				'http://www.ninjamarketing.it/2011/04/19/keting-speaks-design-al-via-la-nuova-sezione-dedicata-alle-arti-visive-a-tutto-tondo/',
				'http://www.h-farmventures.com/en/',
				'https://web.archive.org/web/20131115072955/http://venice.startupweekend.org/',
				'https://web.archive.org/web/20121217072032/http://verona.startupweekend.org/',
				'http://www.simplest.io/work/startup-weekend-verona.html?ref=dtc-resume'
			]

			--------------------------------- */

			let a = $('.story-block-body').find('a');
			// let strp = a.map((el, i) => {
			let strp = $.map(a, (el, i) => {
				let tokens = {
					t01: '?ref=dtc-resume',
					t02: 'http://',
					t03: 'http://localhost:3000/'
				};
				// in the DOM, el.href
				// let curr = el;
				let curr = el.href;
				let cln = curr.length;
				let replaced = '';

				if (curr.substring(0, tokens.t03.length) === tokens.t03) {
					replaced += curr.replace(/http\:\/\/localhost\:3000\//, 'www.ditecco.me/');
				} else if (curr.substring(0, tokens.t02.length) === tokens.t02 && curr.substring((cln - tokens.t01.length), cln) === tokens.t01) {
					// how do we replace for the 1st half of the condition?
					replaced += curr.replace(/\?ref\=dtc\-resume/, '');
				}

				return replaced;
			});

			console.log(strp);

			// change label on btn
			$(this).text('Web version');
		} else if ($(this).text() === 'Web version') {
			// revert changes and restore original doc
			$('link').last().remove();
			$(this).text('Print version');
			$(t).children().last().remove();
			$(t).append(bkp);
		}
	});
});

// print the doc once prepared for print
// var printDoc = () => window.print();
