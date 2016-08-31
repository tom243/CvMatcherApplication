/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* company Profile controller ****************
 */
var company = false;
app.controller('companyProfileController',
    function ($scope, $http, $location, $sce, $rootScope, $timeout) {

    	angular.element(document).ready(function () {
            jsHandlerOb.stopMainProgressBar();
        });

        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/company-profile'>Company Profile</a>";
        var companyId, tabType = '';
        $("#geocomplete").geocomplete();
        $("#geocomplete2").geocomplete();
        $scope.chooseCompanyModal = false;
        $scope.passForCompany = '';
        $scope.changePassword = false;
        $scope.password = false;

        //company profile details
        $scope.init = function () {
            $(".navBarImg ul li").removeClass("selected");
            angular.element(".existingCompanis").hide();
            $rootScope.userSignInType = 'employer';
            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id")
                }
            })
                .then(function (data) {
                        if (data) {

                            $scope.employerProfile = data.data[0];
                            console.log(data.data[0]);

                            if (data.data[0].birth_date){
                                var date = data.data[0].birth_date.split("T")[0].split("-");
                                $scope.dateBirth = date[0] + "-" + date[1] + "-" + date[2];
                            }
                            if (data.data[0].company) {
                                console.log('company exist!!!!!!!!!!!!!');
                                angular.element(".password").hide();
                                company = true;
                                companyId = data.data[0].company;
                                if (companyId) {
                                    url = 'https://cvmatcher.herokuapp.com/employer/getCompany';
                                    $http({
                                        url: url,
                                        method: "POST",
                                        data: {
                                            "user_id": localStorage.getItem("user_id")
                                        }
                                    })
                                        .then(function (data) {
                                                if (data) {
                                                    console.log(data);
                                                    logo = data.data[0].logo;
                                                    $scope.companyProfile = data.data[0];
                                                    angular.element(".fa-pulse").hide();
                                                }
                                            },
                                            function (response) { // optional
                                                console.log("companyProfileController AJAX failed!");
                                                console.log(response);
                                                angular.element(".fa-pulse").hide();

                                            });
                                }

                            }
                            else {
                                console.log('company NOTTTTTT exist!!!!!!!!!!!!!');

                                angular.element(".GarrowInput").hide();
                                $(".newPassword").hide();
                                $scope.password = true;
                                angular.element(".fa-pulse").hide();
                            }
                        }
                    },
                    function (response) { // optional
                        angular.element(".fa-pulse").hide();
                        console.log("companyProfileController AJAX failed!");
                    });
        };
        //select specific logo for company - and remove all other selected
        $scope.newLogo = function () {
            console.log($(this).find("img").prevObject[0].logo);
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".logos label"), function () {
                $(this).removeClass('active');
            });
        };
        //bring 10 different logos by user input
        $scope.logo = function (word) {
            angular.element(".fa-pulse").show();
            $http({
                url: "https://cvmatcher.herokuapp.com/getLogoImages",
                method: "POST",
                data: {"word": word}
            }).then(function (data) {
                console.log(data);
                $scope.logos = data.data;
                angular.element(".fa-pulse").hide();
            })
        };
        $(function() {
            $( "#datepicker" ).datepicker();
        });
        //submit the first form - user details
        $scope.submitUserDetails = function () {

            tabType = 'profile';
            var userJson = {
                "_id": localStorage.getItem("user_id"),
                "personal_id": $(".personalId").val(),
                "first_name": $(".firstName").val(),
                "last_name": $(".lastName").val(),
                "birth_date": $(".birthDay").val(),
                "address": $("#geocomplete").val(),
                "email": $(".email").val(),
                "phone_number": $(".phoneNumber").val(),
                "linkedin": $(".linkedin").val()
            };

            $http({
                url: 'https://cvmatcher.herokuapp.com/updateUser',
                method: "POST",
                data: userJson
            })
                .then(function () {
                        $('#update').modal('show');
                        $scope.status = messageResource.get("modal.user.details", 'resources');
                        $scope.tab = 1;
                    },
                    function (response) { // optional
                        $scope.status = "Error User Update!";
                        $scope.status = messageResource.get("modal.user.error", 'resources');
                        console.log(response);
                    });
        };
        //submit the second form - company details
        $scope.submitCompanyDetails = function () {
            var companyJson;
            if (logo == '')
                logo = 'images/logo-default.png';


            $scope.status = '';

            if (!$.isNumeric($(".companyPC").val())) {
                $('#update').modal('show');
                $scope.status = messageResource.get("modal.user.pc", 'resources');
                return;
            }

            if (!company) {
                //noinspection JSDuplicatedDeclaration
                companyJson = {
                    "user_id": localStorage.getItem("user_id"),
                    "name": $(".companyName").val(),
                    "logo": logo,
                    "p_c": $(".companyPC").val(),
                    "address": $("#geocomplete2").val(),
                    "password": $(".passwordCompany").val(),
                    "phone_number": $(".companyPhoneNumber").val()
                };

                console.log("send form: ", companyJson);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/employer/addCompany',
                    method: "POST",
                    data: companyJson
                }).then(function () {
                        company = true;
                        localStorage.setItem("company", true);
                        localStorage.setItem("employerFirstSignIn", true);
                        $('#update').modal('show');
                        $scope.status = messageResource.get("modal.company", 'resources');

                        tabType = 'company';

                        $scope.chooseCompanyModal = false;
                    },
                    function (response) { // optional
                        $scope.status = messageResource.get("modal.company.error", 'resources');
                        console.log(response);
                    });
            }
            else {





                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": localStorage.getItem("user_id")
                    }
                })
                    .then(function (data) {
                        if (data.data[0].company){
                            //push to json new key value
                            companyJson = {
                                "_id": data.data[0].company,
                                "name": $(".companyName").val(),
                                "logo": logo,
                                "p_c": $(".companyPC").val(),
                                "address": $("#geocomplete2").val(),
                                "phone_number": $(".companyPhoneNumber").val()
                            };

                            console.log("send form: ", companyJson);
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/employer/updateCompany',
                                method: "POST",
                                data: companyJson
                            }).then(function () {
                                    localStorage.setItem("company", true);

                                    localStorage.setItem("employerFirstSignIn", true);

                                    tabType = 'company';
                                    $('#update').modal('show');
                                    $scope.status = messageResource.get("modal.company.update", 'resources');

                                    $scope.chooseCompanyModal = false;

                                },
                                function (response) { // optional
                                    $scope.status = messageResource.get("modal.company.error", 'resources');
                                    console.log(response);
                                });

                            //send new password
                            if ($scope.changePassword == true) {
                                $http({
                                    url: 'https://cvmatcher.herokuapp.com/employer/changeCompanyPassword',
                                    method: "POST",
                                    data: {
                                        "company_id": $scope.employerProfile['company'],
                                        "old_password": $(".passwordCompany").val(),
                                        "new_password": $(".newPasswordCompany").val()
                                    }
                                }).then(function () {
                                        $('#update').modal('show');
                                        $scope.status = messageResource.get("modal.company", 'resources');
                                    },
                                    function (response) { // optional
                                        $scope.status = messageResource.get("modal.password.wrong", 'resources');
                                        console.log(response);
                                    });
                            }
                        }
                            })
            }

        };
        //change password mechanizem
        $scope.changePasswordSect = function () {
            $scope.changePassword = true;
            angular.element(".password").toggle();
        };
        //get all compenies in our DB - for fast connect
        $scope.getCompanies = function () {
            $scope.chooseCompanyModal = false;
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getCompanies',
                method: "GET"
            }).then(function (data) {
                    console.log(data);
                    $scope.companies = data.data;
                },
                function (response) { // optional
                    $scope.status = messageResource.get("modal.get.companies", 'resources');
                    console.log(response);
                });
        };
        //select specific logo for company - and remove all other selected
        $scope.checkCompany = function (id) {
            companyId = id;
            $scope.chooseCompanyModal = true;
            $('#update').modal('show');
            $scope.status = messageResource.get("modal.password", 'resources');
            //remove the v check mark from other buttons
            logo = $(this).find("img").prevObject[0].logo;
            $.each($(".companies label"), function () {
                $(this).removeClass('active');
            });
        };
        //end password to server by selectig specific company
        $scope.sendPassword = function () {
            var pass = $scope.passForCompany;
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/addToExistingCompany',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "company_id": companyId,
                    "password": pass
                }
            }).then(function (data) {
                    $scope.companyProfile = data.data[0];
                },
                function (response) { // optional
                    $scope.status = messageResource.get("modal.password.wrong", 'resources');
                    $('#wrong').modal('show');
                    $scope.passForCompany = '';
                    console.log(response);
                });
        };

        $scope.signExistingCompany = function () {
            angular.element(".existingCompanis").toggle();
        };
    });
