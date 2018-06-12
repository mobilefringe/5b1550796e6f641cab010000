<template>
    <div v-if="dataLoaded" id="overlay">
        <div class="loading-container">
            <vue-simple-spinner size="huge" :message="property.name + ' is Loading...'"></vue-simple-spinner>
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
    .loader,
.loader:before,
.loader:after {
  background: #ffffff;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #ffffff;
  text-indent: -9999em;
  margin: 88px auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: '';
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}

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