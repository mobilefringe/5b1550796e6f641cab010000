<template>
    <div> <!-- Without an outer container div this component template will not render -->
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
                    <div class="row" v-if="currentPromo">
                        <div class="col-md-8">
                            <router-link to="/events-and-promotions">
                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>
                            </router-link>
                            <img v-lazy="currentPromo.image_url" :alt="'Promotion: ' + currentPromo.name" class="margin_20 img_max"/>
                            <h3 class="promo_name">{{ currentPromo.name }}</h3>
                            <p class="promo_store_name">
                                <router-link v-if="currentPromo.promotionable_type == 'Store'" :to="'/stores/'+ currentPromo.store.slug">{{ currentPromo.store.name }}</router-link>
                                <span v-else>{{ property.name }}</span>
                                <span>| </span>
                                <span v-if="isMultiDay(currentPromo)" class="promo_date">{{ currentPromo.start_date | moment("MMMM D", timezone)}} to {{ currentPromo.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else class="promo_date">{{ currentPromo.start_date | moment("MMMM D", timezone)}}</span>
                            </p>
                            <div class="promo_desc" v-html="currentPromo.rich_description"></div>
                            <social-sharing v-if="currentPromo" :url="shareURL(currentPromo.slug)" :title="currentPromo.title" :description="currentPromo.body" :quote="truncate(currentPromo.body)" :twitter-user="siteInfo.twitterHandle" :media="currentPromo.image_url" inline-template>
                                <div class="social_share">
                                    <p>Share</p>
                                    <network network="facebook">
                                        <i class="fab fa-facebook"></i>
                                    </network>
                                    <network network="twitter">
                                        <i class="fab fa-twitter"></i>
                                    </network>
                                </div>
                            </social-sharing>
                        </div>
                        <div class="col-md-4">
                            
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load",  "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, VueLazyload, SocialSharing, site) {
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
        return Vue.component("promo-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function() {
                return {
                    dataLoaded: false,
                    currentPromo: null,
                    siteInfo: site
                }
            },
            created() {
				this.$store.dispatch("getData", "promotions").then(response => {
					this.currentPromo = this.findPromoBySlug(this.id);
					if (this.currentPromo === null || this.currentPromo === undefined) {
						this.$router.replace({ path: '/promotions' });
					}
				// 	this.$breadcrumbs[1].meta.breadcrumb = this.currentPromo.name
					this.dataLoaded = true;
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
			},
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findPromoBySlug'
                ])
            },
            methods: {
				isMultiDay(currentPromo) {
					var timezone = this.timezone
					var start_date = moment(currentPromo.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentPromo.end_date).tz(timezone).format("MM-DD-YYYY")
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
