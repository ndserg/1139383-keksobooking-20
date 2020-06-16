'use strict';
(function () {
  var LEADING_ZERO = 10;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1200;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  var ADVERT_NUMBER = 8;
  var adverts = [];
  var houseTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var bookingTimes = ['12:00', '13:00', '14:00'];
  var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var map = document.querySelector('.map');
  var pinsBlock = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var parentMapFiltersContainer = mapFiltersContainer.parentNode;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  map.classList.remove('map--faded');
  adverts.length = ADVERT_NUMBER;

  //  генератор окончаний числительных
  var setNumbersEnding = function declination(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  };

  //  Генератор случайных чисел
  var generateRandomNumber = function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  };

  //  Случайная выборка из массива
  var getRandomList = function (sourceList) {
    var randomList = sourceList.slice();

    randomList.forEach(function (item, index) {
      var j = generateRandomNumber(0, randomList.length - 1);
      var temp = randomList[index];
      randomList[index] = randomList[j];
      randomList[j] = temp;
      return randomList;
    });

    randomList.length = generateRandomNumber(1, sourceList.length);
    return randomList;
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
        price: generateRandomNumber(500, 10000),
        type: Object.keys(houseTypes)[generateRandomNumber(0, Object.keys(houseTypes).length - 1)],
        rooms: generateRandomNumber(1, 10),
        guests: generateRandomNumber(1, 10),
        checkin: bookingTimes[generateRandomNumber(0, bookingTimes.length - 1)],
        checkout: bookingTimes[generateRandomNumber(0, bookingTimes.length - 1)],
        features: getRandomList(featuresList),
        description: 'строка с описанием',
        photos: getRandomList(photosList),
      },
      location: {
        x: generateRandomNumber(MIN_MAP_WIDTH, MAX_MAP_WIDTH),
        y: generateRandomNumber(MIN_MAP_HEIGHT, MAX_MAP_HEIGHT),
      }
      };
      adverts[i].offer.address = adverts[i].location.x + ',' + adverts[i].location.y;
    }

    return adverts;
  };

  addAdvert();

  //  Отрисовываем сгенерированные DOM-элементы в блок .map__pins
  var renderMapPins = function () {
    adverts.forEach(function (item, n) {
      var pinElement = pinTemplate.cloneNode(true);
      var avatarImg = pinElement.querySelector('img');

      // + Отрисовываем сгенерированные Card-элементы в блок .map перед блоком .map__filters-container
      var cardElement = cardTemplate.cloneNode(true);
      var advertTitle = cardElement.querySelector('.popup__title');
      var advertAddress = cardElement.querySelector('.popup__text--address');
      var advertPrice = cardElement.querySelector('.popup__text--price');
      var advertHouseType = cardElement.querySelector('.popup__type');
      var advertRoomAndGuest = cardElement.querySelector('.popup__text--capacity');
      var advertCheckTime = cardElement.querySelector('.popup__text--time');
      var advertFeatures = cardElement.querySelector('.popup__features');
      var advertDescription = cardElement.querySelector('.popup__description');
      var advertPhotos = cardElement.querySelector('.popup__photos');
      var advertAvatar = cardElement.querySelector('.popup__avatar');

      // данные для Pins
      pinElement.style.left = (adverts[n].location.x < PIN_WIDTH) ? adverts[n].location.x + 'px' : (adverts[n].location.x - PIN_WIDTH) + 'px';
      pinElement.style.top = (adverts[n].location.y < PIN_HEIGHT) ? adverts[n].location.y + 'px' : (adverts[n].location.y - PIN_HEIGHT) + 'px';

      avatarImg.src = adverts[n].author.avatar;
      avatarImg.alt = adverts[n].offer.title;

      // данные для Cards
      advertTitle.textContent = adverts[n].offer.title;
      advertAddress.textContent = adverts[n].offer.address;
      advertPrice.textContent = adverts[n].offer.price + '₽/ночь';
      advertHouseType.textContent = houseTypes[adverts[n].offer.type];
      advertRoomAndGuest.textContent = adverts[n].offer.rooms + setNumbersEnding(adverts[n].offer.rooms, [' комната', ' комнаты', ' комнат']) + ' для ' + adverts[n].offer.guests + setNumbersEnding(adverts[n].offer.guests, [' гостя', ' гостей', ' гостей']);
      advertCheckTime.textContent = 'Заезд после ' + adverts[n].offer.checkin + ', выезд до ' + adverts[n].offer.checkout;
      advertDescription.textContent = adverts[n].offer.description;
      advertAvatar.src = adverts[n].author.avatar;

      // очищаем список feature
      while (advertFeatures.firstChild) {
        advertFeatures.removeChild(advertFeatures.firstChild);
      }

      // добавляем элементы в список feature
      adverts[n].offer.features.forEach(function (feature) {
        var advertFeaturesItem = document.createElement('li');

        advertFeaturesItem.className = 'popup__feature';
        advertFeaturesItem.classList.add('popup__feature--' + feature);

        advertFeatures.appendChild(advertFeaturesItem);
      });

      // очищаем блок photos
      while (advertPhotos.firstChild) {
        advertPhotos.removeChild(advertPhotos.firstChild);
      }

      // добавляем элементы в блок photos
      adverts[n].offer.photos.forEach(function (photo) {
        var advertPhotosItem = document.createElement('img');

        advertPhotosItem.className = 'popup__photo';
        advertPhotosItem.src = photo;
        advertPhotosItem.width = 45;
        advertPhotosItem.height = 40;
        advertPhotosItem.alt = 'Фотография жилья';

        advertPhotos.appendChild(advertPhotosItem);
      });

      //  добавляем pins & cards в DOM
      pinsBlock.appendChild(pinElement);
      parentMapFiltersContainer.insertBefore(cardElement, mapFiltersContainer);
    });
  };

  renderMapPins();
})();
