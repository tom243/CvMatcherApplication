/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* hired controller ****************
 */

app.controller('hiredController', function ($rootScope, $location, $scope, $http) {

	angular.element(document).ready(function () {
        jsHandlerOb.stopMainProgressBar();
    });

    $scope.init = function () {

        $(".navBarImg ul li").removeClass("selected");
        console.log($location.path().split('/')[1]);
        if ($location.path().split('/')[1] == 'hired') {
            $(".navBarImg ul li:nth-child(3)").addClass("selected");
        }


        $(".navigation")[0].innerHTML = "<a href='#/login'>Homepage</a><span> > </span><a href='#/hired'>Hired</a>";
        angular.element(".fa-pulse").show();
        var names =[];
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/getEmployees',
            method: "POST",
            data: {
                "user_id": localStorage.getItem("user_id")
            }
        })
            .then(function (data) {
                    console.log(data.data);
                    $scope.hireCandidates = data.data;
                    angular.element(".fa-pulse").hide();
                    angular.forEach(data.data, function (value, key) {
                        names.push(value.user.first_name);
                    });

                    $( "#searchHire" ).autocomplete({
                        source: names,
                        select: function(e, ui) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.search = ui.item.label;
                                    $("#searchHire").val( ui.item.label);
                                });
                            }, 100);
                        }
                    });

                    /*
                     $("#searchHire").autocomplete({source:names});*/
                },
                function (response) { // optional
                    console.log("getEmployees AJAX failed!");
                    console.log(response);
                });
    }


    $scope.fired = function (indx, id) {
        $("#indx-" + indx + ">.fired").css("background", "url('images/fired11.png')");
        $("#indx-" + indx + ">.hiredImg").css("background", "url('images/hired22.png')");
        this.hireCandidate.personal_properties['decision'] = false;
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/setDecision',
            method: "POST",
            data: {
                "personal_properties_id": id,
                "decision": false,
                "user_id": localStorage.getItem("user_id")
            }
        }).then(function (data) {
            console.log(data.data._id);
            /*
             $scope = $('#hire-cand'+data.data._id).scope();
             $scope.personal_properties['decision'] = false;*/

        });
    }
    $scope.hired = function (indx, id) {
        $("#indx-" + indx + ">.hiredImg").css("background", "url('images/hired11.png')");
        $("#indx-" + indx + ">.fired").css("background", "url('images/fired22.png')");

        this.hireCandidate.personal_properties['decision'] = true;
        $http({
            url: 'https://cvmatcher.herokuapp.com/employer/setDecision',
            method: "POST",
            data: {
                "personal_properties_id": id,
                "decision": true,
                "user_id": localStorage.getItem("user_id")
            }
        }).then(function (data) {

            console.log(data.data._id);
            /*
             $scope = $('#hire-cand'+data.data._id).scope();
             console.log($scope);
             $scope.hireCandidate.personal_properties['decision'] = true;*/
        });
    }
});
