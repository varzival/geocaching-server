const apiEndpoint = '/api/';
const defaultLoc = [ "49.404421", "8.675951" ];

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

            var lastTarget = L.latLng(defaultLoc[0], defaultLoc[1]);
            for (quiz in quizes)
            {
                quiz = quizes[quiz];
                var target = L.latLng(""+quiz.lat, ""+quiz.lon);
                lastTarget = target;
                L.marker(target).addTo(vm.map);
            }
            vm.map.setView(lastTarget, 14);
        });
    }
});