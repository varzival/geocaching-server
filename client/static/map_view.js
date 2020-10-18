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
        marker_selected: -1,
        picked: null
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
                var target = L.latLng(quiz.lat, quiz.lon);
                lastTarget = target;
                vm.newMarker(quiz.lat, quiz.lon, quiz.text);
            }
            vm.map.setView(lastTarget, 14);
            vm.map.on("click", vm.onMapClick);
        });
    },
    methods: {
        updateCorrect(quiznr, optnr) {
            this.game.quizes[quiznr].correct = optnr;
        },
        onMapClick(e) {
            if (!this.game.hasOwnProperty("quizes"))
                return;
            this.newMarker(e.latlng.lat, e.latlng.lng, "Neue Frage");
            var quiz = {
                "text": "Neue Frage",
                "lat": e.latlng.lat,
                "lon": e.latlng.lng,
                "correct": -1,
                "options": []
            }
            this.game.quizes.push(quiz);
        },
        newMarker(lat, lon, text) {
            const vm = this;
            var marker = L.marker([lat, lon], {draggable: true})
            marker
                .bindPopup(text)
                .addTo(this.map)
                .on("click", function(e){
                    vm.marker_selected = this.properties.index;
                })
                .on("dragend", function(e){
                    var latlng = e.target.getLatLng();
                    vm.game.quizes[this.properties.index].lat = latlng.lat;
                    vm.game.quizes[this.properties.index].lon = latlng.lng;
                    vm.marker_selected = this.properties.index;
                });
            marker.properties = {};
            marker.properties.index = this.markers.length;
            this.markers.push(marker);
            this.markers.forEach(this.updateMarkerEvents);
            return marker;
        },
        updateMarkerEvents(item, index) {
            item.properties.index = index;
        },
        remove_quiz() {
            if (! (-1 < this.marker_selected || this.marker_selected < this.markers.length))
                return;
            this.game.quizes.splice(this.marker_selected, 1);
            this.map.removeLayer(this.markers[this.marker_selected]);
            this.markers.splice(this.marker_selected, 1);
            this.marker_selected = -1;
            this.markers.forEach(this.updateMarkerEvents);
        },
        add_option() {
            if (! (-1 < this.marker_selected || this.marker_selected < this.markers.length))
                return;
            console.log("executed")
            this.game.quizes[this.marker_selected].options.push("Option");
        },
        remove_option(index) {
            if (! (-1 < this.marker_selected || this.marker_selected < this.markers.length))
                return;
            this.game.quizes[this.marker_selected].options.splice(index, 1);
            if (this.game.quizes[this.marker_selected].correct == index
                || this.game.quizes[this.marker_selected].correct >= this.game.quizes[this.marker_selected].options.length)
                this.game.quizes[this.marker_selected].correct = 0;
        },
        quizTextChange(evt) {
            if (! (-1 < this.marker_selected || this.marker_selected < this.markers.length))
                return;
            this.markers[this.marker_selected].bindPopup(evt.target.value);
        },
        save() {
            if (!this.game.hasOwnProperty("quizes"))
                return;
            for (quiznr in this.game.quizes)
            {
                if (this.game.quizes[quiznr].correct < 0) {
                    alert("Konnte nicht speichern: mindestens eines der Quizes hat keine korrekte Anwort.")
                    return;
                }
            }
            axios.post(apiEndpoint+ "game/" + this.code, this.game)
                .then( function(response) {
                    alert("Spiel gespeichert!");
                })
                .catch( function(error) {
                    alert("Konnte Spiel nicht speichern.");
                    console.log(error);
                });
        }
    }
});