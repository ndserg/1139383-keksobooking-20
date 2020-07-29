'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');
  var roomsInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var houseTypeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInInput = adForm.querySelector('#timein');
  var timeOutInput = adForm.querySelector('#timeout');
  var filtersForm = document.querySelector('.map__filters');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var minHousePrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var guestsNumber = {
    min: '0',
    notForGuests: '100',
  };

  //  Проверяем соответствие количества комнат - количеству гостей
  roomsInput.onchange = checkCapacity;
  capacityInput.onchange = checkCapacity;

  function checkCapacity() {
    switch (true) {
      case (roomsInput.value === guestsNumber.notForGuests && capacityInput.value !== guestsNumber.min):
        return capacityInput.setCustomValidity('Не для гостей!');
      case (roomsInput.value !== guestsNumber.notForGuests && capacityInput.value === guestsNumber.min):
        return capacityInput.setCustomValidity('Не для гостей!');
      case (capacityInput.value > roomsInput.value):
        return capacityInput.setCustomValidity('Слишко много гостей!');
      default:
        return capacityInput.setCustomValidity('');
    }
  }

  // Установит минимальную цену в зависимости от типа жилья
  function setHousePrice() {
    if (minHousePrices.hasOwnProperty(houseTypeInput.value)) {
      priceInput.min = minHousePrices[houseTypeInput.value];
      priceInput.placeholder = minHousePrices[houseTypeInput.value];
    }
  }

  setHousePrice();

  // Проверяем минимальную цену в зависимости от типа жилья
  houseTypeInput.onchange = checkHousePrice;

  function checkHousePrice() {
    if (minHousePrices.hasOwnProperty(houseTypeInput.value)) {
      priceInput.min = minHousePrices[houseTypeInput.value];
      priceInput.placeholder = minHousePrices[houseTypeInput.value];
    }
  }

  // Устанвливаем соответствующее время заезда и выезда
  timeInInput.onchange = setTimeOut;
  timeOutInput.onchange = setTimeIn;

  function setTimeOut() {
    if (timeOutInput.hasAttribute('selected')) {
      timeOutInput.removeAttribute('selected');
    }
    timeOutInput[timeInInput.selectedIndex].setAttribute('selected', true);
  }

  function setTimeIn() {
    if (timeInInput.hasAttribute('selected')) {
      timeInInput.removeAttribute('selected');
    }
    timeInInput[timeOutInput.selectedIndex].setAttribute('selected', true);
  }

  window.util.addClassOfElement(window.data.map, 'map--faded');
  window.util.addClassOfElement(adForm, 'ad-form--disabled');
  window.util.formControlsToggle('add', adForm.elements, 'disabled', 'disabled');
  window.util.formControlsToggle('add', filtersForm.elements, 'disabled', 'disabled');

  // отправляем данные формы
  adForm.addEventListener('submit', function (evt) {
    window.backend.saveData(new FormData(adForm), function () {}, function () {});
    evt.preventDefault();
  });

  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
  });
})();
