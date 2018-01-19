
/* ========================
dtc-resume-print.js
======================== */

// we should provide a way to revert these changes!
var printPrep = () => {
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

	// edit/alter content for print layout

	// - sect header
	let x = $('.page-controls').find('.lang-switcher').text();

	if ( x === 'Versione italiana' ) {
		$('.full-story').find('.section-heading').first().text('Work experience');
	} else if ( x === 'English version' ) {
		$('.full-story').find('.section-heading').first().text('Esperienze lavorative');
	}

	// - contact section
	let t = $('.outline-block.quick-outline--contact');
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

	$(t).find('.quick-outline--contact-inner').remove()
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
}

// print the doc once prepared for print
var printDoc = () => window.print();

// revert changes and restore original doc
var revertDoc = () => {
	$('link').last().remove();
};
