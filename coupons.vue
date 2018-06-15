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
                    <div class="row">
                        <div v-for="item in couponList" class="col-md-6 col-sm-6 col-xs-12">
                            <div class="row" >
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <div class="product-front">
                                        <img :src="item.image_url" alt="" />
                                    </div>
                                </div>	
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <img src="//codecloud.cdn.speedyrails.net/sites/59d7b1c56e6f64669e8d0000/image/png/1508346683000/Basket@2x.png" class="basket_image add-to-basket" alt="" is_in_cart="false">
                            	    <!--<p>{{store_name}}</p>-->
                                	<h4>{{ item.name }}</h4>
                                	<p class="event_dates"><span>Location</span> | <span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                                    <a class="add-cart-large" :href="/online_offers/+ item.slug">View Details</a>                          
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
              
<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load", "json!coupons.json"], function (Vue, Vuex, moment, tz, VueMoment, VueLazyload, coupons) {
        Vue.use(VueLazyload);
        return Vue.component("coupons-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                    couponsFullList: coupons,
                    events: [],
                    moreEvents: [],
                    moreEventsFetched: false,
                    noMoreEvents: false,
                    noEvents: false
                }
            },
            created (){
                this.loadData().then(response => {
                    console.log(this.couponsFullList)
                    // this.handleButton();
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedPromos'
                ]),
                couponList: function coupons() {
                    var vm = this;
                    var showCoupons = [];
                    _.forEach(this.couponsFullList, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "http://placehold.it/400x400";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://placehold.it/400x400";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showCoupons.push(value);
                        }
                    });
                    var sortedCoupons = _.orderBy(showCoupons, [function(o) { return o.end_date; }]);
                    
                    return sortedCoupons;    
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
                // handleButton: function () {
                //     if(!this.moreEventsFetched){
                //         this.moreEvents = this.promoList;
                //         this.events = this.moreEvents.splice(0, 3);
                //         this.moreEventsFetched = true;
                //     } else {
                //         var nextEvents = this.moreEvents.splice(0, 3);
                //         // Add 3 more posts to posts array
                //         var vm = this;
                //         _.forEach(nextEvents, function(value, key) {
                //             vm.events.push(value);
                //         });
                //     }
                //     if(this.promoList.length === 0){
                //         this.noMoreEvents = true
                //         this.noEvents = true
                //     } else {

                //     }
                // }
            }
        });
    });
</script>
