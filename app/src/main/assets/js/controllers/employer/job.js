/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* Job controller ****************
 */

var requirements = [];

var locations = [], combination = [], tempMustLangs = [], tempAdvLangs = [], tempOrLangs = [], languagesAfterParseForKeyWords = [], newLang = [], languages = [], requirements = [];
var nextCombinationKey = 0;
var langId = 0;
var totalPriorotySum = 0;
var newLangClicked = false;
var combinationDeleted = false;
app.controller('jobController', function ($scope, $http, $location, $timeout, $compile, $rootScope) {

        angular.element(document).ready(function () {
            jsHandlerOb.stopMainProgressBar();
        });

        totalPriorotySum = 0, nextCombinationKey = 0, langId = 0;
        $id = $location.path().split('/')[1];
        $jobId = $location.path().split('/')[2];
        $rootScope.langs = [];
        $rootScope.list1 = [];
        $rootScope.list2 = [];
        $rootScope.list3 = [];
        var i = 0;
        var locationIndex = 0;
        var combinationLengthAfterEdit = 0, combinationsLength = 0, sumSliders = 0;
        var editJob = false, sendForm = false, savedCurrentCombination = false, updateCV = false;
        newLangClicked = false
        //initialize parameters for this controller
        $scope.init = function () {

            $(".navBarImg ul li").removeClass("selected");
            if ($id == 'new-job') {
                $(".navBarImg ul li:nth-child(4)").addClass("selected");
            }

            $scope.combinationIndx = 0;
            $http({
                url: 'https://cvmatcher.herokuapp.com/getUser',
                method: "POST",
                data: {
                    "user_id": localStorage.getItem('user_id')
                }
            }).then(function (data) {
                if (typeof data.data[0].company == 'undefined') {
                    //no company
                    $scope.status = messageResource.get("modal.job.updateProfile", 'resources');
                    $('#sendJob').modal('show');
                    updateCV = true;
                }
            });


            $(".requirementsWrapper").hide();
            $(".experienceBeforeParse").hide();
            angular.element(".spin").hide();
            angular.element(".removeCombination").hide();
            angular.element(".buttonsAfterParse").hide();
            $("#geocomplete").geocomplete();
            angular.element('.selectpicker').selectpicker();
        }
        //edit job - get AJAX details
        $scope.getJobJson = function () {
            $(".fa-arrow-right").hide();
            $(".fa-arrow-left").hide();


            if ($id == 'job') {
                $scope.newJob = false;

                locations = [], combination = [], tempMustLangs = [], tempAdvLangs = [], tempOrLangs = [], languagesAfterParseForKeyWords = [], newLang = [], languages = [], requirements = [];
                requirements = [];
                //url for later to submit!
                url = 'https://cvmatcher.herokuapp.com/updateMatchingObject';
                $http({
                    url: 'https://cvmatcher.herokuapp.com/getMatchingObject',
                    method: "POST",
                    data: {
                        "matching_object_id": $jobId,
                        "matching_object_type": "job"
                    }
                })
                    .then(function (data) {
                        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/job/" + $jobId + "'>Edit Job - " + data.data[0].original_text.title + "</a>";
                        console.log(data.data[0]);
                        $scope.jobDetails = data.data[0];
                        $scope.mustReqiurment = data.data[0].original_text['requirements'].split('|||')[0];
                        $scope.AdvReqiurment = data.data[0].original_text['requirements'].split('|||')[1];

                        editJob = true;

                        combinationsLength = data.data[0].requirements.length - 1;
                        combinationLengthAfterEdit = data.data[0].requirements.length;
                        if (combinationsLength > 1)
                            $(".fa-arrow-right").show();
                        var i = 0;
                        totalPriorotySum = 100;

                        if (data.data[0].requirements.length > 1) {
                            $(".fa-arrow-right").show();
                        }
                        console.log(data.data[0]);
                        if (data.data[0].requirements.length > 0) {
                            $.each(data.data[0].requirements, function (k, v) {
                                i++;
                                var combination = [];
                                $.each(v.combination, function (key, val) {
                                    if (val.mode == 'must') {
                                        tempMustLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempMustLangs[tempMustLangs.length - 1]);
                                    }
                                    else if (val.mode == 'adv') {
                                        tempAdvLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempAdvLangs[tempAdvLangs.length - 1]);
                                    }
                                    else {
                                        tempOrLangs.push({
                                            'langId': langId++,
                                            'name': val.name,
                                            'mode': val.mode,
                                            'years': parseInt(val.years),
                                            'percentage': parseInt(val.percentage),
                                            'drag': true
                                        });
                                        languagesAfterParseForKeyWords.push(val.name);
                                        combination.push(tempOrLangs[tempOrLangs.length - 1]);
                                    }

                                });
                                if (i == 1) {
                                    $rootScope.list1 = tempMustLangs;
                                    $rootScope.list2 = tempAdvLangs;
                                    $rootScope.list3 = tempOrLangs;

                                }

                                tempMustLangs = [];
                                tempAdvLangs = [];
                                tempOrLangs = [];

                                requirements.push({'combination': combination});
                                combination = [];


                            });
                           // $scope.parseExperience();
                            totalPriorotySum = 100;
                            angular.element(".removeCombination").show();
                            angular.element(".buttonsAfterParse").show();
                            $(".requirementsWrapper").show();
                            angular.element(".fa-spin").hide();
                            angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");

                        }
                        angular.element(".fa-pulse").hide();


                        //SLIDERS
                        var sliders = $("#sliders").find(".slider");
                        var formulaJson = ["academy", "candidate_type", "locations", "requirements", "scope_of_position"];
                        //noinspection JSDuplicatedDeclaration
                        var i = 0;
                        $scope.formula = data.data[0].formula;
                        var j = 0;
                        var tmpNum = 0;
                        sliders.each(function () {
                            tmpNum += Number(data.data[0].formula[formulaJson[j++]]);
                        });
                        $scope.totalSum = tmpNum;
                        sumSliders = 100;
                        sliders.each(function () {
                            var availableTotal = 100;
                            $(this).empty().slider({
                                value: data.data[0].formula[formulaJson[i]],
                                min: 0,
                                max: data.data[0].formula[formulaJson[i++]],
                                range: "min",
                                step: 10,
                                slide: function (event, ui) {
                                    // Update display to current value
                                    $(this).siblings().text(ui.value);
                                    var total = 0;

                                    sliders.not(this).each(function () {
                                        total += Number($(this).slider("option", "value"));
                                    });

                                    // Need to do this because apparently jQ UI
                                    // does not update value until this event completes
                                    total += ui.value;
                                    sumSliders = total;
                                    if (total <= 100) {
                                        var max = availableTotal - total;

                                        // Update each slider
                                        sliders.not(this).each(function () {
                                            var t = $(this),
                                                value = t.slider("option", "value");

                                            var sum = +Number(+max + +value);
                                            t.slider("option", "max", sum)
                                                .siblings().text(value + '/' + sum + ' Left');
                                            t.slider('value', value);
                                        });
                                    }
                                }
                            });
                        });

                        var slider = $(".academySlider");

                        $timeout(function () {
                            $.each($(".geocomplete input"), function (key) {
                                $("#geocomplete" + key).geocomplete();
                                locationIndex++;
                            });
                        });


                    });
            }
            //im in newJob - init parameters
            else {
                locations = [], combination = [], tempMustLangs = [], tempAdvLangs = [], tempOrLangs = [], languagesAfterParseForKeyWords = [], newLang = [], languages = [], requirements = [];

                $scope.newJob = true;
                var html = $(".geocomplete").append('<div><input class="form-control" id="geocomplete' + locationIndex + '" required  type="text"  name="location" placeholder="Type in an address" size="90" autocomplete="on"/></div>');
                $("#geocomplete" + locationIndex).geocomplete();
                locationIndex++;
                $compile(html)($scope);


                url = 'https://cvmatcher.herokuapp.com/addMatchingObject';
                $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/myjobs'>My Jobs</a><span> > </span><a href='#/new-job'>New Job</a>";

                editJob = true;
                angular.element(".fa-pulse").hide();

                //setTimeout  because there is a problem loading js after angular
                $timeout(function () {

                    angular.element(".fa-spinner").hide();
                    var sliders = $("#sliders").find(".slider");
                    sliders.each(function () {
                        var availableTotal = 100;
                        $(this).slider({
                            value: 0,
                            min: 0,
                            max: 100,
                            range: "min",
                            step: 10,
                            slide: function (event, ui) {
                                // Update display to current value
                                $(this).siblings().text(ui.value);
                                var total = 0;

                                sliders.not(this).each(function () {
                                    total += Number($(this).slider("option", "value"));
                                });

                                // Need to do this because apparently jQ UI
                                // does not update value until this event completes
                                total += ui.value;
                                sumSliders = total;
                                if (total <= 100) {
                                    var max = availableTotal - total;

                                    // Update each slider
                                    sliders.not(this).each(function () {
                                        var t = $(this),
                                            value = t.slider("option", "value");
                                        var sum = +Number(+max + +value);

                                        t.slider("option", "max", sum)
                                            .siblings().text(value + '/' + sum);
                                        t.slider('value', value);
                                    });
                                }
                            }
                        })
                    })
                });
            }
        };
        //CHANGE CONTENT - AND SHOW BUTTON FOR PARSING
        $scope.changeContent = function () {
            angular.element(".experienceBeforeParse").show();
        };
        //EXIT MODAL BUTTON
        $scope.exitStatus = function () {
            //if user clickd ok then move to search jobs page - need to wait to close modal
            if (sumSliders == 100 && sendForm == true) {
                $timeout(function () {
                    location.replace("#/myjobs");
                }, 1000);
            }
            else if (updateCV == true) {
                $timeout(function () {
                    location.replace("#/profile");
                }, 1000);
            }
            else{
                $scope.status = "";
            }
        };
        //click on parse Orange button
        $scope.parseExperience = function () {

            angular.element(".spin").show();
            var parseExpereince;
            var parseExpereinceAdv;
            $http({
                url: "https://cvmatcher.herokuapp.com/getKeyWordsBySector",
                method: "POST",
                data: {"sector": "software engineering"}
            })
                .then(function (data) {
                    console.log( $.trim($("#requirementsMust").val()));

                        parseExpereince = {
                            "text": $.trim($("#requirementsMust").val()),
                            "words": data.data
                        };
                        parseExpereinceAdv = {
                            "text": $.trim($("#requirementsAdvantage").val()),
                            "words": data.data
                        };
                        var tempMust, tempAdv;

                        //Requerments Must
                        if ($id == 'job') {
                            $rootScope.list1 = [];
                            $rootScope.list2 = [];
                            $rootScope.list3 = [];
                            $rootScope.langs = [];

                            $http({
                                url: "https://cvmatcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data1) {
                                    console.log(parseExpereince);
                                    console.log(data1);
                                        requirements = [];
                                        combination = [];
                                        angular.element(".removeCombination").show();
                                        angular.element(".spin").hide();
                                        angular.element(".fa-spin").hide();
                                        $(".requirementsWrapper").show();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                        tempMustLangs = [];
                                        $.each(data1.data, function (key, val) {
                                            console.log(val);
                                            tempMust = {
                                                'langId': langId++,
                                                'name': val,
                                                'percentage': 0,
                                                'mode': "must",
                                                'years': 0,
                                                'drag': true
                                            };
                                            tempMustLangs.push(tempMust);
                                            combination.push(tempMust);
                                        });
                                        $rootScope.list1 = tempMustLangs;


                                        //adv
                                        $http({
                                            url: "https://cvmatcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                            method: "POST",
                                            data: parseExpereinceAdv
                                        })
                                            .then(function (data1) {
                                                    angular.element(".spin").hide();
                                                    angular.element(".buttonsAfterParse").show();
                                                    angular.element(".fa-spin").hide();
                                                    $(".requirementsWrapper").show();
                                                    angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                                    tempAdvLangs = [];
                                                    $.each(data1.data, function (key, val) {
                                                        tempAdv = {
                                                            'langId': langId++,
                                                            'name': val,
                                                            'percentage': 0,
                                                            'mode': "adv",
                                                            'years': 0,
                                                            'drag': true
                                                        };

                                                        tempAdvLangs.push(tempAdv);
                                                        combination.push(tempAdv);
                                                    });

                                                    $rootScope.list2 = tempAdvLangs;

                                                },
                                                function (response) {
                                                    console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                                    console.log(response);
                                                });


                                        requirements.push({'combination': combination});
                                        console.log(requirements);


                                    },
                                    function (response) {
                                        angular.element(".fa-spin").hide();
                                        console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                        console.log(response);
                                    });








                        }
                        else {
                            $http({
                                url: "https://cvmatcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                method: "POST",
                                data: parseExpereince
                            })
                                .then(function (data1) {
                                        requirements = [];
                                        combination = [];
                                        angular.element(".removeCombination").show();
                                        angular.element(".fa-pulse").hide();
                                        $(".requirementsWrapper").show();
                                        angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                        tempMustLangs = [];
                                        $.each(data1.data, function (key, val) {
                                            tempMust = {
                                                'langId': langId++,
                                                'name': val,
                                                'percentage': 0,
                                                'mode': "must",
                                                'years': 0,
                                                'drag': true
                                            };
                                            tempMustLangs.push(tempMust);
                                            combination.push(tempMust);
                                        });
                                        $rootScope.list1 = tempMustLangs;


                                        //adv
                                        $http({
                                            url: "https://cvmatcherbuilders.herokuapp.com/findIfKeyWordsExistsJOB",
                                            method: "POST",
                                            data: parseExpereinceAdv
                                        })
                                            .then(function (data1) {

                                                    angular.element(".buttonsAfterParse").show();
                                                    angular.element(".fa-spin").hide();
                                                    $(".requirementsWrapper").show();
                                                    angular.element("#submitAfterParse").removeClass("disabled").css("pointer-events", "auto");
                                                    tempAdvLangs = [];
                                                    $.each(data1.data, function (key, val) {
                                                        tempAdv = {
                                                            'langId': langId++,
                                                            'name': val,
                                                            'percentage': 0,
                                                            'mode': "adv",
                                                            'years': 0,
                                                            'drag': true
                                                        };

                                                        tempAdvLangs.push(tempAdv);
                                                        combination.push(tempAdv);
                                                    });

                                                    $rootScope.list2 = tempAdvLangs;

                                                },
                                                function (response) {
                                                    console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                                    console.log(response);
                                                });


                                        requirements.push({'combination': combination});
                                        console.log(requirements);


                                    },
                                    function (response) {
                                        angular.element(".fa-spin").hide();
                                        console.log("findIfKeyWordsExistsJOB AJAX failed!");
                                        console.log(response);
                                    });


                        }

                    },
                    function (response) { // optional
                        console.log("getKeyWordsBySector AJAX failed!");
                        console.log(response);

                    });


            angular.element(".operators").removeClass("hidden");
          //  angular.element(".experienceBeforeParse").addClass( "hidden");

        };
        //send form
        $scope.submitForm = function () {
            //find duplicated languages
            var repeatedLangs = [];
            var languagesNames = [];
            $.each(requirements, function (key, value) {
                $.each(value, function (ke, va) {
                    repeatedLangs = [];
                    $.each(va, function (k, v) {
                        console.log(v);
                        languagesNames.push(v.name);
                        if ($.inArray(v.name, repeatedLangs) == -1)
                            repeatedLangs.push(v.name);
                        else {
                            $scope.status = messageResource.get("modal.job.duplicate", 'resources');
                            $('#sendJob').modal('show');
                            return;
                        }
                    })
                })
            });


            //newKeyWords
            var difference = [];

            jQuery.grep(languagesNames, function (el) {
                if (jQuery.inArray(el, languagesAfterParseForKeyWords) == -1) difference.push(el);
            });

            console.log(difference);
            if (difference.length > 0)
                $http({
                    url: "https://cvmatcher.herokuapp.com/addKeyWords",
                    method: "POST",
                    data: {
                        "sector": $(".sector :selected").val(),
                        "words_list": difference
                    }
                })
                    .then(function (data) {
                            console.log(data);
                        },
                        function (response) { // optional
                            console.log("addKeyWords send form AJAX failed!");
                            console.log(response);
                        });


            $scope.status = messageResource.get("modal.wait", 'resources');

            if (sumSliders == 100 && $rootScope.list1.length > 0 && totalPriorotySum == 100 && $rootScope.list3.length != 1 || sumSliders == 100 && $rootScope.list1.length == 0 && $rootScope.list3.length != 1) {

                console.log(requirements);
                var academy = [];
                //scope_of_position
                $.each($(".academy input:checked"), function () {
                    academy.push($(this).val());
                });
                if (academy.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = messageResource.get("modal.fill.academy", 'resources');
                    return;
                }
                var degree_type = [];
                //scope_of_position
                $.each($(".degree_type input:checked"), function () {
                    degree_type.push($(this).val());
                });
                if (degree_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = messageResource.get("modal.fill.degree_type", 'resources');
                    return;
                }
                var scope_of_position = [];
                //scope_of_position
                $.each($(".scope_of_position input:checked"), function () {
                    scope_of_position.push($(this).val());
                });
                if (scope_of_position.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = messageResource.get("modal.fill.scope_of_position", 'resources');
                    return;
                }
                var candidate_type = [];
                //scope_of_position
                $.each($(".candidate_type input:checked"), function () {
                    candidate_type.push($(this).val());
                });
                if (candidate_type.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = messageResource.get("modal.fill.candidate", 'resources');
                    return;
                }

                $.each($(".geocomplete input"), function () {
                    locations.push($(this).val());
                });
                if (locations.length == 0) {
                    $('#sendJob').modal('show');
                    $scope.status = messageResource.get("modal.fill.location", 'resources');
                    return;
                }

                var job;
                if ($id == 'job') {
                    //noinspection JSDuplicatedDeclaration
                    job = {
                        "_id": $jobId,
                        "matching_object_type": "job",
                        "original_text": {
                            "_id": $scope.jobDetails.original_text._id,
                            "title": $(".jobName").val(),
                            "description": $("#description").html(),
                            "requirements": $("#requirementsMust").val() + " ||| " + $("#requirementsAdvantage").val()
                        },
                        "sector": $(".sector :selected").val(),
                        // "locations": [$("#geocomplete0").val()],
                        "locations": locations,
                        "candidate_type": candidate_type,
                        "scope_of_position": scope_of_position,
                        "academy": {
                            "_id": $scope.jobDetails.academy._id,
                            "academy_type": academy,
                            "degree_name": $(".degree_name :selected").val(),
                            "degree_type": degree_type
                        },
                        "formula": {
                            "_id": $scope.jobDetails.formula._id,
                            "locations": parseInt($(".locationsSlider").text().split("/")[0]),
                            "candidate_type": parseInt($(".candidate_typeSlider").text().split("/")[0]),
                            "scope_of_position": parseInt($(".scope_of_positionSlider").text().split("/")[0]),
                            "academy": parseInt($(".academySlider").text().split("/")[0]),
                            "requirements": parseInt($(".requirementsSlider").text().split("/")[0])
                        },
                        "requirements": requirements,
                        "compatibility_level": $scope.compability,
                        "user": localStorage.getItem("user_id")

                    }
                }
                else {
                    //noinspection JSDuplicatedDeclaration
                    job = {
                        "matching_object_type": "job",
                        "date": new Date(),
                        "original_text": {
                            "title": $(".jobName").val(),
                            "description": $("#description").html(),
                            "requirements": $("#requirementsMust").val() + " ||| " + $("#requirementsAdvantage").val()
                        },
                        "sector": $(".sector :selected").val(),
                        //"locations": [$("#geocomplete0").val()],
                        "locations": locations,
                        "candidate_type": candidate_type,
                        "scope_of_position": scope_of_position,
                        "academy": {
                            "academy_type": academy,
                            "degree_name": $(".degree_name :selected").val(),
                            "degree_type": degree_type
                        },
                        "formula": {
                            "locations": parseInt($(".locationsSlider").text().split("/")[0]),
                            "candidate_type": parseInt($(".candidate_typeSlider").text().split("/")[0]),
                            "scope_of_position": parseInt($(".scope_of_positionSlider").text().split("/")[0]),
                            "academy": parseInt($(".academySlider").text().split("/")[0]),
                            "requirements": parseInt($(".requirementsSlider").text().split("/")[0])
                        },
                        "requirements": requirements,
                        "compatibility_level": $scope.compability,
                        "user": localStorage.getItem("user_id")

                    }
                }


                $http({
                    url: url,
                    method: "POST",
                    data: job
                })
                    .then(function (data) {
                            if (data != null)
                                $('#sendJob').modal('show');
                            //$scope.status = "Job Send Succesfuly";
                            $scope.status = messageResource.get("modal.job.complete", 'resources');
                            sendForm = true;
                        },
                        function (response) { // optional
                            $scope.status = "Job did not send";
                            $scope.status = messageResource.get("modal.job.error", 'resources');
                            console.log("addMatchingObject send form AJAX failed!");
                            console.log(response);
                        });
            }
            if ($rootScope.list3.length == 1) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.or", 'resources');
            }
            if (sumSliders != 100) {

                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.sum_sliders", 'resources');
            }
            if (totalPriorotySum != 100 && $rootScope.list1.length > 0) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.sum_prioroty", 'resources');
            }
        };
        //ADD COMBINATION
        $scope.addDynamicCombination = function () {
            combinationLengthAfterEdit++;
            console.log(nextCombinationKey);
            $scope.combinationIndx =  nextCombinationKey+1;
            $(".fa-arrow-right").hide();
            if ($rootScope.list3.length != 1 && $rootScope.list1.length > 0 && totalPriorotySum == 100 || $rootScope.list3.length != 1 && $rootScope.list1.length == 0) {
                nextCombinationKey++;
                combinationsLength++;
                $(".fa-arrow-left").show();
                /*if ($rootScope.list1 != 'undefined') {
                 $.each($rootScope.list1, function (key, val) {
                 combination.push(val);
                 });
                 }
                 if ($rootScope.list2 != 'undefined') {
                 $.each($rootScope.list2, function (key, val) {
                 combination.push(val);
                 });
                 }

                 if ($rootScope.list3 != 'undefined') {
                 $.each($rootScope.list3, function (key, val) {
                 combination.push(val);
                 });
                 }*/
                $rootScope.list1 = [];
                $rootScope.list2 = [];
                $rootScope.list3 = [];
                $rootScope.langs = [];
                combination = [];
                requirements.push({'combination': combination});
                //$scope.jobDetails = requirements;
                totalPriorotySum = 0;
                $scope.addDynamicLang();
            }
            else if ($rootScope.list1.length > 0 && totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.sum_prioroty", 'resources');
            }
            else if ($rootScope.list3.length == 1) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.or", 'resources');
            }
        };
        //BRING NEXT COMBINATION
        $scope.nextCombination = function (val) {
            if ($rootScope.list3.length == 1) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.or", 'resources');
                return;
            }

            if ($rootScope.list3.length != 1 && $rootScope.list1.length > 0 && totalPriorotySum != 100) {
                $('#sendJob').modal('show');
                $scope.status = messageResource.get("modal.job.sum_prioroty", 'resources');
                return;
            }
            if (val == 'right') {
                savedCurrentCombination = true;
                nextCombinationKey++;
                $scope.combinationIndx = nextCombinationKey;
                console.log($scope.combinationIndx);
                if (nextCombinationKey < combinationsLength && nextCombinationKey != combinationsLength) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();
                }
                else {
                    $(".fa-arrow-right").hide();
                    $(".fa-arrow-left").show();
                }
            }
            else {
                nextCombinationKey--;
                $scope.combinationIndx = nextCombinationKey;
                console.log($scope.combinationIndx);
                if (nextCombinationKey < combinationsLength && nextCombinationKey != 0) {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").show();


                }
                else {
                    $(".fa-arrow-right").show();
                    $(".fa-arrow-left").hide();
                }
            }

            $rootScope.list1 = [];
            $rootScope.list2 = [];
            $rootScope.list3 = [];
            $rootScope.langs = [];
            tempMustLangs = [];
            tempAdvLangs = [];
            tempOrLangs = [];
            totalPriorotySum = 0;
            $.each(requirements[nextCombinationKey].combination, function (key, val) {
                if (val.mode == 'must') {
                    totalPriorotySum += parseInt(val.percentage);
                    tempMustLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'adv') {
                    tempAdvLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
                else if (val.mode == 'or') {
                    tempOrLangs.push({
                        'langId': val.langId,
                        'name': val.name,
                        'mode': val.mode,
                        'years': val.years,
                        'percentage': val.percentage,
                        'drag': true
                    });
                }
            });

            $rootScope.list1 = tempMustLangs;
            $rootScope.list2 = tempAdvLangs;
            $rootScope.list3 = tempOrLangs;


        };
        //ADD LANGUAGE
        $scope.addDynamicLang = function () {
            newLang = [];
            newLang.push({
                'langId': langId,
                'name': "Language",
                'percentage': 0,
                'mode': "langs",
                'years': 0,
                'drag': true
            });
            $rootScope.langs = newLang;
            newLangClicked = true;
        };
        //REMOVE LANG
        $scope.removeLang = function (id, sectType) {

            if (sectType == 'must') {
                $rootScope.list1 = $rootScope.list1.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            if (sectType == 'adv') {
                $rootScope.list2 = $rootScope.list2.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            if (sectType == 'or') {
                $rootScope.list3 = $rootScope.list3.filter(function (obj) {
                    return obj.langId != id;
                });
            }
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        totalPriorotySum -= parseInt(v.percentage);
                        val.combination.splice(k, 1);
                        return false;
                    }

                });
                /*
                 if (val.combination.length == 0){
                 combinationDeleted = true;
                 requirements.splice(key, 1);
                 console.log(requirements);
                 return false;

                 }*/

            });
            console.log("totalPriorotySum: " + totalPriorotySum);
        };
        //REMOVE COMBINATION
        $scope.removeCombination = function () {
            $.each(requirements, function (key) {
                if (nextCombinationKey == key) {
                    requirements.splice(key, 1);
                    combinationDeleted = true;
                    combinationsLength--;
                    return false;
                }
            });

            if (combinationDeleted == true) {
                combinationDeleted = false;
                $rootScope.list1 = [];
                $rootScope.list2 = [];
                $rootScope.list3 = [];
                $rootScope.langs = [];
                tempMustLangs = [];
                tempAdvLangs = [];
                tempOrLangs = [];
                totalPriorotySum = 0;
                if (combinationsLength == 0) {
                    $(".fa-arrow-right").hide();
                    $(".fa-arrow-left").hide();
                }
                if (combinationsLength > 0) {
                    $(".fa-arrow-left").show();
                    $(".fa-arrow-right").hide();
                }
                if (combinationsLength >= 0) {
                    nextCombinationKey = combinationsLength;
                    $.each(requirements[nextCombinationKey].combination, function (key, val) {
                        if (val.mode == 'must') {
                            totalPriorotySum += parseInt(val.percentage);
                            tempMustLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                        else if (val.mode == 'adv') {
                            tempAdvLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                        else if (val.mode == 'or') {
                            tempOrLangs.push({
                                'langId': val.langId,
                                'name': val.name,
                                'mode': val.mode,
                                'years': val.years,
                                'percentage': val.percentage,
                                'drag': true
                            });
                        }
                    });

                    $rootScope.list1 = tempMustLangs;
                    $rootScope.list2 = tempAdvLangs;
                    $rootScope.list3 = tempOrLangs;
                }
            }
        };
        //CHANGE NAMES
        $scope.changeLangeName = function (id) {
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            });

            if ($rootScope.list1 != 'undefined')
                $.each($rootScope.list1, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.list2 != 'undefined')
                $.each($rootScope.list2, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });

            if ($rootScope.list3 != 'undefined')
                $.each($rootScope.list3, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
            if ($rootScope.langs != 'undefined')
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.name = $("input[data-lang-name='" + id + "']").val();
                    }
                });
        };
        //CHANGE YEARS
        $scope.changeYears = function (id) {

            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.years = parseInt($("select[data-select='" + id + "']").val());
                    }
                });
            });


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.years = $("select[data-select='" + id + "']").val();
                }
            });
            if ($rootScope.langs.length > 0)
                $.each($rootScope.langs, function (key, val) {
                    if (val.langId == id) {
                        val.years = $("select[data-select='" + id + "']").val();
                    }
                })
        };
        //CHANGE PLUS
        $scope.plusButton = function (id) {
            if ($("input[data-pr-num='" + id + "']").val() < 100 && totalPriorotySum < 100) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) + 10);
                totalPriorotySum += 10;
                $(".minusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        if (v.langId == id) {
                            v.percentage = v.percentage + 10;
                        }
                    });
                });
                console.log(requirements);

                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) + 10;
                 }
                 });*/
            }
        };
        //CHANGE MINUS
        $scope.minusButton = function (id) {


            if ($("input[data-pr-num='" + id + "']").val() > 0 && totalPriorotySum > 0) {
                $("input[data-pr-num='" + id + "']").val(parseInt($("input[data-pr-num='" + id + "']").val()) - 10);
                totalPriorotySum -= 10;
                $(".plusButton").attr('disabled', false);

                $.each(requirements, function (key, val) {
                    $.each(val.combination, function (k, v) {
                        if (v.langId == id) {
                            v.percentage = v.percentage - 10;
                        }
                    });
                });


                /* $.each($rootScope.list1, function (key, val) {
                 if (val.langId == id) {
                 val.percentage = parseInt(val.percentage) - 10;
                 }
                 });*/


            }

        };
        //ADD LOCATION
        $scope.addAnotherLocation = function () {
            var html = $(".geocomplete").append('<div><input class="form-control" id="geocomplete' + locationIndex + '" required  type="text"  name="location" placeholder="Type in an address" size="90" autocomplete="on"/><i class="fa fa-times" aria-hidden="true"  ng-click="deleteLocation(' + locationIndex + ')"></i></div>');
            $("#geocomplete" + locationIndex).geocomplete();
            locationIndex++;
            if ($id != 'job')
                $compile(html)($scope);
        }
        $scope.deleteLocation = function (i) {
            console.log("#geocomplete" + i);
            $("#geocomplete" + i).parent().remove();
        }
    }
).directive('droppableMust', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id;
            id = attr.langName;
            totalPriorotySum = 0;
            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })
            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "must";
                }
            })
            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "must";
                    }
                });
            });


            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    if (val.mode == 'must') {
                        totalPriorotySum += parseInt(val.percentage);

                    }
                });
            }
            else if (requirements.length === 0) {
                combination = [];
                requirements.push({'combination': combination});
            }
            //requeire if i want to return the 'combinationDeleted' to original position
            combinationDeleted = false;

            //drag into must from langs
            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;

                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "must",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }

        }
    }
}).directive('droppableAdv', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {

            console.log(requirements);
            console.log(totalPriorotySum);
            var id = attr.langName;
            totalPriorotySum = 0;

            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "adv";
                    val.percentage = 0;
                }
            })

            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "adv";
                        v.percentage = 0;
                    }
                });
            });

            /* $.each(requirements[nextCombinationKey].combination, function (key, val) {
             console.log(val);
             if (val.mode == 'must') {
             totalPriorotySum += parseInt(val.percentage);
             console.log(val);
             }
             });*/

            console.log(requirements);
            console.log(totalPriorotySum);
            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    console.log(val);
                    if (val.mode == 'must')
                        totalPriorotySum += parseInt(val.percentage);
                });
            }
            else if (requirements.length == 0) {
                combination = [];
                requirements.push({'combination': combination});
            }

            console.log(requirements);
            console.log(totalPriorotySum);


            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "adv",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
            console.log(totalPriorotySum);
        }
    }
}).directive('droppableOr', function ($rootScope) {
    return {
        scope: {},
        link: function (scope, element, attr) {
            var id = attr.langName;
            totalPriorotySum = 0;


            $.each($rootScope.list1, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                }
            })

            $.each($rootScope.list2, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })
            $.each($rootScope.list3, function (key, val) {
                if (val.langId == id) {
                    val.mode = "or";
                    val.percentage = 0;
                }
            })


            $.each(requirements, function (key, val) {
                $.each(val.combination, function (k, v) {
                    if (v.langId == id) {
                        v.mode = "or";
                        v.percentage = 0;
                    }
                });
            });
            /* $.each(requirements[nextCombinationKey].combination, function (key, val) {
             if (val.mode == 'must')
             totalPriorotySum += parseInt(val.percentage);
             });*/


            if (combinationDeleted == false && nextCombinationKey >= 0 && requirements.length > 0) {
                $.each(requirements[nextCombinationKey].combination, function (key, val) {
                    if (val.mode == 'must')
                        totalPriorotySum += parseInt(val.percentage);
                });
            }
            else if (requirements.length == 0) {
                combination = [];
                requirements.push({'combination': combination});
            }

            if (attr.class == 'langsName' && newLangClicked == true && requirements.length > 0) {
                newLangClicked = false;
                requirements[nextCombinationKey].combination.push({
                    'langId': langId++,
                    'name': attr.value,
                    'mode': "or",
                    'years': 0,
                    'percentage': 0,
                    'drag': true
                })
            }
        }
    }
});

