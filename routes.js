define([], function () {
    return [
        {
            path: '/',
            component: view('home')
        },
        {
            path: '/center-information',
            component: view('default'),
            meta: {
                breadcrumb: 'Center Information'
            },
            children: [
                {   
                    path: '',
                    component: view('center_information'),
                    name: 'center-info'
                },
                {
                    path: '/contact-us',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('contact'),
                            meta: {
                                breadcrumb: 'Contact Us'
                            },
                            name: 'contact'
                        }
                    ]
                },
                {
                    path: '/coupons',
                    component: view('default'),
                    meta: {
                        breadcrumb: 'Coupons',
                    },
                    children: [
                        {
                            path: '',
                            component: view('coupons'),
                            name: 'coupons'
                        },
                        {
                            path: ':id',
                            component: view('coupon_details'),
                            meta: {
                                breadcrumb: 'Coupon Details',
                            },
                            name: 'couponDetails',
                            props: true
                        }
                    ]
                },
                {
                    path: '/leasing',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('leasing'),
                            meta: {
                                breadcrumb: 'Leasing'
                            },
                            name: 'leasing'
                        }
                    ]
                },
                {
                    path: '/newsletter',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('newsletter'),
                            meta: {
                                breadcrumb: 'Newsletter Sign-Up',
                            },
                            name: 'newsletter'
                        }
                    ]
                },
            ]
        },
        {
            path: '/events',
            component: view('default'),
            meta: {
                breadcrumb: 'Events',
            },
            children: [
                {
                    path: '',
                    component: view('events'),
                    name: 'events'
                },
                {
                    path: ':id',
                    component: view('event_details'),
                    meta: {
                        breadcrumb: 'Event Details',
                    },
                    name: 'eventDetails',
                    props: true
                }
            ]
        },
        {
            path: '/location',
            component: view('default'),
            meta: {
                breadcrumb: 'Location'
            },
            children: [
                {   
                    path: '',
                    component: view('location'),
                    name: 'location'
                }
            ]
        },
        {
            path: '/pages',
            component: view('default'),
            children: [
                {
                    path: ':id',
                    component: view('page_details'),
                    name: 'pageDetails',
                    props: true
                }
            ]
        },
        {
            path: '/stores',
            component: view('default'),
            meta: {
                breadcrumb: 'Directory',
            },
            children: [
                {   
                    path: '',
                    component: view('stores'),
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    meta: {
                        breadcrumb: 'Store Details',
                    },
                    name: 'storeDetails',
                    props: true
                },
                {
                    path: '/map',
                    component: view('default'),
                    meta: {
                        pageName: 'Centre Map',
                    },
                    children: [
                        {   
                            path: '',
                            component: view('map'),
                            meta: {
                                pageName: 'Centre Map',
                            },
                            name: 'map'
                        }
                    ]
                },
                {
                    path: '/promotions',
                    component: view('default'),
                    meta: {
                        breadcrumb: 'Sales & Promotions',
                    },
                    children: [
                        {
                            path: '',
                            component: view('promotions'),
                            name: 'promotions'
                        },
                        {
                            path: ':id',
                            component: view('promotion_details'),
                            meta: {
                                breadcrumb: 'Promotion Details',
                            },
                            name: 'promotionDetails',
                            props: true
                        }
                    ]
                },
            ]
        },
        {
            path: '/404',
            name: '404',
            component: view('notfoundcomponent')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]

    /*
    * Asynchronously load view (lazy-loading)
    * @param {string} name the filename (basename) of the view to load.
    */
    function view(name) {
        return function(resolve) { require(['vue!' + name + '.vue'], resolve); }
    };
});
