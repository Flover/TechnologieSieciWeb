			$(function(){

				var DrawRow = function(rowNumber){
					var rowId = rowNumber < 10 ? '0' + rowNumber : rowNumber;
					return '<div class="row" id="row_'+ rowId +'">' +
								'<div class="cell" id="cell_'+ rowId +'01"></div>' +
								'<div class="cell" id="cell_'+ rowId +'02"></div>' +
								'<div class="cell" id="cell_'+ rowId +'03"></div>' +
								'<div class="cell" id="cell_'+ rowId +'04"></div>' +
								'<div class="cell" id="cell_'+ rowId +'05"></div>' +
								'<div class="cell" id="cell_'+ rowId +'06"></div>' +
								'<div class="cell" id="cell_'+ rowId +'07"></div>' +
								'<div class="cell" id="cell_'+ rowId +'08"></div>' +
								'<div class="cell" id="cell_'+ rowId +'09"></div>' +
								'<div class="cell" id="cell_'+ rowId +'10"></div>' +
							'</div>';
				};

				var drawCell = function(){
					return '<div class="cellBuildings"></div><div class="cellPrice">cena</div><div class="cellFigures"></div><div class="cellName">nazwa</div>';
				};

				for(var i =1; i < 5; i++){
					$('div#plansza').append(DrawRow(i));
				}

				$('div.cell').append(drawCell());
				//funkcja przerabiająca pole na pole specjalne
				var makeSpecialCell = function(cellId, cellName, cellBackground){
					var workCell = $('#cell_' + cellId);
					var cellContent = workCell.children();
					cellContent.filter('.cellBuildings').remove();
					cellContent.filter('.cellPrice').remove();
					cellContent.filter('.cellFigures').css('height', '130px');
					cellContent.filter('.cellName').text(cellName);
					if(cellBackground) { workCell.css('background', cellBackground); }
					workCell.css('background-color', 'white');
				}
				//funkcja przerabiająca pole na pole specjalne z ceną
				var makeSpecialCellWithPrice = function(cellId, cellName, cellPrice, cellBackground){
					var workCell = $('#cell_' + cellId);
					var cellContent = workCell.children();
					cellContent.filter('.cellBuildings').remove();
					cellContent.filter('.cellPrice').text(cellPrice);
					cellContent.filter('.cellFigures').css('height', '100px');
					cellContent.filter('.cellName').text(cellName);
					if(cellBackground) { workCell.css('background', cellBackground); }
					workCell.css('background-color', 'white');
				}
				//funkcja wypełniająca pole danymi
				var fillCell = function(cellId, cellName, cellPrice, cellBackground, figureHeight){
					var workCell = $('#cell_' + cellId);
					var cellContent = workCell.children();
					cellContent.filter('.cellBuildings').css('background', cellBackground);
					cellContent.filter('.cellPrice').text(cellPrice);
					cellContent.filter('.cellName').text(cellName);
					if(figureHeight) { $(cellContent).filter('.cellFigures').css('height', figureHeight); }
				}
				var makeBorderThick = function(cellId){
					var workCell = $('#cell_' + cellId);
					workCell.css('border-bottom', '0px');
					workCell.css('height', '163px');	
				}
				
				var makeBorderBold = function(cellId){
					var workCell = $('#cell_' + cellId);
					workCell.css('border-left', '3px solid black');
					workCell.css('width', '126px');	
				}

				//pola specjalne
				makeSpecialCell('0101', 'START', "url('images/startArrow.png')");
				makeSpecialCell('0210', 'WIĘZIENIE');
				makeSpecialCell('0303', 'PARKING');
				makeSpecialCell('0408', 'IDŹ DO WIĘZIENIA');
				$('#cell_0408').children().filter('.cellFigures').css('height', '110px');
				//pola "kolejowe"
				makeSpecialCellWithPrice('0106', 'STRZYŻA','200');
				makeSpecialCellWithPrice('0205', 'OLIWA','200');
				makeSpecialCellWithPrice('0308', 'WITOSA','200');
				makeSpecialCellWithPrice('0403', 'BRZEŹNO','200');
				//pola szansy
				makeSpecialCell('0103', 'SZANSA', "url('images/chance.png')");
				makeSpecialCell('0108', 'SZANSA', "url('images/risk.png')");
				makeSpecialCell('0203', 'SZANSA', "url('images/chance.png')");
				makeSpecialCell('0305', 'SZANSA', "url('images/risk.png')");
				makeSpecialCell('0405', 'SZANSA', "url('images/chance.png')");
				makeSpecialCell('0402', 'SZANSA', "url('images/risk.png')");
				//pola podatku
				makeSpecialCellWithPrice('0105', 'PODATEK DOCHODOWY', 'ZAPŁAĆ 200');
				makeSpecialCellWithPrice('0301', 'PODATEK OD LUKSUSU', 'ZAPŁAĆ 100');
				//pola wodociągów i elektrowni
				makeSpecialCellWithPrice('0208','ELEKTROWNIA', '150');
				makeSpecialCellWithPrice('0410', 'WODOCIĄGI', '150');
				//dzielnica 1 - Brzeźno
				fillCell('0102', 'PCK', '60', 'purple');
				fillCell('0104', 'Gałczyńskiego', '60', 'purple');
				//dzielnica 2 - Nowy Port
				fillCell('0107', 'Wyzwolenia', '100', 'aqua');
				fillCell('0109', 'Wolności', '100', 'aqua');
				fillCell('0110', 'Oliwska', '120', 'aqua');
				//dzielnica 3 - Zaspa
				fillCell('0209', 'Jana Pawła 2', '140', 'magenta');
				fillCell('0207', 'Pilotów', '140', 'magenta');
				fillCell('0206', 'Rzeczypospolitej', '160', 'magenta');
				//dzielnica 4 - Przymorze
				fillCell('0204', 'Obrońców Wybrzeża', '180', 'orange', '60px');

				fillCell('0202', 'Chłopska', '180', 'orange');
				fillCell('0302', 'Piastowska', '200', 'orange');
				//dzielnica 5 - Żabianka
				fillCell('0304', 'Gospody', '220', 'red');
				fillCell('0306', 'Subisława', '220', 'red');
				fillCell('0307', 'Pomorska', '240', 'red');
				//dzielnica 6 - Oliwa
				fillCell('0309', 'Wita Stwosza', '260', 'yellow');
				fillCell('0310', 'Polanki', '260', 'yellow');
				fillCell('0409', 'Spacerowa', '280', 'yellow');
				//dzielnica 7 - Wrzeszcz
				fillCell('0407', 'Jaśkowa Dolina', '300', 'green');
				fillCell('0406', 'Kościuszki', '300', 'green');
				fillCell('0404', 'Grunwaldzka', '320', 'green');
				//dzielnica 8 - Centrum
				fillCell('0401', 'Długa', '350', 'blue');
				fillCell('0201', 'Długi Targ', '400', 'blue');
				
				//zaznaczenie przebiegu planszy
				makeBorderThick('0110');
				makeBorderThick('0202');
				makeBorderThick('0310');
				makeBorderThick('0101');
				makeBorderThick('0201');
				makeBorderThick('0301');
				makeBorderBold('0202');
				makeBorderBold('0302');
			});