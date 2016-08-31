/**
 * Created by Roni on 30/05/2016.
 */

/*
 * ********************* googleSignIn controller ****************
 */


loadCSS('googleSignIn');
var helper;
var auth2;
var profile = '';
app.controller('googleSignInController', function ($rootScope) {
    angular.element("#logo").attr("href", '');
});

//sign in to google
var updateSignIn = function () {
    auth2.isSignedIn.get();
    helper.onSignInCallback(gapi.auth2.getAuthInstance());
};
//This method sets up the sign-in listener after the client library loads.
function startApp() {
    if (loadedPlatformScript == false) {
        loadedPlatformScript = true;
        gapi.load('auth2', function () {
            gapi.client.load('plus', 'v1').then(function () {
                gapi.signin2.render('signin-button', {
                    scope: 'https://www.googleapis.com/auth/userinfo.email',
                    fetch_basic_profile: false
                });
                gapi.auth2.init({
                    fetch_basic_profile: false,
                    scope: 'https://www.googleapis.com/auth/userinfo.email'
                }).then(
                    function () {
                        auth2 = gapi.auth2.getAuthInstance();
                        auth2.isSignedIn.listen(updateSignIn);
                        auth2.then(updateSignIn);
                    });
            });
        });
    }
}
//get the profile, disconnect and sign in helper for google button
helper = (function () {
    return {
        onSignInCallback: function (authResult) {

            if (!authResult.isSignedIn.get()) {
                if (authResult['error'] || !(null != authResult.currentUser.get().getAuthResponse())) {
                    console.log('There was an error: ' + authResult['error']);
                }
                $('#authResult').append('Logged out');
                $('#authOps').hide('slow');
                $('#gConnect').show();
            } else {
                $('#authOps').show('slow');
                helper.profile();
            }

        },
        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function () {
            // Revoke the access token.
            auth2.disconnect();
            /*

             localStorage.removeItem('user');
             localStorage.removeItem('profile');
             localStorage.removeItem('userSignInType');
             localStorage.removeItem('user_id');
             localStorage.removeItem('company');
             localStorage.removeItem('employerFirstSignIn');
             localStorage.removeItem('current_cv');
             localStorage.removeItem('jobSeekerFirstSignIn');
             */
            localStorage.clear();
            console.log('User sign out.');
        },

        profile: function () {
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function (res) {
                profile = res.result;

                //set coockies of user
                var user = {
                    id: profile.id,
                    name: profile.displayName,
                    image: profile["image"].url,
                    emails: profile.emails[0].value
                };
                if (localStorage.getItem('user') == null) {
                    console.log("user first time");
                    location.replace("#/login");
                }
                localStorage.setItem('user', JSON.stringify(user));
                $("#profileImg").attr("src", $.parseJSON(localStorage.getItem('user')).image);


            }, function (err) {
                console.log(err);
            });
        }
    };
})();
//google signOut and LogOut
function logout(out) {
    if (out == 'logout') {
        console.log(auth2);
        //  auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {

            localStorage.clear();
            console.log('User logout out.');
        });

    }
    else {
        helper.disconnect();
    }
    if (window.location.href.indexOf("localhost") > -1)
        window.location.href = '/cvmatcher';
    else
        window.location.href = 'http://cvmatcher.esy.es';
}

