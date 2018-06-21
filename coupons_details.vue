<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Coupons</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div v-if="currentCoupon">
                        <div class="row">
                            <div class="col-md-8">
                                <p v-if="currentCoupon.promotionable_type == 'Property'" class="event_store_name">{{ property.name }}</p>
                                <p v-else class="event_store_name">{{ currentCoupon.store.name }}</p>
                                <h4 class="event_name">{{ currentCoupon.name }}</h4>
                                <p class="event_dates">
                                    <span v-if="isMultiDay(currentCoupon)">{{ currentCoupon.start_date | moment("MMMM D", timezone)}} to {{ currentCoupon.end_date | moment("MMMM D", timezone)}}</span>
                                    <span v-else>{{ currentCoupon.start_date | moment("MMMM D", timezone)}}</span>
                                </p>
                                <div class="event_desc event_details" v-html="currentCoupon.rich_description"></div>
                            </div>
                            <div class="col-md-4">
                                <a :href="currentCoupon.image_url" :data-lightbox="currentCoupon.name">
                                    <img v-lazy="currentCoupon.image_url" :alt="'Promotion: ' + currentCoupon.name" class="margin_20 img_max"/>    
                                </a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row margin_30">
                                    <div class="col-md-12">
                                        <router-link to="/promotions">
                    		                <div class="animated_btn pull-left">Back to Sales & Promotions</div>    
                    		            </router-link>    
                                    </div>
                                </div>
                                <social-sharing v-if="currentCoupon" :url="shareURL(currentCoupon.slug)" :title="currentCoupon.title" :description="currentCoupon.body" :quote="truncate(currentCoupon.body)" :twitter-user="siteInfo.twitterHandle" :media="currentCoupon.image_url" inline-template>
                                    <div class="social_share margin_60">
                                        <network network="facebook">
                                            <i class="fab fa-facebook"></i>
                                        </network>
                                        <network network="twitter">
                                            <i class="fab fa-twitter"></i>
                                        </network>
                                        <network network="email">
                                            <i class="fas fa-envelope"></i>
                                        </network>
                                    </div>
                                </social-sharing>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
              
<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load"], function (Vue, Vuex, moment, tz, VueMoment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("coupons-details-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.handleButton();
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedPromos'
                ]),
                promoList: function promos() {
                    var vm = this;
                    var showPromos = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529516445000/cerritos.png";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529516445000/cerritos.png";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
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
                },
                handleButton: function () {
                    if(!this.moreEventsFetched){
                        this.moreEvents = this.promoList;
                        this.events = this.moreEvents.splice(0, 3);
                        this.moreEventsFetched = true;
                    } else {
                        var nextEvents = this.moreEvents.splice(0, 3);
                        // Add 3 more posts to posts array
                        var vm = this;
                        _.forEach(nextEvents, function(value, key) {
                            vm.events.push(value);
                        });
                    }
                    if(this.promoList.length === 0){
                        this.noMoreEvents = true
                        this.noEvents = true
                    } else {

                    }
                }
            }
        });
    });
</script>