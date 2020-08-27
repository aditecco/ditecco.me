
/* ---------------------------------
spl-main.js
--------------------------------- */

// init lazyload
var lazyLoaded = document.querySelectorAll('.lazy');
lazyload(lazyLoaded);


// init smooth-scroll 
var scroll = new SmoothScroll('.js-scroll');


// toggle TOC
if (document.querySelector('.toc') !== null) {
	var tocToggleBtn = document.getElementById('js-toc-toggle-button');
	var tocContainer = document.querySelector('.toc');

	tocToggleBtn.addEventListener('click', function(e) {
		e.preventDefault();

		if (!tocContainer.hasAttribute('style')) {
			this.previousElementSibling.setAttribute('style', 'display: none;');
			this.closest('.toc').setAttribute('style', 'padding: 16px;');
			this.text = 'Show TOC';
		} else {
			this.previousElementSibling.removeAttribute('style');
			this.closest('.toc').removeAttribute('style');
			this.innerHTML = '&larr; hide';
		}
	});
} else { console.warn('This page contains no TOC.'); }


// img reveal
var revealBtn = document.querySelectorAll('.reveal-button');

revealBtn.forEach(function(el, i) {
	el.addEventListener('click', function(e) {
		e.preventDefault();
		var imgContainer = this.closest('.full-width.reveal');

		if (!imgContainer.hasAttribute('style')) {
			imgContainer.setAttribute('style', 'height: 100%');
			this.text = 'Click to fold';
		} else {
			imgContainer.removeAttribute('style');
			this.text = 'View full-size';
		}
	});
});


// truncate long text fields in responsive mode
function truncate() {
	var textContainer = Array.from(document.querySelectorAll('.txt-only.inline'));
	// reverse order
	textContainer.push(document.querySelector('.txt-only.introtxt'));
	
	textContainer.forEach(function(el, i) {
		if (el.childElementCount > 1 && el.innerText.length >= 400) {
			for (let i = 1; i < el.childElementCount; i++) {
				el.children[i].setAttribute('style', 'display: none;');
			}
			
			el.appendChild(document.createElement('a'));
			var revealBtn = el.lastChild;
			revealBtn.setAttribute('class', 'js-read-more-btn');
			revealBtn.setAttribute('href', '#');
			revealBtn.innerText = 'read more...';
			
			revealBtn.addEventListener('click', function(e) {
				e.preventDefault();
				this.closest('.txt-only').querySelectorAll('p').forEach( function(el) {
					el.removeAttribute('style');
				});
				this.remove();
			});
		} else { console.warn('No long text blocks were found.') }
	});
}

// find another way to trigger the function?
if (window.screen.width < 500) { truncate(); }


// experimental addEventListener shortcut
let on = (ev, target, callback) => {
	target.addEventListener(ev, callback);
}
// on('click', evTarget, () => console.log(this) );


// debug
// temp hide all big images
// var img = document.querySelectorAll('img.lazy');
// img.forEach((el, i) => {
// 	el.setAttribute('style', 'display: none;');
// });