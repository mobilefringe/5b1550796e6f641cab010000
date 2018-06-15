<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Center Information</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div v-if="main" v-html="main.body"></div>
                        </div>
                    </div>
                </div>
                <div class="location_image_container">
                    <div class="location_image" v-if="pageImages" v-for="item in pageImages">
                        <img :src="item.image_url" alt="" />   
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="center title">Amenities</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6" v-if="amenities" v-for="item in amenities">
                            <p class="amenities_title">{{ item.title }}</p>
                            <div class="amenities_body" v-html="item.body"></div>
                        </div>
                    </div>
                </div>
                <div class="location_image_container">
                    <div class="location_image" v-if="lowerBanner">
                        <img :src="lowerBanner.image_url" alt="" />   
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex"], function(Vue, Vuex) {
		return Vue.component("center-info-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    main: null,
                    amenities: null,
                    pageImages: null,
                    lowerBanner: null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Center Information Images');
                    console.log(temp_repo)
                    if(temp_repo) {
                        var three_imgs = _.slice(temp_repo.images, [0], [3])
                        this.pageImages = three_imgs;
                        console.log(this.pageImages)
                        var one_img = temp_repo.images[3];
                        this.lowerBanner = one_img;
                        console.log(this.lowerBanner)
                    }
                    this.main = response[1].data;
                    this.amenities = response[1].data.subpages
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'repos',
                    'findRepoByName'
                ]),
                getPropertyAddress() {
                    return this.property.name + ' ' + this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' +this.property.province_state + ' ' + this.property.province_state
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/cerritos-center-information.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>