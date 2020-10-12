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