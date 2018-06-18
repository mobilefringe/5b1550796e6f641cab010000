<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header parallax bg1">
                    <div class="main_container position_relative">
                        <h2>Newsletter</h2>
                    </div>
                </div>
                <div class="main_container static">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                            <div v-if="pageContent" v-html="pageContent.body"></div>
                            <form class="newsletter_form form-horizontal" action="//mobilefringe.createsend.com/t/d/s/vjklyu/" method="post" @submit.prevent="validateBeforeSubmit">
                                <div class="row">
                                    <div class="col-sm-6" >
                                        <label for="newsletter_name" class="accessibility">First Name</label>
                                        <input v-model="form_data.name" required class="margin_20 form-control" name="cm-f-fihudt" type="text" placeholder="First Name" id="newsletter_name">
                                    </div>
                                    <div class="col-sm-6" >
                                        <label for="fieldfihudi" class="accessibility">Last Name</label>
                                        <input v-model="form_data.name" required class="margin_20 form-control" name="cm-name" type="text" placeholder="Last Name">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="cm-vjklyu-vjklyu" class="accessibility">Email</label>
                                        <input v-model="form_data.email" required class="margin_20 form-control" name="cm-vjklyu-vjklyu" type="email" placeholder="Email" id="newsletter_email">
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="fieldfihudd" class="accessibility">Phone Number</label>
                                        <input id="fieldfihudd" v-model="form_data.email" required class="margin_20 form-control" name="cm-f-fihudd" type="text" placeholder="Phone Number" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div style="margin-left: 20px">
                                            <label class="checkbox">
                                                <input name="agree_newsletter" required  type="checkbox">
                                                    I agree to receive communications from {{ property.name }}.
                                            </label>
                                        </div>
            					    </div>
            					</div>
        					    <div class="margin_40 clearfix"></div>
        					    <div class="row">
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
<style>

.wrapper {
  /* The height needs to be set to a fixed value for the effect to work.
   * 100vh is the full height of the viewport. */
  height: 100vh;
  /* The scaling of the images would add a horizontal scrollbar, so disable x overflow. */
  overflow-x: hidden;
  /* Enable scrolling on the page. */
  overflow-y: auto;
  /* Set the perspective to 2px. This is essentailly the simulated distance from the viewport to transformed objects.*/
  perspective: 2px;
}

.section {
  /* Needed for children to be absolutely positioned relative to the parent. */
  position: relative;
  /* The height of the container. Must be set, but it doesn't really matter what the value is. */
  height: 100vh;
  
  /* For text formatting. */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 5px #000;
}

.parallax::after {
  /* Display and position the pseudo-element */
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  
  /* Move the pseudo-element back away from the camera,
   * then scale it back up to fill the viewport.
   * Because the pseudo-element is further away, it appears to move more slowly, like in real life. */
  transform: translateZ(-1px) scale(1.5);
  /* Force the background image to fill the whole element. */
  background-size: 100%;
  /* Keep the image from overlapping sibling elements. */ 
  z-index: -1;
}

/* The styling for the static div. */
/*.static {*/
/*  background: red;*/
/*}*/

/* Sets the actual background images to adorable kitties. This part is crucial. */
.bg1::after {
  background-image: url('https://placekitten.com/g/900/700');
}

.bg2::after {
  background-image: url('https://placekitten.com/g/800/600');
}
</style>
<script>
    define(["Vue", "vuex", "jquery", "vee-validate", "json!site.json"], function(Vue, Vuex, $, VeeValidate, site) {
        Vue.use(VeeValidate);
        return Vue.component("test-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: true,
                    pageContent: null,
                    siteInfo: site,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            mounted () {
                this.form_data.name = this.$route.query.name;
                $("#newsletter_name").val(this.form_data.name);
                this.form_data.email = this.$route.query.email;
                $("#newsletter_email").val(this.form_data.email);
            },
            watch : {
                $route () {
                    this.form_data.name = this.$route.query.name;
                    $("#newsletter_name").val(this.form_data.name);
                    this.form_data.email = this.$route.query.email;
                    $("#newsletter_email").val(this.form_data.email);
                }
            },
            created() {
                this.loadData().then(response => {
                    this.pageContent = response[0].data;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ])
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/cerritos-newsletter.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
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