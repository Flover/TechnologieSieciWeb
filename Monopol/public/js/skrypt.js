$(function(){
	'use strict';
	var socket = io.connect('http://localhost:3000');
	console.log('connecting…');

	var dzielnice = [];
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
	    	console.log(data);
	    	console.log(gracze[data.graczId]);
	    	$.each(gracze, function (i, item){
	    		if(item){
		    		$('#cell_0101 .cellFigures').append(pionek(i));
		    	}
	    	});
	    }
	    else{
	    	alert('przy stole nie ma miejsc, spadaj.');
	    }
    });

    socket.on('newGracz', function (data){
    	dzielnice = data['data'].dzielnice;
	    gracze = data['data'].gracze;
	    pola = data['data'].pola;
	    kartyRyzyka = data['data'].ryzyka;
	    kartySzansy = data['data'].szansy;
	    console.log(data);
	    console.log(pola);
	    console.log(gracze);
		$('#cell_0101 .cellFigures').append(pionek(data.graczId));
		console.log('wysyłam');
		socket.emit('startGame', {});
		console.log('wysłałem');
    });

    socket.on('makeMove', function (data){
    	console.log(data);
    	graczId = data.graczId;
    	movePionek(data.moveSize, graczId);
    });

    socket.on('makeOtherMove', function (data){
    	console.log(data);
    	moveOtherPionek(data.moveSize, data.graczId);
    });

		
	var trasa = [ '0101' , '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0210', '0209', '0208', '0207', '0206', 
		'0205', '0204', '0203', '0202', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0410', '0409', '0408', '0407', 
		'0406', '0405', '0404', '0403', '0402', '0401', '0301', '0201'];

		var pionek = function (id) { return '<div class="pionek" id="pionek'+id+'"></div>'; };

		// $('#cell_0101 .cellFigures').append(pionek(0));
		// $('#cell_0101 .cellFigures').append(pionek(1));
		// $('#cell_0101 .cellFigures').append(pionek(2));

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

		var moveOtherPionek = function (moveSize, graczId){
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
		}

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
					szansaId = getNextSzansa();
					
					console.log('Numer karty to: ' + szansaId);
					$('#chanceModalContent').text(kartySzansy[szansaId].tresc);
					$('#chanceModal').modal('show');
				}
				else if(pole.typ === 'ryzyko'){
					ryzykoId = getNextRyzyko();
					$('#riskModalContent').text(kartyRyzyka[ryzykoId].tresc);
					$('#riskModal').modal('show');
				}
				else if(pole.typ ==='podatek'){
					$('#taxModalContent').text('Dorwał Cię ZUS, płacisz ' + pola[poleId].wartosc);
					$('#taxModal').modal('show');
					gracz.kasa -= pola[poleId].wartosc;
				}
				else if (pole.typ === 'odwiedziny' || pole.typ === 'parking') {
					socket.emit('endMove',{});
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

				else if(pole.typ ==='specjalne'){
					if(pole.wlasciciel === undefined){
						$('#buyModalLabel').text(gracz.nick + ' Kup: ' + pole.nazwa);
						$('#buyModalKasa').text('Stan konta: ' + gracz.kasa);
						$('#buyModalCena').text('Cena: ' + pole.wartosc);
						$('#buyModal').modal('show');
					}
					else if(pola[12].wlasciciel === pole.wlasciciel && pola[28].wlasciciel !== pole.wlasciciel || pola[12].wlasciciel !== pole.wlasciciel && pola[28].wlasciciel === pole.wlasciciel){
						naleznosc = 4*6;
						gracz.kasa -= naleznosc;
						gracze[pola[poleId].wlasciciel].kasa += naleznosc;
						$('#payModalLabel').text(gracz.nick + ' Płacisz graczowi ' + gracze[pole.wlasciciel].nick + ' za stanięcie na pole: '+ pole.nazwa);
						$('#payModalKasa').text('Stan konta:' + gracz.kasa);
						$('#payModalCena').text('Należność: ' + naleznosc);
						$('#payModal').modal('show');;
					} else if(pola[12].wlasciciel === pole.wlasciciel && pola[28].wlasciciel === pole.wlasciciel){
						naleznosc = 10*6;
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
				
				console.log(gracz.nick + ' kasa po kupnie: ' + gracz.kasa);
				socket.emit('endMove');
			});

		$('#payModalSaveBtn').click(function(){			
			$('#payModal').modal('hide');
			
			console.log(gracz.nick + ' kasa po oddaniu zaplacie: ' + gracz.kasa);
			console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po odbiorze kasy: ' + gracze[pola[poleId].wlasciciel].kasa);

			socket.emit('endMove',{});
		});

		$('#chanceModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			console.log(gracz.nick + ' kasa przed "szansą": ' + gracz.kasa);
			gracz.kasa += kartySzansy[szansaId].kwota;
			$('#chanceModal').modal('hide');
			
			console.log(gracz.nick + ' kasa po "szansie": ' + gracz.kasa);
			socket.emit('endMove',{});
		});

		$('#riskModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			gracz.kasa += kartyRyzyka[ryzykoId].kwota;
			$('#riskModal').modal('hide');
			console.log(gracz.nick + ' kasa po "ryzyku": ' + gracz.kasa);
			socket.emit('endMove',{});
			console.log('wysłałem');
		});

		$('#taxModalSaveBtn').click(function(){
			var gracz = gracze[graczId];
			$('#taxModal').modal('hide');
			
			console.log(gracz.nick + ' kasa po "podatku": ' + gracz.kasa);
			socket.emit('endMove',{});
			console.log('wysłałem');
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
				socket.emit('endMove',{});
				console.log(gracze[pola[poleId].wlasciciel].nick + ' kasa po kupnie domku: ' + gracze[pola[poleId].wlasciciel].kasa);
			}
		});

		$('#propertyModalCancelBtn').click(function(){
			$('#propertyModal').modal('hide');
			socket.emit('endMove',{});
		});

		$('#buyModalCancelBtn').click(function(){
			$('#buyModal').modal('hide');
			socket.emit('endMove',{});
		});

		//losowanie ilości oczek jaką ma się przesunąć pionek
		var kostka = function getRandomInt () {
			var min = 1;
			var max = 6;
			return { '1': Math.floor(Math.random() * (max - min + 1)) + min, '2': Math.floor(Math.random() * (max - min + 1)) + min };
		};

		//console.log(kostka());

		
});