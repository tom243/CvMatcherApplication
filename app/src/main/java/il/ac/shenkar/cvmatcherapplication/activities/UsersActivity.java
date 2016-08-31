package il.ac.shenkar.cvmatcherapplication.activities;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import il.ac.shenkar.cvmatcherapplication.R;
import il.ac.shenkar.cvmatcherapplication.async.DownloadImageTask;
import il.ac.shenkar.cvmatcherapplication.async.SendHwidToBackEndTask;
import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.controller.UsersJSController;
import il.ac.shenkar.cvmatcherapplication.resources.App;
import il.ac.shenkar.cvmatcherapplication.utils.Utils;

public class UsersActivity extends AppCompatActivity implements IConstants {

    public WebView usersWebView = null;
    protected Resources appResources = null;
    final SharedPreferences preferences = App.getAppSharedPreferences(pref.CV_MATCHER_APPLICATION, App.MODE_PRIVATE);
    public ProgressBar usersProgressBar = null;

    public static Activity usersActivityReference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_users);

        appResources = App.getAppResources();
        usersActivityReference = this;

        Intent intent = getIntent();
        final SharedPreferences.Editor editor = preferences.edit();

        editor.putString(pref.EMAIL_KEY, intent.getStringExtra(googleDetails.EMAIL));
        editor.putString(pref.FULL_NAME_KEY, intent.getStringExtra(googleDetails.FULL_NAME));
        String imageUrl = intent.getStringExtra(googleDetails.IMAGE_URL);
        if (imageUrl != null) {
            editor.putString(pref.IMAGE_URL_KEY, imageUrl);
        }
        editor.putString(pref.GOOGLE_USER_ID_KEY, intent.getStringExtra(googleDetails.GOOGLE_USER_ID));
        editor.apply(); // if not working so need to use commit

        initializeViewMembers();

        Log.i(general.CV_MATCHER_APP_TAG, "Users Activity");

        if (!preferences.contains(general.FIRST_LOGIN)) {

            editor.putString(general.FIRST_LOGIN, general.TRUE);
            editor.apply(); // if not working so need to use commit

            new SendHwidToBackEndTask().execute();
        }else {
            Log.i("sendHWID","hwid already sent to backend");
        }

        usersProgressBar.setVisibility(View.VISIBLE);
        usersWebView.loadUrl(appResources.getString(R.string.USERS_LOGIN_PATH));
    }

    private void initializeViewMembers() {

        usersWebView = (WebView) findViewById(R.id.usersWebView);
        Utils.configureWebView(App.getContext(), usersWebView);
        usersWebView.addJavascriptInterface(new UsersJSController(this), general.JS_HANDLER_OB);
        ImageView googlePlusUserImage = (ImageView) findViewById(R.id.googlePlusUser);

        if (preferences.contains(pref.IMAGE_URL_KEY)) {
            if (preferences.contains(general.PROFILE_ABSOLUTE_PATH)) {
                Bitmap bitmap = Utils.loadImageFromStorage(preferences.getString(general.PROFILE_ABSOLUTE_PATH, ""));
                googlePlusUserImage.setImageBitmap(Utils.getCircleBitmap(bitmap));
            } else {
                new DownloadImageTask(googlePlusUserImage).execute(preferences.getString(pref.IMAGE_URL_KEY, ""));
            }
        }

        assert googlePlusUserImage != null;
        googlePlusUserImage.setOnLongClickListener(new View.OnLongClickListener() {

            @Override
            public boolean onLongClick(View view) {

                if (preferences.contains(pref.IMAGE_URL_KEY)) {
                    ImageView googlePlusUserImage = (ImageView) view.findViewById(R.id.googlePlusUser);
                    new DownloadImageTask(googlePlusUserImage).execute(preferences.getString(pref.IMAGE_URL_KEY, ""));
                }
                return true;
            }
        });

        googlePlusUserImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(App.getContext(), "please press long click to refresh profile photo", Toast.LENGTH_LONG).show();
            }
        });

        usersProgressBar = (ProgressBar) findViewById(R.id.usersProgressBar);

    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.i(general.CV_MATCHER_APP_TAG, "in on resume");
        usersWebView.loadUrl(appResources.getString(R.string.USERS_LOGIN_PATH));
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.i(general.CV_MATCHER_APP_TAG, "in on pause");
    }

}