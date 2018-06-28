<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Contact Us</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <img :src="currentContest.image_url" :alt="currentContest.name">
                        </div>
                    </div> 
                    <div class="row"> 
                        <div class="col-md-8 col-md-offset-2 contest_contents">
                            <div class="page_header all_caps double_border_top double_border_bottom">
        						<div class="text_left">{{currentContest.name}}</div>
        					</div>
                            <div class="description_text text_left" style="padding-top:20px"  v-html="currentContest.rich_description"></div>
                            <form id="contest_form" class="form-horizontal clearfix" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
        						<div class="form-group ">
        							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('first_name')}">
        								<label class="accessibility" for="first_name">First Name</label>
        								<input v-model="form_data.first_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="first_name" type="text" placeholder="First Name" data-vv-delay="500" data-vv-as="first name">
        								<span v-show="errors.has('first_name')" class="form-control-feedback">{{ errors.first('first_name') }}</span>
        							</div>
        							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('last_name')}">
        								<label class="accessibility" for="last_name">Last Name</label>
        								<input v-model="form_data.last_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="last_name" type="text" placeholder="Last Name" data-vv-delay="500" data-vv-as="last name">
        								<span v-show="errors.has('last_name')" class="form-control-feedback">{{ errors.first('last_name') }}</span>
        							</div>
        						</div>
        						<div class="form-group">
        							<div class="col-xs-12" :class="{'has-error': errors.has('email')}">
        								<label class="accessibility" for="email">Email</label>
        								<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="500" data-vv-as="email">
        								<span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
        							</div>
        						</div>
        						<div class="form-group account-btn text-left m-t-10 agreement">
        						    <div class="col-xs-12">
        						        <label class="checkbox">
                                            <input name="agree_terms" type="checkbox" required >
                                            I am over the age of 18.
                                        </label>
        						    </div>
        						    <div class="col-xs-12" :class="{'has-error': errors.has('agree_newsletter')}">
        						        <label class="checkbox">
                                            <input name="agree_newsletter" type="checkbox" v-model="form_data.agree_newsletter">
                                                I agree to receive newsletters from {{ property.name }}. (You can unsubscribe at anytime)
                                        </label>
        						    </div>
        						    <div class="col-xs-12">
        						        <p>For more details about personal privacy, please read our <a href="" target="_blank">Privacy Policy</a>.</p>
                                    </div>
        							<div class="col-xs-12">
        								<button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
        							</div>
        						</div>
        					</form>
                            
                            <div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
                                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                <span class="sr-only">Success</span>
                                Good luck and thank you for entering our contest.
                            </div>
                            <div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
                                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                <span class="sr-only">Error:</span>
                                There was an error when trying to submit your request. Please try again later.
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
    #contact_us_container .row{
        margin-left:inherit;
    }
    .contest_contents {
        min-height: 700px;
    }
    /*.form-group [class*="col-"] {*/
    /*    padding-top:0;    */
    /*}*/
    .form-group .form-control-feedback{
        font-size: 12px;
        /*top:60px;*/
        color: #F44336;
        top: initial;
        bottom: -27px;
    }
    .popover-container input {
        margin-top: 10px;
        display: block;
        width: 100%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    }
    .agreement.form-group {
        margin:0;   
    }
    .checkbox {
        font-weight: normal;
    }
</style>

<script>
    define(["Vue", "vuex", "axios", "vee-validate"], function(Vue, Vuex,axios, VeeValidate) {
        Vue.use(VeeValidate);

        return Vue.component("contest-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    form_data: {},
                    formSuccess: false,
                    formError: false,
                    validaNum: '',
                    correctValNum: null,
                    validNumError: false,
                    currentContest: null
                }
            },
            created() {
                this.$store.dispatch("getData", "contests").then(response => {
                    console.log(response)
                    // this.dataloaded = true;
                    this.currentContest = this.findContestByShowOnSlug('cerritos-contest');
                    console.log(this.currentContest)
                    this.dataLoaded = true;
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findContestBySlug',
                    'findContestByShowOnSlug'
                ]),
            },
            methods: {
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            let errors = this.errors;
              
                            // if(this.form_data.agree_newsletter ) {
                            //     $.getJSON("//mobilefringe.createsend.com/t/d/s/irudui/?callback=?",
                            //     "cm-name=" + this.form_data.first_name + this.form_data.last_name +
                            //     "&cm-irudui-irudui=" + this.form_data.email +
                            //     "&cm-f-jtukyu=" + this.form_data.city+
                            //     "&cm-f-jtukjr=" + this.form_data.phone +
                            //     "&cm-f-jtukjy=" + this.form_data.mailing_address +
                            //     "&cm-f-jtukjj=" + this.form_data.postal_code +
                            //     "&cm-f-jtukjt=" + this.form_data.birthday,
                            //         function (data) {
                            //         if (data.Status === 400) {
                            //             e.preventDefault();
                            //             console.error("Please try again later.");
                            //         } else { // 200
                            //             console.log("Newsletter submission successful.");
                            //         }
                            //     });  
                            // }
                            //format contests data for MM
                            var contest_entry = {};
                            contest_entry.contest = this.form_data;
                            var vm = this;
                            host_name = this.property.mm_host.replace("http:", "");
                            var url = host_name + "/contests/" + this.currentContest.slug + "/create_js_entry";
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: contest_entry,
                                success: function(data) {
                                    vm.formSuccess = true;
                                },
                                error: function(data){
                                    vm.formError = true;
                                }
                            });
                        }
                    })
                }
            }
        });
    });
</script>