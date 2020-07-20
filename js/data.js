'use strict';
(function () {
  window.data = {
    'ESC_KEY': 'Escape',
    'ENTER_KEY': 'Enter',
    'MAIN_PIN_WIDTH': 65,
    'MAIN_PIN_HEIGHT': 65,
    'map': document.querySelector('.map')
  };
  var ADVERT_NUMBER = 5;

  var mapPinFilter = window.data.map.querySelector('.map__filters');
  var adFormAddress = document.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');

  window.adverts = [];

  // загружаем данные объявлений
  var successHandler = function (adverts) {
    window.allAdverts = adverts;
    window.adverts = adverts.slice(0, ADVERT_NUMBER);
  };

  mapPinFilter.addEventListener('change', onHouseTypeChange);

  function onHouseTypeChange() {
    // закрываем карточки объявлений
    var mapCards = window.data.map.querySelectorAll('.map__card');
    mapCards.forEach(function (item) {
      item.style.visibility = 'hidden';
      return mapCards;
    });

    // фильтруем полученные данные и собираем новый массив
    var selectedAdverts = window.allAdverts;
    var mapFilterValue = event.target.value;

    if (event.target.value !== 'any') {
      selectedAdverts = window.allAdverts.filter(function (filterValue) {
        return filterValue.offer.type === mapFilterValue;
      });
    } else {
      selectedAdverts = window.adverts;
    }

    window.mapRendering(selectedAdverts, true);
  }

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

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT / 2).itemY);
})();
