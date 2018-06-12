<template>
    <div v-if="dataLoaded" id="overlay">
        <div class="loading-container">
            <div class="loader"></div>
            <p>{{ property.name }} is Loading...</p>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-simple-spinner"], function (Vue, Vuex, Spinner) {
        Vue.component("vue-simple-spinner", Spinner);
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

<style>
    

    #overlay {
        position: fixed;
        /* Sit on top of the page content */
        width: 100%;
        /* Full width (cover the whole page) */
        height: 100%;
        /* Full height (cover the whole page) */
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        z-index: 999;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .loading-container .vue-simple-spinner-text{
        line-height: 1;
    }
</style>