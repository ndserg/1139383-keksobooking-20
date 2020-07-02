'use strict';
(function () {
  var LEADING_ZERO = 10;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var PIN_POINTER_HEIGHT = 22;
  var MIN_MAP_WIDTH = 0;
  var MAX_MAP_WIDTH = 1200;
  var MIN_MAP_HEIGHT = 130;
  var MAX_MAP_HEIGHT = 630;
  var ADVERT_NUMBER = 8;
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

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
  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');
  var filtersForm = document.querySelector('.map__filters');
  var pinsBlock = document.querySelector('.map__pins');
  var mapPinMain = pinsBlock.querySelector('.map__pin--main');
  var houseTypeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInInput = adForm.querySelector('#timein');
  var timeOutInput = adForm.querySelector('#timeout');
  var roomsInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var parentMapFiltersContainer = mapFiltersContainer.parentNode;

  adverts.length = ADVERT_NUMBER;

  //  Проверяем соответствие количества комнат - количеству гостей
  roomsInput.onchange = checkCapacity;
  capacityInput.onchange = checkCapacity;

  function checkCapacity() {
    if (roomsInput.value >= 100 && capacityInput.value > 0) {
      capacityInput.setCustomValidity('Не для гостей!');
    } else if (capacityInput.value < 1 && roomsInput.value < 100) {
      capacityInput.setCustomValidity('Не для гостей!');
    } else if (capacityInput.value > roomsInput.value) {
      capacityInput.setCustomValidity('Слишко много гостей!');
    } else {
      capacityInput.setCustomValidity('');
    }
  }

  // Проверяем минимальную цену в зависимости от типа жилья
  houseTypeInput.onchange = housePrice;

  function housePrice() {
    if (houseTypeInput.value === 'bungalo') {
      priceInput.min = 0;
      priceInput.placeholder = '0';
    } else if (houseTypeInput.value === 'flat') {
      priceInput.min = 1000;
      priceInput.placeholder = '1000';
    } else if (houseTypeInput.value === 'house') {
      priceInput.min = 5000;
      priceInput.placeholder = '5000';
    } else if (houseTypeInput.value === 'palace') {
      priceInput.min = 10000;
      priceInput.placeholder = '10 000';
    }
  }

  // Устанвливаем соответствующее время заезда и выезда
  timeInInput.onchange = setTimeOut;
  timeOutInput.onchange = setTimeIn;

  function setTimeOut() {
    for (var i = 0; i < timeOutInput.length; i++) {
      if (timeOutInput[i].hasAttribute('selected')) {
        timeOutInput[i].removeAttribute('selected');
      }
    }

    timeOutInput[timeInInput.selectedIndex].setAttribute('selected', true);
  }

  function setTimeIn() {
    for (var i = 0; i < timeInInput.length; i++) {
      if (timeInInput[i].hasAttribute('selected')) {
        timeInInput[i].removeAttribute('selected');
      }
    }

    timeInInput[timeOutInput.selectedIndex].setAttribute('selected', true);
  }

  //  Координаты блока относительно блока MAP
  var getCoordinates = function getCoord(item, itemWidth, itemHeight) {
    var pinItem = item.getBoundingClientRect();
    var pinCoordGapX = Math.floor((document.querySelector('html').offsetWidth - map.offsetWidth) / 2);

    return {
      itemY: Math.floor(pinItem.top + pageYOffset + itemHeight),
      itemX: Math.floor(pinItem.left + pageXOffset - pinCoordGapX - itemWidth / 2)
    };
  };

  // Добавление класса элементам
  var addClassOfElement = function (item, itemClass) {
    if (item.classList.contains(itemClass) === false) {
      item.classList.add(itemClass);
    }
  };

  // Удаление класса элементам
  var removeClassOfElement = function (item, itemClass) {
    if (item.classList.contains(itemClass) === true) {
      item.classList.remove(itemClass);
    }
  };

  // Установка атрибута элемента
  var setElementAttribute = function (item, attrName, attrValue) {
    if (item.hasAttribute(attrName, attrValue) === false) {
      item.setAttribute(attrName, attrValue);
    }
  };

  // Удаление атрибута элемента
  var removeElementAttribute = function (item, attrName, attrValue) {
    if (item.hasAttribute(attrName, attrValue) === true) {
      item.removeAttribute(attrName, attrValue);
    }
  };

  // Установка/удаление атрибута всем элементам управления формы
  var formControlsToggle = function (toggleState, formControls, attrName, attrValue) {
    var toggleSetting = setElementAttribute;

    if (toggleState === 'remove') {
      toggleSetting = removeElementAttribute;
    }

    for (var i = 0; i < formControls.length; i++) {
      toggleSetting(formControls[i], attrName, attrValue);
    }
  };

  addClassOfElement(map, 'map--faded');
  addClassOfElement(adForm, 'ad-form--disabled');
  formControlsToggle('add', adForm.elements, 'disabled', 'disabled');
  formControlsToggle('add', filtersForm.elements, 'disabled', 'disabled');

  //  Генератор окончаний числительных
  var numbersEnding = function declination(number, titles) {
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

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', getCoordinates(mapPinMain, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT).itemX + ', ' + getCoordinates(mapPinMain, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2).itemY);

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      mapActivation();
    }
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER_KEY) {
      mapActivation();
    }
  });

  var mapActivation = function () {
    //  Значение поля адрес при открытии страницы с учетом размера указателя
    adFormAddress.setAttribute('value', getCoordinates(mapPinMain, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT).itemX + ', ' + getCoordinates(mapPinMain, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT + PIN_POINTER_HEIGHT).itemY);

    // Активируем карту и поля форм
    removeClassOfElement(map, 'map--faded');
    removeClassOfElement(adForm, 'ad-form--disabled');
    formControlsToggle('remove', adForm.elements, 'disabled', 'disabled');
    formControlsToggle('remove', filtersForm.elements, 'disabled', 'disabled');
    checkCapacity();

    //  Отрисовываем сгенерированные DOM-элементы в блок .map__pins и Card-элементы в блок .map перед блоком .map__filters-container
    var pinsFragment = document.createDocumentFragment();
    var cardsFragment = document.createDocumentFragment();

    var renderMapPins = function () {
      adverts.forEach(function (item, n) {
        var pinElement = pinTemplate.cloneNode(true);
        var avatarImg = pinElement.querySelector('img');

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
        advertRoomAndGuest.textContent = adverts[n].offer.rooms + numbersEnding(adverts[n].offer.rooms, [' комната', ' комнаты', ' комнат']) + ' для ' + adverts[n].offer.guests + numbersEnding(adverts[n].offer.guests, [' гостя', ' гостей', ' гостей']);
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

        //  добавляем pins & cards в fragments
        pinElement.classList.add('pin__num--' + n);
        cardElement.classList.add('map__card--' + n);
        cardElement.style.visibility = 'hidden';

        pinsFragment.appendChild(pinElement);
        cardsFragment.appendChild(cardElement);
      });

      //  добавляем pins & cards fragments в DOM
      pinsBlock.appendChild(pinsFragment);

      parentMapFiltersContainer.insertBefore(cardsFragment, mapFiltersContainer);

      //  Конец отрисовки сгенерированных DOM-элементов в блок .map__pins и Card-элементов в блок .map перед блоком .map__filters-container
    };
    renderMapPins();

    // Узнаем клик на пине
    var pinsClickHandler = function (evt) {
      var mapCards = map.querySelectorAll('.map__card');
      mapCards.forEach(function (item, i) {
        mapCards[i].style.visibility = 'hidden';
        return mapCards;
      });

      for (var i = 0; i <= evt.target.classList.length; i++) {
        var pinClass = String(evt.target.classList[i]);

        if (pinClass.includes('pin__num--')) {
          var pinNum = pinClass.slice(10);
          var mapCard = map.querySelector('.map__card--' + pinNum);

          mapCard.style.visibility = 'visible';

          var closeMapCard = mapCard.querySelector('.popup__close');

          var closeCardOnEsc = function (closekey) {
            if (closekey.key === ESC_KEY) {
              mapCard.style.visibility = 'hidden';
              document.removeEventListener('keydown', closeCardOnEsc);
            }
          };

          closeMapCard.addEventListener('click', function () {
            mapCard.style.visibility = 'hidden';
          });

          document.addEventListener('keydown', closeCardOnEsc);
        }
      }
    };

    pinsBlock.addEventListener('click', pinsClickHandler);
    pinsBlock.addEventListener('keydown', function (evt) {
      if (evt.key === ENTER_KEY) {
        pinsClickHandler();
      }
    });
  };
})();
