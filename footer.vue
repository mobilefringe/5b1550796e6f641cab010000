<template>
    <footer v-if="dataLoaded" v-cloak>
        <section id="footer">
            <div class="main_container">
                <div class="row newsletter_signup">
                    <div class="col-md-12 center-block">
                        <p>Sign up to receive the latest deals and news!</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4 footer_hours">
                    <p class="footer_heading">MANAGEMENT OFFICE HOURS</p>
                    <img src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1525870162000/clock.png" class="clock_icon" alt="">
                    <div class="footer_hours_container">
                        <p>
                            Monday to Friday: <br/>
                            <span v-for="hour in weekdayHours">
                                {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                            </span>
                        </p>
                        <p>
                            Saturday:<br/>
                            <span v-for="hour in saturdayHours">
                                {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                            </span>
                        </p>
                        <p>
                            Sunday:<br/>  
                            <span v-for="hour in sundayHours">
                                {{hour.open_time | moment("h:mm a", timezone)}} - {{hour.close_time | moment("h:mm a", timezone)}}    
                            </span>
                        </p>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4 footer_newsletter">
                    <p class="footer_heading">NEWSLETTER SUBSCRIPTION</p>
                    <label for="emailAddress" class="accessibility">Enter Email Address</label>
                    <input id="emailAddress" v-model="newsletter_email" type="text" placeholder="Susbcribe to Newsletter" class="newsletter_control" required />
                    <button @click="newsletterRoute" class="newsletter_btn animated_btn">Subscribe</button>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 footer_insta">
                    <a class="pull-right insta_view_more" :href="siteInfo.instagramURL" target="_blank">View More <i class="fa fa-caret-right"></i></a>
                    <p class="footer_heading">INSTAGRAM</p>
                    <div class="insta-feed-container">
                        <div class="insta-feed-image " v-for="(item, index) in instaFeed">
                            <a :href="item.link" target="_blank">
                                <img :src="item.images.thumbnail.url" :alt="item.id"/>
                            </a>
                        </div>
                    </div> 
                </div>
            </div>
        </section>
        <section class="footer_privacy ">
            <div class="main_container row">
                <div class="col-sm-4 col-md-6">
                    <p class="footer_text">&#169; {{copyright_year}} {{property.name}}</p>
                    <p class="footer_text">Powered by <a href="https://www.mallmaverick.com/" target="_blank">Mall Maverick</a></p>
                </div>
                <div class="col-sm-8 col-md-6">
                    <p class="footer_text"><a :href="siteInfo.googleMapsURL" target="_blank">{{ getPropertyAddress }}</a></p> 
                    <p class="footer_text"><a :href="'tel:' +  property.contact_phone">{{ property.contact_phone }}</a> | <a href="/pages/milton-privacy-policy">Privacy Policy</a> | <router-link to="/jobs" exact>Jobs</router-link> | <a :href="siteInfo.propertyManagementURL" target="_blank">{{ siteInfo.propertyManagementName }}</a></p>
                </div>
            </div>
        </section>
    </footer>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "json!site.json"], function (Vue, Vuex, moment, tz, VueMoment, site) {
        return Vue.component("footer-component", {
            template: template, // the variable template will be injected,
            data: function data() {
                return {
                    dataLoaded: false,
                    instaFeed: null,
                    siteInfo: site,
                    newsletter_email: ""
                }
            },
            created () {
                this.loadData().then(response => {
                    var socialFeed = response[0].data;
                    var social_feed = socialFeed.social.instagram;
                    this.instaFeed = _.slice(social_feed, [0], [14]);
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
                    'getPropertyHolidayHours'
                ]),
                weekdayHours() {
                    return _.filter(this.getPropertyHours, function(o) { return o.day_of_week == 1 });
                },
                saturdayHours() {
                    return _.filter(this.getPropertyHours, function(o) { return o.day_of_week == 6 });
                },
                sundayHours() {
                    return _.filter(this.getPropertyHours, function(o) { return o.day_of_week == 0 });
                },
                copyright_year() {
                    return moment().year();
                },
                getPropertyAddress() {
                    return this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' + this.property.province_state
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: "http://twinpines.mallmaverick.com/api/v3/twinpines/social.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                newsletterRoute() {
                    this.show_menu = false;
                    this.$router.push("/newsletter?email=" + this.newsletter_email);
                    this.newsletter_email = "";
                }
            }
        });
    });
</script>