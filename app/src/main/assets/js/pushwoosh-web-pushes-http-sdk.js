var pushwoosh = {
    PUSHWOOSH_APPLICATION_CODE: "C6CEE-FFEC9",
    PUSHWOOSH_APPLICATION_CODE_GET_PARAMETER: 'pw_application_code',
    init: function (applicationCode) {
        this.PUSHWOOSH_APPLICATION_CODE = applicationCode;
        window.addEventListener('message', this.pwReceiveMessage, false);
    },
    tryInitUsingGetParameter: function () {
        var applicationCode = this.getQueryVariable(this.PUSHWOOSH_APPLICATION_CODE_GET_PARAMETER);
        if (applicationCode) {
            this.init(applicationCode);
        }
    },
    pwReceiveMessage: function (event) {

        if (event.data == 'allowPushNotifications') {
            localStorage.setItem('pwAllowPushNotifications', true);
        }
    },
    isBrowserChrome: function () {
        return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    },
    isBrowserFirefox: function() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    },
    isBrowserSafari: function() {
        return navigator.userAgent.toLowerCase().indexOf('safari') > -1 && !this.isBrowserChrome();
    },
    isBrowserSupported: function() {
        return this.isBrowserChrome();
    },
    subscribeAtStart: function () {
        if (this.isBrowserSupported()) {
            if (null === localStorage.getItem('pwAllowPushNotifications')) {
                this.showSubscriptionWindow();
            }
        }
    },
    isSubscribedForPushNotifications: function () {
        return true == localStorage.getItem('pwAllowPushNotifications');
    },
    showSubscriptionWindow: function () {
        if (this.isBrowserSupported()) {
            var windowWidth = screen.width / 2;
            var windowHeight = screen.height / 2;

            var windowLeft = screen.width / 2 - windowWidth / 2;
            var windowRight = screen.height / 2 - windowHeight / 2;

            var URL = 'https://' + this.PUSHWOOSH_APPLICATION_CODE + '.chrome.pushwoosh.com/';

            var pwSubscribeWindow = window.open(URL, '_blank', 'width=' + windowWidth + ',height=' + windowHeight + ',resizable=yes,scrollbars=yes,status=yes,left=' + windowLeft + ',top=' + windowRight);

        }
    },
    getQueryVariable: function (variable) {
        // be attention document.currentScript not working if this code will be called from function in event lister
        if (document.currentScript) {
            var urlParts = document.currentScript.src.split('?');
            if (typeof urlParts[1] !== 'undefined') {
                var vars = urlParts[1].split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
            }
        }
        else {
            console.error("Cannot get current script address");
        }
        return null;
    }
};
pushwoosh.tryInitUsingGetParameter();