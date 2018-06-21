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
                            <div class="col-md-2">
                                <!--<img v-lazy="currentCoupon.image_url" :alt="'Promotion: ' + currentCoupon.name" class="margin_20 img_max"/>    -->
                                <img src="https://placehold.it/500"  class="margin_20 img_max"/>    
                            </div>
                            <div class="col-md-10">
                                <!--<p v-if="currentCoupon.promotionable_type == 'Property'" class="event_store_name">{{ property.name }}</p>-->
                                <!--<p v-else class="event_store_name">{{ currentCoupon.store.name }}</p>-->
                                <h4 class="event_name">{{ currentCoupon.name }}</h4>
                                <p class="event_dates">
                                    <span v-if="isMultiDay(currentCoupon)">{{ currentCoupon.start_date | moment("MM/DD/YYY", timezone)}} to {{ currentCoupon.end_date | moment("MM/DD/YYY", timezone)}}</span>
                                    <span v-else>{{ currentCoupon.start_date | moment("MM/DD/YYY", timezone)}}</span>
                                </p>
                                <img :src="currentCoupon.promo_image_url_abs" :alt="currentCoupon.name" />
                                <div class="event_desc event_details" v-html="currentCoupon.rich_description"></div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <router-link to="/promotions">
                    		                <div class="animated_btn pull-left">Add To Basket</div>    
                    		            </router-link>  
                    		            <router-link to="/promotions">
                    		                <div class="animated_btn pull-left">Print Coupon</div>    
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
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "lightbox", "vue-lazy-load",  "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, Lightbox, VueLazyload, SocialSharing, site) {
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
        return Vue.component("coupon-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function() {
                return {
                    dataLoaded: false,
                    // currentCoupon: null
                    currentCoupon : {
                        "id" : "117442",
                        "name" : "20% Off Your Entire Purchase",
                        "description" : " First time users only. Must be 18 or older. Valid at Peninsula Shopping Center location only. One coupon per person. Not valid with any other offer. Restrictions may appy. See store for details. Coupon must be presented at time of purchase or service. Expires 8-15-18 ",
                        "rich_description" : "<p>First time users only. Must be 18 or older. Valid at Peninsula Shopping Center location only. One coupon per person. Not valid with any other offer. Restrictions may appy. See store for details. Coupon must be presented at time of purchase or service. Expires 8-15-18</p>",
                        "rich_description_2" : "null",
                        "promotionable_id" : "29448",
                        "promotionable_type" : "Store",
                        "start_date" : "2018-05-23T07:00:00Z",
                        "end_date" : "2018-08-16T06:59:59Z",
                        "no_end_date" : "false",
                        "show_on_web_date" : "2018-04-18T07:00:00Z",
                        "created_at" : "2018-04-18T16:46:28Z",
                        "updated_at" : "2018-05-18T18:39:29Z",
                        "promo_image_url" : "/promo_images/original/missing.png",
                        "promo_image_url_abs" : "https://res.cloudinary.com/mallmaverick/image/upload/v1524869884/u6o0fwlhkbqsz4ynl6fx.jpg",
                        "promo_image_updated_at" : "null",
                        "slug" : "cerritos-cerritos-towne-center-bay-club-bay-club",
                        "name_2" : "null",
                        "description_2" : "null",
                        "promo_image2_url" : "/promo_image2s/original/missing.png",
                        "promo_image2_url_abs" : "/original/missing.png",
                        "promo_image2_updated_at" : "null",
                        "alt_url" : "null",
                        "tags" : [ ],
                        "is_featured" : false,
                        "feature_item_index" : 0,
                        "pending" : false,
                        "is_special_promo" : false,
                        "property_id" : 177
                    },
                    siteInfo: site
                }
            },
            created() {
				// this.$store.dispatch("getData", "coupons").then(response => {
				// 	this.currentCoupon = this.findPromoBySlug(this.id);
				// 	if (this.currentCoupon === null || this.currentCoupon === undefined) {
				// 		this.$router.replace({ path: '/coupons' });
				// 	}
				// 	this.$breadcrumbs[2].meta.breadcrumb = this.currentCoupon.name
					this.dataLoaded = true;
				// }, error => {
				// 	console.error("Could not retrieve data from server. Please check internet connection and try again.");
				// });
			},
			watch: {
                // currentCoupon : function (){
                //     if(this.currentCoupon != null) {
                //         if (this.currentCoupon.promotionable_type === "Store"){
                //             if  (_.includes(this.currentCoupon.promo_image_url_abs, 'missing')) {
                //                 this.currentCoupon.image_url = this.currentCoupon.store.store_front_url_abs; 
                //             }
                //         } else {
                //             if  (_.includes(this.currentCoupon.promo_image_url_abs, 'missing')) {
                //                 this.currentCoupon.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529532181000/promoplaceholder2@2x.png";    
                //             }
                //         }
                //     }
                // }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findPromoBySlug'
                ])
            },
            methods: {
				isMultiDay(currentCoupon) {
					var timezone = this.timezone
					var start_date = moment(currentCoupon.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentCoupon.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
				truncate(val_body) {
                    var truncate = _.truncate(val_body, { 'length': 99, 'separator': ' ' });
                    return truncate;
                },
				shareURL(slug) {
                    var share_url = window.location.href
                    return share_url
                }
			}
        });
    });
</script>