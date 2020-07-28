'use strict';
(function () {
  var mapPinFilter = window.data.map.querySelector('.map__filters');
  var mapFilters = document.querySelector('.map__filters-container');

  mapPinFilter.addEventListener('change', onFilterChange);

  var PRICES = {
    low: 10000,
    high: 50000
  };

  var FILTERS = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: [],
  };

  function setFilters(filterType, filterValue) {
    var filterFeatures = mapFilters.querySelectorAll('input[name=features]');
    switch (filterType) {
      case 'housing-type':
        FILTERS.type = filterValue;
        break;
      case 'housing-rooms':
        FILTERS.rooms = filterValue;
        break;
      case 'housing-price':
        FILTERS.price = filterValue;
        break;
      case 'housing-guests':
        FILTERS.guests = filterValue;
        break;
      case 'features':
        FILTERS.features = [];
        filterFeatures.forEach(function (item) {
          if (item.checked) {
            FILTERS.features.push(item.value);
          }
        });
        break;
      default:
        FILTERS = {
          type: 'any',
          price: 'any',
          rooms: 'any',
          guests: 'any',
          features: [],
        };
        break;
    }
  }

  function getFilteredData() {
    var selectedAdverts = window.allAdverts;

    selectedAdverts = window.allAdverts.filter(filterByType)
    .filter(filterByRooms)
    .filter(filterByPrice)
    .filter(filterByGuests)
    .filter(featuresFilter);


    return selectedAdverts;
  }

  function filterByType(offers) {
    if (FILTERS.type !== 'any') {
      return offers.offer.type === FILTERS.type;
    }
    return offers;
  }

  function filterByRooms(offers) {
    if (FILTERS.rooms !== 'any') {
      return offers.offer.rooms === Number(FILTERS.rooms);
    }
    return offers;
  }

  function filterByPrice(offers) {
    switch (FILTERS.price) {
      case 'any':
        return offers;
      case 'low':
        return offers.offer.price <= PRICES.low;
      case 'high':
        return offers.offer.price >= PRICES.high;
      case 'middle':
        return offers.offer.price > PRICES.low && offers.offer.price < PRICES.high;
      default:
        return offers;
    }
  }

  function filterByGuests(offers) {
    if (FILTERS.guests !== 'any') {
      return offers.offer.guests === Number(FILTERS.guests);
    }
    return offers;
  }

  function featuresFilter(offers) {

    if (FILTERS.features.length > 0 && offers.offer.features.length > 0) {
      return FILTERS.features.every(function (element) {
        return offers.offer.features.some(function (feature) {
          return feature === element;
        });
      });
    }
    return offers;
  }

  function onFilterChange(evt) {
    // закрываем карточки объявлений
    var mapCards = window.data.map.querySelectorAll('.map__card');
    mapCards.forEach(function (item) {
      item.style.visibility = 'hidden';
      return mapCards;
    });

    // фильтруем полученные данные и собираем новый массив

    var mapFilterValue = evt.target.value;
    var filterType = evt.target.name;

    window.debounce(setFilters(filterType, mapFilterValue));

    window.mapRendering(getFilteredData(), true);
  }

})();
