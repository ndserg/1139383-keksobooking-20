'use strict';
var LEADING_ZERO = 10;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_MAP_WIDTH = 0;
var MAX_MAP_WIDTH = 1200;
var MIN_MAP_HEIGHT = 130;
var MAX_MAP_HEIGHT = 630;
var ADVERT_NUMBER = 8;

var adverts = [];
var houseTypes = ['palace', 'flat', 'house', 'bungalo'];
var bookingTimes = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');
var pinsBlock = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

map.classList.remove('map--faded');
adverts.length = ADVERT_NUMBER;

//  Генератор случайных чисел
var randomNumber = function getRandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
};

//  Случайная выборка из массива
var getRandomList = function (sourceList) {
  var randomList = sourceList.slice();

  randomList.forEach(function (item, index) {
    var j = randomNumber(0, randomList.length - 1);
    var temp = randomList[index];
    randomList[index] = randomList[j];
    randomList[j] = temp;
    return randomList;
  });

  randomList.length = randomNumber(1, sourceList.length);
};

//  Создаем массив обектов (объявлений)
var addAdvert = function () {
  for (var i = 0; i < adverts.length; i++) {
    adverts[i] =
    {author: {
      avatar: 'img/avatars/user' + (([i] >= LEADING_ZERO) ? [i + 1] : '0' + [i + 1]) + '.png'
    },
    offer: {
      title: 'заголовок объявления',
      address: '',
      price: randomNumber(500, 10000),
      type: houseTypes[randomNumber(0, houseTypes.length - 1)],
      rooms: randomNumber(1, 10),
      guests: randomNumber(1, 10),
      checkin: bookingTimes[randomNumber(0, bookingTimes.length - 1)],
      checkout: bookingTimes[randomNumber(0, bookingTimes.length - 1)],
      features: getRandomList(featuresList),
      description: 'строка с описанием',
      photos: getRandomList(photosList),
    },
    location: {
      x: randomNumber(MIN_MAP_WIDTH, MAX_MAP_WIDTH),
      y: randomNumber(MIN_MAP_HEIGHT, MAX_MAP_HEIGHT),
    }
    };
    adverts[i].offer.address = adverts[i].location.x + ',' + adverts[i].location.y;
  }

  return adverts;
};

addAdvert();

//  Отрисовываем сгенерированные DOM-элементы в блок .map__pins
adverts.forEach(function (item, n) {
  var pinElement = pinTemplate.cloneNode(true);
  var avatarImg = pinElement.querySelector('img');

  pinElement.style.left = (adverts[n].location.x < PIN_WIDTH ? adverts[n].location.x + 'px' : (adverts[n].location.x - PIN_WIDTH) + 'px');
  pinElement.style.top = (adverts[n].location.y < PIN_HEIGHT ? adverts[n].location.y + 'px' : (adverts[n].location.y - PIN_HEIGHT) + 'px');

  avatarImg.src = adverts[n].author.avatar;
  avatarImg.alt = adverts[n].offer.title;

  pinsBlock.appendChild(pinElement);
});
