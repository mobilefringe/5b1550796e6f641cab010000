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
                    <div class="row margin_60">
                        <div v-if="eventList" v-for="event in eventList">
                            <div class="event_date_heading col-md-12">
                                <h3 v-if="event.show_month" class="">{{ event.month }}</h3> 
                            </div>
                            <div class="col-md-4">
                                <img :src="event.image_url" :alt="'Event: ' + event.name" class="img_max" />   
                            </div>
                            <div class="col-md-8">
                                <h4 class="event_name">{{ event.name }}</h4>
                                <p class="event_dates"><span>Location</span> | <span v-if="isMultiDay(event)">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ event.start_date | moment("MMMM D", timezone)}}</span></p>
                                <div class="event_desc" v-html="event.description_short"></div>
                                <router-link :to="{ name: 'eventDetails', params: { id: event.slug }}">
                                    <p class="event_link">Event Details <i class="fas fa-angle-double-right"></i></p>
                                </router-link>
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
                    var events = _.orderBy(this.processedEvents, function (o) { return o.end_date });
                    var showEvents = [];
                    var month_heading = "";
                    _.forEach(events, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            console.log("Month Heading ", month_heading )
                            var end_month = moment.tz(value.end_date, this.timezone).format("MM-YYYY");
                            console.log("End Month ", end_month)
                            
                            if (month_heading == end_month){
                                value.month = "";
                                value.show_month = false;
                            } else {
                                value.month = moment.tz(value.end_date, this.timezone).format("MMMM YYYY");
                                month_heading = end_month;
                                value.show_month = true;
                            }

                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "http://placehold.it/400x400";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://placehold.it/400x400";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showEvents.push(value);
                        }
                    });

                    return events
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
