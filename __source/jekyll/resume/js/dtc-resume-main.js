
/* ========================
dtc-resume-main.js
======================== */

// install babel in order to use ES6
$(document).ready(function() {

	/* ---------------------------------
	story-block toggle
	--------------------------------- */
	// don't select directly
	$('.story-block-body').hide();
	$('.story-block-header').on('click', function() {
		$(this).next().slideToggle();
	});

	/* ---------------------------------
	language switcher
	--------------------------------- */
	$('.page-controls').on('click', '#lang-switcher', function(e) {
		e.preventDefault();
		/*
		// outline blocks
		var outlineBlocks = $('.outline-block');

		$.map(outlineBlocks, function(e, i) {
			var localizedContent = [
				{
					blockTitle: "Profilo &amp; skills",
					listItem_0: {
						listHeading: "UI Designer & Imprenditore",
						listBody: "<span class='list-heading'>UI Designer & Imprenditore</span><br>User Interface Designer con approccio imprenditoriale, negli ultimi 5 anni ho lavorato sui miei progetti d'impresa sviluppando un'ampia esperienza nella creazione, vendita e mantenimento di prodotti o servizi."
					},
					listItem_1: {
						listHeading: "Un designer che scrive codice",
						listBody: "<span class='list-heading'>Un designer che scrive codice</span><br>Il mio output principale è high-fidelity mockups in Adobe Photoshop, ma sono anche in grado di scrivere HTML & CSS di base (l'esempio più recente è [il mio portfolio responsive.](http://www.simplest.io))"
					},
					listItem_2: {
						listHeading: "Di cosa mi occupo oggi (2016)",
						listBody: "2011 ad oggi — Simplest</span><br>Dal 2011 lavoro come freelance User Interface Designer, con il brand Simplest: [simplest.io](http://www.simplest.io)"
					}
				}
			];

			// e.innerText = localizedContent[i];
			// e.firstChild.innerText = localizedContent[i.title];
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Missing_name_after_dot_operator
			var buildPropName = 'listItem_' + i;
			var locBlockTitle = localizedContent[i].blockTitle,
					// locBlockListHeading = localizedContent[i]['listItem_' + i].listHeading,
					locBlockListBody = localizedContent[i]['listItem_' + i].listBody;

			$(e).find('.outline-block-list-heading').text(locBlockTitle);
			// $(e).find('.list-heading').text(locBlockListHeading);
			$(e).find('li').html(locBlockListBody);
		});
		*/

		// story blocks
		var storyBlocks = $('.story-block');

		$.map(storyBlocks, function(e, i) {
			var localizedStoryContent = [
				{
					storyBlockTitle: "Freelance User Interface Designer",
					storyBlockBody: "Mi occupo stabilmente di UI Design dal 2011, e dal 2015 ho deciso di dare un nome alla mia attività: l'ho chiamata Simplest, per ricordare a me stesso che le interfacce utente e le interazioni più semplici sono il fondamento delle migliori esperienze digitali. Negli ultimi 5 anni ho progettato una vasta gamma di prodotti digitali, spesso curandone l'immagine completa dall'identità al marketing: subscription e-commerce, web apps, applicazioni multi-piattaforma, & molto altro. [&rarr; Tutti i miei lavori](http://www.simplest.io) Inoltre, data la mia attuale esperienza nella creazione e gestione di uno spazio di coworking, ho sviluppato una comprensione a tutto tondo del ciclo di vita di un prodotto: progettazione (nell'ambito fisico o digitale), marketing & vendita, pricing, amministrazione, acquisizione clienti, fidelizzazione, customer care, e tutte le quotidiane attività di problem-solving che ogni imprenditore conosce bene."
				},
				{
					storyBlockTitle: "foobar",
					storyBlockBody: "Attivo da ottobre 2013, Geekville è il coworking per aziende e freelance del settore creativo, web, & mobile a Verona. [&rarr; Visita il sito](http://www.geekville.it) Ispirato agli uffici delle startup di Silicon Valley, Geekville è un ambiente di lavoro non convenzionale: offre tutto ciò che serve per essere produttivi, e allo stesso tempo favorisce l'incontro e lo scambio di conoscenze tra coworkers grazie all'atmosfera amichevole e informale. Geekville è attivo anche nella produzione di corsi & workshop, con il brand [&rarr; Geekville Learning.](http://www.geekvillelearning.it) Credits: Geekville è stato fondato e realizzato col fondamentale aiuto del mio socio Francesco Adami, con il quale attualmente sto gestendo la società."
				},
				{
					storyBlockTitle: "Creator, Co-Founder, All-around Designer",
					storyBlockBody: "Nel 2012 a Verona non esisteva una vera e propria offerta dedicata al coworking; certo, c'era abbondanza di professionisti e aziende con uffici più grandi del necessario, che per arrotondare affittavano qualcuno dei loro locali. Ma ho sempre pensato che questo non si potesse chiamare coworking; piuttosto, sub-affitto. Nessuno aveva ancora pensato di creare una realtà che facesse una cosa sola, e con la massima qualità: offrire spazi di lavoro come servizio per giovani aziende e professionisti, a un prezzo ragionevole. E' in questo vuoto che si è inserito The Collective. Durante la sua esistenza, in molti si sono incontrati a The Collective: alcuni hanno instaurato rapporti professionali, altri sono diventati semplicemente buoni amici. Alcuni ne hanno fatto quasi una seconda casa, altri ci hanno trovato lo spazio giusto per dare vita a quei progetti che da troppo tempo tenevano nel cassetto. Altri ancora si sono ispirati a The Collective per creare un proprio coworking. In ogni caso, The Collective ha lasciato il segno. Credits: un fondamentale aiuto nel realizzare e gestire The Collective è venuto dal mio socio Francesco Adami, con il quale attualmente conduco Geekville."
				}
			];

			var locStoryBlockTitle = localizedStoryContent[i].storyBlockTitle,
					locStoryBlockListBody = localizedStoryContent[i].storyBlockBody;

			$(e).find('h4').text(locStoryBlockTitle);
			$(e).find('.story-block-body').html(locStoryBlockListBody);
		});

		window.alert('translated!');
	});
}); // document.ready

// [IDEA]
// when an el is selected,
// (implementation)
// fade out other els
/* ---------------------------------
$('.story-block').map((ind, el) => {
	let jqt = $(el);
	jqt.fadeTo('slow', 0.25);
})
--------------------------------- */
