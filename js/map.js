'use strict';
(function () {
  var PIN_POINTER_HEIGHT = 22;

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = document.querySelector('#address');
  var pinsBlock = document.querySelector('.map__pins');
  var mapPinMain = pinsBlock.querySelector('.map__pin--main');
  var filtersForm = document.querySelector('.map__filters');

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT / 2).itemY);

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      mapActivation();
    }
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === window.data.ENTER_KEY) {
      mapActivation();
    }
  });

  var mapActivation = function () {
    //  Значение поля адрес при открытии страницы с учетом размера указателя
    adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT + PIN_POINTER_HEIGHT).itemY);

    // Активируем карту и поля форм
    window.util.removeClassOfElement(window.data.map, 'map--faded');
    window.util.removeClassOfElement(adForm, 'ad-form--disabled');
    window.util.formControlsToggle('remove', adForm.elements, 'disabled', 'disabled');
    window.util.formControlsToggle('remove', filtersForm.elements, 'disabled', 'disabled');
    window.mapRendering(window.adverts, false);
  };
})();
