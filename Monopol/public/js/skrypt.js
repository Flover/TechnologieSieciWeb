$(function(){
	'use strict';
	var socket = io.connect('http://localhost:3000');
	console.log('connecting…');

	var dzielnice = [];
		var dzielnicaId = 0;
		var gracze = [];
		var pola = [];
		var kartySzansy = [];
		var kartyRyzyka = [];
		var szansaId = 0;
		var ryzykoId = 0;
		var graczId = 0;
		var poleId = 0;
		var naleznosc = 0;
		var cenaDomek = 0;
		var cenaHotel = 0;
		var iloscDomkow = 0;
		var iloscHoteli = 0;
		var iloscPol = 0;
		var moveSize = 0;

	var buildProperty = function (data){
		for(var i =0; i < data.length; i++){
			if(data[i].domki && data[i].domki > 0){
				var cell = '#cell_' + trasa[i];
				if(data[i].domki === 4 && data[i].hotel === 1){
					$(cell + ' .cellBuildings').children().remove();
					$(cell + ' .cellBuildings').append('<div class="hotel"></div>');
				}else{
					$(cell + ' .cellBuildings').children().remove();
					for(var j =0 ; j < data[i].domki; j++){
						$(cell + ' .cellBuildings').append('<div class="domek"></div>');
					}
				}
			}
		}
	};

	socket.on('connect', function () {
		console.log('Połączony!');
	});

	socket.on('hello', function (data){
		if(data){
			dzielnice = data['data'].dzielnice;
			gracze = data['data'].gracze; 
			pola = data['data'].pola;
			kartyRyzyka = data['data'].ryzyka;
			kartySzansy = data['data'].szansy;

			//build
			buildProperty(pola);

			$('.cellFigures').children().remove();
			for(var i=0; i < gracze.length; i++){
				if(gracze[i] !== null && gracze[i] !== undefined){
					$('#cell_0101 .cellFigures').append(pionek(i, gracze[i].pionek));
				}
			}
		}
		else{
			alert('przy stole nie ma miejsc, spadaj.');
		}
	});

	socket.on('newGracz', function (data){
		gracze = data['data'].gracze; console.log(data['data'].gracze);
		pola = data['data'].pola;
		$('#cell_0101 .cellFigures').append(pionek(data.graczId, data.pionek));
	});

	socket.on('tryStart', function(){
		$('#startModalBody').css({'text-align': 'center'});
		$('#startModal').modal('show');
	});

	$('#yesStartModalBtn').click(function(){
		socket.emit('startGame', 1);
		$('#startModal').modal('hide');
	});

	$('#noStartModalBtn').click(function(){
		socket.emit('startGame', 0);
		$('#startModal').modal('hide');
	});

	socket.on('rmGracz', function (data){
		$('#pionek'+data).remove();
	})

	socket.on('loser', function(){
		$('#loseModal').modal('show');
	});

	socket.on('makeMove', function (data){
		graczId = data.graczId;
		gracze = data.gracze;
		pola = data.pola;	

		//build
		buildProperty(pola);

		moveSize =data.moveSize['1']+data.moveSize['2'];
		$('#moveModalDrawBtn').show();
		$('#moveModalBody').css({'text-align': 'center'});
		$('#moveModalCount').text(moveSize);
		$('#moveModalCountImg').attr('src', 'images/'+data.moveSize['1']+data.moveSize['2']+'.png');

		$('#moveModalCountPanel').hide();
		$('#moveModalSaveBtn').hide();
		$('#moveModal').modal('show');		
	});

	$('#moveModalDrawBtn').click(function(){
		$('#moveModalDrawBtn').hide();
		$('#moveModalCountPanel').show();
		$('#moveModalSaveBtn').show();

	});

	$('#moveModalSaveBtn').click(function(){
		$('#moveModal').modal('hide');
		movePionek(moveSize, graczId, gracze[graczId].pionek);
	});

	socket.on('makeOtherMove', function (data){

		gracze = data.gracze;
		pola = data.pola;

		//build
		buildProperty(pola);

		moveOtherPionek(data.moveSize['1']+data.moveSize['2'], data.graczId, gracze[data.graczId].pionek);
		});

		
	var trasa = [ '0101' , '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0210', '0209', '0208', '0207', '0206', 
			'0205', '0204', '0203', '0202', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0410', '0409', '0408', '0407', 
			'0406', '0405', '0404', '0403', '0402', '0401', '0301', '0201'];

		var pionek = function (id, typ) { return '<div class="pionek'+typ+'" id="pionek'+id+'"></div>'; };


		var getNextRyzyko = function getRandomInt () {
			var min = 0;
			var max = 13;
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		var getNextSzansa = function getRandomInt () {
			var min = 0;
			var max = 13;
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		var moveOtherPionek = function (moveSize, graczId, graczPionek){
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
				var poleId = ((pionekPozycja+moveSize)%40);
				if(poleId < 0){ poleId = 40 + poleId; }
			$('#cell_'+ trasa[poleId] +' .cellFigures').append(pionek(graczId, graczPionek));
		}

		var movePionek = function (moveSize, graczId, graczPionek){
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
			$('#cell_'+ trasa[((pionekPozycja+moveSize)%40)] +' .cellFigures').append(pionek(graczId, graczPionek));

			poleId = ((pionekPozycja+moveSize)%40);
			if(poleId < 0){ poleId = 40 + poleId; }
			var pole = pola[((pionekPozycja+moveSize)%40)];
				console.log(pole);

				//Przejście przez start
				if(pionekPozycja%40 > (pionekPozycja+moveSize)%40){
					gracz.kasa += 200;
					console.log(pionekPozycja);
					console.log(pionekPozycja+moveSize);
					console.log('Kasa po przejsciu przez start: ' + gracz.kasa);
				}

				//sprawdzanie na jakie pole staneliśmy
				//szansa
				if(pole.typ === 'szansa'){
					szansaId = getNextSzansa();
					if(kartySzansy[szansaId].ruch !== undefined){
						console.log('szansa ruch: ' + kartySzansy[szansaId].ruch);
						moveOtherPionek(kartySzansy[szansaId].ruch, graczId, gracze[graczId].pionek);
						socket.emit('moveOtherPionek', {'moveSize': {'1': kartySzansy[szansaId].ruch, '2': 0}, 'graczId': graczId, 'pola': pola, 'gracze': gracze});
					}
					else{
						if(kartySzansy[szansaId].pole !== undefined){
							if(poleId < kartySzansy[szansaId].pole){
								var moveSizeNormal = kartySzansy[szansaId].pole - poleId;
								console.log('szansa pole: ' + kartySzansy[szansaId].pole + ' ' +
									moveSizeNormal);
								moveOtherPionek(moveSizeNormal, graczId, gracze[graczId].pionek);
								socket.emit('moveOtherPionek', {'moveSize': {'1': moveSizeNormal, '2': 0}, 'graczId': graczId, 'pola': pola, 'gracze': gracze});
							}else{
								var moveSizeHardcore = (40 - poleId) + kartySzansy[szansaId].pole;
								console.log('szansa pole: ' + kartySzansy[szansaId].pole + ' ' +
									moveSizeHardcore);
								moveOtherPionek(moveSizeHardcore, graczId, gracze[graczId].pionek);
								socket.emit('moveOtherPionek', {'moveSize': {'1': moveSizeHardcore, '2': 0}, 'graczId': graczId, 'pola': pola, 'gracze': gracze});
							}
						}
					}

					console.log('Numer karty to: ' + szansaId);
					$('#chanceModalContent').text(kartySzansy[szansaId].tresc);
					$('#chanceModal').modal('show');
				}
				//sanki
				else if(pole.typ === 'IdzDoWiezienia'){
					console.log('sanki');
					//socket.emit('moveOtherPionek', {'moveSize': -20, 'graczId': graczId, 'pola': pola, 'gracze': gracze});
					//!!!!!!!!!!!!!todo sanki puchałke dostał
					//movePionek(-20, graczId);
					$('#prisonModalContent').text('Idziesz do więzienia, nie przechodzisz przez start, nie otrzymujesz premii za przejście prez start.');
					$('#prisonModal').modal('show');

				}
				//ryzyko
				else if(pole.typ === 'ryzyko'){
					ryzykoId = getNextRyzyko();
					if(kartyRyzyka[ryzykoId].ruch){
						moveOtherPionek(kartyRyzyka[ryzykoId].ruch, graczId);
					}else{
						if(kartyRyzyka[ryzykoId].pole){
							if(poleId < kartyRyzyka[ryzykoId].pole){
								var moveSizeNormal = kartyRyzyka[ryzykoId].pole - poleId;
								moveOtherPionek(moveSizeNormal, graczId);
							}else{
								var moveSizeHardcore = (39 - poleId) + kartyRyzyka[ryzykoId].pole;
								moveOtherPionek(moveSizeHardcore, graczId);
							}
						}
					}


					$('#riskModalContent').text(kartyRyzyka[ryzykoId].tresc);
					$('#riskModal').modal('show');
				}
				//podatek
				else if(pole.typ ==='podatek'){
					$('#taxModalContent').text('Dorwał Cię ZUS, płacisz ' + pola[poleId].wartosc);
					$('#taxModal').modal('show');
					gracz.kasa -= pola[poleId].wartosc;
				}
				//pola bez akcji
				else if (pole.typ === 'odwiedziny' || pole.typ === 'parking' || pole.typ ==='start') {
					socket.emit('endMove',{'gracze': gracze, 'pola': pola});
				}

				//linie tramwajowe
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
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
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
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
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
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
					//Wszystkie pola Linii
					else if (pola[5].wlasciciel !== graczId && pola[15].wlasciciel === pole.wlasciciel && pola[25].wlasciciel === pole.wlasciciel && pola[35].wlasciciel === pole.wlasciciel) {
						naleznosc = pole.wartosc;
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');
					}
				}
				//wodociągi i elektrownia
				else if(pole.typ ==='specjalne'){
					if(pole.wlasciciel === undefined){
						$('#buyModalLabel').text(gracz.nick + ' Kup: ' + pole.nazwa);
						$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
						$('#buyModalCena').text('Cena: ' + pole.wartosc);
						$('#buyModal').modal('show');
					}
					else if(pola[12].wlasciciel === pole.wlasciciel && pola[28].wlasciciel !== pole.wlasciciel || pola[12].wlasciciel !== pole.wlasciciel && pola[28].wlasciciel === pole.wlasciciel){
						naleznosc = 4*moveSize;
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');;
					} else if(pola[12].wlasciciel === pole.wlasciciel && pola[28].wlasciciel === pole.wlasciciel){
						naleznosc = 10*moveSize;
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');;
					}
				}

				//normalne pole
				else { 

					var dzielnica = dzielnice[pole.dzielnica-1];
					console.log('pole: ' + pole);
					console.log('dzielnica: ' + dzielnica);
						var ownsAll = true;
						var oneOwner = true;
						var owner = pola[dzielnica.lista[0]].wlasciciel;
						var liczbaDomki = 0;
						var liczbaHotele = 0;
						iloscPol = 0;
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

					//akcja która wykona się gdy staniemy na pole niczyje
					if(pole.wlasciciel === undefined){
						$('#buyModalLabel').text(gracz.nick + ' Kup: ' + pole.nazwa);
						$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
						$('#buyModalCena').text('Cena: ' + pole.wartosc);
						$('#buyModal').modal('show');
					}
					//akcja która wykona się gdy staniemy na swoje pole i posiadamy wszystkie pola z tej dzielnicy
					else if(pole.wlasciciel === graczId && ownsAll && pole.typ === 'ulica'){
						$('#propertyModalKasa').text(gracz.kasa);
						$('#propertyModalCena').text('0');
						$('#propertyDomki').attr('max', (iloscPol * 4) - liczbaDomki);
						$('#propertyHotele').attr('max', iloscPol - liczbaHotele);


								dzielnicaId = dzielnica.numer -1;
								cenaDomek = pola[dzielnica.lista[0]].domekCena;
								cenaHotel = pola[dzielnica.lista[0]].hotelCena;
								console.log(dzielnica);
						
						 console.log(dzielnica);
						$('#propertyDzielnica').text(dzielnica.nazwa);
						$('#propertyModal').modal('show');
					}
					//wyliczenie opłat za pola z domkami lub hotelem
					else if(pole.wlasciciel !== graczId){
							naleznosc = (pole.wartosc/20);
							if(oneOwner){ 
								if(pole.domki === 0 && pole.hotel === 0){
									naleznosc *= 2; 
								} else if(pole.domki === 1 && pole.hotel === 0) {
									naleznosc *= 5;
								} else if (pole.domki === 2 && pole.hotel === 0) {
									naleznosc *= 15;
								} else if (pole.domki === 3 && pole.hotel === 0) {
									naleznosc *= 45;
								} else if (pole.domki === 4 && pole.hotel === 0) {
									naleznosc *= 80;
								} else if (pole.domki === 0 && pole.hotel === 1) {
									naleznosc *= 100;
								}

							}
						gracz.kasa -= naleznosc;
						gracze[pole.wlasciciel].kasa += naleznosc;
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

		$('#propertyDomki').change(function () {
			var data = $(this).val();
			$('#propertyDomkiKoszt').text(data * cenaDomek);
			var koszt = parseInt($('#propertyDomkiKoszt').text() ,10) + parseInt($('#propertyHoteleKoszt').text(), 10) ;
			$('#propertyModalCena').text(koszt);
		});

		$('#propertyHotele').change(function () {
			var data = $(this).val();

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
				
				// console.log(gracz.nick + ' kasa po kupnie: ' + gracz.kasa);
				socket.emit('endMove',{'gracze': gracze, 'pola': pola});
			});

		$('#payModalSaveBtn').click(function(){
			$('#payModal').modal('hide');
			var gracz = gracze[graczId];
			// console.log(gracz.nick + ' kasa po oddaniu zaplacie: ' + gracz.kasa);
			// console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po odbiorze kasy: ' + gracze[pola[poleId].wlasciciel].kasa);

			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
		});

		$('#chanceModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			// console.log(gracz.nick + ' kasa przed "szansą": ' + gracz.kasa);
			gracz.kasa += kartySzansy[szansaId].kwota;
			$('#chanceModal').modal('hide');
			
			// console.log(gracz.nick + ' kasa po "szansie": ' + gracz.kasa);
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
		});

		$('#riskModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa += kartyRyzyka[ryzykoId].kwota;
			$('#riskModal').modal('hide');
			// console.log(gracz.nick + ' kasa po "ryzyku": ' + gracz.kasa);
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
			// console.log('wysłałem');
		});

		$('#taxModalSaveBtn').click(function(){
			//console.log(gracze);
			//var gracz = gracze[graczId];
			$('#taxModal').modal('hide');
			
			//console.log(gracz.nick + ' kasa po "podatku": ' + gracz.kasa);
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
			//console.log('wysłałem');
		});

		$('#prisonModalSaveBtn').click(function(){
			$('#prisonModal').modal('hide');
			socket.emit('moveOtherPionek', {'moveSize': {'1': -10, '2': -10}, 'graczId': graczId, 'pola': pola, 'gracze': gracze});
			moveOtherPionek(-20, graczId, gracze[graczId].pionek);
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
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
				var dzielnia = dzielnice[dzielnicaId];
				var iloscPol = dzielnia.lista.length;
				console.log('d:');
				console.log(dzielnia);
				var npd = selectedIloscDomkow % iloscPol;
				var pd = selectedIloscDomkow - npd;

				console.log('npd: ' + npd + ' pd: ' + pd);

				for(var i =0; i < iloscPol; i++){
					console.log('poleNum: ' + dzielnia.lista[i]);
					console.log(pola[dzielnia.lista[i]]);
					pola[dzielnia.lista[i]].domki += pd / iloscPol;
					if(i === iloscPol) { pola[dzielnia.lista[i]].domki += npd; }
				}

				var nph = selectedIloscHoteli % iloscPol;
				var ph = selectedIloscHoteli - nph;

				console.log('nph: ' + nph + ' ph: ' + ph);

				for(var j =0; j < iloscPol; j++){
					console.log('poleNum: ' + dzielnia.lista[j]);
					console.log(pola[dzielnia.lista[j]]);
					pola[dzielnia.lista[j]].hotel += ph;
					if(i === iloscPol){ pola[dzielnia.lista[j]].hotel += nph; }
				}

				console.log(pola[1]);
				console.log(pola[3]);

				$('#propertyModal').modal('hide');
				socket.emit('endMove',{'gracze': gracze, 'pola': pola});
				console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po kupnie domku: ' + gracze[pola[poleId].wlasciciel].kasa);
			}
		});

		$('#propertyModalCancelBtn').click(function(){
			$('#propertyModal').modal('hide');
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
		});

		$('#buyModalCancelBtn').click(function(){
			$('#buyModal').modal('hide');
			socket.emit('endMove',{'gracze': gracze, 'pola': pola});
		});
});