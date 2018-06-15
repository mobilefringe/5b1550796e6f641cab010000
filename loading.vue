<template>
    <div v-if="dataLoaded" id="overlay">
        <div class="loading-container">
            <div class="loader"></div>
            <p class="main_container center">{{ property.name }} is Loading...</p>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function (Vue, Vuex) {
        return Vue.component("loading-spinner", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false
                };
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ])
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "property")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>