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
var kolejka = 0;
var gracze = [];

var getGracz = function (number){
    console.log('getGracz number: ' + number);
    var ilosc = -1;
    for(var j =0; j < gracze.length; j++){
        if(gracze[j]){
            console.log(gracze[j].number);
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
        var gracz = data.addGracz('Gracz '+(iloscGraczy+1), 'red');
        gracze[iloscGraczy] = { 'number': gracz, 'socket': client };
        iloscGraczy++;

        client.emit('hello', {'data':data.getAllData(), 'graczId': gracz});
        client.broadcast.emit('newGracz', {'data': data.getAllData(), 'graczId': gracz});
    }
    else{
        client.emit('hello', undefined);
    }

    client.on('disconnect', function () {
        for(var i=0; i < gracze.length; i++){
            if(gracze[i] && gracze[i].socket.id === client.id){
                data.rmGracz(i);
                gracze[i] = undefined;
                break;
            }
        }
        iloscGraczy--;
        console.log(gracze);
    });

    client.on('startGame', function(){
        console.log('dostałem');
        var g = getGracz(kolejka%iloscGraczy);
        kolejka++;
        console.log('g: ' + g);
        if(g !== undefined){
            gracze[g].socket.emit('makeMove', { 'moveSize': 4, 'graczId': gracze[g].number});
            gracze[g].socket.broadcast.emit('makeOtherMove', { 'moveSize': 4, 'graczId': gracze[g].number});
            console.log('wysłałem');
        }
    });
    client.on('endMove', function(){
        console.log('dostałem');
        var g = getGracz(kolejka%iloscGraczy);
        kolejka++;
        console.log('g: ' + g);
        if(g !== undefined){
            gracze[g].socket.emit('makeMove', { 'moveSize': 4, 'graczId': gracze[g].number});
            gracze[g].socket.broadcast.emit('makeOtherMove', { 'moveSize': 4, 'graczId': gracze[g].number});
            console.log('wysłałem');
        }
    });
});



