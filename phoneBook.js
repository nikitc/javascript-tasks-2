'use strict';

var phoneBook = new Array();// Здесь вы храните записи как хотите
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
function isValidPhone (phone) {
    phone = parsePhoneNumber(phone);
    var re = /^(\+|[0-9])\d{9,}/g;
    return re.test(phone);
}

function isValidEmail (email) {
    var re = /((\d|\w)+@\w(\w{1,}|-)*\w.\w{2,})/g;
    return re.test(email);
}

function parsePhoneNumber (phone) {
    return phone.replace(/(\s|\(|\)|\-)/g,'');
}

function addLeadingSymbols (firstSymbol, word, lengthTable, symbol) {
    var countSpaces = lengthTable - word.length;
    for (var symbolNumber = 0; symbolNumber < countSpaces; symbolNumber++) {
        word += symbol;
    }
    return firstSymbol + word;
}

function parsePhoneToFind (phone) {
    return (phone.substring(0,1) + ' (' + phone.substring(1,4) + ') '
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

function addEndingWords (firstEnd, secondEnd, number) {
    return (('Удален%n ' + number + ' контакт%s').replace('%s', firstEnd).replace('%n', secondEnd));
}
function pluralizeContactsNumber (number) {
    number %= 100;
    var addWithNumber = function(firstEnd, secondEnd) {
        return addEndingWords(firstEnd, secondEnd, number);
    }

    if (number > 4 && number < 21) {
        return addWithNumber('о', 'ов');
    }
    else {
        number %= 10;
        if (number === 1) {
            return addWithNumber('', '');
        }
        if (number > 1 && number < 5) {
            return addWithNumber('о', 'а');
        }
        else {
            return addWithNumber('о', 'ов');
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
    var fileLines = data.split('\n');
    fileLines.forEach(function(client) {
        if (client.search(';') !== -1) {
            var newClient = client.split(';');
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
    var addTopLine = function(firstSymbol, length) {
        return addLeadingSymbols(firstSymbol, '─', length, '─');
    }
    console.log(addTopLine('┌', 13) + addTopLine('┬', 20)
                + addTopLine('╥', 22) + '┐');

    var addColumnNames = function(firstSymbol, text, length) {
        return addLeadingSymbols(firstSymbol, text, length, ' ');
    }
    console.log(addColumnNames('│',' Имя', 13) +
                addColumnNames('│', ' Телефон', 20) +
                addColumnNames('║', ' email', 22) + '│');

    var addBottomLine = function(firstSymbol, length) {
        return addLeadingSymbols(firstSymbol, '─', length, '─');
    }
    console.log(addBottomLine('├', 13) + addBottomLine('┼', 20)
                + addBottomLine('╫', 22) + '┤');

    var addClient = function(firstSymbol, text, length) {
        return addLeadingSymbols(firstSymbol, text, length, ' ');
    }
    phoneBook.forEach(function(client) {
        console.log(addClient('│', client.name, 13) +
                addClient('│', parsePhoneToFind(client.phone), 20) +
                addClient('║', client.email, 22) + '│');
    });

    var addFooterLine = function(firstSymbol, length) {
        return addLeadingSymbols(firstSymbol, '─', length, '─');
    }
    console.log(addFooterLine('└', 13) + addFooterLine('┴', 20)
                + addFooterLine('╨', 22) + '┘');
}
