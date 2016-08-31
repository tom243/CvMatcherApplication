/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* jobSeeker Search Jobs Controller ****************
 */
app.controller('jobSeekerSearchJobsController', function ($rootScope, $scope, $sce, $http, $location) {

	angular.element(document).ready(function () {
        jsHandlerOb.stopMainProgressBar();
    });

    var jobTitles;
    //initialize parameters for controller
    $scope.init = function () {
        $(".navBarImg ul li").removeClass("selected");
        console.log($location.path().split('/')[1]);
        if ($location.path().split('/')[1] == 'search-jobs') {
            $(".navBarImg ul li:nth-child(1)").addClass("selected");
        }
        //load CSS for this current page

        jobTitles = [];
        localStorage.removeItem('fixCV');
        $scope.getTopTenJobs = false;
        $rootScope.userSignInType = 'jobSeeker';
        angular.element("#logo").attr("href", '#/login');
        //navigation in site
        //navigation in site
        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/search-jobs'>Find Jobs</a>";

        angular.element(".sort_compability").hide();
        angular.element(".sort_date").hide();
    };
    //get jobs that didnot send cv to them

    $scope.getMainJson = function () {
        angular.element(".sort_compability").show();
        angular.element(".sort_date").show();
        angular.element(".fa-spinner").show();
        $scope.getTopTenJobs = false;
        $scope.jobSeekerJobs = '';

        $http({
            url: 'https://cvmatcher.herokuapp.com/getUser',
            method: "POST",
            data: {
                "user_id": localStorage.getItem('user_id')
            }
        }).then(function (data) {
            console.log(data.data[0]);
            if (typeof data.data[0].current_cv == 'undefined') {
                $scope.cv_exist = false;
            }
            else {
                $scope.cv_exist = true;
                localStorage.setItem("current_cv",data.data[0].current_cv);
            }

        });

        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getJobsBySector',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id"),
                "sector": "software engineering"
            }
        })
            .then(function (data) {
                    $scope.jobSeekerJobs = data.data;
                    console.log(data.data);
                    angular.element(".fa-pulse").hide();
                    angular.element(".fa-spinner").hide();

                    angular.forEach(data.data, function (value, key) {
                        jobTitles.push(value.original_text.title);
                        data.data[key].date = value.date.split("T")[0] + ' | ' + value.date.split("T")[1].split(".")[0];
                    });
               // $scope.names = jobTitles;

                    $( ".searchText" ).autocomplete({
                        source: jobTitles,
                        select: function(e, ui) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.searchText = ui.item.label;
                                    $(".searchText").val( ui.item.label);
                                });
                            }, 100);
                        }
                    });

                },
                function (response) { // optional
                    angular.element(".fa-pulse").hide();
                    console.log("resumeController AJAX failed!");
                    console.log(response);

                });
    };
    $('.searchText select').click(function() {
        console.log("a");
        $('.searchText').trigger("focus"); //or "click", at least one should work
    });

    $scope.showSortOptions = function(){
        angular.element(".sort_compability").show();
        angular.element(".sort_date").show();
    }
    //sort jobs by user selection
    $scope.sort = function (sort) {
        $scope.sortby = sort;
    };
    //save data - for match page check
    $scope.saveData = function (title, compatibility_level,logo,date) {
        var jobDetails = {
            "title":title,
            "compatibility_level":compatibility_level,
            "logo":logo,
            "date":date
        };
        localStorage.setItem("jobDetails", JSON.stringify(jobDetails));
    };
    //accordion collepse arrow
    //accordion collepse arrow
    $scope.collepse = function (id) {
        if ($("#collepse-" + id).hasClass("in")) {
            $("#collepse-" + id).parent().find(".arrow-down").show();
            $("#collepse-" + id).parent().find(".arrow-up").hide();
        }
        else {
            $("#collepse-" + id).parent().find(".arrow-up").show();
            $("#collepse-" + id).parent().find(".arrow-down").hide();
        }
    };
    //get top 10
    $scope.getTopTen = function(){
        angular.element(".sort_compability").hide();
        angular.element(".sort_date").hide();
        angular.element(".fa-spinner").show();
        $scope.jobSeekerJobs = [];
        $scope.sortby = -'matcher_grade';
        $http({
            url: 'https://cvmatcher.herokuapp.com/jobSeeker/getBestMatchJobs',
            method: "POST",
            data: {
                "user_id":localStorage.getItem('user_id'),
                "sector":"software engineering",
                "cv": localStorage.getItem('current_cv')
            }
        }).then(function (data) {
            console.log(data);
            $scope.getTopTenJobs = true;
            angular.element(".fa-spinner").hide();
            $scope.jobSeekerJobs = data.data;
            angular.forEach(data.data, function (value, key) {
                data.data[key].date = value.date.split("T")[0] + ' | ' + value.date.split("T")[1].split(".")[0];
            });
        });


    }
});
