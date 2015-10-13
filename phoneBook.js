'use strict';

var phoneBook = new Array();// Здесь вы храните записи как хотите
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
function isValidPhone (phone) {
    phone = phone.replace(/(\s|\(|\)|\-)/g,'');
    var re = /^(\+|[0-9])\d{9,}/g;
    return re.test(phone) && phone.length >= 10;
}

function isValidEmail (email) {
    var re = /((\d|\w)+@(\w+|-).\w)/g;
    return re.test(email);
}

function parsePhoneNumber (phone) {
    phone = phone.replace(/(\s|\+|\(|\)|\-)/g,'');
    return phone;
}

function computionCountSpaces (word, lengthTable) {
    var countSpaces = lengthTable - word.length;
    for (var symbol = 0; symbol < countSpaces; symbol++) {
        word += ' ';
    }
    return word;
}

function parsePhoneToFind (phone) {
    return ('+' + phone.substring(0,1) + ' (' + phone.substring(1,4) + ') '
            + phone.substring(4,7) + '-' + phone.charAt(7) + '-' +
            phone.substring(8,phone.length))
}

function pushClient (name, phone, email) {
    if (isValidEmail(email) && isValidPhone(phone)) {
        phone = parsePhoneNumber(phone);
        phoneBook.push({
            name : name,
            phone : phone,
            email : email    
        });
    }
}

function pluralizeContactsNumber (number) {
    number %= 100;

    if (number > 4 && number < 21) {
        return ('Удалено ' + number + ' контактов');
    }
    else {
        number %= 10;
        if (number === 1) {
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
function isClientFoundByQuery (client, query) {
    var checkPhone = isValidPhone(query);
    var checkNameInQuery = client.name.indexOf(query) !== -1;
    var checkPhoneInQuery = client.phone.indexOf(query) !== -1;
    var checkEmailInQuery = client.email.indexOf(query) !== -1;
    return (checkNameInQuery || (checkPhone && (checkEmailInQuery || checkPhoneInQuery)));    

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
        for (var field in client) {
            if (client[field].indexOf(query) !== -1) {
                console.log(client.name + ' ' + parsePhoneToFind(client.phone) + ' ' + client.email);
                return;
        }
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
        if (isClientFoundByQuery(client, query)) {
            counter++;
            delete phoneBook[client]
        }
    });   
    console.log(pluralizeContactsNumber(counter));
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
        if (client.search(';') !== -1) {
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
}