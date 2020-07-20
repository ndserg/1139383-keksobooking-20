'use strict';
(function () {
  var pinsBlock = document.querySelector('.map__pins');

  // Узнаем клик на пине
  var pinsClickHandler = function (evt) {
    var mapCards = window.data.map.querySelectorAll('.map__card');
    mapCards.forEach(function (item, i) {
      mapCards[i].style.visibility = 'hidden';
      return mapCards;
    });

    for (var i = 0; i <= evt.target.classList.length; i++) {
      var pinClass = String(evt.target.classList[i]);

      if (pinClass.includes('pin__num--')) {
        var pinNum = pinClass.slice(10);
        var mapCard = window.data.map.querySelector('.map__card--' + pinNum);

        mapCard.style.visibility = 'visible';

        var closeMapCard = mapCard.querySelector('.popup__close');

        var closeCardOnEsc = function (closekey) {
          if (closekey.key === window.data.ESC_KEY) {
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
    if (evt.key === window.data.ENTER_KEY) {
      pinsClickHandler();
    }
  });
})();
