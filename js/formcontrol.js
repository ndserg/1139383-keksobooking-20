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
