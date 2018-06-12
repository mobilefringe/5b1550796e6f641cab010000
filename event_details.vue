<template>
    <div> <!-- Without an outer container div this component template will not render -->
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
                    <div class="row" v-if="currentEvent">
                        <div class="col-md-8">
                            <h4 class="event_name">{{ currentEvent.name }}</h4>
                            <p class="event_dates">
                                <span v-if="isMultiDay(currentEvent)">{{ currentEvent.start_date | moment("MMMM D", timezone)}} to {{ currentEvent.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else>{{ currentEvent.start_date | moment("MMMM D", timezone)}}</span>
                                <br>
                                Location
                            </p>
                            <div class="event_desc" v-html="currentEvent.rich_description"></div>
                            <div class="row margin_30">
                                <div class="col-md-12">
                                    <router-link to="/promotions">
                		                <div class="animated_btn pull-left">Back to Events</div>    
                		            </router-link>    
                                </div>
                            </div>
                            <social-sharing v-if="currentEvent" :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.body" :quote="truncate(currentEvent.body)" :twitter-user="siteInfo.twitterHandle" :media="currentEvent.image_url" inline-template>
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
                            <img v-lazy="currentEvent.image_url" :alt="'Promotion: ' + currentEvent.name" class="margin_20 img_max"/>    
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
    .event_desc {
        margin-bottom: 60px;
    }
</style>

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
					this.$breadcrumbs[1].meta.breadcrumb = this.currentEvent.name
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