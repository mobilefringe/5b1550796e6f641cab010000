<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>My Basket</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row margin_40">
        		        <div class="col-md-6 clearfix">
        		            <router-link to="/coupons">
        		                <div class="animated_btn basket_btn">
        		                    Back to Coupons
        		                </div>    
        		            </router-link>
        		        </div>
        		        <div class="col-md-6 clearfix">
        		            <router-link to="/coupon-basket">
        		                <div class="animated_btn coupon_btn">
        		                    Print Coupons
        		                </div>    
        		            </router-link>
        		        </div>
        		    </div>
                    <div class="row">
                        <div v-for="(item, index) in couponList" :key="item.id" v-on:remove="couponList.splice(index, 1)" class="col-md-6 col-sm-6 col-xs-12">
                            <div :id="item.id" class="row coupon_container">
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <div class="coupon_img">
                                        <!--<img class="img_max" :src="item.image_url" alt="" />-->
                                        <img class="img_max" src="https://placehold.it/200" />
                                    </div>
                                </div>	
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <div class="coupon_content">
                                        <i v-on:click="$emit(\'remove\')" class="fas fa-times"></i>
                                        <div>
                                            <p>Store Name</p>
                                        	<h4>{{ item.name_short }}</h4>
                                        	<p class="coupon_dates"><span v-if="isMultiDay(item)">{{ item.start_date | moment("MM/DD/YYY", timezone)}} - {{ item.end_date | moment("MM/DD/YYY", timezone)}}</span><span v-else>{{ item.start_date | moment("MM/DD/YYY", timezone)}}</span></p>
                                            <router-link :to="{ name: 'couponDetails', params: { id: item.slug }}">
                                                <p class="event_link">Coupon Details <i class="fas fa-angle-double-right"></i></p>
                                            </router-link>
                                        </div>
                                    </div>
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
    define(["Vue", "vuex", "jquery", 'js-cookie', "moment", "moment-timezone", "vue-moment", "vue-lazy-load"], function (Vue, Vuex, $, Cookies, moment, tz, VueMoment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("coupon-basket-component", {
            template: template, // the variable template will be injected,
            props: ['selected'],
            data: function () {
                return {
                    dataLoaded: false,
                    selectedCoupons: null,
                    events: [],
                    moreEvents: [],
                    moreEventsFetched: false,
                    noMoreEvents: false,
                    noEvents: false
                }
            },
            created (){
                this.loadData().then(response => {
                    console.log("Cookies Basket ", Cookies.get('coupon_ids'))
                    this.selectedCoupons = Cookies.get('coupon_ids');
                    console.log(this.selected)
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
                    _.forEach(this.selectedCoupons, function(value, key) {
                        console.log(value)
                        // var today = moment.tz(this.timezone).format();
                        // var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        // if (today >= showOnWebDate) {
                        //     if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                        //         value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529516445000/cerritos.png";
                        //     }
                            
                        //     if (_.includes(value.image_url, 'missing')) {
                        //         value.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529516445000/cerritos.png";
                        //     }
                            
                        //     value.name_short = _.truncate(value.name, { 'length': 30, 'separator': ' ' });
                            
                        //     value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
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
                isMultiDay(item) {
                    var timezone = this.timezone
                    var start_date = moment(item.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(item.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                },
                selectedCoupon(item) {
                    console.log(item)    
                }
            }
        });
    });
</script>