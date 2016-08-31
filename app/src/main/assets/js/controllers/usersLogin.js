/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* usersLogin controller ****************
 */

var user;
app.controller('usersLoginController', function ($scope, $http, $sce, $rootScope) {

	angular.element(document).ready(function () {
        jsHandlerOb.stopUsersProgressBar();
    });

    var user = jsHandlerOb.retriveUserDetails();
    localStorage.setItem("user", user);

    var firstSignIn = true;

    //initialize for this controller
    $scope.init = function () {
        $(".fa-spinner").hide();
        $rootScope.userSignInType = 'usersLogin';
        //noinspection JSValidateTypes
        angular.element("#profileImg").parent().attr("href", '#/');
        //noinspection JSValidateTypes
        angular.element("#profileImg").parent().show();
        $http({
            url: 'https://cvmatcher.herokuapp.com/getUserId',
            method: "POST",
            data: {
                "google_user_id": $.parseJSON(localStorage.getItem("user")).id
            }
        }).then(function (data) {
                if (data.data) {
                    firstSignIn = false;
                    //user_id exist - user logged in before.
                    if ($.isArray(data.data)) {
                        localStorage.setItem('user_id', data.data[0]._id);
                        $rootScope.user_id = data.data[0]._id;
                    }
                    else {
                        localStorage.setItem('user_id', data.data._id);
                        $rootScope.user_id = data.data._id;
                    }
                }
                else if (data.data == false) {
                    firstSignIn = true;
                    //first sign in
                    console.log($.parseJSON(localStorage.getItem("user")));
                    var givenName = $.parseJSON(localStorage.getItem("user")).name.split(" ")[0];
                    var familyName = $.parseJSON(localStorage.getItem("user")).name.split(" ")[1];
                    var id = $.parseJSON(localStorage.getItem("user")).id;
                    var emails = $.parseJSON(localStorage.getItem("user")).emails;

                    if (givenName == '') {
                        givenName = "Name";
                    }
                    if (familyName == '') {
                        familyName = "Family";
                    }

                    //first login!
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/addUser',
                        method: "POST",
                        data: {
                            "google_user_id": id,
                            "first_name": givenName,
                            "last_name": familyName,
                            "email": emails
                        }
                    }).then(function (data) {
                            if ($.isArray(data.data)) {
                                localStorage.setItem('user_id', data.data[0]._id);
                                $rootScope.user_id = data.data[0]._id;
                            }
                            else {
                                localStorage.setItem('user_id', data.data._id);
                                $rootScope.user_id = data.data._id;
                            }

                            sockets();
                        },
                        function (response) { // optional
                            console.log("addUser AJAX failed!");
                            console.log(response);
                        });
                }
            },
            function (response) { // optional
                console.log("getUserId AJAX failed!");
                console.log(response);
            });

    }
    //set user type and bring correct ajax
    $scope.userType = function (type) {
        $(".fa-spinner").show();
        if (type == 'employer') {
            localStorage.setItem("profile", "#/company-profile");
            localStorage.setItem("userSignInType", 'employer');
            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem('user_id')
                }
            }).then(function (data) {
                $(".fa-spinner").hide();
                console.log(data);
                if (typeof data.data[0].company == 'undefined') {
                    jsHandlerOb.moveToEmployerActivity("company-profile");
                }else {
                    jsHandlerOb.moveToEmployerActivity("myjobs");
                }
            });


        }
        else if (type == 'jobSeeker') {
            $(".fa-spinner").hide();
            localStorage.setItem("userSignInType", 'jobSeeker');
            localStorage.setItem("profile", "#/profile");
            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem('user_id')
                }
            }).then(function (data) {
                if (typeof data.data[0]['current_cv'] == 'undefined') {
                    jsHandlerOb.moveToJobSeekerActivity("profile");
                }else {
                    jsHandlerOb.moveToJobSeekerActivity("search-jobs");
                }
            });


        }
    }
});
