<template>
    <header>
        <section id="header" class="sticky">
            <div class="main_container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="site_logo center-block">
                            <a href="/">
                                <img :alt="siteInfo.siteName" :src="siteInfo.siteLogo">
                            </a>
                        </div>
                        <div @click="showMenu = !showMenu" :class="{ open: showMenu }" id="menu-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <nav id="primary_nav">
    						<ul>
    						    <li class="menu_item" v-for="item in menu_items" :id="item.id">
    						        <router-link :to="item.href">{{ item.name }}</router-link>
    						        <ul v-if="item.sub_menu">
    						            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
    						                <router-link :to="sub_menu.href">{{ sub_menu.name }}</router-link>
    						            </li>
    								</ul>
    						    </li>
    						</ul>
    					</nav>
    					<div class="nav_container visible_phone">
    					    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        					    <nav id="mobile_nav" v-show="showMenu" class="">
        					        <ul>
        					            <li v-for="(item,key) in menu_items" class="menu_item">
        							        <router-link :to="item.href" v-if="item.sub_menu == undefined">
        							            <div class="btn-block">{{$t(item.name)}}</div>
    							            </router-link>
        							        <div v-else>
        							            <b-card no-body class="mb-1">
                                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                                        <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                            {{$t(item.name)}}
                                                            <i v-if="item.show_sub_menu"  class="fas fa-angle-down"></i>
                                                            <i v-else  class="fas fa-angle-right"></i>
                                                        </b-btn>
                                                    </b-card-header>
                                                    <transition name="slideInDown">
                                                        <div>
                                                        <b-collapse v-model="item.show_sub_menu" accordion="my-accordion" is-nav="true" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                        
                                                            <b-card-body v-for="sub_menu in item.sub_menu">
                                                                <p class="card-text">
                                                                    <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
                                                                </p>
                                                            </b-card-body>
                                    
                                                        </b-collapse>
                                                        </div>
                                                    </transition>
                                                </b-card>
        							        </div>
        							    </li>
        					        </ul>
        						 <!--   <div class="mobile_nav_content">-->
        						 <!--       <div class="header_social">-->
            			<!--				    <span class="social_icon" v-for="item in social_media">-->
               <!--                                 <a :href="item.url" target="_blank">-->
               <!--                                     <div>-->
               <!--                                         <p class="accessibility">{{item.name}}</p>-->
               <!--                                         <i :class="item.iconClass" aria-hidden="true"></i>-->
               <!--                                     </div>-->
               <!--                                 </a>-->
               <!--                             </span>-->
               <!--                         </div>-->
               <!--                         <div class="mobile_property_address center">-->
               <!--                             <p>{{ property.name }}<br>-->
               <!--                                 <a :href="siteInfo.googleMapsURL" target="_blank">{{ getPropertyAddress }}</a>-->
               <!--                             </p>-->
               <!--                         </div>-->
        							<!--</div>-->
        						</nav>
        				    </transition>
        				</div>
                    </div>
                </div>
            </div>
        </section>
    </header>
</template>

<script>
    define(["Vue", "vuex", "vue!today_hours.vue", "bootstrap-vue", "json!site.json"], function (Vue, Vuex, TodayHoursComponent, BootstrapVue, site) {
        Vue.use(BootstrapVue);
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    showMenu: false,
                    showMobileMenu: false,
                    noScroll: false,
                    windowWidth: 0,
                    siteInfo: site,
                }
            },
            props:['menu_items', 'social_media'],
            watch: {
                $route: function() {
                    if (this.windowWidth <= 768) {
                        this.showMenu = false;
                    }  
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                },
                showMenu: function() {
                    if(this.showMenu == true){
                        document.body.classList.add("no_scroll");
                    } else if (this.showMenu == false) {
                        document.body.classList.remove("no_scroll");
                    }
                }
            },
            created() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    this.getWindowWidth();
                });
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
                    'hours',
                    'getTodayHours',
                ]),
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                },
                todays_hours() {
                    return this.getTodayHours;
                },
                getPropertyAddress() {
                    return this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' + this.property.province_state
                }
            },
            methods: {
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.search = ""
                    });
                    this.$router.push("/stores/" + option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>