<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Events</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div v-if="eventList" v-for="event in eventList">
                            <div class="col-md-12">
                                <h3>{{ event.end_date | moment("MMMM YYYY", timezone)}}</h3>    
                            </div>
                            <div class="col-md-4">
                                <img :src="event.image_url" :alt="'Event: ' + event.name" class="img_max" />   
                            </div>
                            <div class="col-md-8">
                                <h4>{{ event.name }}</h4>
                                <h>Location | <span v-if="isMultiDay(event)" class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span><span v-else class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}}</span></p>
                                <div class="" v-html="event.description_short"></div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Sorry, there are no Events posted at this time. Please check back soon!</p>    
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load", "bootstrap-vue"], function (Vue, Vuex, moment, tz, VueMoment, VueLazyload, BootstrapVue) {
        Vue.use(BootstrapVue);
        Vue.use(VueLazyload);
        return Vue.component("promotions-and-events-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents'
                ]),
                eventList: function events() {
                    var events = this.processedEvents;
                    var showEvents = [];
                    _.forEach(events, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "http://placehold.it/400x400";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://placehold.it/400x400";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 100, 'separator': ' ' });
                            
                            showEvents.push(value);
                        }
                    });
                    var sortedEvents = _.orderBy(showEvents, function (o) { return o.end_date });
                    if (sortedEvents.length > 0) {
                        this.toggleEvents = true;
                    }
                    return sortedEvents
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "events")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        });
    });
</script>
