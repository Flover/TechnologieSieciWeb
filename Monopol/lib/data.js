module.exports = function (){
	var Dzielnica = function(numer, nazwa, kolor){
		this.numer = numer;
		this.nazwa = nazwa;
		this.kolor = kolor
		this.lista = [];
		return this;
	};

	var KartaSzansy = function (numer, tresc, kwota, ruch, pole) {
		this.numer = numer;
		this.tresc = tresc;
		this.kwota = kwota;
		this.ruch = ruch;
		this.pole = pole;
		return this;
	}

	var KartaRyzyka = function (numer, tresc, kwota, ruch, pole) {
		this.numer = numer;
		this.tresc = tresc;
		this.kwota = kwota;
		this.ruch = ruch;
		this.pole = pole;
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

	var dzielnice = [ new Dzielnica(1, 'Brzeźno', 'purple'), new Dzielnica(2, 'Nowy Port', 'aqua'), new Dzielnica(3, 'Zaspa', 'magenta'), new Dzielnica(4, 'Przymorze', 'orange'), 
		new Dzielnica(5, 'Żabianka', 'red'), new Dzielnica(6, 'Oliwa', 'yellow'), new Dzielnica(7, 'Wrzeszcz', 'green'), new Dzielnica(8, 'Centrum', 'blue'), 
		new Dzielnica(9, 'Pętle', 'white'), new Dzielnica(10, 'Użytkowe', 'white')];
	var gracze = [ ];
		
	var trasa = [ '0101' , '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0210', '0209', '0208', '0207', '0206', 
		'0205', '0204', '0203', '0202', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0410', '0409', '0408', '0407', 
		'0406', '0405', '0404', '0403', '0402', '0401', '0301', '0201'];

	var pola = [ new Pole('start', 200) , new Pole('ulica', 60, 'purple', 'PCK', undefined, 0, 50, 0, 250, 1), 
		new Pole('szansa'), new Pole('ulica', 60, 'purple', 'Gałczyńskiego', undefined, 0, 50, 0, 250, 1), 
		new Pole('podatek', 200), new Pole('linia', 200, 'white', 'Strzyża', undefined, 0, 0, 0, 0 ,9), 
		new Pole('ulica', 100, 'aqua', 'Wyzwolenia', undefined, 0, 50, 0, 250, 2),
		new Pole('ryzyko'), new Pole('ulica', 100, 'aqua', 'Wolności', undefined, 0, 50, 0, 250, 2), 
		new Pole('ulica', 100, 'aqua', 'Oliwska', undefined, 0, 50, 0, 250, 2),
		new Pole('odwiedziny'), new Pole('ulica', 140, 'magenta', 'Jana Pawła 2', undefined, 0, 100, 0, 500, 3), 
		new Pole('specjalne', 150, 'white', 'Elektrownia', undefined, 0, 0, 0, 0, 10),
		new Pole('ulica', 140, 'magenta', 'Pilotów', undefined, 0, 100, 0, 500, 3), 
		new Pole('ulica', 160, 'magenta', 'Rzeczypospolitej', undefined, 0, 100, 0, 500, 3),
		new Pole('linia', 200, 'white', 'Oliwa', undefined, 0, 0, 0, 0 ,9), 
		new Pole('ulica', 180, 'orange', 'Obrońców Wybrzeża', undefined, 0, 100, 0, 500, 4), new Pole('szansa'),
		new Pole('ulica', 180, 'orange', 'Chłopska', undefined, 0, 100, 0, 500, 4), 
		new Pole('ulica', 200, 'orange', 'Piastowska', undefined, 0, 100, 0, 500, 4), new Pole('parking'),
		new Pole('ulica', 220, 'red', 'Gospody', undefined, 0, 150, 0, 750, 5), 
		new Pole('ryzyko'), new Pole('ulica', 220, 'red', 'Subisława', undefined, 0, 150, 0, 750, 5),
		new Pole('ulica', 240, 'red', 'Pomorska', undefined, 0, 150, 0, 750, 5), 
		new Pole('linia', 200, 'white', 'Witosa', undefined, 0, 0, 0, 0 ,9), 
		new Pole('ulica', 260, 'yellow', 'Wita Stwosza', undefined, 0, 150, 0, 750, 6), 
		new Pole('ulica', 260, 'yellow', 'Polanki', undefined, 0, 150, 0, 750, 6),
		new Pole('specjalne', 150, 'white', 'Wodociągi', undefined, 0, 0, 0, 0, 10), 
		new Pole('ulica', 280, 'yellow', 'Spacerowa', undefined, 0, 150, 0, 750, 6),
		new Pole('IdzDoWiezienia'), new Pole('ulica', 300, 'green', 'Jaśkowa Dolina', undefined, 0, 200, 0, 1000, 7), 
		new Pole('ulica', 300, 'green', 'Kościuszki', undefined, 0, 200, 0, 1000, 7),
		new Pole('szansa'), new Pole('ulica', 320, 'green', 'Grunwaldzka', undefined, 0, 200, 0, 1000, 7), 
		new Pole('linia', 200, 'white', 'Brzeźno', undefined, 0, 0, 0, 0 ,9),
		new Pole('ryzyko'), new Pole('ulica', 350, 'blue', 'Długa', undefined, 0, 200, 0, 1000, 8), 
		new Pole('podatek', 100), new Pole('ulica', 400, 'blue', 'Długi Targ', undefined, 0, 200, 0, 1000, 8) ];

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


	var kartySzansy = [ new KartaSzansy(0, 'Idż na ulice Jana Pawła II jeśli przejdziesz przez START pobierz 200', 0, undefined, 11), 
		new KartaSzansy(1, 'Idź na Strzyża. Jeśli przejdziesz przez START pobierz 200', 0, undefined, 5),
		new KartaSzansy(2, 'Zrobiłeś błąd w kalkulacjach podatkowych. Zapłać 200.', -200), 
		new KartaSzansy(3, 'Idź na Oliwa.', 0, undefined, 15 ),
		new KartaSzansy(4, 'Idź do Elektrowni.', 0, undefined, 12), 
		new KartaSzansy(5, 'Otrzymujesz 30 za porady finansowe', 30), 
		new KartaSzansy(6, 'Idź do więzienia. Nie przechodź przez START. Nie pobieraj 200', 0, undefined, 30), 
		new KartaSzansy(7, 'Idź na Pomorska. Jeśli przejdziesz przez START pobierz 200', 0, undefined, 24),
		new KartaSzansy(8, 'Bank wypłaca Ci dywidendę. Pobierz 50', 50), 
		new KartaSzansy(9, 'Zwrot podatku.Pobierz 150', 150),
		new KartaSzansy(10, 'Przejdź na START. (Pobierz 200)', 0, undefined, 0), 
		new KartaSzansy(11, 'Zapłać grzywne 20', -20), 
		new KartaSzansy(12, 'Cofnij się o trzy pola.', 0, -3), 
		new KartaSzansy(13, 'Idź na Długi Targ', 0, undefined, 39) ];

	var kartyRyzyka = [ new KartaRyzyka(0, 'Idź na Brzeźno.', 0, undefined, 35), 
		new KartaRyzyka(1, 'Odziedziczyłeś spadek. Pobierz 100', 100),
		new KartaRyzyka(2, 'Zająłeś 2 miejsce w konkursie piękności. Pobierz 10', 10), 
		new KartaRyzyka(3, 'Błąd bankowy na twoim koncie! Pobierz 200', 200),
		new KartaRyzyka(4, 'Idź do więzienia. Nie przechodź przez START. Nie pobieraj 200', 0, undefined, 30), 
		new KartaRyzyka(5, 'Dostałeś premię! Pobierz 100', 100),
		new KartaRyzyka(6, 'Masz urodziny! Pobierz 100.', 100), 
		new KartaRyzyka(7, 'Fundusz Zdrowotny. Pobierz 100', 100),
		new KartaRyzyka(8, 'Zapłać za wizytę u dentysty 100', -100), 
		new KartaRyzyka(9, 'Zapłać czesne 50', -50),
		new KartaRyzyka(10, 'Przejdź na START (Pobierz 200)', 0, undefined, 0), 
		new KartaRyzyka(11, 'Wyprzedaż! Pobierz 50', 50),
		new KartaRyzyka(12, 'Zapłać za wizytę Lekarską 50', 50), 
		new KartaRyzyka(13, 'Zwrot podatku. Pobierz 20', 20) ];

	return{
		getAllData: function() {
			return { 'dzielnice': dzielnice, 'pola': pola, 'gracze': gracze, 'szansy': kartySzansy, 'ryzyka': kartyRyzyka  };
		},
		addGracz: function (nick, pionek){
			gracze.push(new Gracz(nick, pionek));
			return (gracze.length -1);
		},
		rmGracz: function (data){

			for(var i=0; i < gracze[data].ulice.length; i++){
				pola[gracze[data].ulice[i]].hotel = 0;
				pola[gracze[data].ulice[i]].domki = 0;
				pola[gracze[data].ulice[i]].wlasciciel = undefined;
			}
			gracze[data] = undefined;
			return;
		},
		setData: function (data){
			gracze = data.gracze;
			pola = data.pola;
		},
		getRandomInts: function () {
			var min = 1;
			var max = 6;
			return { '1': Math.floor(Math.random() * (max - min + 1)) + min, '2': Math.floor(Math.random() * (max - min + 1)) + min };
		}
	};
};