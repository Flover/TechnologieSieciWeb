/*jshint node: true */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});

var io = require('socket.io');
var socket = io.listen(server);

var data = require('./lib/data')();

var iloscGraczy = 0;
var numerGracza = 0;
var kolejka = 0;
var gracze = [];
var start;
var isStarted = false;
var pionki = [ {'owner': undefined}, {'owner': undefined}, {'owner': undefined}, {'owner': undefined},
				{'owner': undefined}, {'owner': undefined} ];

var getGracz = function (number){
	// console.log('getGracz number: ' + number);
	var ilosc = -1;
	for(var j =0; j < gracze.length; j++){
		if(gracze[j]){
			// console.log(gracze[j].number);
			ilosc++;
		}
		if(ilosc === number){
			return j;
		}
	}
	return undefined;
};

socket.on('connection', function (client) {
	'use strict';

	if(iloscGraczy < 6){
		
		var i;
		for(i=0; i < 6; i++){
			if(!pionki[i].owner){
				pionki[i].owner = client.id;
				break;
			}
		}

		var gracz = data.addGracz('Gracz '+(numerGracza+1), i);
		gracze[numerGracza] = { 'number': gracz, 'socket': client };

		numerGracza++;
		iloscGraczy++;

		client.emit('hello', {'data':data.getAllData(), 'graczId': gracz, 'pionek': i});
		client.broadcast.emit('newGracz', {'data': data.getAllData(), 'graczId': gracz, 'pionek': i});

		if(!isStarted && iloscGraczy >= 2){
			client.emit('tryStart');
			client.broadcast.emit('tryStart');
			start = [];
			for(var i = 0; i < gracze.length; i++){
				start[i] = undefined;
			}
		}
	}
	else{
		client.emit('hello', undefined);
	}

	client.on('disconnect', function () {

		for(var j =0; j < pionki.length; j++){
			if(pionki[j].owner && pionki[j].owner === client.id){
				pionki[j].owner = undefined;
			}
		}

		for(var i=0; i < gracze.length; i++){
			if(gracze[i] && gracze[i].socket.id === client.id){
				data.rmGracz(i);
				gracze[i].socket.broadcast.emit('rmGracz', i);
				gracze[i] = undefined;
				break;
			}
		}
		iloscGraczy--;
	});

	client.on('moveOtherPionek', function (data){
		client.broadcast.emit('makeOtherMove', 
			{ 'moveSize': data.moveSize, 'graczId': data.graczId, 'gracze': data.gracze, 'pola': data.pola});
	});

	client.on('startGame', function (answer){
		console.log('before vote: ');
		console.log(start);
		for(var i = 0; i < gracze.length; i++){
			if(gracze[i] && gracze[i].socket.id === client.id){
				start[i] = answer;
				break;
			}
		}
		console.log('after vote: ');
		console.log(start);
		var yesCount = 0;

		for(var j = 0; j < start.length; j++){
			if(start[j] && start[j] === 1){
				yesCount += 1;
			}
		}

		if(yesCount === iloscGraczy){
			isStarted = true;
			var g = getGracz(kolejka%iloscGraczy);
			kolejka++;
			if(g !== undefined){
				var item = data.getAllData();
				var moveSize = data.getRandomInts();
				gracze[g].socket.emit('makeMove', { 'moveSize': moveSize, 'graczId': gracze[g].number, 'gracze': item.gracze, 'pola': item.pola});
				gracze[g].socket.broadcast.emit('makeOtherMove', { 'moveSize': moveSize, 'graczId': gracze[g].number, 'gracze': item.gracze, 'pola': item.pola});
			}
		}
	});
	client.on('endMove', function (item){
		// console.log('dostałem');
		data.setData(item);

		for(var i=0; i < item.gracze.length; i++){
			if(item.gracze[i] && item.gracze[i].kasa <= 0){
				data.rmGracz(i);

				for(var j =0; j < pionki.length; j++){
					if(pionki[j].owner && pionki[j].owner === gracze[i].socket.id){
						pionki[j].owner = undefined;
					}
				}

				gracze[i].socket.emit('loser');
				gracze[i].socket.emit('rmGracz', i);
				gracze[i].socket.broadcast.emit('rmGracz', i);
				gracze[i] = undefined;
				iloscGraczy--;
			}
		}

		var g = getGracz(kolejka%iloscGraczy);
		kolejka++;
		if(g !== undefined){
			var moveSize = data.getRandomInts();
			gracze[g].socket.emit('makeMove', { 'moveSize': moveSize, 'graczId': gracze[g].number, 'gracze': item.gracze, 'pola': item.pola});
			gracze[g].socket.broadcast.emit('makeOtherMove', { 'moveSize': moveSize, 'graczId': gracze[g].number, 'gracze': item.gracze, 'pola': item.pola});
		}
	});
});