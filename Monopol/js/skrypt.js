$(function(){
	'use strict';
	var Dzielnica = function(numer, nazwa){
		this.numer = numer;
		this.nazwa = nazwa;
		this.lista = [];
		return this;
	};

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

	var graczId = 0;
	var poleId = 0;

	var dzielnice = [ new Dzielnica(1, 'Brzeźno'), new Dzielnica(2, 'Nowy Port'), new Dzielnica(3, 'Zaspa'), new Dzielnica(4, 'Przymorze'), 
		new Dzielnica(5, 'Żabianka'), new Dzielnica(6, 'Oliwa'), new Dzielnica(7, 'Wrzeszcz'), new Dzielnica(8, 'Centrum'), 
		new Dzielnica(9, 'Pętle'), new Dzielnica(10, 'Użytkowe')];

	var gracze = [ new Gracz('Szefo', 'red'), new Gracz('V-c_Szefo', 'blue'), new Gracz('ja', 'green') ];
		
	var trasa = [ '0101' , '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0210', '0209', '0208', '0207', '0206', 
		'0205', '0204', '0203', '0202', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0410', '0409', '0408', '0407', 
		'0406', '0405', '0404', '0403', '0402', '0401', '0301', '0201'];

	var pola = [ new Pole('Start', 200) , new Pole('ulica', 60, 'purple', 'PCK', undefined, 0, 60, 0, 120, 1), new Pole('Szansa'), 
		new Pole('ulica', 60, 'purple', 'Gałczyńskiego', undefined, 0, 60, 0, 120, 1), new Pole('Podatek_Dochodowy', 200),
		new Pole('Linia', 200, 'white', 'Strzyża', undefined, 0, 0, 0, 0 ,9), new Pole('ulica', 100, 'aqua', 'Wyzwolenia', undefined, 0, 100, 0, 200, 2),
		new Pole('Szansa'), new Pole('ulica', 100, 'aqua', 'Wolności', undefined, 0, 100, 0, 200, 2), new Pole('ulica', 100, 'aqua', 'Oliwska', undefined, 0, 120, 0, 200, 2),
		new Pole('Odwiedziny'), new Pole('ulica', 140, 'magenta', 'Jana Pawła 2', undefined, 0, 280, 0, 560, 3), new Pole('specjalne', 150, 'white', 'Elektrownia', undefined, 0, 0, 0, 0, 10),
		new Pole('ulica', 140, 'magenta', 'Pilotów', undefined, 0, 280, 0, 560, 3), new Pole('ulica', 160, 'magenta', 'Rzeczypospolitej', undefined, 0, 300, 0, 600, 3),
		new Pole('Linia', 200, 'white', 'Oliwa', undefined, 0, 0, 0, 0 ,9), new Pole('ulica', 180, 'orange', 'Obrońców Wybrzeża', undefined, 0, 320, 0, 640, 4), new Pole('szansa'),
		new Pole('ulica', 180, 'orange', 'Chłopska', undefined, 0, 320, 0, 640, 4), new Pole('ulica', 200, 'orange', 'Piastowska', undefined, 0, 340, 0, 660, 4), new Pole('Parking'),
		new Pole('ulica', 220, 'red', 'Gospody', undefined, 0, 360, 0, 680, 5), new Pole('Szansa'), new Pole('ulica', 220, 'red', 'Subisława', undefined, 0, 360, 0, 680, 5),
		new Pole('ulica', 240, 'red', 'Pomorska', undefined, 0, 360, 0, 680, 5), new Pole('Linia', 200, 'white', 'Witosa', undefined, 0, 0, 0, 0 ,9), 
		new Pole('ulica', 260, 'yellow', 'Wita Stwosza', undefined, 0, 360, 0, 680, 6), new Pole('ulica', 260, 'yellow', 'Polanki', undefined, 0, 360, 0, 680, 6),
		new Pole('specjalne', 150, 'white', 'Wodociągi', undefined, 0, 0, 0, 0, 10), new Pole('ulica', 280, 'yellow', 'Spacerowa', undefined, 0, 360, 0, 680, 6),
		new Pole('IdźDoWięzienia'), new Pole('ulica', 300, 'green', 'Jaśkowa Dolina', undefined, 0, 360, 0, 680, 7), new Pole('ulica', 300, 'green', 'Kościuszki', undefined, 0, 360, 0, 680, 7),
		new Pole('Szansa'), new Pole('ulica', 320, 'green', 'Grunwaldzka', undefined, 0, 360, 0, 680, 7), new Pole('Linia', 200, 'white', 'Brzeźno', undefined, 0, 0, 0, 0 ,9),
		new Pole('Szansa'), new Pole('ulica', 350, 'blue', 'Długa', undefined, 0, 360, 0, 680, 8), new Pole('PodateOdLuksusu', 200), new Pole('ulica', 400, 'blue', 'Długi Targ', undefined, 0, 360, 0, 680, 8) ]; //TO-DO!

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

		var pionek = function (id) { return '<div class="pionek" id="pionek'+id+'"></div>'; };

		$('#cell_0101 .cellFigures').append(pionek(0));
		$('#cell_0101 .cellFigures').append(pionek(1));
		$('#cell_0101 .cellFigures').append(pionek(2));


		var movePionek = function (moveSize, graczId){
			var gracz = gracze[graczId];
			var cell = $('#pionek'+graczId).parent().parent().attr('id').substring(6,9);
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

			var dzielnica = dzielnice[pole.dzielnica-1];
				var ownsAll = true;
				var liczbaDomki = 0;
				var liczbaHotele = 0;
				var iloscPol = 0;
				for(var i=0; i < dzielnica.lista.length; i++){
					if(dzielnica.lista[i] && pola[dzielnica.lista[i]].wlasciciel !== graczId){
						ownsAll = false;
					}
						console.log(pola[dzielnica.lista[i]].domki + " : " + pola[dzielnica.lista[i]].hotel);
					liczbaDomki += pola[dzielnica.lista[i]].domki;
					liczbaHotele += pola[dzielnica.lista[i]].hotel;
					iloscPol++;
				}
					console.log('iloscPol: ' + iloscPol + ' ownsAll: ' + ownsAll + ' domki: ' + liczbaDomki + ' hotele: ' + liczbaHotele);

			if(pole.wlasciciel === undefined){
				$('#buyModalLabel').text('Kup: ' + pole.nazwa);
				$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
				$('#buyModalCena').text('Cena: ' + pole.wartosc);
				$('#buyModal').modal('show');
			}
			else if(pole.wlasciciel === graczId && ownsAll){
				//todo modal do budowania
			}
			else if(pole.wlasciciel !== graczId){
					var naleznosc = pole.wartosc;
					if(ownsAll){ naleznosc *= iloscPol; }
				gracz.kasa -= naleznosc;
				gracze[pole.wlasciciel].kasa += naleznosc;
					console.log(gracz.nick + ' kasa: ' + gracz.kasa);
					console.log(gracze[pole.wlasciciel].nick + ' kasa: ' + gracze[pole.wlasciciel].kasa);
				$('#payModalLabel').text( 'Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
				$('#payModalKasa').text('Stan konta:' + gracz.kasa);
				$('#payModalCena').text('Należność: ' + naleznosc);
				$('#payModal').modal('show');
			} else {

			}
		};

		$('#buyModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			pola[poleId].wlasciciel = graczId;
			gracz.ulice.push(poleId);
			gracz.kasa -= pola[poleId].wartosc;
				$('#buyModal').modal('hide');
				setTimeout(function(){
					graczId++;
					movePionek(3, graczId);
				}
				,1000);

			});

			$('#payModalSaveBtn').click(function(){
			
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

		movePionek(3, graczId);
});