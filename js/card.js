'use strict';
(function () {
  var pinsBlock = document.querySelector('.map__pins');

  var onPinsKeyDown = function (evt) {
    if (evt.key === window.data.ENTER_KEY) {
      onPinsClick();
    }
  };

  // Узнаем клик на пине
  var onPinsClick = function (evt) {
    var mapCards = window.data.map.querySelectorAll('.map__card');
    mapCards.forEach(function (item, i) {
      mapCards[i].style.visibility = 'hidden';
      return mapCards;
    });

    evt.target.classList.forEach(function (element) {
      var pinClass = String(element);

      if (pinClass.includes('pin__num--')) {
        var pinNum = pinClass.slice(10);
        var mapCard = window.data.map.querySelector('.map__card--' + pinNum);

        mapCard.style.visibility = 'visible';

        var closeMapCard = mapCard.querySelector('.popup__close');

        var onCloseCardKeyDown = function (closekey) {
          if (closekey.key === window.data.ESC_KEY) {
            mapCard.style.visibility = 'hidden';
            document.removeEventListener('keydown', onCloseCardKeyDown);
            document.removeEventListener('click', onCloseCardClick);
          }
        };

        var onCloseCardClick = function () {
          mapCard.style.visibility = 'hidden';
          document.removeEventListener('keydown', onCloseCardKeyDown);
          document.removeEventListener('click', onCloseCardClick);
        };

        closeMapCard.addEventListener('click', onCloseCardClick);
        document.addEventListener('keydown', onCloseCardKeyDown);
      }
    });
  };

  pinsBlock.addEventListener('click', onPinsClick);
  pinsBlock.addEventListener('keydown', onPinsKeyDown);
})();
