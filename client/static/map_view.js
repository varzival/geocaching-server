const apiEndpoint = '/api/';

async function api_call(endpoint){
    const gResponse = await fetch(apiEndpoint + endpoint);
    return await gResponse.json();
}

Vue.component("game_code", {
    props: ["code"],
    asyncComputed: {
        name: async function() {
            return await api_call("game/"+this.code).then(response => response.name)
        }
    },
    template: "<div><p>{{code}}</p>{{name}}<p></p></div>"
});

const vm = new Vue({
    el: '#vm',
    delimiters: ['[[', ']]']
});


// Where you want to render the map.
var element = document.getElementById('map');

// Create Leaflet map on map element.
var map = L.map(element);

// Add OSM tile leayer to the Leaflet map.
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Target's GPS coordinates.
var target = L.latLng('47.50737', '19.04611');

// Set map's center to target with zoom 14.
map.setView(target, 14);

// Place a marker on the same location.
L.marker(target).addTo(map);