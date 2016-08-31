/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* DIRECTIVES ****************
 */

var loadedPlatformScript = false;

// google Button
app.directive("compileGoogle", function ($compile) {
    return {
        link: function (scope, element) {
            element
                .html($compile(
                    '<div id="gConnect"><button id="signin-button" data-scope="email"> </button></div>')(scope));
            $.getScript("https://apis.google.com/js/client:platform.js?onload=startApp");

        }
    }
});
//check if connected to google - refresh action
app.directive("checkGoogleLogIn", function () {
    return {
        link: function () {
            $.getScript("https://apis.google.com/js/client:platform.js?onload=startApp");
        }
    }
});
// focus on searchBox
app.directive('focus', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element[0].focus();
        }
    }
});
// compabtility level
app.directive('circle', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var circle;
            // COMPABILITY
            $timeout(function () {
                circle = new ProgressBar.Circle("#" + attr.id, {
                    color: '#2196F3',
                    strokeWidth: 10,
                    fill: '#000'
                });

                scope.$watch('compability', function (newValue) {
                    if (newValue) {
                        circle.animate(newValue / 100, function () {
                        })
                        angular.element("#circle-container-0 > h5")[0].innerHTML = newValue + "%";
                    }
                }, true);

                circle.animate(attr.compability / 100, function () {
                })
                return circle;
            });
        }
    }
});
// append for profile image
app.directive('profileimg', function ($compile) {
    return {
        replace: true,
        restrict: 'EA',
        link: function (scope) {
            //userProfileImg
            if (localStorage.getItem("user") !== null) {
                var cookieImg = $.parseJSON(localStorage.getItem("user")).image;
                angular.element("#profilePicture").attr("src",cookieImg);
                angular.element(".profilePictureHam").attr("src",cookieImg);
              //  var e = $compile( '<a ng-href="' + profile + '"><img src="' + cookieImg + '" id="profileImg"></a>')(scope);
              //  $compile(angular.element("#profilePage").replaceWith(e))(scope);
            }
        }
    }
});
//tool tip
app.directive('bsTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

app.directive('myRepeatDirective', function($rootScope) {
    return function(scope, element, attrs) {
        if (scope.$last){
        }
    };
});

