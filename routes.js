define([], function () {
    return [
        {
            path: '/',
            component: view('home')
        },
        {
            path: '/contact-us',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('contact'),
                    meta: {
                        pageName: 'Contact Us',
                    },
                    name: 'contact'
                }
            ]
        },
        {
            path: '/dine',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('dine'),
                    meta: {
                        pageName: 'Dine',
                    },
                    name: 'dine'
                }
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
            path: '/jobs',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('jobs'),
                    meta: {
                        pageName: 'Careers',
                    },
                    name: 'jobs'
                },
                {
                    path: ':id',
                    component: view('job_details'),
                    meta: {
                        pageName: 'Careers',
                    },
                    name: 'jobDetails',
                    props: true
                }
            ]
        },
        {
            path: '/location',
            component: view('default'),
            children: [
                {   
                    path: '',
                    component: view('location'),
                    meta: {
                        pageName: 'Location',
                    },
                    name: 'location'
                }
            ]
        },
        {
            path: '/map',
            component: view('default'),
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
            path: '/newsletter',
            component: view('default'),
            meta: {
                breadcrumb: 'Newsletter Sign-Up',
            },
            children: [
                {
                    path: '',
                    component: view('newsletter'),
                    name: 'newsletter'
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
        // {
        //     path: '/promotions',
        //     component: view('default'),
        //     meta: {
        //         breadcrumb: 'Sales & Promotions',
        //     },
        //     children: [
        //         {
        //             path: '',
        //             component: view('promotions'),
        //             name: 'promotions'
        //         },
        //         {
        //             path: ':id',
        //             component: view('promotion_details'),
        //             meta: {
        //                 breadcrumb: 'Promotion Details',
        //             },
        //             name: 'promotionDetails',
        //             props: true
        //         }
        //     ]
        // },
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
