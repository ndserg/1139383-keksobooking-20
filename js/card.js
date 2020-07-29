'use strict';
(function () {
  var pinsBlock = document.querySelector('.map__pins');

  var onPinsKeyDown = function (evt) {
    if (evt.key === window.data.ENTER_KEY) {
      onPinsClick();
    }
  };

  var cardRendering = function (mapCard) {
    mapCard.style.visibility = 'visible';
    var closeMapCard = mapCard.querySelector('.popup__close');

    var onCloseCardKeyDown = function (closekey) {
      if (closekey.key === window.data.ESC_KEY) {
        mapCard.style.visibility = 'hidden';
        pinsBlock.removeEventListener('keydown', onCloseCardKeyDown);
        closeMapCard.removeEventListener('click', onCloseCardClick);
      }
    };

    var onCloseCardClick = function () {
      mapCard.style.visibility = 'hidden';
      pinsBlock.removeEventListener('keydown', onCloseCardKeyDown);
      closeMapCard.removeEventListener('click', onCloseCardClick);
    };

    closeMapCard.addEventListener('click', onCloseCardClick);
    pinsBlock.addEventListener('keydown', onCloseCardKeyDown);
  };

  // Узнаем клик на пине
  var onPinsClick = function (evt) {
    if (evt.target.dataset.number) {
      var pinNumber = evt.target.dataset.number;
      var mapCards = window.data.map.querySelectorAll('.map__card');

      mapCards.forEach(function (element) {
        if (element.style.visibility === 'visible' && element.dataset.number === pinNumber) {
          return element;
        } else {
          element.style.visibility = 'hidden';
          return element.dataset.number === pinNumber ? cardRendering(element) : '';
        }
      });
    }
  };

  pinsBlock.addEventListener('click', onPinsClick);
  pinsBlock.addEventListener('keydown', onPinsKeyDown);
})();
