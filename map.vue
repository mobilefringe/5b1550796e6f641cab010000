<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Center Map</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                 
                        <div class="col-md-3 padding_60">
                            <div class="map_category">
                                <v-select 
                                    v-if="allCategories"
                                    v-model="selected" 
                                    :options="allCategories" 
                                    :searchable="false" 
                                    class="category-select"
                                ></v-select>
                            </div>
                            <div class="map_search">
                                <search-component 
                                    v-model="storeSearch" 
                                    :list="processedStores" 
                                    :suggestion-attribute="suggestionAttribute" 
                                    @select="onOptionSelect" 
                                    :threshold="1"
                                >
                                    <template slot="item" scope="option">
                                        <article class="media">
                                            <p>{{ option.data.name }}</p>
                                        </article>
                                    </template>
                                </search-component>
                                <i id="store-search-icon" class="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <div class="hidden_phone">
                                <h3 class="inside_page_title">Find Store</h3>
                                <div class="store_list_container hidden-mobile" v-if="allStores">
                                    <p class="store_name" v-for="store in allStores" v-on:click="dropPin(store)">{{store.name}}</p>
                                </div>
                            </div>
                            <div class="visible_phone">
                                <v-select 
                                    :options="allStores" 
                                    :placeholder="'Select A Store'" 
                                    :searchable="false" 
                                    :label="'name'" 
                                    :on-change="dropPin"
                                ></v-select>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <mapplic-png-map ref="pngmap_ref" :height="700" :hovertip="true" :storelist="allStores" :floorlist="floorList" :bindLocationOpened="true" :svgWidth="property.map_image_width" :svgHeight="property.map_image_height" :showPin="true" tooltiplabel="View Store Details"></mapplic-png-map>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-select", "vue!search-component", "vue!mapplic-png-map"], function(Vue, Vuex, VueSelect, SearchComponent, MapplicComponent) {
        Vue.component('v-select', VueSelect.VueSelect);
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    selected: "Select a Category",
                    suggestionAttribute: "name",
                    storeSearch: null,
                    currentSelection: null,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'processedStores',
                    "processedCategories",
                    "storesByCategoryName",
                ]),
                allStores() {
                    this.processedStores.map(function(store){
                        store.zoom = 1;
                    })
                    return this.processedStores;
                },
                allCategories() {
                    var categories = this.storesByCategoryName
                    console.log(this.storesByCategoryName)
                    var categoryData = [];
                    _.forEach(categories, function(value, key) {
                        var name = key
                        var id = key
                        if(name != null && id != null){
                            var object = {
                                'label': name,
                                'value': name
                            }
                            categoryData.push(object)
                        }
                    });
                    categoryData.unshift('All');
                    return categoryData 
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
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                dropPin(store) {
                    this.pngMapRef.showLocation(store.id);
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.$refs.mapplic_ref.showLocation(option.svgmap_region);
                },
            }
        });
    });
</script>