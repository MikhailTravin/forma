//Яндекс карта
const map = document.querySelector('#map');

if (map) {
	ymaps.ready(init);

	function init() {
		var myMap = new ymaps.Map('map', {
			center: [55.757642, 37.678442],
			zoom: 16,
			controls: ['zoomControl'],
			behaviors: ['drag']
		});
		var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
			latitude: 55.757642,
			longitude: 37.678442,
		}, {
			iconLayout: 'default#image',
			iconImageHref: 'img/icons/map.svg',
			iconColor: '#ec6608',
			iconImageSize: [105, 140],
			iconImageOffset: [-57, -137],
		});

		myMap.geoObjects.add(myPlacemark);
	};
}