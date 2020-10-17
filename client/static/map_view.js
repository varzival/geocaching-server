const apiEndpoint = '/api/';
const defaultLoc = [ "49.404421", "8.675951" ];

new Vue({
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        map: null,
        code: "",
        game: {},
        markers: [],
        marker_selected: -1
    },
    mounted() {
        var element = this.$refs.map;
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
            for (quiznr in quizes)
            {
                quiz = quizes[quiznr];
                var target = L.latLng(""+quiz.lat, ""+quiz.lon);
                lastTarget = target;
                vm.addMarker(quiz);
            }
            vm.map.setView(lastTarget, 14);
            vm.map.on("click", vm.onMapClick);
        });
    },
    methods: {
        addMarker(quiz) {
            var target = L.latLng(""+quiz.lat, ""+quiz.lon);
            var marker = L.marker(target, {draggable: true});
            const marker_nr = this.markers.length;
            const vm = this;
            marker
                .bindPopup(quiz.text)
                .addTo(this.map)
                .on("click", function(e){vm.marker_selected = marker_nr;});
            this.markers.push(marker);
            return marker;
        },
        onMapClick(e) {
            L.marker([0,0], {draggable: true}).setLatLng(e.latlng).bindPopup("").addTo(this.map);
        }
    }
});