<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Directory</h2>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="hidden_phone">
                        <div class="row store_nav">
                            <div class="col-md-3">
                                <a class="store_nav_link active_store_nav" href="/stores">Directory</a>
                            </div>
                            <div class="col-md-3">
                                <a class="store_nav_link" href="/map">Centre Map</a>
                            </div>
                            <div class="col-md-3">
                                <span>Sort By: </span>
                                <a class="store_nav_link" v-on:click="changeMode('alphabetical')">Alphabetical</a>
                            </div>
                            <div class="col-md-3">
                                <v-select v-model="selectedCat" :options="dropDownCats" :searchable="false" :on-change="filteredByCategory" class="category-select" :placeholder="$t('stores_page.sort_by_cats')" id="selectByCat"></v-select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <span class="pull-right"><span class="promo_exist"><i class="fas fa-tag"></i></span> Promotion</span>  
                                <span class="pull-right"><span class="new_store"><i class="fas fa-star"></i></span> New Store </span>
                                <span class="pull-right"><span class="coming_soon_store"><i class="far fa-clock"></i></span> Coming Soon Store</span>
                            </div>
                        </div>
                        <div class="row" v-if="sortByStores">
                            <div class="col-md-6">
                                <div v-if="listOne" v-for="(stores, index) in listOne">
                                    <div class="list_header">
                                        <div class="store_initial_container">
                                            {{index}}
                                        </div>
                                    </div>
                                    <div class="store-section" v-for="store in stores">
                                        <p class="store_list_name">
                                            <router-link :to="{ name: 'storeDetails', params: { id: store.slug }}">
                                                {{store.name}}
                                            </router-link>
                                            <span v-if="store.is_new_store" class="pull-right new_store"><i class="fas fa-star"></i></span>
                                            <span v-if="store.is_coming_soon_store" class="pull-right coming_soon_store"><i class="far fa-clock"></i></span>
                                            <span v-if="store.promotions != null" class="promo_exist pull-right"><i class="fas fa-tag"></i></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" >
                                <div v-if="listTwo" v-for="(stores, index) in listTwo">
                                    <div class="list_header">
                                        <div class="store_initial_container">
                                            {{index}}
                                        </div>
                                    </div>
                                    <div class="store-section" v-for="store in stores">
                                        <p class="store_list_name">
                                            <router-link :to="{ name: 'storeDetails', params: { id: store.slug }}">
                                                {{store.name}}
                                            </router-link>
                                            <span v-if="store.is_new_store" class="pull-right new_store"><i class="fas fa-star"></i></span>
                                            <span v-if="store.is_coming_soon_store" class="pull-right coming_soon_store"><i class="far fa-clock"></i></span>
                                            <span v-if="store.promotions != null" class="promo_exist pull-right"><i class="fas fa-tag"></i></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-else>
                            <div class="col-md-12">
                                <div v-for="(stores, index) in filteredStores" >
                                    <div class="list_header">
                                        <div class="store_initial_container">
                                            {{index}}
                                        </div>
                                    </div>
                                    <div class="store-section" v-for="store in stores">
                                        <p class="store_list_name">
                                            <router-link :to="{ name: 'storeDetails', params: { id: store.slug }}">
                                                {{store.name}}
                                            </router-link>
                                            <span v-if="store.is_new_store" class="pull-right new_store"><i class="fas fa-star"></i></span>
                                            <span v-if="store.is_coming_soon_store" class="pull-right coming_soon_store"><i class="far fa-clock"></i></span>
                                            <span v-if="store.promotions != null" class="promo_exist pull-right"><i class="fas fa-tag"></i></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="visible_phone">
                        <div class="row margin_40">
                            <div class="col-md-12 mobile_store_select">
                                <v-select 
                                    :options="storesList" 
                                    :placeholder="'Select A Store'" 
                                    :searchable="false" 
                                    :label="'name'" 
                                    :on-change="dropPin"
                                ></v-select> 
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <mapplic-png-map ref="pngmap_ref" :height="700" :hovertip="true" :storelist="storesList" :floorlist="floorList" :bindLocationOpened="true" :svgWidth="property.map_image_width" :svgHeight="property.map_image_height" :showPin="true" tooltiplabel="View Store Details"></mapplic-png-map>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-select", "vue!mapplic-png-map"], function(Vue, Vuex, VueSelect, MapplicComponent) {
        Vue.component('v-select', VueSelect.VueSelect);
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    sortByStores: true,
                    listOne: null,
                    listTwo: null,
                    filteredStores: null,
                    selectedCat: "Select a Category"
                }
            },
            created(){
                this.loadData().then(response => {
                    this.allStores;
                    this.sortByStores = true;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryByName',
                    'findCategoryById'
                ]), 
                allStores() {
                    var listOne = [];
                    var listTwo = [];
                    _.forEach( this.processedStores , function( value, key ) {
                        var starter = "A";
                        var breaker = "M";
                        var store_initial = _.toUpper(value.name[0]);
                        if (store_initial.charCodeAt(0) <= breaker.charCodeAt(0) && store_initial.charCodeAt(0) >= starter.charCodeAt(0)){
                            listOne.push(value);
                        } else {
                            listTwo.push(value);    
                        }
                    });
                    this.listOne = _.groupBy(listOne, store => (isNaN(_.upperCase(store.name.charAt(0))) ? _.upperCase(store.name.charAt(0)) : "#"));
                    this.listTwo = _.groupBy(listTwo, store => (isNaN(_.upperCase(store.name.charAt(0))) ? _.upperCase(store.name.charAt(0)) : "#"));
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                storesList() {
                    this.processedStores.map(function(store){
                        store.zoom = 1;
                    })
                    return this.processedStores;
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                pngMapRef() {
                    return this.$refs.pngmap_ref;
                },
                floorList () {
                    var floor_list = [];
                    
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Floor 1";
                    floor_1.map = this.getPNGurl;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    
                    floor_list.push(floor_1);
                    return floor_list;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeMode (mode) {
                    this.sortByStores = true;
                },
                filteredByCategory (cat_id) {
                    if(cat_id == "Select a Category" || cat_id == "All" || cat_id == null || cat_id == undefined){
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(cat_id).id;
                    }
                    
                    if(category_id == "All"){
                        this.sortByStores = true;
                    } else {
                        this.sortByStores = false;
                        var find = this.findCategoryById;
                        var filtered = _.filter(this.processedStores, function(o) {return _.indexOf(o.categories, _.toNumber(category_id)) > -1; });
                        _.forEach(filtered, function(value, i) {
                            value.currentCategory = find(category_id).name;
                        });
                        sortedCats = _.groupBy(filtered, store => store.currentCategory);
                        this.filteredStores = sortedCats;
                    }
                },
                dropPin(store) {
                    this.pngMapRef.showLocation(store.id);
                }
            }
        });
    });
</script>
