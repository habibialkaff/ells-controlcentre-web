app.directive('ccWidgetHeader', function () {
    //Usage:
    //<div data-cc-widget-header title="vm.map.title"></div>
    var directive = {
        link: link,
        scope: {
            'title': '@',
            'subtitle': '@',
            'rightText': '@',
            'allowCollapse': '@'
        },
        templateUrl: '/app/layout/widgetheader.html',
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
        attrs.$set('class', 'widget-head');
    }
});

app.directive('ccWidgetMinimize', function () {
    // Usage:
    // <a data-cc-widget-minimize></a>
    // Creates:
    // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
    var directive = {
        link: link,
        template: '<i class="fa fa-chevron-up"></i>',
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
        //$('body').on('click', '.widget .wminimize', minimize);
        attrs.$set('href', '#');
        attrs.$set('wminimize');
        element.click(minimize);

        function minimize(e) {
            e.preventDefault();
            var $wcontent = element.parent().parent().next('.widget-content');
            var iElement = element.children('i');
            if ($wcontent.is(':visible')) {
                iElement.removeClass('fa fa-chevron-up');
                iElement.addClass('fa fa-chevron-down');
            } else {
                iElement.removeClass('fa fa-chevron-down');
                iElement.addClass('fa fa-chevron-up');
            }
            $wcontent.toggle(500);
        }
    }
});
//# sourceMappingURL=dataWidget.js.map
