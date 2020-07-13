'use strict';
(function () {
  window.ESC_KEY = 'Escape';
  window.ENTER_KEY = 'Enter';
  var LEADING_ZERO = 10;
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1200;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  window.MAIN_PIN_WIDTH = 65;
  window.MAIN_PIN_HEIGHT = 65;
  var ADVERT_NUMBER = 8;

  window.houseTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var bookingTimes = ['12:00', '13:00', '14:00'];
  var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  window.map = document.querySelector('.map');
  var adFormAddress = document.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');

  window.adverts = [];
  window.adverts.length = ADVERT_NUMBER;

  //  Создаем массив обектов (объявлений)
  var addAdvert = function () {
    for (var i = 0; i < window.adverts.length; i++) {
      window.adverts[i] =
      {author: {
        avatar: 'img/avatars/user' + (([i] >= LEADING_ZERO) ? [i + 1] : '0' + [i + 1]) + '.png'
      },
      offer: {
        title: 'заголовок объявления',
        address: '',
        price: window.util.generateRandomNumber(500, 10000),
        type: Object.keys(window.houseTypes)[window.util.generateRandomNumber(0, Object.keys(window.houseTypes).length - 1)],
        rooms: window.util.generateRandomNumber(1, 10),
        guests: window.util.generateRandomNumber(1, 10),
        checkin: bookingTimes[window.util.generateRandomNumber(0, bookingTimes.length - 1)],
        checkout: bookingTimes[window.util.generateRandomNumber(0, bookingTimes.length - 1)],
        features: window.util.getRandomList(featuresList),
        description: 'строка с описанием',
        photos: window.util.getRandomList(photosList),
      },
      location: {
        x: window.util.generateRandomNumber(MIN_MAP_WIDTH, MAX_MAP_WIDTH),
        y: window.util.generateRandomNumber(MIN_MAP_HEIGHT, MAX_MAP_HEIGHT),
      }
      };
      window.adverts[i].offer.address = window.adverts[i].location.x + ',' + window.adverts[i].location.y;
    }

    return window.adverts;
  };

  addAdvert();

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT / 2).itemY);
})();
