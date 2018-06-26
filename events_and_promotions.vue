<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Events & Promotions</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row margin_60">
                        <div class="col-md-12">
                            <!-- PROMOTIONS -->
                            <b-card no-body class="mb-1 inside_page_toggle">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-btn block @click="togglePromos = !togglePromos" :aria-expanded="togglePromos ? 'true' : 'false'" aria-controls="togglePromotions">
                                        Promotions
                                        <i v-if="togglePromos"  class="fa fa-minus f"></i>
                                        <i v-else  class="fa fa-plus"></i>
                                    </b-btn>
                                </b-card-header>
                                <b-collapse v-if="promoList.length >= 1" v-for="promo in promoList" v-model="togglePromos" role="tabpanel" id="togglePromotions" class="accordion_body">
                                    <b-card-body>
                                        <div v-if="promoList" v-for="item in promoList" :key="item.id">
                                            <div class="row event_container">
                                                <div class="col-sm-6 col-md-4">
                                                    <img :src="item.image_url" :alt="'Promotion: ' + item.name" class="event_img img_max" />   
                                                </div>
                                                <div class="col-sm-6 col-md-8">
                                                    <p v-if="item.promotionable_type == 'Property'" class="event_store_name">{{ property.name }}</p>
                                                    <p v-else class="event_store_name">
                                                        <router-link :to="{ name: 'storeDetails', params: { id: item.store.slug }}">
                                                            {{ item.store.name }}
                                                        </router-link>        
                                                    </p>
                                                    <h4 class="event_name">{{ item.name }}</h4>
                                                    <p class="event_dates"><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                                                    <div class="event_desc" v-html="item.description_short"></div>
                                                    <router-link :to="{ name: 'promotionDetails', params: { id: item.slug }}">
                                                        <p class="event_link">Promotion Details <i class="fas fa-angle-double-right"></i></p>
                                                    </router-link>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <p>Sorry, there are no Promotions posted at this time. Please check back soon!</p>    
                                                </div>
                                            </div>
                                        </div>
                                    </b-card-body>
                                </b-collapse>
                                <b-collapse v-if="promoList.length == 0" v-model="togglePromos" role="tabpanel" id="togglePromotions" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p>Sorry. There are no Promotions posted at this time. Please check back soon!</p>
                                            </div>
                                        </div>
                                        <hr class="promo_separator" />
                                    </b-card-body>
                                </b-collapse>
                            </b-card>
                                                        <!-- EVENTS -->
                            <b-card no-body class="mb-1 inside_page_toggle">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-btn block @click="toggleEvents = !toggleEvents" :aria-expanded="toggleEvents ? 'true' : 'false'" aria-controls="toggleEvents">
                                        Events
                                        <i v-if="toggleEvents"  class="fa fa-minus f"></i>
                                        <i v-else  class="fa fa-plus"></i>
                                    </b-btn>
                                </b-card-header>
                                <b-collapse v-if="eventList.length >= 1" v-for="event in eventList" v-model="toggleEvents" role="tabpanel" id="toggleEvents" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-5" v-if="">
                                                <img :src="event.image_url" :alt="'Event: ' + event.name" class="max_img" />
                                            </div>
                                            <div class="col-md-7">
                                                <h3 class="promo_name">{{event.name}}</h3>
                                                <p class="promo_store_name">
                                                    <router-link v-if="event.eventable_type == 'Store'" :to="'/stores/'+ event.store.slug">
                                                        {{ event.store.name }}
                                                    </router-link>
                                                    <span v-else>{{ property.name }}</span>
                                                    <span>| </span>
                                                    <span v-if="isMultiDay(event)" class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span>
                                                    <span v-else class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}}</span>
                                                </p>
                                                <div class="promo_desc" v-html="event.description_short"></div>
                                                <router-link :to="'/events/'+ event.slug" >
						                            <i class="fa fa-caret-right"></i> <span class="read_more">View Event Details</span>
				                                </router-link>
                                            </div>
                                        </div>
                                        <hr class="promo_separator" />
                                    </b-card-body>
                                </b-collapse>
                                <b-collapse v-if="eventList.length == 0" v-model="toggleEvents" role="tabpanel" id="toggleEvents" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p>Sorry, there are no Events posted at this time. Please check back soon!</p>
                                            </div>
                                        </div>
                                        <hr class="promo_separator" />
                                    </b-card-body>
                                </b-collapse>
                            </b-card>
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
        return Vue.component("events-and-promotions-component", {
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
