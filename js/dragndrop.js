'use strict';

(function () {
  var dialogHandler = document.querySelector('.map__pin--main');
  var adFormAddress = document.querySelector('#address');

  var dialogHandlerSize = {
    WIDTH: 62,
    HEIGHT: 84,
  };

  var CoordinatesLimit = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630,
  };

  dialogHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      dialogHandler.style.top = (dialogHandler.offsetTop - shift.y) + 'px';
      dialogHandler.style.left = (dialogHandler.offsetLeft - shift.x) + 'px';

      var halfWidth = dialogHandlerSize.WIDTH / 2;
      var coordMaxX = CoordinatesLimit.X_MAX - halfWidth;
      var coordMinX = CoordinatesLimit.X_MIN - halfWidth;
      var coordMaxY = CoordinatesLimit.Y_MAX - dialogHandler.offsetHeight;
      var coordMinY = CoordinatesLimit.Y_MIN - dialogHandler.offsetHeight;

      adFormAddress.value = (dialogHandler.offsetLeft - shift.x + halfWidth) + ', ' + (dialogHandler.offsetTop - shift.y + dialogHandlerSize.HEIGHT);

      if (dialogHandler.offsetLeft > coordMaxX) {
        dialogHandler.style.left = coordMaxX + 'px';
      } else if (dialogHandler.offsetLeft < coordMinX) {
        dialogHandler.style.left = coordMinX + 'px';
      }

      if (dialogHandler.offsetTop > coordMaxY) {
        dialogHandler.style.top = coordMaxY + 'px';
      } else if (dialogHandler.offsetTop < coordMinY) {
        dialogHandler.style.top = coordMinY + 'px';
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
