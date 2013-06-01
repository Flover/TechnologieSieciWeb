$(function(){
	'use strict';
	var Dzielnica = function(numer, nazwa, kolor){
		this.numer = numer;
		this.nazwa = nazwa;
		this.kolor = kolor
		this.lista = [];
		return this;
	};

	var KartaSzansy = function (numer, tresc, kwota) {
		this.numer = numer;
		this.tresc = tresc;
		this.kwota = kwota;
		return this;
	}

	var KartaRyzyka = function (numer, tresc, kwota) {
		this.numer = numer;
		this.tresc = tresc;
		this.kwota = kwota;
		return this;
	}

	var Pole = function(typ, wartosc, kolor, nazwa, wlasciciel, domki, domekCena, hotel, hotelCena, dzielnica){
		this.typ = typ;
		this.wartosc = wartosc;
		this.kolor = kolor;
		this.nazwa = nazwa;
		this.wlasciciel = wlasciciel;
		this.domki = domki;
		this.domekCena = domekCena;
		this.hotel = hotel;
		this.hotelCena = hotelCena;
		this.dzielnica = dzielnica;
		return this;
	};

	var Gracz = function(nick, pionek){
		this.nick = nick;
		this.ulice = [];
		this.kasa = 1000;
		this.pionek = pionek;
		return this;
	};
	var graczId = 1;
	var poleId = 0;
	var naleznosc = 0;
	var cenaDomek = 0;
	var cenaHotel = 0;
	var iloscDomkow = 0;
	var iloscHoteli = 0;
	var iloscPol = 0;

	var dzielnice = [ new Dzielnica(1, 'Brzeźno', 'purple'), new Dzielnica(2, 'Nowy Port', 'aqua'), new Dzielnica(3, 'Zaspa', 'magenta'), new Dzielnica(4, 'Przymorze', 'orange'), 
		new Dzielnica(5, 'Żabianka', 'red'), new Dzielnica(6, 'Oliwa', 'yellow'), new Dzielnica(7, 'Wrzeszcz', 'green'), new Dzielnica(8, 'Centrum', 'blue'), 
		new Dzielnica(9, 'Pętle', 'white'), new Dzielnica(10, 'Użytkowe', 'white')];
	var gracze = [ new Gracz('Szefo', 'red'), new Gracz('V-c_Szefo', 'blue'), new Gracz('ja', 'green') ];
		
	var trasa = [ '0101' , '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0210', '0209', '0208', '0207', '0206', 
		'0205', '0204', '0203', '0202', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0410', '0409', '0408', '0407', 
		'0406', '0405', '0404', '0403', '0402', '0401', '0301', '0201'];

		var pola = [ new Pole('Start', 200) , new Pole('ulica', 60, 'purple', 'PCK', undefined, 0, 50, 0, 250, 1), new Pole('szansa'), 
			new Pole('ulica', 60, 'purple', 'Gałczyńskiego', undefined, 0, 50, 0, 250, 1), new Pole('podatek', 200),
			new Pole('linia', 200, 'white', 'Strzyża', undefined, 0, 0, 0, 0 ,9), new Pole('ulica', 100, 'aqua', 'Wyzwolenia', undefined, 0, 50, 0, 250, 2),
			new Pole('ryzyko'), new Pole('ulica', 100, 'aqua', 'Wolności', undefined, 0, 50, 0, 250, 2), new Pole('ulica', 100, 'aqua', 'Oliwska', undefined, 0, 50, 0, 250, 2),
			new Pole('odwiedziny'), new Pole('ulica', 140, 'magenta', 'Jana Pawła 2', undefined, 0, 100, 0, 500, 3), new Pole('specjalne', 150, 'white', 'Elektrownia', undefined, 0, 0, 0, 0, 10),
			new Pole('ulica', 140, 'magenta', 'Pilotów', undefined, 0, 100, 0, 500, 3), new Pole('ulica', 160, 'magenta', 'Rzeczypospolitej', undefined, 0, 100, 0, 500, 3),
			new Pole('linia', 200, 'white', 'Oliwa', undefined, 0, 0, 0, 0 ,9), new Pole('ulica', 180, 'orange', 'Obrońców Wybrzeża', undefined, 0, 100, 0, 500, 4), new Pole('szansa'),
			new Pole('ulica', 180, 'orange', 'Chłopska', undefined, 0, 100, 0, 500, 4), new Pole('ulica', 200, 'orange', 'Piastowska', undefined, 0, 100, 0, 500, 4), new Pole('parking'),
			new Pole('ulica', 220, 'red', 'Gospody', undefined, 0, 150, 0, 750, 5), new Pole('ryzyko'), new Pole('ulica', 220, 'red', 'Subisława', undefined, 0, 150, 0, 750, 5),
			new Pole('ulica', 240, 'red', 'Pomorska', undefined, 0, 150, 0, 750, 5), new Pole('linia', 200, 'white', 'Witosa', undefined, 0, 0, 0, 0 ,9), 
			new Pole('ulica', 260, 'yellow', 'Wita Stwosza', undefined, 0, 150, 0, 750, 6), new Pole('ulica', 260, 'yellow', 'Polanki', undefined, 0, 150, 0, 750, 6),
			new Pole('specjalne', 150, 'white', 'Wodociągi', undefined, 0, 0, 0, 0, 10), new Pole('ulica', 280, 'yellow', 'Spacerowa', undefined, 0, 150, 0, 750, 6),
			new Pole('IdźDoWięzienia'), new Pole('ulica', 300, 'green', 'Jaśkowa Dolina', undefined, 0, 200, 0, 1000, 7), new Pole('ulica', 300, 'green', 'Kościuszki', undefined, 0, 200, 0, 1000, 7),
			new Pole('szansa'), new Pole('ulica', 320, 'green', 'Grunwaldzka', undefined, 0, 200, 0, 1000, 7), new Pole('linia', 200, 'white', 'Brzeźno', undefined, 0, 0, 0, 0 ,9),
			new Pole('ryzyko'), new Pole('ulica', 350, 'blue', 'Długa', undefined, 0, 200, 0, 1000, 8), new Pole('podatek', 100), new Pole('ulica', 400, 'blue', 'Długi Targ', undefined, 0, 200, 0, 1000, 8) ]; //TO-DO!

		dzielnice[0].lista.push(1);
			dzielnice[0].lista.push(3);
			dzielnice[1].lista.push(6);
			dzielnice[1].lista.push(8);
			dzielnice[1].lista.push(9);
			dzielnice[2].lista.push(11);
			dzielnice[2].lista.push(13);
			dzielnice[2].lista.push(14);
			dzielnice[3].lista.push(16);
			dzielnice[3].lista.push(18);
			dzielnice[3].lista.push(19);
			dzielnice[4].lista.push(21);
			dzielnice[4].lista.push(23);
			dzielnice[4].lista.push(24);
			dzielnice[5].lista.push(26);
			dzielnice[5].lista.push(27);
			dzielnice[5].lista.push(29);
			dzielnice[6].lista.push(31);
			dzielnice[6].lista.push(32);
			dzielnice[6].lista.push(34);
			dzielnice[7].lista.push(37);
			dzielnice[7].lista.push(39);
			dzielnice[8].lista.push(5);
			dzielnice[8].lista.push(15);
			dzielnice[8].lista.push(25);
			dzielnice[8].lista.push(35);
			dzielnice[9].lista.push(12);
			dzielnice[9].lista.push(28);

			gracze[0].ulice.push(1);
			gracze[0].ulice.push(3);
			pola[1].wlasciciel = 0;
			pola[3].wlasciciel = 0;

			gracze[0].ulice.push(37);
			gracze[0].ulice.push(39);
			pola[37].wlasciciel = 0;
			pola[39].wlasciciel = 0;

			gracze[1].ulice.push(5);
			gracze[2].ulice.push(15);
			gracze[0].ulice.push(25);
			gracze[0].ulice.push(35);
			pola[5].wlasciciel = 1;
			pola[15].wlasciciel = 2;
			pola[25].wlasciciel = 0;
			pola[35].wlasciciel = 0;

		var kartySzansy = [ new KartaSzansy(0, 'Idż na ulice Jana Pawła II jeśli przejdziesz przez START pobierz 200', 0), 
			new KartaSzansy(1, 'Idź na Strzyża. Jeśli przejdziesz przez START pobierz 200', 0),
			new KartaSzansy(2, 'Zrobiłeś błąd w kalkulacjach podatkowych. Zapłać 200.', -200), 
			new KartaSzansy(3, 'Idź na najbliższy Dworzec kolejowy. Jeśli nie jest zajęty możesz go kupić od banku. Jeśli jest już zajęty rzuć kostką jeszcze raz i zapłać właścicielowi odpowiednią sumę.', 0),
			new KartaSzansy(4, 'Idź do Elektrowni.Jeśli nie jest zajęta możesz ją kupić od banku. Jeśli jest już zajęta rzuć kostką jeszcze raz i zapłać właścicielowi odpowiednią sumę.', 0), 
			new KartaSzansy(5, 'Otrzymujesz 30 za porady finansowe', 30), 
			new KartaSzansy(6, 'Idź do więzienia. Nie przechodź przez START. Nie pobieraj 200', 0), 
			new KartaSzansy(7, 'Idź na Pomorska. Jeśli przejdziesz przez START pobierz 200', 0),
			new KartaSzansy(8, 'Bank wypłaca Ci dywidendę. Pobierz 50', 50), 
			new KartaSzansy(9, 'Zwrot podatku.Pobierz 150', 150),
			new KartaSzansy(10, 'Przejdź na START. (Pobierz 200)', 0), 
			new KartaSzansy(11, 'Zapłać grzywne 20', -20), 
			new KartaSzansy(12, 'Cofnij się o trzy pola.', 0), 
			new KartaSzansy(13, 'Idź na Długi Targ', 0) ];

		var kartyRyzyka = [ new KartaRyzyka(0, 'Idź na najbliższy Dworzec kolejowy. Jeśli nie jest zajęty możesz go kupić od banku. Jeśli jest już zajęty rzuć kostką jeszcze raz i zapłać właścicielowi odpowiednią sumę.', 0), 
			new KartaRyzyka(1, 'Odziedziczyłeś spadek. Pobierz 100', 100),
			new KartaRyzyka(2, 'Zająłeś 2 miejsce w konkursie piękności. Pobierz 10', 10), 
			new KartaRyzyka(3, 'Błąd bankowy na twoim koncie! Pobierz 200', 200),
			new KartaRyzyka(4, 'Idź do więzienia. Nie przechodź przez START. Nie pobieraj 200', 0), 
			new KartaRyzyka(5, 'Dostałeś premię! Pobierz 100', 100),
			new KartaRyzyka(6, 'Masz urodziny! Pobierz 100.', 100), 
			new KartaRyzyka(7, 'Fundusz Zdrowotny. Pobierz 100', 100),
			new KartaRyzyka(8, 'Zapłać za wizytę u dentysty 100', -100), 
			new KartaRyzyka(9, 'Zapłać czesne 50', -50),
			new KartaRyzyka(10, 'Przejdź na START (Pobierz 200)', 0), 
			new KartaRyzyka(11, 'Wyprzedaż! Pobierz 50', 50),
			new KartaRyzyka(12, 'Zapłać za wizytę Lekarską 50', 50), 
			new KartaRyzyka(13, 'Zwrot podatku. Pobierz 20', 20) ];

		var pionek = function (id) { return '<div class="pionek" id="pionek'+id+'"></div>'; };

		$('#cell_0101 .cellFigures').append(pionek(0));
		$('#cell_0101 .cellFigures').append(pionek(1));
		$('#cell_0101 .cellFigures').append(pionek(2));


		var movePionek = function (moveSize, graczId){
			var gracz = gracze[graczId];
			var cell = $('#pionek'+graczId).parent().parent().attr('id').substring(5,9);
			console.log('cell: ' + cell);
			var pionekPozycja = 0;
			for(var i = 0; i < 41; i++){
				if(trasa[i] === cell){
					pionekPozycja = i;
					break;
				}
			}
				console.log(pionekPozycja);
				console.log(trasa[pionekPozycja]);
			$('#cell_'+ trasa[pionekPozycja] +' .cellFigures').children().filter('#pionek'+graczId).remove();
				console.log(trasa[((pionekPozycja+moveSize)%40)]);
			$('#cell_'+ trasa[((pionekPozycja+moveSize)%40)] +' .cellFigures').append(pionek(graczId));

			poleId = ((pionekPozycja+moveSize)%40);
			var pole = pola[((pionekPozycja+moveSize)%40)];
				console.log(pole);

				//sprawdzanie na jakie pole staneliśmy
				if(pole.typ === 'szansa'){
					//todo szansaModal
					var szansaId = function getRandomInt () {
						var min = 0;
						var max = 13;
						return Math.floor(Math.random() * (max - min + 1)) + min;
					};
					console.log('Numer karty to: ' + szansaId())
					$('#chanceModalContent').text(kartySzansy[szansaId()].tresc);
					$('#chanceModal').modal('show');
				}
				else if(pole.typ === 'ryzyko'){
					var ryzykoId = function getRandomInt () {
						var min = 0;
						var max = 13;
						return Math.floor(Math.random() * (max - min + 1)) + min;
					};
					$('#chanceModalContent').text(kartyRyzyka[ryzykoId()].tresc);
					$('#chanceModal').modal('show');
				}
				else if(pole.typ ==='podatek'){
					$('#taxModalContent').text('Dorwał Cię ZUS, płacisz ' + pola[poleId].wartosc);
						$('#taxModal').modal('show');
				}
				else if (pole.typ === 'odwiedziny' || pole.typ === 'parking') {
					graczId++;
				}
				else if (pole.typ === 'linia'){
					if(pole.wlasciciel === undefined){
						$('#buyModalLabel').text(gracz.nick + ' Kup: ' + pole.nazwa);
						$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
						$('#buyModalCena').text('Cena: ' + pole.wartosc);
						$('#buyModal').modal('show');
					}
					//Jedno pole Linii
					else if (pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel
							|| pola[15].wlasciciel === pole.wlasciciel && pola[5].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel
							|| pola[25].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[5].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel
							|| pola[35].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[5].wlasciciel !== pole.wlasciciel){
						naleznosc = (pole.wartosc/8);
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
					//Dwa pola linii
					else if (pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel 
						|| pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel 
						|| pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel 
						|| pola[5].wlasciciel !== pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel 
						|| pola[5].wlasciciel !== pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel 
						|| pola[5].wlasciciel !== pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel){
						naleznosc = (pole.wartosc/4);
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
					//Trzy pola linii
					else if(pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel !== pole.wlasciciel
							|| pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel !== pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel
							|| pola[5].wlasciciel === pole.wlasciciel && pola[15].wlasciciel !== pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel
							|| pola[5].wlasciciel !== pole.wlasciciel && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel){
						naleznosc = (pole.wartosc/2);
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
					//Wszystkie pola Linii
					else if (pola[5].wlasciciel !== graczId && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel) {
						naleznosc = pole.wartosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
				}
				//normale pole
				else { 

					var dzielnica = dzielnice[pole.dzielnica-1];
						var ownsAll = true;
						var oneOwner = true;
						var owner = pola[dzielnica.lista[0]].wlasciciel;
						var liczbaDomki = 0;
						var liczbaHotele = 0;
						var iloscPol = 0;
						for(var i=0; i < dzielnica.lista.length; i++){
							if(pola[dzielnica.lista[i]].wlasciciel !== owner){
								oneOwner = false;
							}
							if(dzielnica.lista[i] && pola[dzielnica.lista[i]].wlasciciel !== graczId){
								ownsAll = false;
							}

								console.log(pola[dzielnica.lista[i]].wlasciciel + " : " +pola[dzielnica.lista[i]].domki + " : " + pola[dzielnica.lista[i]].hotel);
							liczbaDomki += pola[dzielnica.lista[i]].domki;
							liczbaHotele += pola[dzielnica.lista[i]].hotel;
							iloscPol++;
						}
							console.log('iloscPol: ' + iloscPol + ' ownsAll: ' + ownsAll + ' domki: ' + liczbaDomki + ' hotele: ' + liczbaHotele);

					if(pole.wlasciciel === undefined){
						$('#buyModalLabel').text(gracz.nick + ' Kup: ' + pole.nazwa);
						$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
						$('#buyModalCena').text('Cena: ' + pole.wartosc);
						$('#buyModal').modal('show');
					}
					else if(pole.wlasciciel === graczId && ownsAll && pole.typ === 'ulica'){
						//todo modal do budowania
						$('#propertyModalKasa').text(gracz.kasa);
						$('#propertyModalCena').text('0');
						$('#propertyModal').modal('show');

						var ownedDzielnice =[];
						var ownsDzielnica = true;

						for(var j = 0; j < dzielnice.length; j++){
							if(pola[dzielnice[j].lista[0]].wlasciciel === graczId){
								for(var k=1; k < dzielnice[j].lista.length; k++){
									if(pola[dzielnice[j].lista[k]].wlasciciel !== graczId){
										ownsDzielnica = false;
										break;
									}
								}
								if(ownsDzielnica) { ownedDzielnice.push(dzielnice[j]); }
							}
						}
						 console.log(ownedDzielnice);
						 $('#propertyDzielnicaList').append('<option value="null">---</option>');
						 $.each(ownedDzielnice, function(i, item) {
						 	$('#propertyDzielnicaList').append('<option value="'+item.numer+'">'+item.nazwa+'</option>');
						 });

					}
					else if(pole.wlasciciel !== graczId){
							naleznosc = (pole.wartosc/20);
							if(oneOwner){ 
								if(liczbaDomki === 0 && liczbaHotele === 0){
									naleznosc *= 2; 
								} else if(liczbaDomki === 1 && liczbaHotele === 0) {
									naleznosc *= 5;
								} else if (liczbaDomki === 2 && liczbaHotele === 0) {
									naleznosc *= 15;
								} else if (liczbaDomki === 3 && liczbaHotele === 0) {
									naleznosc *= 45;
								} else if (liczbaDomki === 4 && liczbaHotele === 0) {
									naleznosc *= 80;
								} else if (liczbaDomki === 0 && liczbaHotele === 1) {
									naleznosc *= 100;
								}

							}
						//gracz.kasa -= naleznosc;
						//gracze[pole.wlasciciel].kasa += naleznosc;
						//	console.log(gracz.nick + ' kasa: ' + gracz.kasa);
						//	console.log(gracze[pole.wlasciciel].nick + ' kasa: ' + gracze[pole.wlasciciel].kasa);
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					} else {

					}
				}
		};

		$('#propertyDzielnicaList').change(function () {
			iloscDomkow = 0;
			iloscHoteli = 0;
			var data = $(this).val();
			if(data === 'null'){
				cenaDomek = 0;
				cenaHotel = 0;
				//console.log(cenaDomek + " : " + cenaHotel);
				$('#propertyDomkiIlosc').text(0);
				$('#propertyHoteleIlosc').text(0);
			}
			else {
				data = parseInt(data, 10) - 1;
				cenaDomek = pola[dzielnice[data].lista[0]].domekCena;
				cenaHotel = pola[dzielnice[data].lista[0]].hotelCena;
				//console.log(cenaDomek + " : " + cenaHotel);
				iloscPol = dzielnice[data].lista.length;
				for(var k = 0; k < iloscPol; k++){
					iloscDomkow += pola[dzielnice[data].lista[k]].domki;
					iloscHoteli += pola[dzielnice[data].lista[k]].hotel;
				}
				$('#propertyDomki').attr('max', (iloscPol * 4) - iloscDomkow);
				$('#propertyHotele').attr('max', (iloscPol) - iloscHoteli);

				$('#propertyDomkiIlosc').text(iloscDomkow);
				$('#propertyHoteleIlosc').text(iloscHoteli);				

			}
			$('#propertyDomki').change();
			$('#propertyHotele').change();
		});

		$('#propertyDomki').change(function () {
			var data = $(this).val();

			//console.log(data * cenaDomek);

			$('#propertyDomkiKoszt').text(data * cenaDomek);
			var koszt = parseInt($('#propertyDomkiKoszt').text() ,10) + parseInt($('#propertyHoteleKoszt').text(), 10) ;
			$('#propertyModalCena').text(koszt);

		});

		$('#propertyHotele').change(function () {
			var data = $(this).val();

			//console.log(data * cenaHotel);

			$('#propertyHoteleKoszt').text(data * cenaHotel);
			var koszt = parseInt($('#propertyDomkiKoszt').text() ,10) + parseInt($('#propertyHoteleKoszt').text(), 10) ;
			$('#propertyModalCena').text(koszt);

		});

		$('#buyModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			pola[poleId].wlasciciel = graczId;
			gracz.ulice.push(poleId);
			gracz.kasa -= pola[poleId].wartosc;
				$('#buyModal').modal('hide');
				setTimeout(function(){
					graczId++;
					movePionek(5, graczId);
				}
				,1000);
				console.log(gracz.nick + ' kasa po kupnie: ' + gracz.kasa);
			});

		$('#payModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa -= naleznosc;
			gracze[pola[poleId].wlasciciel].kasa += naleznosc;
			$('#payModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(5, graczId);
			}
			,1000);
			console.log(gracz.nick + ' kasa po oddaniu zaplacie: ' + gracz.kasa);
			console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po odbiorze kasy: ' + gracze[pola[poleId].wlasciciel].kasa);
		});

		$('#chanceModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa += kartySzansy[szansaId].kwota;
			$('#chanceModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(3, graczId);
			}
			,1000);
			console.log(gracz.nick + ' kasa po "szansie": ' + gracz.kasa);
		});

		$('#riskModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa += kartySzansy[szansaId].kwota;
			$('#riskModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(3, graczId);
			}
			,1000);
			console.log(gracz.nick + ' kasa po "ryzyku": ' + gracz.kasa);
		});

		$('#taxModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa -= pola[poleId].wartosc;
			$('#taxModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(3, graczId);
			}
			,1000);
			console.log(gracz.nick + ' kasa po "podatku": ' + gracz.kasa);
		});

		$('#propertyModalSaveBtn').click(function(){
			var selectedIloscDomkow = $('#propertyDomki').val();
			var selectedIloscHoteli = $('#propertyHotele').val();
			var selectedStanKonta = parseInt($('#propertyModalKasa').text(),10);
			var selectedKoszt = parseInt($('#propertyModalCena').text(),10);

			if( selectedIloscHoteli > 0 && iloscDomkow + selectedIloscDomkow !== iloscPol * 4 ){
				console.log('za mało donków na hotiel');

			} else if(selectedStanKonta < selectedKoszt) {
				console.log('kasa musi się zgadzać');
			}
			else{
				gracze[graczId].kasa -= selectedKoszt;
				var dzielnia = parseInt($('#propertyDzielnicaList').val(), 10) - 1;
				//console.log('d:' + dzielnia);
				var npd = selectedIloscDomkow % iloscPol;
				var pd = selectedIloscDomkow - npd;

				//console.log('npd: ' + npd + ' pd: ' + pd);

				for(var i =0; i < iloscPol; i++){
					pola[dzielnice[dzielnia].lista[i]].domki += pd / iloscPol;
					if(i === iloscPol) { pola[dzielnice[dzielnia].lista[i]].domki += npd; }
				}

				var nph = selectedIloscHoteli % iloscPol;
				var ph = selectedIloscHoteli - nph;

				//console.log('nph: ' + nph + ' ph: ' + ph);

				for(var j =0; j < iloscPol; j++){
					pola[dzielnice[dzielnia].lista[j]].hotel += ph;
					if(i === iloscPol){ pola[dzielnice[dzielnia].lista[j]].hotel += nph; }
				}

				console.log(pola[1]);
				console.log(pola[3]);

				$('#propertyModal').modal('hide');
				setTimeout(function(){
					graczId++;
					movePionek(3, graczId);
				}
				,1000);
				console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po kupnie domku: ' + gracze[pola[poleId].wlasciciel].kasa);
			}
		});

		$('#propertyModalCancelBtn').click(function(){
			$('#propertyModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(3, graczId);
			}
			,1000);
		});

		$('#buyModalCancelBtn').click(function(){
			$('#buyModal').modal('hide');
			setTimeout(function(){
				graczId++;
				movePionek(3, graczId);
			}
			,1000);
		});

		//losowanie ilości oczek jaką ma się przesunąć pionek
		var kostka = function getRandomInt () {
			var min = 1;
			var max = 6;
			return { '1': Math.floor(Math.random() * (max - min + 1)) + min, '2': Math.floor(Math.random() * (max - min + 1)) + min };
		};

		console.log(kostka());

		movePionek(35, graczId);
});