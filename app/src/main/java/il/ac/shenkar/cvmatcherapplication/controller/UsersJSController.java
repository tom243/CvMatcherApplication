package il.ac.shenkar.cvmatcherapplication.controller;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;

import il.ac.shenkar.cvmatcherapplication.R;
import il.ac.shenkar.cvmatcherapplication.activities.MainActivity;
import il.ac.shenkar.cvmatcherapplication.activities.UsersActivity;
import il.ac.shenkar.cvmatcherapplication.async.SendHwidToBackEndTask;
import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.common.User;
import il.ac.shenkar.cvmatcherapplication.resources.App;

/**
 * Created by Tomer on 10/03/2016.
 */
public class UsersJSController implements IConstants {

    private Resources appResources = App.getAppResources();
    private UsersActivity usersActivity = null;
    final SharedPreferences preferences = App.getAppSharedPreferences(IConstants.pref.CV_MATCHER_APPLICATION, App.MODE_PRIVATE);

    public UsersJSController(UsersActivity usersActivity) {
        this.usersActivity = usersActivity;
    }

    /**
     * this method loads new activity for the employer
     */
    @JavascriptInterface
    public void moveToEmployerActivity(final String pageSelection) {

        usersActivity.usersWebView.post(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(App.getContext(), MainActivity.class);
                intent.putExtra(general.USER_TYPE, general.EMPLOYER);
                if (pageSelection.equals("companyProfile")) {
                    intent.putExtra(general.PAGE_SELECTION, appResources.getString(R.string.COMPANY_PROFILE_PATH));
                } else { // my jobs path
                    intent.putExtra(general.PAGE_SELECTION, appResources.getString(R.string.MY_JOBS_PATH));
                }
                usersActivity.startActivity(intent);
            }
        });
    }

    /**
     * this method loads new activity for the job seeker
     */
    @JavascriptInterface
    public void moveToJobSeekerActivity(final String pageSelection) {

        usersActivity.usersWebView.post(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(App.getContext(), MainActivity.class); // TODO
                intent.putExtra(general.USER_TYPE, general.JOB_SEEKER );
                if (pageSelection.equals("Profile")) {
                    intent.putExtra(general.PAGE_SELECTION, appResources.getString(R.string.JOB_SEEKER_PROFILE_PATH));
                } else { // search jobs path
                    intent.putExtra(general.PAGE_SELECTION, appResources.getString(R.string.SEARCH_JOBS_PATH));
                }
                usersActivity.startActivity(intent);
            }
        });
    }

    /**
     * this method retrieve user details
     */
    @JavascriptInterface
    public String retriveUserDetails() {

        User user = new User();

        user.setId(preferences.getString(IConstants.pref.GOOGLE_USER_ID_KEY,""));
        user.setName(preferences.getString(IConstants.pref.FULL_NAME_KEY,""));
        user.setEmails(preferences.getString(IConstants.pref.EMAIL_KEY,""));

        return App.getGsonInstance().toJson(user);

    }

    /**
     * this method stop progress bar
     */
    @JavascriptInterface
    public void stopUsersProgressBar() {

        usersActivity.usersProgressBar.post(new Runnable() {
            @Override
            public void run() {
                usersActivity.usersProgressBar.setVisibility(View.INVISIBLE);
            }
        });

    }

}
