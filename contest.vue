<template>
    <div class="page_container" id="contact_us_container"> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <div>
            <div class="row">
                    <!--<img :src='currentContest.image_url' alt="contest image">-->
                </div> 
            <div class="row"> 
                <div class="col-md-8 col-offset-md-2 contest_contents">
                    <div class="page_header all_caps double_border_top double_border_bottom">
						<!--<div class="text_left">{{currentContest.name}}</div>-->
					</div>
                    <!--<div class="description_text text_left" style="padding-top:20px"  v-html="currentContest.rich_description"></div>-->
                    <form class="form-horizontal padding_top_20" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
						<div class="form-group ">
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('first_name')}">
								<label class="label" for="first_name">First Name</label>
								<input v-model="form_data.first_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="first_name" type="text" placeholder="First Name" data-vv-delay="500" data-vv-as="first name">
								<span v-show="errors.has('first_name')" class="form-control-feedback">{{ errors.first('first_name') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('last_name')}">
								<label class="label" for="last_name">Last Name</label>
								<input v-model="form_data.last_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="last_name" type="text" placeholder="Last Name" data-vv-delay="500" data-vv-as="last name">
								<span v-show="errors.has('last_name')" class="form-control-feedback">{{ errors.first('last_name') }}</span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('email')}">
								<label class="label" for="email">Email</label>
								<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="500" data-vv-as="email">
								<span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('phone')}" >
								<label class="label" for="phone">Phone Number</label>
								<input v-model="form_data.phone" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="phone" type="text" placeholder="Phone number" data-vv-delay="500" data-vv-as="phone">
								<span v-show="errors.has('phone')" class="form-control-feedback">{{ errors.first('phone') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('street')}"  style="padding-top: 20px;">
								<label class="label" for="street">Street Address</label>
								<input v-model="form_data.mailing_address" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="street" type="text" placeholder="Street Address" data-vv-delay="500" data-vv-as="street address">
								<span v-show="errors.has('street')" class="form-control-feedback">{{ errors.first('street') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12"  :class="{'has-error': errors.has('city')}" style="padding-top: 20px;">
								<label class="label" for="city"> City</label>
								<input v-model="form_data.city" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="city" type="text" placeholder="Town/City" data-vv-delay="500" data-vv-as="city">
								<span v-show="errors.has('city')" class="form-control-feedback">{{ errors.first('city') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12 " :class="{'has-error': errors.has('postal')}"  style="padding-top: 20px;">
								<label class="label" for="postal">Postal Code</label>
								<input v-model="form_data.postal_code" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="postal" type="text" placeholder="Postal Code" data-vv-delay="500" data-vv-as="postal code">
								<span v-show="errors.has('postal')" class="form-control-feedback">{{ errors.first('postal') }}</span>
							</div>
							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('birthday')}"   style="padding-top: 20px;">
								<label class="label" for="birthday">Birthday</label>
								<input v-model="form_data.birthday" class="form-control" v-validate="'required|date_format:MM/DD/YYYY'" :class="{'input': true}" name="birthday" type="text" placeholder="mm/dd/yyyy" data-vv-delay="500" data-vv-as="birthday">
                                <v-date-picker mode='single' v-model='birthday'  v-validate="'required:true'" select-color='green'></v-date-picker>
								<span v-show="errors.has('birthday')" class="form-control-feedback">{{ errors.first('birthday') }}</span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-xs-6" :class="{'has-error': errors.has('validate')}">
								<label class="label" for="validate">Enter the following number below to proceed: {{correctValNum}}</label> 
								<input v-model="validaNum" v-validate="'required|numeric|min:6|max:6'" class="form-control col-xs-3" :class="{'input': true}" name="validate" type="text" placeholder="Enter above number" data-vv-delay="500" data-vv-as="validation">
								<span v-show="errors.has('validate')" class="form-control-feedback">{{ errors.first('validate') }}</span>
								<span v-if="validaNum.length === 6 && validaNum !== correctValNum && errors.first('validate') == null" class="form-control-feedback" :class="{shake_element : validNumError}">Please enter correct number</span>
							</div>
						</div>
						<div class="form-group account-btn text-left m-t-10 agreement">
						    <div class="col-xs-12" :class="{'has-error': errors.has('agree_newsletter')}">
						        <label class="checkbox">
                                    <input name="agree_newsletter" type="checkbox" v-model="form_data.agree_newsletter">
                                        Yes, I would like to receive ongoing news related to events, promotions and special announcements from Eastgate Square. 
                                </label>
						    </div>
						    <div class="col-xs-12">
						        <label class="checkbox">
                                    <input name="agree_terms" required type="checkbox" >
                                    I agree to the <a href = "/pages/eastgate-contest-rules-and-regulations" target="_blank"><u> rules and regulations</u></a>
                                </label>
						    </div>
							<div class="col-xs-12">
								<button class="feature-readmore" type="submit" :disabled="formSuccess">Submit</button>
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
            <div class="padding_top_40"></div>    
        </div>
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
    define(["Vue", "vuex", "axios", "moment", "moment-timezone", "vue-moment", "vue-meta", 'vee-validate'], function(Vue, Vuex,axios, moment, tz, VueMoment, Meta, VeeValidate) {
        Vue.use(Meta);
        Vue.use(VeeValidate);

        return Vue.component("contest-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
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
                    // this.dataloaded = true;
                    this.currentContest = this.findContestByShowOnSlug('eastgate-contest');
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            mounted() {
                //creating random validation num 
                // this.correctValNum = Utility.rannumber();
                
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
                        if (result &&  (this.correctValNum === this.validaNum)) {
                            let errors = this.errors;
                            this.validNumError = false;
                            if(this.form_data.agree_newsletter ) {
                                $.getJSON("//mobilefringe.createsend.com/t/d/s/irudui/?callback=?",
                                "cm-name=" + this.form_data.first_name + this.form_data.last_name +
                                "&cm-irudui-irudui=" + this.form_data.email +
                                "&cm-f-jtukyu=" + this.form_data.city+
                                "&cm-f-jtukjr=" + this.form_data.phone +
                                "&cm-f-jtukjy=" + this.form_data.mailing_address +
                                "&cm-f-jtukjj=" + this.form_data.postal_code +
                                "&cm-f-jtukjt=" + this.form_data.birthday,
                                    function (data) {
                                    if (data.Status === 400) {
                                        e.preventDefault();
                                        console.error("Please try again later.");
                                    } else { // 200
                                        console.log("Newsletter submission successful.");
                                    }
                                });  
                            }
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
                },
            }
        });
    });
</script>