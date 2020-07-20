'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;
  var LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successMessage = successTemplate.cloneNode(true);
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorMessage = errorTemplate.cloneNode(true);
  var errorButton = errorMessage.querySelector('.error__button');

  var StatusCode = {
    OK: 200
  };

  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var saveData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
        messageHandler(successMessage);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        messageHandler(errorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка отправки данных');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    var messageHandler = function (element) {
      window.messageElement = main.appendChild(element);
      document.addEventListener('keydown', onButtonPress);
      document.addEventListener('click', onWindowClick);
      if (element === errorMessage) {
        errorButton.addEventListener('click', onErrorButtonClick);
      }
    };

    function closeMesssage(element) {
      element.remove();
      document.removeEventListener('keydown', onButtonPress);
      document.removeEventListener('click', onWindowClick);
      if (element.classList.contains('success')) {
        document.location.reload(true);
      }
    }

    var onButtonPress = function (evt) {
      if (evt.key === window.data.ESC_KEY) {
        evt.preventDefault();
        closeMesssage(window.messageElement);
      }
    };

    var onWindowClick = function () {
      closeMesssage(window.messageElement);
    };

    var onErrorButtonClick = function (evt) {
      evt.preventDefault();
      window.messageElement.remove();
      errorButton.removeEventListener('click', onErrorButtonClick);
    };

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    'loadData': loadData,
    'saveData': saveData
  };
})();
