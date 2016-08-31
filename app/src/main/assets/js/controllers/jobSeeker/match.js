/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Match Page Controller ****************
 */
app
    .controller(
        'matchpageController',
        function ($scope, $http, $location, $rootScope, $timeout) {

            var current_cv;
            $jobId = $location.path().split('/')[2];
            console.log($jobId);

            var colorsArr = ["#106332", "#0F8742", "#58B647", "#1FB24A", "#1EAE6D", "#3DB98C", "#48C1C3",
                "#71CBD2", "#7BD0E5", "#AFE0E9", "#BFDEDF"];

            var colorIndex = 0;

            //initialize parameter in the controller
            $scope.init = function () {
                $(".sendCV").removeClass("disabled");
                $(".matchResult").hide();
                $(".fixCV").hide();
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": localStorage.getItem("user_id")
                    }
                })
                    .then(function (data) {
                        if (typeof data.data[0].current_cv !== 'undefined' && data.data[0].current_cv != null) {
                            current_cv = data.data[0].current_cv;
                            console.log("data: ", data.data[0]);
                            console.log("cv: " + current_cv);
                            console.log("job: " + $jobId);
                            localStorage.setItem("current_cv", data.data[0].current_cv);
                            $http({
                                url: 'https://cvmatcher.herokuapp.com/jobSeeker/checkCV',
                                method: "POST",
                                data: {
                                    "cv_id": current_cv,
                                    "job_id": $jobId
                                }
                            })
                                .then(function (data) {
                                    $(".jobDetailsLS").append("<img src='"+JSON.parse(localStorage.getItem("jobDetails")).logo+"'/><h3>"+JSON.parse(localStorage.getItem("jobDetails")).title+"</h3><h3>"+JSON.parse(localStorage.getItem("jobDetails")).date+"</h3>");
                                        $(".matchResult").show();
                                        $(".fixCV").show();
                                        //navigation in site
                                        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/search-jobs'>Search Jobs</a><span> > </span><a href='#/search-jobs/" + $jobId + "/matchpage'>" + JSON.parse(localStorage.getItem("jobDetails")).title + " Match Page</a>";

                                        if (data.data.formula !== undefined) {
                                            console.log(data.data);

                                            $(".matchpageWrapper .formula-result").append(
                                                '<p>' + messageResource.get("jobseeker.formula","resources") + '</p>' +
                                                '<p>' + messageResource.get("jobseeker.formula.candidate_type", "resources") + " <span class='redGrade'>" + data.data.formula.candidate_type + '%</span></p>' +
                                                '<p>' + messageResource.get("jobseeker.formula.requirements", "resources") + " <span class='redGrade'>" + data.data.formula.requirements.grade +  '%</span></p>' +
                                                '<p>' + messageResource.get("jobseeker.formula.locations", "resources") + " <span class='redGrade'>" + data.data.formula.locations +  '%</span></p>' +
                                                '<p>' + messageResource.get("jobseeker.formula.scope_of_position", "resources") + " <span class='redGrade'>" + data.data.formula.scope_of_position + '%</span></p>' +
                                                '<p>' + messageResource.get("jobseeker.formula.academy", "resources") + " <span class='redGrade'>" + data.data.formula.academy +  '%</span></p>'
                                            );
                                            
                                            if (data.data.formula.requirements.grade > 0) {
                                                $(".skillsTitleM").show();
                                                $(".matchpageWrapper .requirements-skills-bar").show();

                                                var skillsFromJson = data.data.formula.requirements.details;

                                                $.each(skillsFromJson, function (key, value) {
                                                    if (value.grade == 0)
                                                        return;
                                                    var color = colorsArr[colorIndex];
                                                    $(".matchpageWrapper .requirements-skills-bar").append('<div class="skillbar" data-percent=' + value.grade + ' >' +
                                                        '<span class="skillbar-title">' + value.name + '' +
                                                        '</span><p class="skillbar-bar" style="background: ' + color + ';">' +
                                                        '</p><span class="skill-bar-percent"></span></div>');
                                                    colorIndex++;
                                                    if (colorIndex > colorsArr.length -1 ) {
                                                        colorIndex = 0;
                                                    }

                                                });

                                                skillsBar();
                                            }
                                            else {
                                                $(".skillsTitleM").hide();
                                                $(".matchpageWrapper .requirements-skills-bar").hide();
                                            }
                                            angular.element(".fa-pulse").hide();
                                            //user percentage
                                            var userCircle = new ProgressBar.Circle(
                                                '#user-container',
                                                {
                                                    color: '#ee5785',
                                                    strokeWidth: 5,
                                                    fill: '#000'
                                                });
                                            angular
                                                .element(
                                                    "#user-container>h5")
                                                .html(Math.max(parseInt(data.data.total_grade), 1) + "%");
                                            userCircle.animate(data.data.total_grade / 100);
                                            //check if user passed the Match!!!
                                            console.log(data.data.total_grade);
                                            console.log(JSON.parse(localStorage.getItem("jobDetails")).compatibility_level);
                                            if (data.data.total_grade < JSON.parse(localStorage.getItem("jobDetails")).compatibility_level) {
                                                angular.element(".matchResult > h2").append("Oops");
                                                angular.element(".matchResult > h2 > i").addClass("fa-thumbs-down");
                                                angular.element(".matchResult > h4").html('You did not passed the minimum requirements');
                                                $scope.sendcv = false;
                                            }
                                            else {
                                                angular.element(".matchResult > h2").append("Great!");
                                                angular.element(".matchResult > h2 > i").addClass("fa-thumbs-up");
                                                angular.element(".matchResult > h4").html('Harray!! You Passed The Minimum requirements');
                                                $scope.sendcv = true;
                                            }

                                            $scope.formula = data.data.formula;

                                        }
                                        else {
                                            $scope.status = messageResource.get("modal.seeker.cv_update", 'resources');
                                            angular.element(".fa-pulse").hide();
                                        }
                                    },
                                    function (response) { // optional
                                        console.log(response);
                                        angular.element(".fa-pulse").hide();
                                        $scope.status = response.data.error;
                                        $('#sendCVstatus').modal('show');
                                    });
                        }

                    });

            };
            //fix cv - go to profile and come back!
            $scope.fixCV = function () {
                localStorage.setItem('fixCV', $jobId);
            }
            //send cv to employer
            $scope.sendCV = function () {
                $(".sendCV").addClass("disabled");
                console.log($jobId);
                console.log(localStorage.getItem("current_cv"));
                $(".fa-spinner").show();
                $http({
                    url: 'https://cvmatcher.herokuapp.com/jobSeeker/addCvToJob',
                    method: "POST",
                    data: {
                        "job_id": $jobId,
                        "cv_id": localStorage.getItem("current_cv")
                    }
                }).then(function (data) {

                        $(".fa-spinner").hide();
                        console.log(data);
                        if (data != null) {
                            $('#sendCVstatus').modal('show');
                            $scope.status = messageResource.get("modal.seeker.resume.sent", 'resources');

                        }
                        else {
                            $scope.status = messageResource.get("modal.seeker.resume_problem", 'resources');
                        }
                    },
                    function (response) { // optional
                        console.log(response);
                        console.log("addCvToJob AJAX failed!");
                    });
            };
            //close modal
            $scope.exitStatus = function () {
                //if user clickd ok then move to search jobs page - need to wait to close modal
                $timeout(function () {
                    location.replace("#/search-jobs");
                }, 1000);
            };
        });