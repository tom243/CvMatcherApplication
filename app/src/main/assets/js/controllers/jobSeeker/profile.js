/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Job Seeker Profile Page Controller ****************
 */
app
    .controller(
        'seekerProfileControler',
        function ($scope, $http, $compile, $rootScope, $location, $timeout) {

        	angular.element(document).ready(function () {
                jsHandlerOb.stopMainProgressBar();
            });

            var combination;
            var history_timeline = [], myKeyWords = [];
            var cvJson = false, closeModal = false;
            var indx = 2;
            var parseExpereince = {
                "expereince": []
            };
            //initialize parameters for controller
            $scope.init = function () {
                $(".parserExperienceLanguage").hide();
                $(".parserExperienceYearsLabel").hide();
                $(".navBarImg ul li").removeClass("selected");
                angular
                    .element(".parserAfterText").hide();
                $rootScope.userSignInType = 'jobSeeker';
                $("#geocomplete").geocomplete();
                $("[rel='popover']").popover({trigger: "hover", container: "body"});

                //navigation in site
                $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/profile'>My Profile</a>";

            }
            //get user details
            $scope.getMainJson = function () {
//http://stackoverflow.com/questions/22447374/how-to-trigger-ng-click-angularjs-programmatically
                if (localStorage.getItem('fixCV') !== null) {
                    angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                    $timeout(function () {
                        angular.element("#tab1").trigger('click');
                    }, 100);
                }


                //job seeker Details
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                })
                    .then(function (data) {

                            $scope.jobSeeker = data.data[0];

                            if (data.data[0].birth_date){
                                var date = data.data[0].birth_date.split("T")[0].split("-");
                                $scope.dateBirth = date[0] + "-" + date[1] + "-" + date[2];
                            }

                            console.log(data.data[0]);
                            if (typeof data.data[0].current_cv !== 'undefined' && data.data[0].current_cv != null) {
                                var currentId = data.data[0].current_cv;
                                cvJson = true;
                                localStorage.setItem("current_cv", currentId);
                                $http({
                                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                                    method: "POST",
                                    data: {
                                        "matching_object_id": currentId,
                                        "matching_object_type": "cv"
                                    }
                                })
                                    .then(function (data) {
                                            console.log(data);
                                            angular.element(".fa-pulse").hide();
                                            /*
                                             $.each(data.data[0].personal_properties, function (i, post) {
                                             console.log(i + " : " + post);
                                             });*/
                                            myKeyWords = [];
                                            $scope.jobSeekerCV = data.data[0];
                                            if ($scope.jobSeekerCV.original_text.history_timeline.length == 0) {
                                                $scope.addEducation('education');
                                                $scope.addEducation('employment');
                                            }
                                            if (cvJson) {
                                                if ($scope.jobSeekerCV.requirements[0].combination.length > 0)
                                                    angular.forEach($scope.jobSeekerCV.requirements[0].combination, function (value) {
                                                        console.log(value);
                                                        myKeyWords.push({
                                                            "name": value.name,
                                                            "years": value.years
                                                        });

                                                        indx = $(".timeline li").length + 1;
                                                        var yearsExperience = '<label class="parserExperienceYearsLabel"><input type="text" class="form-control" class="parserExperienceYears" value="' + value.years + '"></label>';
                                                        angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage"><input type="text" required class="form-control " id="experience" name="experience"' +
                                                            ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                                    });
                                                angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                            }
                                        },
                                        function (response) { // optional
                                            angular.element(".fa-pulse").hide();
                                            console.log("jobSeekerCv AJAX failed!");
                                            console.log(response);

                                        }
                                    );
                            } else {
                                $scope.addEducation('education');
                                $scope.addEducation('employment');

                                angular.element(".fa-pulse").hide();

                            }
                            //userId = data.data[0]._id;
                            angular.element(".fa-pulse").hide();
                        },
                        function (response) { // optional
                            angular.element(".fa-pulse").hide();
                            console.log("jobSeekerJobs AJAX failed!");
                            console.log(response);

                        });
            };
            $(function() {
                $( "#datepickerProfile" ).datepicker();
            });
            //remove 1 section from timeline
            $scope.removeContentCV = function (index) {
                $scope.changeContent();
                indx++;
                console.log(indx);
                angular.element("#submitAfterParse").css("pointer-events", "auto");
                $("#cvLi" + index).remove();
            };
            //change content in textarea of the timeline - open parsing option
            $scope.changeContent = function () {

                angular
                    .element(".parseExperienceButton").show();
                angular
                    .element(".parseExperiencePlusButton").addClass("hidden");

            };
            //select from - will open the "to" in timeline
            $scope.selectFromYear = function (selected) {
                $scope.selectFrom = selected;
            };
            //parse the experience and bring corrent languages that been found
            $scope.parseMyExperience = function () {

                $(".parserExperienceLanguage").show();
                $(".parserExperienceYearsLabel").show();

                parseExpereince = {
                    "expereince": []
                };
                if (cvJson) {
                    $(".parseExperience").html("");
                }
                angular.element(".fa-spin").show();

                var type;
                history_timeline = [];

                parseExpereince.expereince = [];
                $.each($(".profileWrapper .timeline .timeline-inverted"), function () {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(3) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(4) select').val();

                    if (startdate > enddate) {
                        $scope.status = messageResource.get("modal.seeker.fix_years", 'resources');
                        $('#myModal').modal('show');
                        return;
                    }


                    if ($(this).hasClass("timeline-inverted"))
                        type = 'experience';
                    else
                        type = 'education';
                    history_timeline.push({
                        "text": text,
                        "start_year": parseInt(startdate),
                        "end_year": parseInt(enddate),
                        "type": type
                    });

                    parseExpereince.expereince.push({
                        "text": text,
                        "startdate": startdate,
                        "enddate": enddate
                    });
                });
                $http({
                    url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                    method: "POST",
                    data: {"sector": "software engineering"}
                })
                    .then(function (data) {
                            parseExpereince.words = data.data;
                            console.log(parseExpereince);
                            myKeyWords = [];
                            $http({
                                url: "https://cvmatcherbuilders.herokuapp.com/findIfKeyWordsExistsCV",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data) {
                                        console.log(data);
                                        angular.element(".parseExperience").html('');
                                        angular.forEach(data.data, function (value) {
                                            myKeyWords.push({
                                                "name": value.name,
                                                "years": value.years
                                            });
                                            var yearsExperience = '<label class="parserExperienceYearsLabel"><input type="text" class="form-control" class="parserExperienceYears"  value="' + value.years + '"></label>';
                                            angular.element(".parseExperience").append('<div class="parser"><label class="parserExperienceLanguage"><input type="text" required class="form-control " id="experience" name="experience"' +
                                                ' value="' + value.name + '"  /></label>' + yearsExperience) + '</div>';
                                        });

                                        angular.element(".parserAfterText").show();
                                        angular.element(".fa-spin").hide();
                                        angular.element(".cvPreview").show();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");

                                    },
                                    function (response) { // optional
                                        console.log("findIfKeyWordsExistsCV AJAX failed!");
                                        console.log(response);
                                    });
                        },
                        function (response) { // optional
                            console.log("getKeyWordsBySector AJAX failed!");
                            console.log(response);
                        });

                angular
                    .element(".parseExperienceButton").hide();
                angular
                    .element(".parseB > .Garrow").hide();

                angular
                    .element(".parseExperiencePlusButton").removeClass("hidden");

            };
            //add more experience to the timeline by selecting Plus button
            $scope.addMoreExperience = function () {
                var yearsExperience = '<label class="parserExperienceYearsLabelAdded"><input type="text" class="form-control" class="parserExperienceYears" value=""></label>';
                angular
                    .element(".parseExperience")
                    .append('<div class="parser"><label class="parserExperienceLanguageAdded"><input type="text" required class="form-control " id="experience" name="experience"' +
                        ' value=""  /></label>' + yearsExperience + '</div>');
            };
            //add more education to the timeline by selecting Plus button
            $scope.addEducation = function (type) {
                var fromExperience = '<label>From<select  ng-model="selectedFrom' + indx + '"  ng-change="selectFromYear(selectedFrom' + indx + ')" class="form-control yearsProfile"><option ng-selected="true" value=""></option><option value="2004">2004</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option></select></label>';
                var toExperience = '<label>To<select  ng-model="selectedTo' + indx + '" class="form-control yearsProfile" ><option ng-selected="true" value=""></option><option value="2004"   ng-show="selectFrom == 2004">2004</option><option value="2005" ng-show="selectFrom <= 2005">2005</option><option value="2006" ng-show="selectFrom <= 2006">2006</option><option value="2007" ng-show="selectFrom <= 2007">2007</option><option value="2008" ng-show="selectFrom <= 2008">2008</option><option value="2009" ng-show="selectFrom <= 2009">2009</option><option value="2010" ng-show="selectFrom <= 2010">2010</option><option value="2011" ng-show="selectFrom <= 2011">2011</option><option value="2012" ng-show="selectFrom <= 2012">2012</option><option value="2013" ng-show="selectFrom <= 2013">2013</option><option value="2014" ng-show="selectFrom <= 2014">2014</option><option value="2015" ng-show="selectFrom <= 2015">2015</option><option value="2016" ng-show="selectFrom <= 2016">2016</option></select></label>';

                indx++;
                var divTemplate;
                if (type == 'education') {
                    divTemplate = '<li id="cvLi' + indx + '"><div class="timeline-badge"  ng-click="addEducation(' + "'education'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"><h2 class="timelineTitle">Education</h2> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control profileExpEdu " rows="3" name="content"   ng-model="content' + indx + '" ng-change="changeContent(content' + indx + ')" id="content" required></textarea></div></p></div></div></li>';

                }
                else {
                    divTemplate = '<li class="timeline-inverted" id="cvLi' + indx + '"><div class="timeline-badge" ng-click="addEducation(' + "'employment'" + ')"><i class="fa fa-plus"></i></div><div class="timeline-panel"><div class="timeline-heading"><h2 class="timelineTitle">Experience</h2> <i class="fa fa-times fa-2x removeContentCV" aria-hidden="true" ng-click="removeContentCV(' + indx + ')"></i>' + fromExperience + toExperience + '</div><div class="timeline-body"><p><div class="form-group"><label for="content">Content:</label><textarea class="form-control profileExpEdu "   ng-model="content' + indx + '"  ng-change="changeContent(content' + indx + ')"  rows="3" name="content" id="content" required></textarea></div></p></div></div></li>';
                }
                var temp = $compile(divTemplate)($scope);
                angular.element(".timeline").append(temp);

                if (cvJson) {
                    angular
                        .element(".parseExperienceButton").show();
                    angular
                        .element(".parseExperiencePlusButton").addClass("hidden");
                }
            };
            //submit user profile details
            $scope.submitUserDetails = function () {

                //add more parameters to json
                //noinspection JSDuplicatedDeclaration
                var key = 'birth_date';
                $scope.jobSeeker[key] = $(".birthDay").val();
                //noinspection JSDuplicatedDeclaration
                key = 'address';
                $scope.jobSeeker[key] = $("#geocomplete").val();
                //noinspection JSDuplicatedDeclaration
                key = 'phone_number';
                $scope.jobSeeker[key] = $(".phoneNumber").val();
                //noinspection JSDuplicatedDeclaration
                key = 'linkedin';
                $scope.jobSeeker[key] = $(".linkedin").val();

                console.log("send form: ", $scope.jobSeeker);
                $http({
                    url: 'https://cvmatcher.herokuapp.com/updateUser',
                    method: "POST",
                    data: $scope.jobSeeker
                })
                    .then(function () {
                            $scope.status = messageResource.get("modal.seeker.details_send", 'resources');
                            $('#myModal').modal('show');
                            $scope.tab = 1;
                        },
                        function (response) { // optional
                            console.log("jobSeeker send form AJAX failed!");
                            console.log(response);
                        });
            };
            //preview cv before sending to employer
            $scope.cvPreview = function () {

                $http({
                    url: 'https://cvmatcher.herokuapp.com/getUser',
                    method: "POST",
                    data: {
                        "user_id": $rootScope.user_id
                    }
                })
                    .then(function (data) {
                            console.log(data.data[0]);
                            $scope.user = data.data[0];
                            var user_timeline = [];
                            $.each($(".profileWrapper .timeline li "), function (key, val) {
                                var text = $(this).find('.timeline-body textarea').val();
                                var startdate = $(this).find('.timeline-heading label:nth-child(3) select').val();
                                var enddate = $(this).find('.timeline-heading label:nth-child(4) select').val();

                                if (startdate > enddate) {
                                    $scope.status = messageResource.get("modal.seeker.fix_years", 'resources');
                                    $('#myModal').modal('show');
                                    return;
                                }

                                var type;
                                if ($(this).hasClass("timeline-inverted"))
                                    type = 'experience';
                                else
                                    type = 'education';

                                var newLi = {
                                    "text": text,
                                    "start_year": parseInt(startdate),
                                    "end_year": parseInt(enddate),
                                    "type": type
                                };
                                user_timeline.push(newLi);
                            });

                            $scope.user_timeline = user_timeline;
                            $scope.status = messageResource.get("modal.seeker.preview", 'resources');
                            $('#previewCV').modal('show');


                        },
                        function (response) { // optional
                            console.log("getMatchingObject send form AJAX failed!");
                            console.log(response);
                        });

            }
            //submit user cv details
            $scope.submitUserCV = function () {


                combination = [];
                $('.parser').each(function () {
                    combination.push({
                        "name": $(this).find('label:nth-child(1) input').val(),
                        "years": parseInt($(this).find('label:nth-child(2) input').val())
                    })
                });


                var jsonForNewKeyWords = [];
                $.map(combination, function (i) {
                    var exist = false;
                    $.each(myKeyWords, function (key, val) {
                        if (i.name == val.name)
                            exist = true;
                    });
                    if (exist == false) {
                        jsonForNewKeyWords.push(i.name);
                    }
                });


                //add new keywords!
                $http({
                    url: "https://cvmatcher.herokuapp.com/addKeyWords",
                    method: "POST",
                    data: {
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "words_list": jsonForNewKeyWords
                    }
                })
                    .then(function (data) {
                            //console.log(data);
                        },
                        function (response) { // optional
                            console.log("addKeyWords send form AJAX failed!");
                            console.log(response);
                        });


                var jobSeekerCVScopeOfPosition = [];
                //scope_of_position

                $.each($(".jobSeekerCVScopeOfPosition input:checked"), function () {
                    jobSeekerCVScopeOfPosition.push($(this).val());
                });
                if (jobSeekerCVScopeOfPosition.length == 0) {
                    $scope.status = messageResource.get("modal.seeker.scope_of_position", 'resources');
                    $('#myModal').modal('show');
                    return;
                }
                /*var key = 'scope_of_position';
                 var val = $('.scope_of_position').find(":selected").val();*/
                var jobSeekerCVAcademy = [];
                $.each($(".jobSeekerCVAcademy input:checked"), function () {
                    jobSeekerCVAcademy.push($(this).val());
                });

                if (jobSeekerCVAcademy.length == 0) {
                    $scope.status = messageResource.get("modal.seeker.fill.academy", 'resources');
                    $('#myModal').modal('show');
                    return;
                }
                /*

                 var jobSeekerCVHistoryTimeLine = [];
                 //history_timeline
                 $.each($(".timeline-panel textarea"), function () {
                 jobSeekerCVHistoryTimeLine.push($(this).val());
                 });
                 console.log("jobSeekerCVHistoryTimeLine: ",jobSeekerCVHistoryTimeLine);
                 */

                var type;
                history_timeline = [];
                $.each($(".profileWrapper .timeline li"), function () {
                    var text = $(this).find('.timeline-body textarea').val();
                    var startdate = $(this).find('.timeline-heading label:nth-child(3) select').val();
                    var enddate = $(this).find('.timeline-heading label:nth-child(4) select').val();

                    if (startdate > enddate) {
                        $scope.status = messageResource.get("modal.seeker.fix_years", 'resources');
                        $('#myModal').modal('show');
                        return;
                    }

                    console.log(text);
                    if ($(this).hasClass("timeline-inverted"))
                        type = 'experience';
                    else
                        type = 'education';
                    history_timeline.push({
                        "text": text,
                        "start_year": parseInt(startdate),
                        "end_year": parseInt(enddate),
                        "type": type
                    });
                });
                var jobSeekerCV;
                if (cvJson) {
                    url = "https://cvmatcher.herokuapp.com/updateMatchingObject";
                    //noinspection JSDuplicatedDeclaration
                    jobSeekerCV = {
                        "_id": $scope.jobSeekerCV._id,
                        "matching_object_type": "cv",
                        "date": new Date(),
                        "personal_properties": {
                            "_id": $scope.jobSeekerCV.personal_properties._id,
                            "university_degree": $('.jobSeekerCVAcademy > label > input').is(":checked"),
                            "degree_graduation_with_honors": $('#honorsCB').is(":checked"),
                            "above_two_years_experience": $('#experienceCB').is(":checked"),
                            "psychometric_above_680": $('#scoreCB').is(":checked"),
                            "multilingual": $('#foreignCB').is(":checked"),
                            "volunteering": $('#volunteeringCB').is(":checked"),
                            "full_army_service": $('#armyCB').is(":checked"),
                            "officer_in_the_military": $('#officerCB').is(":checked"),
                            "high_school_graduation_with_honors": $('#graduateCB').is(":checked"),
                            "youth_movements": $('#YouthCB').is(":checked")

                        },
                        "original_text": {
                            "_id": $scope.jobSeekerCV.original_text._id,
                            "history_timeline": history_timeline
                        },
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "locations": [$('#geocomplete').val()],
                        "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                        "scope_of_position": jobSeekerCVScopeOfPosition,
                        "academy": {
                            "_id": $scope.jobSeekerCV.academy._id,
                            "academy_type": jobSeekerCVAcademy,
                            "degree_name": $.trim($('.degree_name').find(":selected").val()),
                            "degree_type": [$('.degree_type').find(":selected").val()]
                        },
                        "requirements": [{
                            "combination": combination
                        }],
                        "user": $rootScope.user_id
                    }
                }
                else {
                    console.log("first cv");
                    url = "https://cvmatcher.herokuapp.com/addMatchingObject";
                    //noinspection JSDuplicatedDeclaration
                    jobSeekerCV = {
                        "matching_object_type": "cv",
                        "date": new Date(),
                        "personal_properties": {
                            "university_degree": $('.jobSeekerCVAcademy > label > input').is(":checked"),
                            "degree_graduation_with_honors": $('#honorsCB').is(":checked"),
                            "above_two_years_experience": $('#experienceCB').is(":checked"),
                            "psychometric_above_680": $('#scoreCB').is(":checked"),
                            "multilingual": $('#foreignCB').is(":checked"),
                            "volunteering": $('#volunteeringCB').is(":checked"),
                            "full_army_service": $('#armyCB').is(":checked"),
                            "officer_in_the_military": $('#officerCB').is(":checked"),
                            "high_school_graduation_with_honors": $('#graduateCB').is(":checked"),
                            "youth_movements": $('#YouthCB').is(":checked")

                        },
                        "original_text": {
                            "history_timeline": history_timeline
                        },
                        "sector": $('.jobSeekerCVsector').find(":selected").val(),
                        "locations": [$('#geocomplete').val()],
                        "candidate_type": [$('.jobSeekerCVCandidateType').find(":selected").val()],
                        "scope_of_position": jobSeekerCVScopeOfPosition,
                        "academy": {
                            "academy_type": jobSeekerCVAcademy,
                            "degree_name": $.trim($('.degree_name').find(":selected").val()),
                            "degree_type": [$('.degree_type').find(":selected").val()]
                        },
                        "requirements": [{
                            "combination": combination
                        }],
                        "user": $rootScope.user_id
                    }
                }


                console.log("send form: ", jobSeekerCV);
                //if i got data then do update, else do add

                $http({
                    url: url,
                    method: "POST",
                    data: jobSeekerCV
                })
                    .then(function (data) {

                            localStorage.setItem("jobSeekerFirstSignIn", true);
                            $scope.status = messageResource.get("modal.seeker.resume_sent", 'resources');
                            $('#myModal ').modal('show');
                            closeModal = true;
                            if (cvJson == false) {
                                //first time user cv
                                var currentId = data.data.current_cv;
                                console.log(data.data);
                                localStorage.setItem("current_cv", currentId);
                            }
                        },
                        function (response) { // optional
                            console.log("jobSeekerJobs send form AJAX failed!");
                            console.log(response);

                        });


            };
            //exit modal
            $scope.exitStatus = function () {

                if (localStorage.getItem('fixCV') !== null) {
                    var jobid = localStorage.getItem('fixCV');
                    localStorage.removeItem('fixCV');
                    $('#myModal ').modal('hide');
                    $timeout(function () {
                        $location.url('/search-jobs/' + jobid + '/matchpage');
                    }, 1000);
                    return;
                }


                //if user clickd ok then move to search jobs page - need to wait to close modal
                if (closeModal == true)
                    $timeout(function () {
                        location.replace("#/search-jobs");
                    }, 1000);
            };

        });
