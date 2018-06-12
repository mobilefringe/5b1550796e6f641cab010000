<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Newsletter</h2>
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
                            <!--<div class="page_content" v-if="currentPage" v-html="currentPage.body"></div>-->
                        </div>
                    </div>
                </div>
                <iframe title="Map" width="100%" height="400px" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"  :src="'http://maps.google.nl/maps?q=' + getPropertyAddress + '&amp;hl=en&amp;ie=UTF8&amp;t=v&amp;hnear=' + getPropertyAddress + '&amp;z=16&amp;output=embed'"></iframe>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-6">
                            <!--<div class="page_content" v-if="currentPage" v-html="currentPage.body"></div>-->
                        </div>
                        <div class="col-md-6">
                            <!--<div class="page_content" v-if="currentPage" v-html="currentPage.body"></div>-->
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex", "json!site.json"], function(Vue, Vuex, site) {
		return Vue.component("location-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    currentPage: null,
                    siteInfo: site
                }
            },
            created() {
                this.loadData().then(response => {
                    // this.currentPage = response[0].data;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ]),
                getPropertyAddress() {
                    return this.property.name + ' ' + this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' +this.property.province_state + ' ' + this.property.province_state
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/milton-directions.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>