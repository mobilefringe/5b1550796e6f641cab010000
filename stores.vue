<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Directory</h2>
                    </div>
                </div>
        		<div class="main_container">
        		    <div class="row margin_40">
        		        <div class="col-md-6">
        		            <button class="animated_btn stores_btn" @click="toggleView()">{{ toggleText }}</button>
        		            <router-link to="/map">
        		                <div class="animated_btn stores_btn">
        		                    Center Map
        		                </div>    
        		            </router-link>
        		        </div>
        		        <div class="col-md-6">
        		            <div class="store_search">
            					<search-component :list="allStores" placeholder="Search" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left">
            						<template slot="item" scope="option" class="manual">
            							<article class="media">
            								<p>{{ option.data.name }}</p>
            							</article>
            						</template>
            					</search-component>
            					<i class="fa fa-search"></i>
            				</div> 
            				<div class="store_category">
            					<v-select 
            					    v-model="selectedCat" 
            					    :options="dropDownCats" 
            					    :searchable="false" 
            					    :on-change="filterByCategory" 
            					    class="category-select" 
            					    placeholder="Category" 
            					    id="selectByCat"
            				    ></v-select>
            				</div>
        		        </div>
        		    </div>
        			<!-- Logo View -->
        			<div v-if="logoView">
            			<div v-masonry transition-duration="0.3s" item-selector=".stores-grid-item">
                            <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
                                <div v-masonry-tile  v-for="(store, index) in filteredStores" :key="index" class="stores-grid-item">
                            	    <div class="store_logo_container">
                            	        <router-link :to="'/stores/'+ store.slug">
                                			<img class="store_img" :src="store.image_url" alt="">
                                			<div class="store_tag" v-if="store.total_published_promos">-->
            									<div class="store_tag_text">Promotion</div>
            								</div>
            								<div class="store_tag" v-if="!store.total_published_promos && !store.is_new_store && store.is_coming_soon_store">
            									<div class="store_tag_text">Coming Soon</div>
            								</div>
            								<div class="store_tag" v-if="!store.total_published_promos && !store.is_coming_soon_store && store.is_new_store">
            									<div class="store_tag_text">New Store</div>
            								</div>
            								<div class="store_details">
            								    <div class="store_text">{{ store.name }}</div>    
            								</div>
                                		</router-link>
                            	    </div>
                                </div>
                            </transition-group>
                        </div>
                    </div>
                    <!-- List View -->
                    <div v-if="listView" class="listView">
                        <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
                            <div v-for="(store, index) in filteredStores" :key="index">
                    	        <router-link :to="'/stores/'+ store.slug">
                        			<div>
                        			    {{ store.name }}
                        			    <span v-if="store.total_published_promos"><i class="fa fa-tag"></i></span>
                                        <span v-if="store.is_new_store"><i class="fa fa-star"></i></span>
                                        <span v-if="store.is_coming_soon_store"><i class="fa fa-clock"></i></span>
                        			</div>
                        		</router-link>
                            </div>
                        </transition-group>
                    </div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>
<style>
    .store_details {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        background-color: rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;
    }
    .store_logo_container:hover .store_tag {
        display: none;
    }
    .listView {
        column-count: 2;
    }
</style>
<script>
    define(["Vue", "vuex", "vue-select", "vue!search-component", "masonry" , "vue-masonry-plugin"], function(Vue, Vuex, VueSelect, SearchComponent, masonry, VueMasonryPlugin) {
        Vue.component('v-select', VueSelect.VueSelect);
        Vue.use(VueMasonryPlugin.default);
        return Vue.component("stores-m-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    storeBanner : null,
                    windowWidth: 0,
                    selectedCat: null,
                    filteredStores: null,
                    search_result : null,
                    query: "",
                    toggleText: "Display as List",
                    logoView: true,
                    listView: false
                }
            },
            created (){
                this.loadData().then(response => {
                    // var temp_repo = this.findRepoByName('Directory Banner').images;
                    // if(temp_repo != null) {
                    //     this.storeBanner = temp_repo[0];
                    // } else {
                    //     this.storeBanner = "http://via.placeholder.com/1920x400/4f6726/4f6726";
                    // }
                    
                    this.dataLoaded = true;

                    // console.log(this.$route)
                    // this.query = this.$route.query.category
                    // if(this.query == "fast_food"){
                    //   this.selectedCat = "Fast Food";
                    //   this.filterByCategory();
                    // } else {
                    //     this.selectedCat = "All";
                    //     this.filteredStores = this.allStores;
                    // }
                });
            },
            watch: {
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.mobile_store = true;
                    } else {
                        this.mobile_store = false;
                    }
                }
            },
            mounted() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findRepoByName'
                ]),
                allStores() {
                    var store_list = this.processedStores
                    console.log(this.processedStores)
                    var vm = this;
                    var hover_image = "";
                    _.forEach(store_list, function(value, key) {
                        value.image_url = "https://via.placeholder.com/500";
                    });
                    this.filteredStores = store_list;
                    return store_list
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                svgMapRef() {
                    return _.filter(this.$children, function(o) {
                        return (o.$el.className == "svg-map")
                    })[0];
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(category_id).id;
                    }

                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
                        });
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                    }
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData", "repos")]);
                        
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeMode(mode) {
                    this.listMode = mode;
                },
                toggleView() {
                    if (this.logoView) {
                        this.toggleText = "Display as Logos"
                        this.listView = true;
                        this.logoView = false;
                    } else if (this.listView) {
                        this.toggleText = "Display as List"
                        this.logoView = true;
                        this.listView = false;
                    } 
                },
                updateSVGMap(map) {
                    this.map = map;
                },
                addLandmark(store) {
                    this.svgMapRef.addMarker(store);
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/" + option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>