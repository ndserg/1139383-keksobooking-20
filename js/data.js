'use strict';
(function () {
  window.data = {
    'ESC_KEY': 'Escape',
    'ENTER_KEY': 'Enter',
    'MAIN_PIN_WIDTH': 65,
    'MAIN_PIN_HEIGHT': 65,
    'map': document.querySelector('.map')
  };
  var ADVERT_NUMBER = 8;

  var adFormAddress = document.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');

  window.adverts = [];
  window.adverts.length = ADVERT_NUMBER;

  // загружаем данные объявлений
  var successHandler = function (adverts) {
    window.adverts = adverts;
    addAdvert();
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.loadData(successHandler, errorHandler);

  //  Создаем массив обектов (объявлений)
  var addAdvert = function () {
    for (var i = 0; i < window.adverts.length; i++) {
      window.adverts[i] =
      {author: {
        avatar: window.adverts[i].author.avatar
      },
      offer: {
        title: window.adverts[i].offer.title,
        address: window.adverts[i].offer.address,
        price: window.adverts[i].offer.price,
        type: window.adverts[i].offer.type,
        rooms: window.adverts[i].offer.rooms,
        guests: window.adverts[i].offer.guests,
        checkin: window.adverts[i].offer.checkin,
        checkout: window.adverts[i].offer.checkout,
        features: window.adverts[i].offer.features,
        description: window.adverts[i].offer.description,
        photos: window.adverts[i].offer.photos
      },
      location: {
        x: window.adverts[i].location.x,
        y: window.adverts[i].location.y,
      }
      };
      window.adverts[i].offer.address = window.adverts[i].location.x + ',' + window.adverts[i].location.y;
    }

    return window.adverts;
  };

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT / 2).itemY);
})();
