!function ($) {

  $(function(){

    $('#world_map').vectorMap({
      map: 'world_mill_en',
      normalizeFunction: 'polynomial',
      backgroundColor: '#bf1519',            
      regionStyle: {
        initial: {
          fill: '#000'
        },
       hover: {
          fill: '#f5f5f5'
        },
      },
      markerStyle: {
        initial: {
          fill: '#b20000',
          stroke: '#fff'
        }
      },
      markers: [
        {latLng: [10.29, -66.52], name: 'Caracas'},
        {latLng: [10.37, -71.38], name: 'Maracaibo'},
        {latLng: [36.11, 139.04], name: 'Shinjuku'},
        {latLng: [35.54, 139.39], name: 'Saitama'},
        {latLng: [-33.27, -70.39], name: 'Santiago'},
        {latLng: [7.35, 134.46], name: 'Palau'},
        {latLng: [42.5, 1.51], name: 'Andorra'},
        {latLng: [14.01, -60.98], name: 'Saint Lucia'},
        {latLng: [6.91, 158.18], name: 'Federated States of Micronesia'},
        {latLng: [1.3, 103.8], name: 'Singapore'},
        {latLng: [1.46, 173.03], name: 'Kiribati'},
        {latLng: [-21.13, -175.2], name: 'Tonga'},
        {latLng: [15.3, -61.38], name: 'Dominica'},
        {latLng: [-20.2, 57.5], name: 'Mauritius'},
        {latLng: [26.02, 50.55], name: 'Bahrain'},
        {latLng: [0.33, 6.73], name: 'São Tomé and Príncipe'}
      ]
    });
    var map,
    markers = [
      {latLng: [40.71, -74.00], name: 'New York'},
      {latLng: [34.05, -118.24], name: 'Los Angeles'},
      {latLng: [41.87, -87.62], name: 'Chicago'},
      {latLng: [29.76, -95.36], name: 'Houston'},
      {latLng: [39.95, -75.16], name: 'Philadelphia'},
      {latLng: [38.90, -77.03], name: 'Washington'},
      {latLng: [37.36, -122.03], name: 'Silicon Valley'}
    ],
    cityAreaData = [
      187.70,
      255.16,
      310.69,
      605.17,
      248.31,
      107.35,
      217.22
    ];

    map = new jvm.WorldMap({
      container: $('#usa_map'),
      map: 'us_aea_en',
      backgroundColor: '#fff',  
      regionsSelectable: true,
      markersSelectable: true,
      markers: markers,
      markerStyle: {
        initial: {
          fill: '#fcc633'
        },
        selected: {
          fill: '#ffffff'
        }
      },
      regionStyle: {
        initial: {
          fill: '#177bbb'
        },
        selected: {
          fill: '#1ccacc'
        }
      },
      series: {
        markers: [{
          attribute: 'r',
          scale: [5, 15],
          values: cityAreaData
        }]
      },
      onRegionSelected: function(){
        if (window.localStorage) {
          window.localStorage.setItem(
            'jvectormap-selected-regions',
            JSON.stringify(map.getSelectedRegions())
          );
        }
      },
      onMarkerSelected: function(){
        if (window.localStorage) {
          window.localStorage.setItem(
            'jvectormap-selected-markers',
            JSON.stringify(map.getSelectedMarkers())
          );
        }
      }
    });
    

  });
}(window.jQuery);