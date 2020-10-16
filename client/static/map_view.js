const apiEndpoint = '/api/';

new Vue({
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        map: null,
        code: "",
        game: {}
    },
    created() {
        var element = document.getElementById('map');
        this.map = L.map(element);

        // Add OSM tile leayer to the Leaflet map.
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.code = window.location.pathname.split('/').pop();

        var vm = this;
        axios.get(apiEndpoint+ "game/" + this.code).then(function (response) {
            vm.game = response.data;
            var quizes = vm.game.quizes;

            var lastTarget = null;
            for (quiz in quizes)
            {
                quiz = quizes[quiz];
                var target = L.latLng(""+quiz.lon, ""+quiz.lat);
                lastTarget = target;
                L.marker(target).addTo(vm.map);
            }
            if (lastTarget)
            {
                vm.map.setView(lastTarget, 14);
            }
        });
    }
});

/*
// Target's GPS coordinates.
var target = L.latLng('47.50737', '19.04611');

// Set map's center to target with zoom 14.
map.setView(target, 14);

// Place a marker on the same location.
L.marker(target).addTo(map);
*/