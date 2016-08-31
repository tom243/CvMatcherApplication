/**
 * Created by Roni on 30/05/2016.
 */


/*
 * ********************* resume controller ****************
 */
var candidateId;
var skills = [];
app.controller('resumeController',
    function ($scope, $http, $location, $timeout, $rootScope) {

    	angular.element(document).ready(function () {
            jsHandlerOb.stopMainProgressBar();
        });

        var candidates;
        var id;
        var users;
        var rateStars;
        var colorsArr = ["#106332", "#0F8742", "#58B647", "#1FB24A", "#1EAE6D", "#3DB98C", "#48C1C3",
            "#71CBD2", "#7BD0E5", "#AFE0E9", "#BFDEDF"];

        var colorIndex = 0;

        $id = $location.path().split('/');

        $scope.predictTrue = messageResource.get("predict.true", 'resources');
        $scope.predictFalse = messageResource.get("predict.false", 'resources');

        //initialize parameters for this controller
        $scope.init = function () {
            $scope.hiredPage = false;
            $("#predictAppend").hide();
            $("#users").hide();
            // circle animation
            if ($id[5])
                id = $id[5];
            else
                id = $id[4];

            // if i came from Unread page
            if ($id[1] == "unread") {
                $("#candidateUnLike").show();
                $("#candidateLike").show();
                //noinspection JSDuplicatedDeclaration
                users = document.getElementById('users');
                // create a simple instance
                // by default, it only adds horizontal recognizers
                $user = new Hammer(users);
                // SWIPE LEFT - USER
                $user.on("swipeleft", function () {
                    $("#candidateUnLike").click();
                });
                // SWIPE RIGHT - USER
                $user.on("swiperight", function () {
                    $("#candidateLike").click();
                });
            }
            if ($id[1] == "candidates") {
                $("#candidateUnLike").show();
                $("#candidateLike").show();
                users = document.getElementById('users');
                // create a simple instance
                // by default, it only adds horizontal recognizers
                $user = new Hammer(users);
                // SWIPE LEFT - USER
                $user.on("swipeleft", function () {
                    $(".bringNextCandidate").click();
                });
                // SWIPE RIGHT - USER
                $user.on("swiperight", function () {
                    $(".bringNextCandidate").click();
                });
            }

            if (localStorage.getItem('archive') == 'true') {
                $scope.archivePage = true;
            }
            else {
                $scope.archivePage = false;
            }


            if ($id[1] == "hired") {
                $scope.hiredPage = true;

            }

            angular.element('[data-toggle="tooltip"]').tooltip();


        }
        //get user resume - by id
        $scope.getUserJson = function () {
            $http({
                url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                method: "POST",
                data: {
                    "matching_object_id": id,
                    "matching_object_type": "cv"
                }
            })
                .then(function (data) {
                        $("#users").show();
                        var navigation;
                        if ($id[1] == "hired")
                            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/candidates/" + $id[3] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/unread/" + $id[2] + "/resume/" + id + "'>Hired " + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        else if ($id[1] == "unread")
                            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/candidates/" + $id[2] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"
                        else
                            navigation = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/candidates/" + $id[3] + "'>Candidates of " + localStorage.getItem("jobTitle") + "</a><span> > </span><a href='#/unread/" + $id[2] + "/resume/" + id + "'>" + data.data[0].user.first_name + " " + data.data[0].user.last_name + " Resume</a>"

                        $(".navigation")[0].innerHTML = navigation;
                        $scope.user = data.data[0];
                        console.log(data.data[0]);
                        $scope.user_id = data.data[0].user._id;
                        angular.element(".fa-pulse").hide();

                        $scope.user["stars"] = 0;
                        if ($id[1] == "unread") {
                            $scope.user["stars"] = 0;


                            console.log(id);
                            console.log(localStorage.getItem("user_id"));
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/employer/rateCV',
                                method: "POST",
                                data: {
                                    "cv_id": id,
                                    "status": {
                                        "current_status": 'seen',
                                        "stars": 0,
                                        "description": '',
                                        "timestamp": new Date
                                    },
                                    "user_id": localStorage.getItem("user_id")
                                }
                            }).then(function () {

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
                                                        "message": "The employer viewed your cv for job " + localStorage.getItem("jobTitle")
                                                    }
                                                }).then(function () {

                                                        console.log($scope.user_id);
                                                        console.log($id[2]);

                                                    },
                                                    function (response) { // optional
                                                        console.log("sendNotification notification AJAX failed!");
                                                        console.log(response);
                                                    });
                                            }
                                        })


                                },
                                function (response) { // optional
                                    console.log("rateCV notification AJAX failed!");
                                    console.log(response);
                                });
                        }

                        if (data.data[0].formula !== undefined) {


                            $(".resumeWrapper #formulasAppend").append(
                                '<p>' + messageResource.get("employer.formula", "resources") + '</p>' +
                                '<p>' + messageResource.get("employer.formula.candidate_type", "resources") + " <span class='redGrade'>" + data.data[0].formula.candidate_type + '%</span></p>' +
                                '<p>' + messageResource.get("employer.formula.requirements", "resources") + " <span class='redGrade'>" + data.data[0].formula.matching_requirements.grade + '%</span></p>' +
                                '<p>' + messageResource.get("employer.formula.locations", "resources") + " <span class='redGrade'>" + data.data[0].formula.locations + '%</span></p>' +
                                '<p>' + messageResource.get("employer.formula.scope_of_position", "resources") + " <span class='redGrade'>" + data.data[0].formula.scope_of_position + '%</span></p>' +
                                '<p>' + messageResource.get("employer.formula.academy", "resources") + " <span class='redGrade'>" + data.data[0].formula.academy + '%</span></p>'
                            );
                        }

                        if (data.data[0].predict_result !== 'undefined' && data.data[0].predict_result == true || data.data[0].predict_result == false) {
                            $("#predictAppend").show();
                        }
                        else {
                            $("#predictAppend").hide();
                        }

                        //formula requirements
                        if (data.data[0].formula)
                            if (data.data[0].formula.matching_requirements.grade > 0) {

                                var skillsFromJson = data.data[0].formula.matching_requirements.details;

                                $.each(skillsFromJson, function (key, value) {
                                    if (value.grade == 0)
                                        return;
                                    var color = colorsArr[colorIndex];
                                    $(".resumeWrapper .requirements-skills-bar").append('<div class="skillbar" data-percent=' + value.grade + ' >' +
                                        '<span class="skillbar-title">' + value.name + '' +
                                        '</span><p class="skillbar-bar" style="background: ' + color + ';">' +
                                        '</p><span class="skill-bar-percent"></span></div>');
                                    colorIndex++;
                                    if (colorIndex > colorsArr.length - 1) {
                                        colorIndex = 0;
                                    }

                                });

                                $(".resumeSkillsBox").show();
                                skillsBar();

                            }
                            else {

                                $(".skillsTitle").hide();
                                $(".resumeWrapper .requirements-skills-bar").hide();
                                $(".resumeSkillsBox").hide();
                                $(".resumeSkillsBox > h3").html("There is no Skills for this Candidate!");
                            }
                    },
                    function (response) { // optional
                        console.log("resumeController AJAX failed!");
                        console.log(response);
                    });
        };
        //rate user stars

        $scope.rating = function (rateNumber) {
            $scope.user["stars"] = rateNumber;
            rateStars = rateNumber;

        };
        //add candidate to like or unlike
        $scope.addCandidateToLikeUnlike = function (candidate, likeORunlike) {
            candidateId = candidate;
            if (likeORunlike == 'liked') {
                if (angular.element("#candidateLike")
                        .hasClass("fa-thumbs-o-up"))
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-o-up").addClass("fa-thumbs-up");
                else
                    angular.element("#candidateLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $(".starModal").click();
            }
            if (likeORunlike == 'unliked') {
                if (angular.element("#candidateUnLike").hasClass(
                        "fa-thumbs-o-up"))
                    angular.element("#candidateUnLike").removeClass(
                        "fa-thumbs-o-up").addClass("fa-thumbs-up");
                else
                    angular.element("#candidateUnLike").removeClass(
                        "fa-thumbs-up").addClass("fa-thumbs-o-up");
                $(".leftModal").click();
            }
        };
        //bring next candidate by swipe left\right or click on hands icon
        $scope.bringNextCandidate = function (type, description) {
            if (description == undefined)
                description = ' - not typed';
            console.log(description);
            var url;
            if ($id[1] == 'like') {
                //  candidates = $rootScope.likeCandidates;
                candidates = localStorage.getItem("candidates");
                url = 'https://cvmatcher.herokuapp.com/employer/updateRateCV';
            }
            else if ($id[1] == 'unlike') {
                // candidates = $rootScope.unlikeCandidates;
                candidates = localStorage.getItem("candidates");
                url = 'https://cvmatcher.herokuapp.com/employer/updateRateCV';
            }
            else {
                //i came from UnreadCVS
                // candidates = $rootScope.unreadCandidates;
                candidates = localStorage.getItem("candidates");
                url = 'https://cvmatcher.herokuapp.com/employer/rateCV';
            }
            //add user to like and rate stars || unlike and description
            $http({
                url: url,
                method: "POST",
                data: {
                    "cv_id": candidateId,
                    "status": {
                        "current_status": type,
                        "stars": $scope.user["stars"],
                        "description": description,
                        "timestamp": new Date
                    },
                    "user_id": localStorage.getItem("user_id")
                }
            }).then(function () {

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

                                var id;
                                if ($id[1] == 'unread')
                                    id = $id[2];
                                else
                                    id = $id[3];
                                console.log(id);

                                console.log("companyName", companyName);

                                if (type == 'unliked') {
                                    $http({
                                        url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                        method: "POST",
                                        data: {
                                            "user_id": $scope.user_id,
                                            "message": "The employer from company " + companyName + "  didn't liked your cv for job: " + localStorage.getItem("jobTitle") + "with the reason of: " + description
                                        }
                                    }).then(function (data) {
                                            console.log(data.data);
                                        },
                                        function (response) { // optional
                                            console.log("unlike notification AJAX failed!");
                                            console.log(response);
                                        });
                                }


                                if (type == 'liked') {

                                    $http({
                                        url: 'https://cvmatcher.herokuapp.com/sendNotification',
                                        method: "POST",
                                        data: {
                                            "user_id": $scope.user_id,
                                            "message": "The employer from company " + companyName + " liked your cv for job " + localStorage.getItem("jobTitle") + " with the amount of " + rateStars + " stars"
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
                            console.log("getCompany AJAX failed!");
                            console.log(response);

                        });


            });


            var nextCandidate = null;
            candidates = candidates.split(",");

            if (candidates.length > 0) {
                var index = candidates.indexOf(candidateId);
                candidates.splice(index, 1);
                localStorage.setItem("candidates", candidates);
            }
            if (candidates.length > 0) {
                nextCandidate = candidates[0];
            }


            console.log("nextCandidate: ", nextCandidate);
            //bring next candidate
            if (nextCandidate == null) {
                angular.element(".noMoreCandidates").show();
                angular.element("#users").hide();

            }
            else {
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                    method: "POST",
                    data: {
                        "matching_object_id": nextCandidate,
                        "matching_object_type": "cv"
                    }
                })
                    .then(function (data) {
                        $scope.user = data.data[0];
                        if ($id[1] == "unread") {
                            $scope.user["stars"] = 0;
                        }

                        //remove like unlike clicks view
                        angular.element("#candidateLike").removeClass(
                            "fa-thumbs-up").addClass("fa-thumbs-o-up");
                        angular.element("#candidateUnLike").removeClass(
                            "fa-thumbs-up").addClass("fa-thumbs-o-up")
                    });
                $("#users").fadeOut(300, function () {
                    $("#users").fadeIn(300);
                });
            }
        };

    });
