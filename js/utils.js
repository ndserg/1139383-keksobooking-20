'use strict';
(function () {
  window.util = {
    // Добавление класса элементам
    addClassOfElement: function (item, itemClass) {
      item.classList.add(itemClass);
    },

    // Удаление класса элементам
    removeClassOfElement: function (item, itemClass) {
      item.classList.remove(itemClass);
    },

    // Установка атрибута элемента
    setElementAttribute: function (item, attrName, attrValue) {
      if (item.hasAttribute(attrName) === false) {
        item.setAttribute(attrName, attrValue);
      }
    },

    // Удаление атрибута элемента
    removeElementAttribute: function (item, attrName, attrValue) {
      if (item.hasAttribute(attrName) === true) {
        item.removeAttribute(attrName, attrValue);
      }
    },

    // Установка/удаление атрибута всем элементам управления формы
    formControlsToggle: function (toggleState, formControls, attrName, attrValue) {
      var toggleSetting = window.util.setElementAttribute;

      if (toggleState === 'remove') {
        toggleSetting = window.util.removeElementAttribute;
      }

      Array.from(formControls).forEach(function (element) {
        toggleSetting(element, attrName, attrValue);
      });
    },

    //  Генератор окончаний числительных
    numbersEnding: function declination(number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    //  Генератор случайных чисел
    generateRandomNumber: function getRandomInt(min, max) {
      return (Math.floor(Math.random() * (max - min + 1)) + min);
    },

    //  Случайная выборка из массива
    getRandomList: function (sourceList) {
      var randomList = sourceList.slice();

      randomList.forEach(function (item, index) {
        var j = window.util.generateRandomNumber(0, randomList.length - 1);
        var temp = randomList[index];
        randomList[index] = randomList[j];
        randomList[j] = temp;
        return randomList;
      });

      randomList.length = window.util.generateRandomNumber(1, sourceList.length);
      return randomList;
    },

    //  Координаты блока относительно блока MAP
    getCoordinates: function getCoord(item, itemWidth, itemHeight) {
      var pinItem = item.getBoundingClientRect();
      var pinCoordGapX = Math.floor((document.querySelector('html').offsetWidth - window.data.map.offsetWidth) / 2);

      return {
        itemY: Math.floor(pinItem.top + pageYOffset + itemHeight),
        itemX: Math.floor(pinItem.left + pageXOffset - pinCoordGapX - itemWidth / 2)
      };
    }
  };
})();
