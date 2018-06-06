<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="storeBanner" v-bind:style="{ backgroundImage: 'url(' + storeBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        				    <p>{{ $t("stores_page.header_desc") }} {{ property.name }}</p>
        					<h1>{{ $t("stores_page.directory") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        			<div class="stores_header_container">
        			    <div class="stores_header_line hidden_phone"></div>
        				<div class="stores_button_container search position_relative">
        					<search-component :list="allStores" :placeholder="$t('stores_page.find_your_store')" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left">
        						<template slot="item" scope="option" class="manual">
        							<article class="media">
        								<p>{{ option.data.name }}</p>
        							</article>
        						</template>
        					</search-component>
        					<img src="//codecloud.cdn.speedyrails.net/sites/5ac3cb4b6e6f640eec120000/image/png/1517497861636/search_icon_2x.png" id="search_icon" alt="">
        				</div>
        				<div class="stores_header_line hidden_phone"></div>
        				<div class="stores_button_container category">
        					<v-select 
        					    v-model="selectedCat" 
        					    :options="dropDownCats" 
        					    :searchable="false" 
        					    :on-change="filterByCategory" 
        					    class="category-select" 
        					    :placeholder="$t('stores_page.sort_by_cats')" 
        					    id="selectByCat"
        				    ></v-select>
        				</div>
        				<div class="stores_header_line hidden_phone"></div>
        				<div class="stores_button_container map_link hidden_phone">
        				    <router-link to="/map">
        				        <div>{{$t("stores_page.view_map")}}</div>
        				    </router-link>
        				</div>
        				<div class="stores_header_line hidden_phone"></div>
        			</div>
        			<div class="margin_40">
    			        <button class="submit_btn animated_btn swing_in" @click="toggleView()">{{ toggleText }}</button>
        			</div>
        			<!-- Logo View -->
        			<div v-if="logoView">
            			<div v-masonry transition-duration="0.3s" item-selector=".stores-grid-item">
                            <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
                                <div v-masonry-tile  v-for="(store, index) in filteredStores" :key="index" class="stores-grid-item">
                            	    <div class="store_logo_container">
                            	        <router-link :to="'/stores/'+ store.slug">
                                			<img class="store_img" :src="store.store_front_url_abs" alt="">
                                			<div class="store_tag store_promotion" v-if="store.total_published_promos">-->
            									<div class="store_tag_text">{{$t("stores_page.promotion")}}</div>
            								</div>
            								<div class="store_tag coming_soon" v-if="!store.total_published_promos && !store.is_new_store && store.is_coming_soon_store">
            									<div class="store_tag_text">{{$t("stores_page.coming_soon")}}</div>
            								</div>
            								<div class="store_tag new_store" v-if="!store.total_published_promos && !store.is_coming_soon_store && store.is_new_store">
            									<div class="store_tag_text">{{$t("stores_page.new_store")}}</div>
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
    .store_logo_container {
        margin: 0;
        border: none !important;
    }
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
    .store_logo_container:hover .store_img {
        display: block;
        -webkit-filter: blur(3px);
        -moz-filter: all .25s ease;
        -o-filter: all .25s ease;
        -ms-filter: all .25s ease;
        filter: blur(3px);
    }
    .store_logo_container:hover .store_tag {
        display: none;
    }
    .store_logo_container:hover .store_details {
        display: block;
    }
    .store_logo_container:hover .store_details .store_text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        color: #fff;
        line-height: 22px;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        text-align: center;
    }
    .listView {
        column-count: 2;
    }
</style>
<script>
    define(["Vue", "vuex", "vue-select", "jquery", "smooth-zoom", "vue!png-map", "vue!search-component", "masonry" , "vue-masonry-plugin"], function(Vue, Vuex, VueSelect, $, smoothZoom, PNGMapComponent, SearchComponent, masonry, VueMasonryPlugin) {
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
                    toggleText: "List View",
                    logoView: true,
                    listView: false
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Directory Banner').images;
                    if(temp_repo != null) {
                        this.storeBanner = temp_repo[0];
                    } else {
                        this.storeBanner = "http://via.placeholder.com/1920x400/4f6726/4f6726";
                    }
                    
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
                    var vm = this;
                    var hover_image = "";
                    _.forEach(store_list, function(value, key) {
                        if(value.assets != undefined){
                            //Stores JSON
                            var store_id = value.id
                            vm.$store.dispatch('LOAD_PAGE_DATA', { url: vm.property.mm_host + "/api/v4/thegateway/stores/" + store_id + "/store_files.json" }).then(response => {
                                if(response.data != undefined) {
                                    hover_image = response.data.store_files[0].url
                                    value.hover_img = 'https://www.mallmaverick.com' + hover_image
                                    // vm.filteredStores = null;
                                    // vm.filteredStores = store_list; 
                                    // vm.filteredStores[key].hover_img = 'https://www.mallmaverick.com' + hover_image
                                }
                            }, error => {
                                console.error("Could not retrieve data from server. Please check internet connection and try again.");
                                vm.$router.replace({ name: 'home' });
                            });
                        }    
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
                        this.toggleText = "Logo View"
                        this.listView = true;
                        this.logoView = false;
                    } else if (this.listView) {
                        this.toggleText = "List View"
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