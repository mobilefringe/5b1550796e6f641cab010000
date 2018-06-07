<template>
    <div><!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="home_banner_container">
                    <slick ref="slick" :options="slickOptions">
                        <div v-if="homeBanners" v-for="banner in homeBanners">
                            <a v-if="banner.url" :href="banner.url" class="">
                                <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                                <!--<div class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x500)' }"></div>-->
                            </a>
                            <div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                            <!--<div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x500)' }"></div>-->
                        </div>
                    </slick>
                </div>
                <div class="main_container">
                    <h2>Events & Promotions</h2>
                    <div class="row margin_40">
                        <div class="col-md-4" v-if="featuredItems" v-for="item in featuredItems">
                            <div class="feature_item_container">
                    	        <router-link class="tile" :to="{ name: 'couponDetails', params: { id: item.slug }}">
                        			<img :src="item.image_url" :alt="item.name">
                    				<div class="details">
            					    	<span class="title">
            					            <h3>{{ item.name }}</h3>
        					            </span>
                					    <span class="info">
            					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
            					            <p>View Promotion Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
        					            </span>
                    				</div>
                        		</router-link>
                    	    </div>
                        </div>
                    </div>
                    <h2 class="center">In Our Feed</h2>
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <div class="insta-feed-container">
                                <div class="insta-feed-image " v-for="(item, index) in instaFeed">
                                    <a :href="item.link" target="_blank">
                                        <img :src="item.images.standard_resolution.url" :alt="item.id"/>
                                        <!--<img :src="item.images.thumbnail.url" :alt="item.id"/>-->
                                        <div class="insta_content">
                                            <p class="insta_caption">{{ item.caption.text }}</p>
                                            <p class="insta_user">@{{ item.user.username }}</p>
                                            <i class="insta_icon fab fa-instagram"></i>
                                        </div>
                                    </a>
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
    define(["Vue", "vuex", "vue!vue-slick"], function (Vue, Vuex, slick) {
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: false,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1000
                    },
                    instaFeed: null
                }
            },
            created(){
                this.loadData().then(response => {
                    var socialFeed = response[3].data;
                    var social_feed = socialFeed.social.instagram;
                    this.instaFeed = _.slice(social_feed, [0], [6]);
                    this.instaFeed.map(insta => {
                        if(insta.caption != null){
                            insta.caption.text = _.truncate(insta.caption.text, { 'length': 60, 'separator': ' ' });
                        }
                    });
                    
                    this.dataLoaded = true;  
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'processedPromos',
                    'processedEvents'
                ]),
                homeBanners() {
                    var banners = [];
                    _.forEach(this.$store.state.banners, function (value, key) {
                        var today = new Date();
                        var start = new Date (value.start_date);
                        if (start <= today){
                            if (value.end_date){
                                var end = new Date (value.end_date);
                                if (end >= today){
                                    banners.push(value);  
                                }
                            } else {
                                banners.push(value);
                            }
                        }
                    });
                    return banners
                },
                featuredItems() {
                    var promotions = this.processedPromos;
                    console.log(promotions)
                    var events = this.processedEvents;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData", "events"), this.$store.dispatch('LOAD_PAGE_DATA', {url: "https://peninsula.mallmaverick.com/api/v4/peninsula/social.json"})]);
                        return results;
                    } catch(e) {
                        console.log("Error loading data: " + e.message);    
                    }
                }
            }
        })
    })
</script>