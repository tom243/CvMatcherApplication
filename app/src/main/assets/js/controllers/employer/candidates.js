/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Candidates controller ****************
 */
app.controller('candidatesController',
    function ($scope, $http, $location, $sce, $rootScope) {


        var stars = 0;
        $id = $location.path().split('/');
        $scope.jobPage = '';
        var candidates = [];
        //init function to bring all the unread cv's
        $scope.unreadCvs = function () {
            if (localStorage.getItem('archive') == 'true') {
                $scope.archivePage = true;
                $scope.jobId = $id[3];
            }
            else {
                $scope.archivePage = false;
                $scope.jobId = $id[2];
            }

            angular.element(".fa-pulse").show();
            $scope.candidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getUnreadCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "job_id": $scope.jobId
                }
            })
                .then(function (data) {

                        candidates = [];
                        localStorage.setItem("candidates", candidates);
                        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/candidates/" + $id[2] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a>";
                        $scope.candidates = data.data;
                        $scope.candidatesLength = $scope.candidates.length+ " CV's";
                        if (data.data.length == 0)
                            $scope.candidatesLength = "There is No CV's to show";
                        $rootScope.unreadCandidates = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();

                        $.each(data.data, function (k, v) {
                            candidates.push(v._id);
                            localStorage.setItem("candidates", candidates);
                        });

                    },
                    function (response) { // optional
                        console.log("unreadCvs AJAX failed!");
                        console.log(response);
                    });
        };
        //bring all the like cv's
        $scope.likedCvs = function () {

            candidates = [];
            localStorage.setItem("candidates", candidates);
            $scope.likeCandidates = '';

            angular.element(".fa-pulse").show();
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "job_id": $scope.jobId,
                    "current_status": "liked"
                }
            })
                .then(function (data) {
                        $rootScope.likeCandidates = data.data;
                        $scope.likeCandidates = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();

                        $scope.candidatesLength = $scope.likeCandidates.length + " Like CV's";
                        if (data.data.length == 0)
                            $scope.candidatesLength = "There is No CV's to show";

                        $.each(data.data, function (k, v) {
                            candidates.push(v._id);
                            localStorage.setItem("candidates", candidates);
                        });

                    },
                    function (response) { // optional
                        console.log("likedCvs AJAX failed!");
                        console.log(response);

                    });
        };
        //bring all the unlike cv's
        $scope.unlikeCvs = function () {
            candidates = [];
            localStorage.setItem("candidates", candidates);
            angular.element(".fa-pulse").show();
            $scope.unlikeCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getRateCvsForJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "job_id": $scope.jobId,
                    "current_status": "unliked"
                }
            })
                .then(function (data) {
                        $rootScope.unlikeCandidates = data.data;
                        $scope.unlikeCandidates = data.data;
                        console.log(data.data);
                        angular.element(".fa-pulse").hide();
                        $.each(data.data, function (k, v) {
                            candidates.push(v._id);
                            localStorage.setItem("candidates", candidates);

                        });

                        $scope.candidatesLength = $scope.unlikeCandidates.length + " Unlike CV's";
                        if (data.data.length == 0)
                            $scope.candidatesLength = "There is No CV's to show";
                    },
                    function (response) { // optional
                        console.log("unlikeCvs AJAX failed!");
                        console.log(response);
                    });
        };
        //bring all the hired cv's
        $scope.Hired = function () {
            candidates = [];
            localStorage.setItem("candidates", candidates);
            angular.element(".fa-pulse").show();
            $scope.hiredCandidates = '';
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/getHiredCvs',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "job_id": $scope.jobId
                }
            }).then(function (data) {
                    console.log(data.data);
                    $scope.hiredCandidates = data.data;
                    angular.element(".fa-pulse").hide();
                    $.each(data.data, function (k, v) {
                        candidates.push(v._id);
                        localStorage.setItem("candidates", candidates);
                    });


                    $scope.candidatesLength = $scope.hiredCandidates.length + "  Hired CV's";
                    if (data.data.length == 0)
                        $scope.candidatesLength = "There is No CV's to show";


                },
                function (response) { // optional
                    console.log("Hired AJAX failed!");
                    console.log(response);
                });
        };
        //sort by user type
        $scope.sort = function (sort) {
            $scope.sortby = sort;
        };
        //add candidate to like cv's for specific job
        $scope.addCandidateToLike = function (candidate, user_id) {
            var candidatesArr;
            $scope.user_id = user_id;
            if (angular.element("#candidateLike-" + candidate).hasClass(
                    "like")) {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "like").addClass("unlike");
                $scope.userId = candidate;
                $(".leftModal").click();
                //noinspection JSDuplicatedDeclaration
                candidatesArr = $scope.likeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.likeCandidates = candidatesArr;

            }
            else {
                angular.element("#candidateLike-" + candidate).removeClass(
                    "unlike").addClass("like");
                $scope.userId = candidate;
                $(".starModal").click();
                //noinspection JSDuplicatedDeclaration
                candidatesArr = $scope.unlikeCandidates;
                candidatesArr = candidatesArr.filter(function (obj) {
                    return obj._id !== candidate;
                });
                $scope.unlikeCandidates = candidatesArr;

            }
        };
        //rate candidate by stars
        $scope.rating = function (rateNumber) {
            stars = rateNumber;

        };
        //hire candidate to job
        $scope.hire = function (cvId) {
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/hireToJob',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem("user_id"),
                    "cv_id": cvId
                }
            })
                .then(function () {
                        //remove from list filter

                        $http({
                            url: 'https://cvmatcher.herokuapp.com/employer/getCompany',
                            method: "POST",
                            data: {
                                "user_id": localStorage.getItem("user_id")
                            }
                        })
                            .then(function (data) {
                                    if (data) {
                                        console.log('getCompany', data);
                                        var companyName = data.data[0].name;

                                        $http({
                                            url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                            method: "POST",
                                            data: {
                                                "user_id": $scope.user_id,
                                                "message": "Congratulations!! you have been hired by company " + companyName + " for  job: " + localStorage.getItem("jobTitle")

                                            }
                                        }).then(function (data) {
                                                console.log(data.data);
                                            },
                                            function (response) { // optional
                                                console.log("Hired notification AJAX failed!");
                                                console.log(response);
                                            });

                                        var canArr = $rootScope.likeCandidates;
                                        canArr = canArr.filter(function (obj) {
                                            return obj._id !== cvId;
                                        });
                                        $rootScope.likeCandidates = canArr;
                                        $scope.likeCandidates = canArr;

                                    }
                                },
                                function (response) { // optional
                                    console.log("getCompany AJAX failed!");
                                    console.log(response);

                                });


                    },
                    function (response) { // optional
                        console.log("Hired AJAX failed!");
                        console.log(response);
                    });
        };
        //bring next candidates by slide right or left - or press hands icon.
        $scope.bringNextCandidate = function (type, description, id) {
            console.log(type);

            $("#comment").val("");
            $http({
                url: 'https://cvmatcher.herokuapp.com/employer/updateRateCV',
                method: "POST",
                data: {
                    "cv_id": id,
                    "status": {
                        "current_status": type,
                        "stars": stars,
                        "description": description,
                        "timestamp": new Date
                    },
                    "user_id": localStorage.getItem("user_id")

                }

            }).then(function (data) {
                    console.log("updateRateCV: ", data);
                    $http({
                        url: 'https://cvmatcher.herokuapp.com/employer/getCompany',
                        method: "POST",
                        data: {
                            "user_id": localStorage.getItem("user_id")
                        }
                    })
                        .then(function (data) {
                            if (data) {
                                var companyName = data.data[0].name;
                                console.log('scope.user_id: ' + $scope.user_id);
                                if (type == 'unliked') {
console.log(description);
                                    $http({
                                        url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                        method: "POST",
                                        data: {
                                            "user_id": $scope.user_id,
                                            "message": "The employer from company " + companyName + " didn't liked your cv for job: " + localStorage.getItem("jobTitle") + " with the reason of: " + description
                                        }
                                    }).then(function (data) {
                                            console.log(data.data);
                                        },
                                        function (response) { // optional
                                            console.log("unlike notification AJAX failed!");
                                            console.log(response);
                                        });
                                }
                                else if (type == 'liked') {

                                    console.log(stars);
                                    $http({
                                        url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                        method: "POST",
                                        data: {
                                            "user_id": $scope.user_id,
                                            "message": "The employer from company " + companyName + " liked your cv for job " + localStorage.getItem("jobTitle") + " with the amount of " + stars + " stars"
                                        }
                                    }).then(function (data) {
                                            console.log(data.data);
                                        },
                                        function (response) { // optional
                                            console.log("like notification AJAX failed!");
                                            console.log(response);
                                        });
                                }
                            }
                        },
                        function (response) { // optional
                            console.log("getCompany  AJAX failed!");
                            console.log(response);
                        });


                },
                function (response) { // optional
                    console.log("updateRateCV AJAX failed!");
                    console.log(response);
                });

        }

    });
