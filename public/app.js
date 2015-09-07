//pre-registers jquery to be used in other modules
var $ = require('jquery');
window.$ = $;
window.jQuery = $;


//register js modules
var React = require('react'),
    bootstrap = require('bootstrap'),
    angular = require('angular'),
    ngBootstrap = require('angular-bootstrap'),
    ngCookies = require('angular-cookies'),
    ngResource = require('angular-resource'),
    ngSanitize = require('angular-sanitize'),
    ngTouch = require('angular-touch'),
    uiRouter = require('angular-ui-router'),
    blockUi = require('block-ui'),
    bootstrap = require('bootstrap'),
    bootstrapHover = require('bootstrap-hover-dropdown'),
    bootstrapSwitch = require('bootstrap-switch'),
    es5Shim = require('es5-shim'),
    jqueryUi = require('jquery-ui'),
    jqueryUniform = require('jquery-uniform'),
    jsTree = require('jstree'),
    knockout = require('knockout'),
    lodash = require('lodash'),
    migrate = require('migrate'),
    ocLazyLoad = require('oclazyload'),
    slimScroll = require('slimscroll'),
    moment = require('moment'),
    LocalStorageModule = require('angular-local-storage'),
    bcrypt = require('bcrypt-nodejs');

    //Globally accessible
    window.moment = moment;
    window.slimScroll = slimscroll;
    window.lodash = lodash;

//register styles
var Styles = {
    bootstrap: require('bootstrap/dist/css/bootstrap.css'),
    fontAwesome: require('font-awesome/css/font-awesome.css'),
    simpleLineIcons: require('simple-line-icons/css/simple-line-icons.css'),
    jsTree: require('jstree/dist/themes/default/style.min.css'),
    uniform: require('./theme/assets/global/plugins/uniform/css/uniform.default.css'),
    bootstrapSwitch: require('./theme/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.css'),
    components: require('./theme/assets/global/css/components.css'),
    plugins: require('./theme/assets/global/css/plugins.css'),
    layout: require('./theme/assets/admin/layout/css/layout.css'),
    darkBlue: require('./theme/assets/admin/layout/css/themes/darkblue.css'),
    custom: require('./theme/assets/admin/layout/css/custom.css'),
    gridStack: require('./theme/js/scripts/gridstack.css'),
    ngTree: require('./theme/js/scripts/dist/angular-ui-tree.min.css'),
    demo: require('./theme/js/scripts/css/demo.css'),
    ngTreeView: require('./theme/js/scripts/css/angular.treeview.css')
};
