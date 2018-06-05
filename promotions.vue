<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Sales & Promotions</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div v-if="promoList" v-for="promo in promoList">
                        <div class="row">
                            <!--<div class="col-md-12">-->
                            <!--    <h3 class="event_date_heading">{{ promo.end_date | moment("MMMM YYYY", timezone)}}</h3>    -->
                            <!--</div>-->
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <img :src="promo.image_url" :alt="'Event: ' + promo.name" class="img_max" />   
                            </div>
                            <div class="col-md-8">
                                <h4 class="event_name">{{ promo.name }}</h4>
                                <p class="event_dates"><span>Location</span> | <span v-if="isMultiDay(promo)">{{ promo.start_date | moment("MMMM D", timezone)}} to {{ promo.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ promo.start_date | moment("MMMM D", timezone)}}</span></p>
                                <div class="event_desc" v-html="promo.description"></div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Sorry, there are no Promotions posted at this time. Please check back soon!</p>    
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
        return Vue.component("promotions-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                    toggleEvents: false,
                    togglePromos: false
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
                    'processedEvents',
                    'processedPromos'
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
                    
                },
                promoList: function promos() {
                    var vm = this;
                    var showPromos = [];
                    _.forEach(this.processedPromos, function(value, key) {
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
                            
                            showPromos.push(value);
                        }
                    });
                    var sortedPromos = _.orderBy(showPromos, [function(o) { return o.end_date; }]);
                    if (sortedPromos.length > 0) {
                        this.togglePromos = true;
                    }
                    return sortedPromos;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "events"), this.$store.dispatch("getData","promotions")]);
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
