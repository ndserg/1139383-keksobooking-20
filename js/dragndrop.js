'use strict';
(function () {
  var PIN_SIZE = 62;
  var mapWidth = 1200;
  var minX = (screen.width - mapWidth) / 2;
  var maxX = (screen.width - mapWidth) / 2 + mapWidth;
  var minY = 130;
  var maxY = 630;
  var adFormAddress = document.querySelector('#address');
  var pinsBlock = document.querySelector('.map__pins');
  var dialogHandler = pinsBlock.querySelector('.map__pin--main');

  var pincCoordinates = function () {
    adFormAddress.setAttribute('value', window.util.getCoordinates(dialogHandler, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemX + PIN_SIZE + ', ' + (window.util.getCoordinates(dialogHandler, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT).itemY + PIN_SIZE));
  };

  dialogHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      if ((moveEvt.pageX > minX) && (moveEvt.pageX < maxX)) {
        var coordX = moveEvt.pageX;
      }

      if ((moveEvt.pageY > minY) && (moveEvt.pageY < maxY)) {
        var coordY = moveEvt.pageY;
      }

      var shift = {
        x: startCoords.x - coordX,
        y: startCoords.y - coordY
      };

      startCoords = {
        x: coordX,
        y: coordY
      };

      dialogHandler.style.top = (dialogHandler.offsetTop - shift.y) + 'px';
      dialogHandler.style.left = (dialogHandler.offsetLeft - shift.x) + 'px';

      pincCoordinates();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          dialogHandler.removeEventListener('click', onClickPreventDefault);
          pincCoordinates();
        };
        dialogHandler.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
