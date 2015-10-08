'use strict';

var phoneBook = new Array();// Здесь вы храните записи как хотите
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
function isValidPhone (phone) {
    phone = phone.replace(/(\s|\+|\(|\)|\-)/g,'');
    var re = /\\w/g;
    return (phone.search(re) == -1 || phone.length < 10);
}

function isValidEmail (email) {
    var re = /(.+?@.+?\.\w)/g;
    return (email.search(re) != -1);
}

function parsePhone (phone) {
    phone = phone.replace(/(\s|\+|\(|\)|\-)/g,'');
    if (phone.length == 10) {
        return ('+7' + phone);
    }
    else {
        return ('+' + phone);
    }
}

function computionCountSpaces (word, lengthTable) {
    var countSpaces = lengthTable - word.length;
    for (var symbol = 0; symbol < countSpaces; symbol++) {
        word += ' ';
    }
    return word;
}

function parsePhoneToFind (phone) {
    return (phone.substring(0,2) + ' (' + phone.substring(2,5) + ') '
            + phone.substring(5,8) + '-' + phone.charAt(8) + '-' + phone.substring(9,12))
}

function pushClient (name, phone, email) {
    if (isValidEmail(email) && isValidPhone(phone)) {
        phone = parsePhone(phone);
        phoneBook.push({
            name : name,
            phone : phone,
            email : email    
        });
    }
}

function parseNumber (number) {
    number %= 100;

    if (number > 4 && number < 21) {
        return ('Удалено ' + number + ' контактов');
    }
    else {
        number %= 10;
        if (number == 1) {
            return ('Удален ' + number + ' контакт');
        }
        if (number > 1 && number < 5) {
            return ('Удалено ' + number + ' контакта');
        }
        else {
            return ('Удалено ' + number + ' контактов');
        }
    }
}

module.exports.add = function add (name, phone, email) {
        pushClient(name, phone, email)
    // Ваша невероятная магия здесь
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find (query) {
    phoneBook.forEach(function(client) { 
        if (client.name.indexOf(query) != -1) {
            console.log(client.name + ' ' + parsePhoneToFind(client.phone) + ' ' + client.email)
        }
        if (isValidPhone(query) && client.phone.indexOf(query) != -1) {
            console.log(client.name + ' ' + parsePhoneToFind(client.phone) + ' ' + client.email)
        }
        if (isValidPhone(query) && client.email.indexOf(query) != -1) {
            console.log(client.name + ' ' + parsePhoneToFind(client.phone) + ' ' + client.email)
        }
    });  
    // Ваша удивительная магия здесь
}

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove (query) {
    var counter = 0;
    phoneBook.forEach(function(client) {
        if (client.name.indexOf(query) != -1) {
            counter++;
            delete phoneBook[client];
        }
        if (isValidPhone(query) && client.phone.indexOf(query) != -1) {
            counter++;
            delete phoneBook[client];
        }
        if (isValidPhone(query) && client.email.indexOf(query) != -1){
            counter++;
            delete phoneBook[client];
        }
    });   
    console.log(parseNumber(counter));
    // Ваша необьяснимая магия здесь
}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv (filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var newClient;
    var importBook = data.split('\n');
    importBook.forEach(function(client) {
        if (client.search(';') != -1) {
            newClient = client.split(';');
                pushClient(newClient[0], newClient[1], newClient[2])  
        }
    });
    // Ваша чёрная магия:
    // - Разбираете записи из `data`
    // - Добавляете каждую запись в книгу
}

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable () {
     var name, phone, email;
     console.log('┌─────────────┬────────────────────╥──────────────────────┐');
     console.log('│ Имя         │ Телефон            ║ email                │');
     console.log('├─────────────┼────────────────────╫──────────────────────┤');
     phoneBook.forEach(function(client) {
        name = '│' + computionCountSpaces(client.name, 13);
        phone = '│' + computionCountSpaces(parsePhoneToFind(client.phone), 20);
        email = '║' + computionCountSpaces(client.email, 22) + '│';
        console.log(name + phone + email);
    });
    console.log('└─────────────┴────────────────────╨──────────────────────┘')
    // Ваша чёрная магия здесь
};