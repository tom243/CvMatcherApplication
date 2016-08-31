package il.ac.shenkar.cvmatcherapplication.controller;

import android.content.res.Resources;
import android.view.View;
import android.webkit.JavascriptInterface;

import il.ac.shenkar.cvmatcherapplication.R;
import il.ac.shenkar.cvmatcherapplication.activities.MainActivity;
import il.ac.shenkar.cvmatcherapplication.async.SendNotificationTask;
import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.resources.App;

/**
 * Created by Tomer on 23/02/2016.
 */
public class MainJSController implements IConstants {

    private Resources appResources = App.getAppResources();
    private MainActivity mainActivity = null;

    public MainJSController(MainActivity mainActivity) {
        this.mainActivity = mainActivity;
    }

    /**
     * this method loads the webview with the 'home' page and toast a message
     */
    @JavascriptInterface
    public void moveToHomePage() {
        mainActivity.mainWebView.post(new Runnable() {
            @Override
            public void run() {
                mainActivity.mainWebView.loadUrl(appResources.getString(R.string.USERS_LOGIN_PATH));
            }
        });
    }

    /**
     * this method send like notification to the job seeker
     */
    @JavascriptInterface
    public void sendLikeNotification(String userID, String jobName, String stars) {

        String message = "The employer liked your cv and rated it with a number of "
                + stars + " stars for job " + jobName;


        new SendNotificationTask().execute(userID, message);
    }

    /**
     * this method send unlike notification to the job seeker
     */
    @JavascriptInterface
    public void sendUnLikeNotification(String userID, String jobName, String refusalDesc) {

        String message = "The employer didn't like your cv and entered the feedback: "
                + refusalDesc + " for job " + jobName;

        new SendNotificationTask().execute(userID, message);
    }

    /**
     * this method send seen notification to the job seeker
     */
    @JavascriptInterface
    public void sendSeenNotification(String userID, String jobName) {

        String message = "The employer viewed your cv for job: " + jobName;
        new SendNotificationTask().execute(userID, message);

    }

    /**
     * this method send hire notification to the job seeker
     */
    @JavascriptInterface
    public void sendHireNotification(String userID, String jobName) {

        String message = "congratulations!! you're hired for job: " + jobName;
        new SendNotificationTask().execute(userID, message);

    }

    /**
     * this method stop progress bar
     */
    @JavascriptInterface
    public void stopMainProgressBar() {

        mainActivity.mainProgressBar.post(new Runnable() {
            @Override
            public void run() {
                mainActivity.mainProgressBar.setVisibility(View.INVISIBLE);
            }
        });

    }

}
