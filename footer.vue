<template>
    <footer v-if="dataLoaded" v-cloak>
        <section id="footer">
            <div class="main_container">
                <div class="row newsletter_signup">
                    <div class="col-md-12 center-block">
                        <p>Sign up to receive the latest deals and news!</p>
                        <label for="userName" class="accessibility">Enter Name</label>
                        <input id="userName" v-model="newsletter_email" type="text" placeholder="Name*" class="newsletter_control" required />
                        <label for="emailAddress" class="accessibility">Enter Email Address</label>
                        <input id="emailAddress" v-model="newsletter_email" type="text" placeholder="Email*" class="newsletter_control" required />
                        <button @click="newsletterRoute" class="newsletter_btn animated_btn">Subscribe</button>
                    </div>
                </div>
                <div class="row footer_content">
                    
                    
                </div>
                <div class="row copyright">
                    <div class="col-md-12">
                        <p class="footer_text">&#169; {{copyright_year}} <a :href="siteInfo.propertyManagementURL" target="_blank">{{ siteInfo.propertyManagementName }}</a>. All rights reserved. | Powered by <a href="https://www.mallmaverick.com/" target="_blank">Mall Maverick</a></p>
                    </div>
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
                    newsletter_name: "",
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
                ]),
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
                    this.$router.push("/newsletter?name=" + this.newsletter_name + "?email=" + this.newsletter_email);
                    this.newsletter_name = "";
                    this.newsletter_email = "";
                }
            }
        });
    });
</script>