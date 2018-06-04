<template>
    <div class="row">
        <div class="col-md-12">
            <p class="page-breadcrumb">
                <breadcrumbs></breadcrumbs>
                <span class="pull-left">{{property.name}} <i class="fa fa-angle-right" aria-hidden="true"></i> </span>
            </p>
        </div>
    </div>
</template>

<script>
define(["Vue", "vuex", "vue-breadcrumbs"], function (Vue, Vuex, VueBreadcrumbs) {
    Vue.use(VueBreadcrumbs);
    return Vue.component("breadcrumb", {
        template: template, // the variable template will be injected
        data: function data() {
            return {
                breadcrumb: null,
            }
        },
        computed: {
            ...Vuex.mapGetters([
                'property'
            ])
        }
    });
});
</script>