/** **********************************ANGULAR*************************************** */
//TODO: open all sendNotification functions calls!
var app = angular.module('cvmatcherApp', ["ngRoute", "infinite-scroll", 'ngDragDrop']);
app.config(function ($routeProvider) {
        $routeProvider
        // employer
            .when('/', {
                templateUrl: 'googleSignIn.html',
                controller: 'googleSignInController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
                        if (checkPopOverOpenOrClose)
                            $('#profilePicture').popover('hide');

                        $rootScope.userSignInType = '';
                        if (localStorage.getItem("user_id") !== null) {
                            $location.path('/login');
                        }
                    }
                }
            }).when('/login', {
            templateUrl: 'usersLogin.html',
            controller: 'usersLoginController',
            resolve: {
                resolvedVal: function ($rootScope) {
                    //don't use here in checkProfile function - different Path!
                    if (localStorage.getItem("profile")) {
                        $rootScope.imgProfile = $.parseJSON(localStorage.getItem("user")).image;
                        $rootScope.Profile = localStorage.getItem("profile").split("/")[1];
                        $rootScope.content = "<a href='' onclick=logout('logout')>Log Out</a><a href='' onclick=logout('signout')>Sign Out</a>";
                    }

                    var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
                    if (checkPopOverOpenOrClose)
                        $('#profilePicture').popover('hide');

                    $rootScope.userSignInType = '';
                }
            }
        }).when('/myjobs', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('myJobs');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('candidates');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/archive/candidates/:_id', {
            templateUrl: 'employer/candidates.html',
            controller: 'candidatesController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('candidates');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/like/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('resume');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/hired/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('resume');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/unlike/candidates/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('resume');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/unread/:id/resume/:_id', {
            templateUrl: 'employer/resume.html',
            controller: 'resumeController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('resume');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/archive', {
            templateUrl: 'employer/myjobs.html',
            controller: 'myjobsController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('myJobs');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/hired', {
            templateUrl: 'employer/hired.html',
            controller: 'hiredController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('hired');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/job/:_id', {
            templateUrl: 'employer/job.html',
            controller: 'jobController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('job');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/company-profile', {
            templateUrl: 'employer/company_profile.html',
            controller: 'companyProfileController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('companyProfile');
                    checkProfile($rootScope, 'Company Profile');
                    return changeLocation($location, '#/company-profile', "employer");
                }
            }
        }).when('/new-job', {
                templateUrl: 'employer/job.html',
                controller: 'jobController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        loadCSS('job');
                        checkProfile($rootScope, 'Company Profile');
                        return changeLocation($location, '#/company-profile', "employer");
                    }
                }
            })
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////// job seeker///////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            .when('/search-jobs', {
                templateUrl: 'job_seeker/search_jobs.html',
                controller: 'jobSeekerSearchJobsController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {
                        loadCSS('searchJobs');
                        checkProfile($rootScope, 'Profile');
                        return changeLocation($location, '#/profile', 'jobSeeker');
                    }
                }
            }).when('/yourjobs', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('searchJobs');
                    loadCSS('yourJobs');
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/deleted', {
            templateUrl: 'job_seeker/yourjobs.html',
            controller: 'yourjobSeekerController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('searchJobs');
                    loadCSS('yourJobs');
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/search-jobs/:_id/matchpage', {
            templateUrl: 'job_seeker/matchpage.html',
            controller: 'matchpageController',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('match');
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/profile', {
            templateUrl: 'job_seeker/profile.html',
            controller: 'seekerProfileControler',
            resolve: {
                resolvedVal: function ($location, $rootScope) {
                    loadCSS('profile');
                    loadCSS('cvPreview');
                    checkProfile($rootScope, 'Profile');
                    return changeLocation($location, '#/profile', 'jobSeeker');
                }
            }
        }).when('/favorites', {
                templateUrl: 'job_seeker/yourjobs.html',
                controller: 'yourjobSeekerController',
                resolve: {
                    resolvedVal: function ($location, $rootScope) {

                        loadCSS('searchJobs');
                        loadCSS('yourJobs');
                        checkProfile($rootScope, 'Profile');
                        return changeLocation($location, '#/profile', 'jobSeeker');
                    }
                }
            })
    })
    .run(function ($rootScope) {

        if (localStorage.getItem("userSignInType")) {
            $rootScope.userSignInType = localStorage.getItem("userSignInType");
        }
        else {
            $rootScope.userSignInType = '';
        }
        //notification window accept
        document.addEventListener('DOMContentLoaded', function () {
            if (Notification.permission !== "granted")
                Notification.requestPermission();
        });

        if (localStorage.getItem("user_id")) {
            console.log("a");
            user_id = localStorage.getItem("user_id");
            //set the header navigation
            $rootScope.user_id = user_id;

        }
    })
    .filter('highlight', function ($sce) {
        return function (text, phrase) {
            if (phrase){
                phrase = phrase.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
                    '<span class="highlighted">$1</span>');
            }
            //noinspection JSUnresolvedFunction
            return $sce.trustAsHtml(text)
        }
    });

/*
 * ********************* JS Functions ****************
 */

var socket;
var url;
var user_id;


//resolve function to make initializion before controllers
function changeLocation(location, profilePath, userSignInType) {
    $(".navBarImg").removeClass('hidden');
    var checkPopOverOpenOrClose = $('#profilePicture').attr('aria-describedby');
    if (checkPopOverOpenOrClose)
        $('#profilePicture').popover('hide');
    localStorage.setItem("userSignInType", userSignInType);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().attr("href", profilePath);
    //noinspection JSValidateTypes
    angular.element("#profileImg").parent().show();
    if (localStorage.getItem("user_id") === null) {
        console.log("no user id - changeLocation function at site.js");
        location.path('/');
    }
}


function checkProfile($rootScope, str) {
    if (localStorage.getItem("profile")) {
        $rootScope.imgProfile = $.parseJSON(localStorage.getItem("user")).image;
        $rootScope.Profile = localStorage.getItem("profile").split("/")[1];
        var location = $rootScope.Profile;
        console.log(location);
        if ($rootScope.Profile == 'company-profile')
            location = 'company-profile';
        else
            location = 'profile';
        $rootScope.content = "<a href='#/" + location + "'>" + str + "</a><a href='' onclick=logout('logout')>Log Out</a><a href='' onclick=logout('signout')>Sign Out</a>";
    }
}
// initialize messageResource.js with settings
messageResource.init({
    // path to directory containing message resource files(.properties files),
    // give empty string or discard this configuration if files are in the
    // same directory as that of html file.
    filePath: 'resources/'
});

var resourcesCallback = function () {
    // console.log("resources.properties loaded");
};

messageResource.load('resources', resourcesCallback);

$(document).ready(function () {
    $("[data-toggle = 'popover']").popover();
    //click event outside profile picture.
    $('html:not("#profilePicture")').click(function (e) {
        if (e.target.id != 'profilePicture') {
            $('#profilePicture').popover('hide');
        }
    });

    //popover small modal
    $('.navBar').popover({
        selector: '[data-popover]',
        trigger: 'click',
        content: '',
        placement: 'auto',
        delay: {show: 400, hide: 1500}
    });


    $("#logo").click(function () {
        console.log("A");
        $(".navbar-collapse").collapse('hide');
    });

});

function skillsBar() {
    $('.skillbar').skillBars({
        from: 0,
        speed: 4000,
        interval: 100,
        decimals: 0,
    });
}
function loadCSS(str){

    if($('link[rel*=style][href="css/pages/'+str+'.css"]').length==0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "css/pages/" + str + ".css"
        }).appendTo("head");
    }
}
