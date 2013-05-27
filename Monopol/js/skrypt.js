$(function(){

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
	}

	var Gracz = function(nick, pionek){
		this.nick = nick;
		this.ulice = [];
		this.kasa = 1000;
		this.pionek = pionek;
	}

	graczId = 0;
	poleId = 0;

var gracze = [ new Gracz('Szefo', 'red'), new Gracz('V-c_Szefo', 'blue') ];
	
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

 	var pionek = function (id) { return '<div class="pionek" id="pionek'+id+'"></div>'; }

 	$('#cell_0101 .cellFigures').append(pionek(0));
 	$('#cell_0101 .cellFigures').append(pionek(1));

 	var movePionek = function(moveSize, graczId){
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

 		if(pole.wlasciciel === undefined){

	 		$('#buyModalLabel').text('Kup: ' + pole.nazwa);
	 		$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
	 		$('#buyModalCena').text('Cena: ' + pole.wartosc);
	 		$('#buyModal').modal('show');
	 	}
	 	else if(pole.wlasciciel !== graczId){
	 		$('#payModalLabel').text('Płacisz za: ' + pole.nazwa);
	 		$('#payModalKasa').text('Stan konta: ' + gracz.kasa);
	 		$('#payModalCena').text('Należność: ' + pole.wartosc);
	 		$('#payModal').modal('show');
	 	}
 	}

 	$('#buyModalSaveBtn').click(function(){
 		pola[poleId].wlasciciel = graczId;
 		gracze[graczId].ulice.push(poleId);
 		$('#buyModal').modal('hide');
 		graczId++;
 		movePionek(3, graczId);
 	});

 	 //setInterval(function() {
 		movePionek(3, graczId);
 		
 	 //},100);
 	

});