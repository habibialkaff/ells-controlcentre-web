var Ells;
(function (Ells) {
    var constantRoutes = [
        {
            url: '/home',
            configuration: {
                templateUrl: 'app/home/home.html',
                title: 'home',
                settings: {
                    nav: 1,
                    content: '<i class="fa fa-dashboard"></i> Home'
                }
            }
        }, {
            url: '/employee',
            configuration: {
                title: 'employee',
                templateUrl: 'app/employee/employee.html',
                settings: {
                    nav: 2,
                    content: '<i class="fa fa-people"></i> Employee'
                }
            }
        }, {
            url: '/client',
            configuration: {
                title: 'client',
                templateUrl: 'app/client/client.html',
                settings: {
                    nav: 3,
                    content: '<i class="fa fa-people"></i> Client'
                }
            }
        }, {
            url: '/client/detail/:id',
            configuration: {
                templateUrl: 'app/client/clientDetail.html',
                title: 'client detail',
                settings: {}
            }
        }, {
            url: '/login',
            configuration: {
                templateUrl: 'app/auth/login.html',
                title: 'login',
                settings: {}
            }
        }, {
            url: '/signup',
            configuration: {
                templateUrl: 'app/auth/signup.html',
                settings: {}
            }
        }, {
            url: '/refresh',
            configuration: {
                templateUrl: 'app/auth/refresh.html',
                settings: {}
            }
        }, {
            url: '/token',
            configuration: {
                templateUrl: 'app/auth/token.html',
                settings: {}
            }
        }, {
            url: '/associate',
            configuration: {
                templateUrl: 'app/auth/associate.html',
                settings: {}
            }
        }
    ];

    app.constant('routes', constantRoutes);
})(Ells || (Ells = {}));
//# sourceMappingURL=routes.js.map
