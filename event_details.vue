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
                            <h4 class="event_name">{{ currentPromo.name }}</h4>
                            <p class="event_dates">
                                <span v-if="isMultiDay(currentPromo)">{{ currentPromo.start_date | moment("MMMM D", timezone)}} to {{ currentPromo.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else>{{ currentPromo.start_date | moment("MMMM D", timezone)}}</span>
                                <br>
                                Location
                            </p>
                            <div class="event_desc" v-html="currentPromo.rich_description"></div>
                            <div class="row margin_30">
                                <div class="col-md-12">
                                    <router-link to="/promotions">
                		                <div class="animated_btn pull-left">Back to Sales & Promotions</div>    
                		            </router-link>    
                                </div>
                            </div>
                            <social-sharing v-if="currentPromo" :url="shareURL(currentPromo.slug)" :title="currentPromo.title" :description="currentPromo.body" :quote="truncate(currentPromo.body)" :twitter-user="siteInfo.twitterHandle" :media="currentPromo.image_url" inline-template>
                                <div class="social_share">
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
                        <div class="col-md-4">
                            <img v-lazy="currentPromo.image_url" :alt="'Promotion: ' + currentPromo.name" class="margin_20 img_max"/>    
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<!--<template>-->
    <div> <!-- Without an outer container div this component template will not render -->
<!--        <loading-spinner v-if="!dataLoaded"></loading-spinner>-->
<!--        <transition name="fade">-->
<!--            <div v-if="dataLoaded" v-cloak>-->
<!--                <div class="inside_header_background">-->
<!--                    <div class="main_container">-->
<!--                        <h2>Events</h2>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="main_container mobile_padding margin_30">-->
<!--                    <div class="details_row">-->
<!--                        <div class="details_col_3 hidden_phone">-->
<!--                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    -->
<!--                        </div>-->
<!--                        <div class="details_col_9" v-if="currentEvent">-->
<!--                            <router-link to="/events-and-promotions">-->
<!--                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>-->
<!--                            </router-link>-->
<!--                            <img v-lazy="currentEvent.image_url" :alt="'Event: ' + currentEvent.name" class="margin_20 img_max"/>-->
<!--                            <h3 class="promo_name">{{ currentEvent.name }}</h3>-->
<!--                            <p class="promo_store_name">-->
<!--                                <router-link v-if="currentEvent.eventable_type == 'Store'" :to="'/stores/'+ currentEvent.store.slug">-->
<!--                                    {{ currentEvent.store.name }}-->
<!--                                </router-link>-->
<!--                                <span v-else>{{ property.name }}</span>-->
<!--                                <span>| </span>-->
<!--                                <span v-if="isMultiDay(currentEvent)" class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}} to {{ currentEvent.end_date | moment("MMMM D", timezone)}}</span>-->
<!--                                <span v-else class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}}</span>-->
<!--                            </p>-->
<!--                            <div class="promo_desc" v-html="currentEvent.rich_description"></div>-->
<!--                            <social-sharing v-if="currentEvent" :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.body" :quote="truncate(currentEvent.body)" :twitter-user="siteInfo.twitterHandle" :media="currentEvent.image_url" inline-template>-->
<!--                                <div class="social_share">-->
<!--                                    <p>Share</p>-->
<!--                                    <network network="facebook">-->
<!--                                        <i class="fab fa-facebook"></i>-->
<!--                                    </network>-->
<!--                                    <network network="twitter">-->
<!--                                        <i class="fab fa-twitter"></i>-->
<!--                                    </network>-->
<!--                                </div>-->
<!--                            </social-sharing>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </transition>-->
<!--    </div>-->
<!--</template>-->

<script>
	define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load",  "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, VueLazyload, SocialSharing, site) {
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
		return Vue.component("event-details-component", {
			template: template, // the variable template will be injected,
			props: ['id'],
			data: function() {
				return {
					dataLoaded: false,
					currentEvent: null,
				    siteInfo: site,
				}
			},
			created() {
				this.$store.dispatch("getData", "events").then(response => {
					this.currentEvent = this.findEventBySlug(this.id);
					if (this.currentEvent === null || this.currentEvent === undefined) {
						this.$router.replace({ name: '404' });
					}
					this.dataLoaded = true;
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
			},
			computed: {
				...Vuex.mapGetters([
					'property',
					'timezone',
					'processedEvents',
					'findEventBySlug',
				])
			},
			methods: {
				isMultiDay(currentEvent) {
					var timezone = this.timezone
					var start_date = moment(currentEvent.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentEvent.end_date).tz(timezone).format("MM-DD-YYYY")
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
                },
			}
		});
	});
</script>