<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>Newsletter</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <h3 class="inside_page_title">Address</h3>
                            <p class="inside_page_link">
                                {{ property.address1 }} <br>
                                {{ property.city }}, {{ property.province_state }} <br>
                                {{ property.postal_code }}
                            </p>
                            <a class="animated_btn" :href="siteInfo.googleMapsURL" target="_blank">Driving Direction</a>  
                        </div>
                        <div class="details_col_9">
                            <p class="inside_page_link">Be the first to know about upcoming events and special announcements from {{ property.name }}!</p>
                            <form class="form-horizontal" action="//mobilefringe.createsend.com/t/d/s/vltuui/" method="post" @submit.prevent="validateBeforeSubmit">
                                <div class="row">
                                    <div class="col-sm-8" >
                                        <label for="cm-name">Name</label>
                                        <input v-model="form_data.name" required class="margin_20 form-control" name="cm-name" type="text" placeholder="Name">
                                    </div>
                                    <div class="col-sm-8">
                                        <label for="cm-vltuui-vltuui">Email</label>
                                        <input v-model="form_data.email" required class="margin_20 form-control" name="cm-vltuui-vltuui" type="email" placeholder="Email" id="newsletter_email">
                                    </div>
                                    <div class="col-sm-8">
                                        <div style="margin-left: 20px">
                                            <label class="checkbox">
                                                <input name="agree_newsletter" required  type="checkbox">
                                                    I agree to receive communications from {{ property.name }}.
                                            </label>
                                        </div>
            					    </div>
            					    <div class="margin_20 clearfix"></div>
                                    <div class="col-xs-12">
                                        <button class="animated_btn" type="submit" :disabled="formSuccess">Subscribe</button>
                                    </div>
                                </div>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "jquery", "vee-validate", "json!site.json"], function(Vue, Vuex, $, VeeValidate, site) {
        Vue.use(VeeValidate);
        return Vue.component("newsletter-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: true,
                    siteInfo: site,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            mounted () {
                this.form_data.email = this.$route.query.email;
                $("#newsletter_email").val(this.form_data.email);
            },
            watch : {
                $route () {
                    console.log(this.$route.query)
                    this.form_data.email = this.$route.query.email;
                    $("#newsletter_email").val(this.form_data.email);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ])
            },
            methods: {
                validateBeforeSubmit(form) {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            let errors = this.errors;
                            
                            if(errors.length > 0) {
                                console.log("Error");
                            } else {
                                console.log("No Error");
                                // return true;
                                form.target.submit();
                            }
                        }
                    })
                }
            }
        });
    });
</script>