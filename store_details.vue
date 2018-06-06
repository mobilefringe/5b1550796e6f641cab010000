<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>{{ currentStore.name }}</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <img class="store_details_image center-block" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
                            <div v-if="currentStore.phone">
                                <a class="store_details_phone" :href="'tel:' + currentStore.phone">{{ currentStore.phone }}</a>    
                            </div>
                            <div v-if="currentStore.website">
                                <a class="store_details_phone" :href="'http://' + currentStore.website" target="_blank">Website</a>
                            </div>
                            <ul v-if="storeHours" class="store_details_hours_list">
                                <li v-for="hour in storeHours" :class="{ today: hour.todays_hours }">
                                    <div v-if="!hour.is_closed">
                                        <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}
                                    </div>
                                    <div v-else>
                                        <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>CLOSED
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-8">
                            <div id="map" class="margin_20">
                                <svg-map  ref="svgmapRef"  @updateMap="updateSVGMap"  :svgMapUrl="getSVGurl" ></svg-map>
                            </div>
                            <div class=" margin_30 store_details_desc" v-html="currentStore.rich_description"></div>
                            <div v-if="this.currentStore.promotions">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="togglePromos = !togglePromos" :aria-expanded="togglePromos ? 'true' : 'false'" aria-controls="togglePromotions">
                                            Promotions
                                            <i v-if="togglePromos"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="promo in storePromotions" v-model="togglePromos" role="tabpanel" id="togglePromotions" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-5" v-if="">
                                                    <img :src="promo.image_url" :alt="'Promotion: ' + promo.name" />
                                                </div>
                                                <div class="col-md-7">
                                                    <h3 class="promo_name">{{promo.name}}</h3>
                                                    <p class="promo_date" v-if="isMultiDay(promo)">
                        							    {{ promo.start_date | moment("MMMM D", timezone)}} to {{ promo.end_date | moment("MMMM D", timezone)}}
                                                    </p>
                                                    <p class="promo_date" v-else>{{ promo.start_date | moment("MMMM D", timezone)}}</p>
                                                    <div class="promo_desc" v-html="promo.description_short"></div>
                                                    <router-link :to="'/promotions/'+ promo.slug" >
							                            <i class="fa fa-caret-right"></i> <span class="read_more">View Promotion Details</span>
					                                </router-link>
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                            <div v-if="this.currentStore.jobs">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="toggleJobs = !toggleJobs" :aria-expanded="toggleJobs ? 'true' : 'false'" aria-controls="toggleJobs">
                                            Jobs
                                            <i v-if="toggleJobs"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="job in storeJobs" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <h3 class="promo_name">{{job.name}}</h3>
                                                    <p class="promo_date" v-if="isMultiDay(job)">
                        							    {{ job.start_date | moment("MMMM D", timezone)}} to {{ job.end_date | moment("MMMM D", timezone)}}
                                                    </p>
                                                    <p class="promo_date" v-else>{{ job.start_date | moment("MMMM D", timezone)}}</p>
                                                    <router-link :to="'/jobs/'+ job.slug" >
							                            <i class="fa fa-caret-right"></i> <span class="read_more">View Job Details</span>
					                                </router-link>
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
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "jquery", "bootstrap-vue"], function (Vue, Vuex, moment, $, BootstrapVue) {
        Vue.use(BootstrapVue);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function () {
                return {
                    dataLoaded: false,
                    currentStore: null,
                    storeHours: null,
                    storePromotions: null,
                    togglePromos: false,
                    storeJobs: null,
                    toggleJobs: false,
                    map: null
                }
            },
            props:['id'],
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.updateCurrentStore(this.id);
                });
            },
            watch: {
                $route: function () {
                    this.updateCurrentStore(this.$route.params.id);
                },
                currentStore: function () {
                    if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.store_front_url_abs = "http://placehold.it/600x600"
                    }
                    
                    var vm = this;
                    var storeHours = [];
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        hours = vm.findHourById(value)
                        today = moment().day();
                        if( today == hours.day_of_week ){
                            hours.todays_hours = true;
                        } else {
                            hours.todays_hours = false;
                        }
                        storeHours.push(hours);
                    });
                    this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
                
                    var vm = this;
                    var temp_promo = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        
                        if (_.includes(current_promo.image_url, 'missing')) {
                            current_promo.image_url = "http://placehold.it/1560x800/757575";
                        }
                        current_promo.description_short = _.truncate(current_promo.description, { 'length': 150, 'separator': ' ' });

                        temp_promo.push(current_promo);
                    }); 
                    this.storePromotions = temp_promo;
                    this.togglePromos = true;
                    
                    var vm = this;
                    var temp_job = [];
                    _.forEach(this.currentStore.jobs, function(value, key) {
                        var current_job = vm.findJobById(value);
                        temp_job.push(current_job);
                    }); 
                    this.storeJobs = temp_job;
                    this.toggleJobs = true;
                },
                // map : function (){
                    
                //         var vm = this;
                //         setTimeout(function () {
                //             vm.dropPin();
                //         }, 500);
                   
                // }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'stores',
                    'findStoreBySlug',
                    'findCategoryById',
                    'findHourById',
                    'findPromoById',
                    'findJobById'
                ]),
                storeCategory() {
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
                },
                getSVGurl () {
                    return "https://www.mallmaverick.com" + this.property.svgmap_url;
                },
                svgMapRef () {
                    return _.filter(this.$children, function(o) { return (o.$el.className == "svg-map") })[0];
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData","jobs")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore(id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined) {
                        this.$router.replace({ name: 'stores' });
                    }
                },
                updateSVGMap (map) {
                    this.map = map;
                    this.dropPin();
                },
                dropPin () {
                    this.svgMapRef.addMarker(this.currentStore, '//codecloud.cdn.speedyrails.net/sites/589e308f6e6f641b9f010000/image/png/1484850466000/show_pin.png');
                    this.svgMapRef.setViewBox(this.currentStore)
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
