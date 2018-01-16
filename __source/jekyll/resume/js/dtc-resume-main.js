
/* ========================
dtc-resume-main.js
======================== */

// install babel in order to use ES6
$(document).ready(function() {

	/* ---------------------------------
	state management
	--------------------------------- */

	// on doc ready, we store the default EN text content
	var initialState = [];

	var storeState = function() {
		var qoState = $('.quick-outline').html();
		var fsState = $('.full-story').html();
		initialState.push({ quickOutline: qoState }, { fullStory: fsState });
	}(); // IIFE


	/* ---------------------------------
	story-block toggle
	--------------------------------- */

	// set the initial state of '.story-block-body' as hidden
	// and attach an event listener to '.story-block-header'
	// to reveal '.story-block-body' on click
	function setToggles(start, listener, target) {
		$(start).find(target).hide();
		$(start).on('click', listener, function(e) {
			$(this).next().slideToggle();
			// console.log(e)
		});
	}
	setToggles('.story-block', '.story-block-header', '.story-block-body');


	/* ---------------------------------
	language switcher
	--------------------------------- */
	$('.page-controls').on('click', '.lang-switcher', function(e) {
		e.preventDefault();

		// pre-flight
		// ----------
		// check which version, IT or EN, we're serving
		var checkLang = $(this).text();

		// handle translate button changes
		var buttonHandler = function(label, flagCode) {
			$('.lang-switcher').text(label).next().attr('src', 'img/' + flagCode + '-flag.svg');
		};

		// show confirmation after the translation
		var showConfirmation = function(msg) {
			$('.notification-bar').text(msg);
			$('.notification-bar').css('opacity', '100');
		};

		// auto-remove the conf message
		var removeConfirmation = function() {
			$('.notification-bar').css('opacity', '0');
		};

		// use a conditional to cycle IT/EN versions
		if (checkLang === 'English version') {
			/* ---------------------------------
			IT > EN
			--------------------------------- */

			// replace IT content w/ values previously stored in `state`
			$('.quick-outline').html(initialState[0].quickOutline);
			$('.full-story').html(initialState[1].fullStory);
			// console.log(state);

			// calls
			// since the DOM change loses the event listeners
			// and the state of '.story-block-body', we set them again
			setToggles('.story-block', '.story-block-header', '.story-block-body');
			showConfirmation('Translated to English!');
			setTimeout(removeConfirmation, 2000);
			buttonHandler('Versione italiana', 'it');
		} else {
			/* ---------------------------------
			EN > IT (default state)
			--------------------------------- */

			// replace EN content w/ hardcoded values

			// quick-outline
			var quickOutline = $('.quick-outline').children();

			$.map(quickOutline, function(e, i) {
				// [OPTIM] move this to an external data file, convert to JSON
				// require contents w/ $.get()
				var localized = [
					{
						title: '<span class="underline">In breve</span>',
						body: ''
					},
					{
						title: 'Profilo',
						body: '<li><h3 class="list-heading">Front-End Web Designer</h3><p>Dal 2011 creo design per una vasta gamma di prodotti digitali. Sono in grado di sviluppare high-fidelity mockups o HTML/CSS/JS. <sup class="supertext">new!</sup></p></li><li><h3 class="list-heading">Esperienza d&#39;impresa</h3><p>Per diversi anni ho lavorato sui miei progetti d&#39;impresa sviluppando un&#39;ampia esperienza nella creazione, vendita e mantenimento di prodotti o servizi.</p></li>'
					},
					{
						title: 'Skills',
						body: ''
					},
					{
						title: 'Contatti',
						body: '<p>Il modo migliore per contattarmi &egrave; via e-mail.</p><a class="cta-button contact-button" href="mailto:&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;">Contattami</a>'
					}
				];

				var localizedTitle = localized[i].title,
						localizedBody = localized[i].body;

				if ($(e).children().length === 1) {
					$(e).children().first().html(localizedTitle)
				} else if ($(e).children().length === 2) {
					$(e).children().first().text(localizedTitle)
					$(e).children().last().html(localizedBody);
				} else {
					$(e).find('.list-heading').first().text('Aree/linguaggi');
				}
			});

			// full-story
			var fullStory = $('.full-story').children();

			$.map(fullStory, function(e, i) {
				// [FIX] all accented letters need escaping
				// [OPTIM] move this to an external data file, convert to JSON
				// require contents w/ $.get()
				var localized = [
					{
						title: '<span class="underline">La storia completa</span>',
						jobTitle: '',
						body: 'Segue una storia del mio percorso professionale fino ad oggi; clicca su una sezione per rivelare/nascondere i suoi contenuti.'
					},
					{
						title: '2011 - 2017 &mdash; Simplest',
						jobTitle: 'Freelance User Interface Designer',
						body: '<p>Mi occupo di UI Design dal 2011, e dal 2015 ho deciso di dare un nome alla mia attivit&agrave;: l&#39;ho chiamata Simplest, perch&eacute; le pi&ugrave; semplici interfacce utente e interazioni sono il fondamento delle migliori esperienze digitali.</p><p>Negli ultimi 7 anni ho progettato una vasta gamma di prodotti digitali, spesso curandone l&#39;immagine a tutto tondo:</p><ul><li>web-app UIs</li><li>mobile UIs</li><li>product/marketing websites</li><li>e-commerce</li><li>landing pages</li><li>identity, marketing visuals, banners, etc</li></ul><p>Ecco il mio portfolio completo: <a href="http://www.simplest.io/?ref=dtc-resume">&rarr; simplest.io</a></p><p>Inoltre, data la mia passata esperienza nella creazione e gestione di uno spazio di coworking, ho sviluppato una comprensione a tutto tondo del ciclo di vita di un prodotto: progettazione (nell&#39;ambito fisico o digitale), marketing &amp; vendita, pricing, amministrazione, acquisizione clienti, fidelizzazione, customer care, e tutte le quotidiane attivit&agrave; di problem-solving che ogni imprenditore conosce bene.</p>'
					},
					{
						title: '2013 - 2016 &mdash; Geekville',
						jobTitle: 'Creatore, Co-Founder, Designer',
						body: '<p>Fondato nel 2013, <a href="/archive/geekville/">Geekville</a> &egrave;  stato il principale coworking per aziende e freelance del settore creativo, web, &amp; mobile a Verona.</p><p>Ispirato agli uffici delle startup di Silicon Valley, Geekville era un ambiente di lavoro non convenzionale: offriva tutto il necessario per essere produttivi, allo stesso tempo favorendo l&#39;incontro e lo scambio di conoscenze tra coworkers grazie all&#39;atmosfera amichevole e informale.</p><p>Geekville &egrave; stato attivo anche nella produzione di corsi &amp; workshop, con il brand Geekville Learning.</p><p>Credits: Geekville &egrave; stato fondato e realizzato col fondamentale aiuto del mio socio Francesco Adami.</p>'
					},
					{
						title: '2012 - 2013 &mdash; The Collective',
						jobTitle: 'Creatore, Co-Founder, Designer',
						body: '<p>Nel 2012 a Verona non esisteva una vera e propria offerta dedicata al coworking. Certo, c&#39;era abbondanza di professionisti e aziende che affittavano qualcuno dei loro locali per arrotondare; ma nessuno aveva ancora pensato di creare una realt&agrave; che facesse una cosa sola, e con la massima qualit&agrave;: offrire spazi di lavoro come servizio per giovani aziende e professionisti, a un prezzo ragionevole. E&#39; in questo vuoto che si &egrave; inserito <a href="/archive/the-collective/">The Collective.</a></p><p>Durante la sua esistenza, in molti si sono incontrati a The Collective: alcuni hanno instaurato rapporti professionali, altri sono diventati semplicemente buoni amici. Alcuni ne hanno fatto quasi una seconda casa, altri ci hanno trovato lo spazio giusto per dare vita a quei progetti che da troppo tempo tenevano nel cassetto. Altri ancora si sono ispirati a The Collective per creare un proprio coworking. In ogni caso, The Collective ha lasciato il segno.</p><p>Credits: The Collective &egrave; stato fondato e realizzato col fondamentale aiuto del mio socio Francesco Adami.</p>'
					},
					{
						title: '2011 - 2013 &mdash; The Digital League',
						jobTitle: 'Founder, Designer',
						body: '<p>I principali eventi tech/digital in Italia di norma sono un&#39;esclusiva delle grandi citt&agrave; come Roma o Milano. E&#39; nel 2009 che ho avuto per la prima volta l&#39;idea di creare un&#39;organizzazione in grado di portare quel tipo di manifestazioni a Verona. Due anni dopo, nel 2011, ho fondato <a href="/archive/the-digital-league/">The Digital League.</a> un&#39;associazione con l&#39;obiettivo di portare a Verona i migliori eventi nazionali e internazionali su internet, tecnologia, startup e cultura digitale, favorendo cos&igrave; la nascita di una tech-community locale. </p><p>Nei suoi due anni di attivit&agrave;, The Digital League ha ottenuto molte conquiste:</p><ul><li>Ha creato The Collective, il primo coworking a Verona per professionisti creativi &amp; digitali;</li><li>Ha creato il format Digital Drink, ciclo di aperitivi di networking che hanno offerto a molte startup l&#39;opportunit&agrave; di presentare il proprio prodotto a un pubblico selezionato;</li><li>Ha attivato relazioni e collaborazioni, nella forma della media partnership, con eventi e iniziative tech italiane e internazionali;</li><li>E&#39; stata uno degli sponsor paganti di Startup Weekend Verona 2012.</li></ul>'
					},
					{
						title: '01-06/2011 &mdash; Ninja Marketing',
						jobTitle: 'Contributor',
						body: '<p>Ninja Marketing &egrave; uno dei principali blog di marketing italiani, con particolare specializzazione su social media &amp; unconventional.</p><p>Come contributor per la Sezione Startup ho scritto news e approfondimenti, interviste e analisi sul mondo startup italiano. <a href="http://www.ninjamarketing.it/author/alessandro-ditecco/">&rarr; Leggi i miei post</a></p>'
					},
					{
						title: '04-06/2011 &mdash; Ninja Marketing',
						jobTitle: 'Editor',
						body: '<p>La Sezione Design &egrave; stata un&#39;assoluta novit&agrave; per Ninja Marketing ed ha introdotto un grande cambiamento nella tradizione marketing-centrica del sito: sono stato scelto come editor per gestirne il lancio al pubblico, curarne la linea editoriale, reclutare e coordinare un team di contributors. <a href="http://www.ninjamarketing.it/2011/04/19/ninja-marketing-speaks-design-al-via-la-nuova-sezione-dedicata-alle-arti-visive-a-tutto-tondo/">&rarr; Post di lancio della Sezione Design</a></p>'
					},
					{
						title: '2010 - 2011 &mdash; Clab Comunicazione',
						jobTitle: 'Copywriter',
						body: '<p>Clab Comunicazione &egrave; un&#39;agenzia pubblicitaria; ho lavorato principalmente come copywriter, ma anche in qualit&agrave; di responsabile dell&#39;area digitale (siti web, adv online, e altri), sia come designer che come project manager.</p>'
					},
					{
						title: '2007 - 2009 &mdash; BCF',
						jobTitle: 'Copywriter',
						body: '<p>BCF &egrave; un&#39;agenzia di pubblicit&agrave; e studio di design industriale con oltre 30 anni di esperienza. Ho lavorato principalmente come copywriter, ma mi sono anche occupato di presentare progetti creativi ai maggiori clienti d&#39;agenzia e di ideare/gestire progetti digitali.</p>'
					},
					{
						title: '',
						jobTitle: '',
						body: ''
					},
					{
						title: '<span class="underline">Altre esperienze</span>',
						jobTitle: '',
						body: ''
					},
					{
						title: '03-05/2014 &mdash; Behance Portfolio Reviews',
						jobTitle: 'Organizzatore',
						body: '<p>Sono stato uno degli organizzatori di Behance Portfolio Reviews Verona 2014, prima edizione in assoluto per la citt&agrave;.</p><p>Behance Portfolio Review &egrave; un format pensato per incitare i professionisti della creativit&agrave; a scambiarsi feedback sui propri lavori.</p><p>Come organizzatore mi sono occupato di:</p><ul><li>Marketing dell&#39;evento;</li><li>Vendita dei biglietti;</li><li>Allestimento dei locali della manifestazione (pre &amp; post evento);</li><li>Conduzione dell&#39;evento;</li><li>Comunicazione con Behance HQ in USA.</li></ul><p>Credits: per il reclutamento degli ospiti speciali e dei Review Leaders un grande aiuto &egrave; venuto da Stefano Torregrossa &amp; Matteo Cuccato, che hanno messo a disposizione il loro network di conoscenze personali e professionali.</p>'
					},
					{
						title: '04/2013 &mdash; Startup Weekend',
						jobTitle: 'Coach',
						body: '<p>Nell&#39;aprile 2013 <a href="http://www.h-farmventures.com/en/">H-Farm</a> (uno dei maggiori acceleratori di startup italiani) ha organizzato e ospitato Startup Weekend Venezia; sono stato invitato a partecipare all&#39;evento in qualit&agrave; di Coach: <a href="https://web.archive.org/web/20131115072955/http://venice.startupweekend.org/">&rarr; Startup Weekend Venice 2013</a></p><p>Quello del Coach &egrave; un ruolo importante all&#39;interno di uno Startup Weekend: il Coach &egrave; fondamentalmente un esperto nella sua materia – nel mio caso, UI Design &amp; Logo Design – che assiste i team mettendo a disposizione la propria conoscenza.</p>'
					},
					{
						title: '10-12/2012 &mdash; Startup Weekend',
						jobTitle: 'Organizzatore',
						body: '<p>Sono stato uno dei 3 organizzatori di Startup Weekend Verona 2012, per la prima volta in assoluto nella citt&agrave;: <a href="https://web.archive.org/web/20121217072032/http://verona.startupweekend.org/">&rarr; Startup Weekend Verona 2012</a></p><p>Organizzare uno Startup Weekend &egrave; un&#39;attivit&agrave; che richiede molta pianificazione, e l&#39;abilit&agrave; di saper gestire una moltitudine di aspetti:</p><ol><li>Reperimento sponsor;</li><li>Reclutamento di coach e giuria;</li><li>Marketing dell&#39;evento;</li><li>Relazioni pubbliche dell&#39;evento;</li><li>Vendita dei biglietti e customer service;</li><li>Allestimento dei locali della manifestazione (pre &amp; post evento);</li><li>Conduzione dell&#39;evento secondo il programma stabilito;</li><li>Gestione dei premi e comunicazione con aziende partner;</li><li>Lavoro amministrativo (gestire gli incassi, emettere fatture, etc);</li><li>Comunicazione con gli HQ di Startup Weekend in USA.</li></ol><p>Personalmente ho lavorato soprattutto negli ambiti 2, 3, 5, 6, 8. Inoltre, ho realizzato l&#39;immagine dell&#39;evento: <a href="http://www.simplest.io/work/startup-weekend-verona.html">&rarr; Startup Weekend Verona 2012 on Simplest</a></p><p>Grazie al lavoro di tutti l&#39;evento ha avuto un grande successo, con 120+ partecipanti.</p>'
					}
				];

				var localizedTitle = localized[i].title,
						localizedJobTitle = localized[i].jobTitle,
						localizedBody = localized[i].body;

				if ($(e).hasClass('section-header')) {
					$(e).find('h1').html(localizedTitle);
					$(e).find('p').html(localizedBody);
					// what about the separator?
				} else {
					$(e).find('h2').html(localizedTitle);
					$(e).find('h4').text(localizedJobTitle);
					$(e).find('.story-block-body').html(localizedBody);
				}
			});

			// calls
			showConfirmation('Tradotto in italiano!');
			setTimeout(removeConfirmation, 2000);
			buttonHandler('English version', 'us');
		}
	});
}); // document.ready
