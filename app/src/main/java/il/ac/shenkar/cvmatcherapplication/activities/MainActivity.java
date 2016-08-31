package il.ac.shenkar.cvmatcherapplication.activities;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.gson.JsonObject;
import com.pushwoosh.BasePushMessageReceiver;
import com.pushwoosh.BaseRegistrationReceiver;
import com.pushwoosh.PushManager;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import il.ac.shenkar.cvmatcherapplication.R;
import il.ac.shenkar.cvmatcherapplication.adapters.CustomListAdapter;
import il.ac.shenkar.cvmatcherapplication.async.DownloadImageTask;
import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.controller.MainJSController;
import il.ac.shenkar.cvmatcherapplication.resources.App;
import il.ac.shenkar.cvmatcherapplication.utils.PushNotification;
import il.ac.shenkar.cvmatcherapplication.utils.Utils;


public class MainActivity extends AppCompatActivity implements IConstants {

    public WebView mainWebView = null;
    private Resources appResources = null;
    private ImageView slidePanelImage = null;
    private DrawerLayout drawer = null;
    private String userType = null;
    public ProgressBar mainProgressBar = null;
    final SharedPreferences preferences = App.getAppSharedPreferences(pref.CV_MATCHER_APPLICATION, App.MODE_PRIVATE);
    public static Activity mainActivityReference;

    private static final AtomicInteger counter = new AtomicInteger();
    Notification.Builder mBuilder = null;
    NotificationManager mNotifyMgr = null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.i(general.CV_MATCHER_APP_TAG, "Main Activity");

        setContentView(R.layout.activity_main);
        mainActivityReference = this;

        Intent intent = getIntent();
        String pageSelection = intent.getStringExtra(general.PAGE_SELECTION);
        userType = intent.getStringExtra(general.USER_TYPE);

        initializeViewMembers();
        appResources = App.getAppResources();
        initDrawer();

        Utils.configureWebView(App.getContext(), mainWebView);
        configureBtnSlideImageViewClickListener();

        // Init notification
        PushNotification pushNotification = new PushNotification(this);
        mBuilder = pushNotification.initNotification();

        // Gets an instance of the NotificationManager service
        mNotifyMgr = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // Push Woosh

        //Register receivers for push notifications
        registerReceivers();

        //Create and start push manager
        PushManager.setMultiNotificationMode(this);
        PushManager pushManager = PushManager.getInstance(this);

        //Start push manager, this will count app open for Pushwoosh stats as well
        try {
            pushManager.onStartup(this);
        } catch (Exception e) {
            Log.e("push woosh error", e.getMessage());
            //push notifications are not available or AndroidManifest.xml is not configured properly
        }

        //Register for push!
        pushManager.registerForPushNotifications();

        checkMessage(getIntent());

        /* End Push Woosh */

        mainProgressBar.setVisibility(View.VISIBLE);
        mainWebView.loadUrl(pageSelection);
    }

    private void initializeViewMembers() {
        mainWebView = (WebView) findViewById(R.id.mainWebView);
        mainWebView.addJavascriptInterface(new MainJSController(this), general.JS_HANDLER_OB);

        slidePanelImage = (ImageView) findViewById(R.id.slidePanelImageView);
        drawer = (DrawerLayout) findViewById(R.id.mainDrawerLayout);

        ImageView logoImage = (ImageView) findViewById(R.id.employerLogoImageView);
        assert logoImage != null;
        logoImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(App.getContext(), UsersActivity.class);
                startActivity(intent);
                finish();
            }
        });

        mainProgressBar = (ProgressBar) findViewById(R.id.mainProgressBar);

    }

    /**
     * this method deals with click on the back button
     *
     * @param keyCode key entered
     * @param event   event
     * @return boolean
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mainWebView != null && mainWebView.canGoBack()) {
                mainWebView.goBack();
                return true;
            } else {
                return super.onKeyDown(keyCode, event);
            }
        }

        return super.onKeyDown(keyCode, event);
    }

    //initialization of the drawer with the correct CategoryBean objects
    private void initDrawer() {
        drawer.setDrawerListener(new DrawerLayout.SimpleDrawerListener() {
            private float prevOffset = 0;
            private boolean isSwitchToLeftRequired = true;
            private boolean isSwitchToRightRequired = true;

            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                if (prevOffset == 0 && slideOffset > prevOffset && isSwitchToLeftRequired) {
                    slidePanelImage.setImageResource(R.drawable.x);
                    isSwitchToLeftRequired = false;
                    isSwitchToRightRequired = true;
                } else if (prevOffset == 1 && slideOffset < prevOffset && isSwitchToRightRequired) {
                    slidePanelImage.setImageResource(R.drawable.hamburger);
                    isSwitchToRightRequired = false;
                    isSwitchToLeftRequired = true;
                } else if (prevOffset < slideOffset && isSwitchToLeftRequired) {
                    slidePanelImage.setImageResource(R.drawable.x);
                    isSwitchToLeftRequired = false;
                    isSwitchToRightRequired = true;
                } else if (slideOffset < prevOffset && isSwitchToRightRequired) {
                    slidePanelImage.setImageResource(R.drawable.hamburger);
                    isSwitchToRightRequired = false;
                    isSwitchToLeftRequired = true;
                }
                prevOffset = slideOffset;

                super.onDrawerSlide(drawerView, slideOffset);

            }

            @Override
            public void onDrawerClosed(View drawerView) {
            }

            //when opening the drawer we are going to save all the answers that on the screen
            @Override
            public void onDrawerOpened(View drawerView) {

            }
        });

        List<String> list = new ArrayList<>();
        ArrayAdapter adapter = null;

        LayoutInflater inflater = getLayoutInflater();
        View listHeaderView = inflater.inflate(R.layout.header_list, null, false);

        switch (userType) {
            case general.EMPLOYER:

                list.add(drawerMenuNames.employer.COMPANY_PROFILE);
                list.add(drawerMenuNames.employer.MY_JOBS);
                list.add(drawerMenuNames.employer.DELETED_JOBS);
                list.add(drawerMenuNames.employer.HIRED_JOBS);
                list.add(drawerMenuNames.employer.ADD_JOB);
                list.add(drawerMenuNames.employer.SETTINGS);
                list.add(drawerMenuNames.employer.HOME_PAGE);

                adapter = new CustomListAdapter(this, list);

                final ListView employerNavList = (ListView) findViewById(R.id.mainDrawer);

                employerNavList.addHeaderView(listHeaderView);

                assert employerNavList != null;
                employerNavList.setAdapter(adapter);

                employerNavList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, final int pos, long id) {
                        Intent intent = null;
                        switch ((int) id) {
                            case 0: // COMPANY PROFILE
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.COMPANY_PROFILE_PATH));
                                break;
                            case 1: // MY JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.MY_JOBS_PATH));
                                break;
                            case 2: // DELETED JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.DELETED_JOBS_PATH));
                                break;
                            case 3: // HIRED JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.HIRED_PATH));
                                break;
                            case 4: // ADD JOB
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.ADD_JOB_PATH));
                                break;
                            case 5: // SETTINGS
                                intent = new Intent(App.getContext(), SignInActivity.class);
                                intent.putExtra("logOutMode", true);
                                startActivity(intent);
                                break;
                            case 6: // Home PAGE
                                intent = new Intent(App.getContext(), UsersActivity.class);
                                startActivity(intent);
                                finish();
                                break;
                            default: // MAIN ACTIVITY
                                intent = new Intent(App.getContext(), UsersActivity.class);
                                startActivity(intent);
                                finish();
                                break;
                        }
                        drawer.closeDrawer(employerNavList);
                        slidePanelImage.setImageResource(R.drawable.hamburger);
                    }
                });

                break;

            case general.JOB_SEEKER:

                list.add(drawerMenuNames.jobSeeker.PROFILE);
                list.add(drawerMenuNames.jobSeeker.SEARCH_JOBS);
                list.add(drawerMenuNames.jobSeeker.MY_JOBS);
                list.add(drawerMenuNames.jobSeeker.FAVORITE_JOBS);
                list.add(drawerMenuNames.jobSeeker.DELETED_JOBS);
                list.add(drawerMenuNames.jobSeeker.SETTINGS);
                list.add(drawerMenuNames.jobSeeker.HOME_PAGE);

                adapter = new CustomListAdapter(this, list);

                final ListView jobSeekerNavList = (ListView) findViewById(R.id.mainDrawer);

                jobSeekerNavList.addHeaderView(listHeaderView);

                assert jobSeekerNavList != null;
                jobSeekerNavList.setAdapter(adapter);

                jobSeekerNavList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, final int pos, long id) {
                        Intent intent = null;
                        switch ((int) id) {
                            case 0: // PROFILE
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.JOB_SEEKER_PROFILE_PATH));
                                break;
                            case 1: // SEARCH_JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.SEARCH_JOBS_PATH));
                                break;
                            case 2: // MY_JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.JOB_SEEKER_MY_JOBS_PATH));
                                break;
                            case 3: // FAVORITE_JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.FAVORITE_JOBS_PATH));
                                break;
                            case 4: // DELETED_JOBS
                                mainProgressBar.setVisibility(View.VISIBLE);
                                mainWebView.loadUrl(appResources.getString(R.string.JOB_SEEKER_DELETED_JOBS_PATH));
                                break;
                            case 5: // SETTINGS
                                intent = new Intent(App.getContext(), SignInActivity.class);
                                intent.putExtra("logOutMode", true);
                                startActivity(intent);
                                break;
                            case 6: // Home PAGE
                                intent = new Intent(App.getContext(), UsersActivity.class);
                                startActivity(intent);
                                finish();
                                break;
                            default: // MAIN ACTIVITY
                                intent = new Intent(App.getContext(), UsersActivity.class);
                                startActivity(intent);
                                finish();
                                break;
                        }
                        drawer.closeDrawer(jobSeekerNavList);
                        slidePanelImage.setImageResource(R.drawable.hamburger);
                    }
                });

                break;

        }

        ImageView googlePlusUserImage = (ImageView) findViewById(R.id.googleProfileImage);

        if (preferences.contains(pref.IMAGE_URL_KEY)) {
            if (preferences.contains(general.PROFILE_ABSOLUTE_PATH)) {
                Bitmap bitmap = Utils.loadImageFromStorage(preferences.getString(general.PROFILE_ABSOLUTE_PATH, ""));
                googlePlusUserImage.setImageBitmap(Utils.getCircleBitmap(bitmap));
            } else {
                new DownloadImageTask(googlePlusUserImage).execute(preferences.getString(pref.IMAGE_URL_KEY, ""));
            }
        }

        assert googlePlusUserImage != null;
        googlePlusUserImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                switch (userType) {
                    case general.EMPLOYER:
                        mainProgressBar.setVisibility(View.VISIBLE);
                        mainWebView.loadUrl(appResources.getString(R.string.COMPANY_PROFILE_PATH));
                        break;

                    case general.JOB_SEEKER:
                        mainProgressBar.setVisibility(View.VISIBLE);
                        mainWebView.loadUrl(appResources.getString(R.string.JOB_SEEKER_PROFILE_PATH));
                        break;
                }
                toggleMenu();
            }
        });

    }

    private void configureBtnSlideImageViewClickListener() {
        slidePanelImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleMenu();
            }
        });
    }

    private void toggleMenu() {
        if (drawer.isDrawerOpen(findViewById(R.id.mainDrawer))) {
            drawer.closeDrawer(Gravity.LEFT);
            slidePanelImage.setImageDrawable(App.getAppResources().getDrawable(R.drawable.hamburger));
        } else {
            drawer.openDrawer(Gravity.LEFT);
            slidePanelImage.setImageDrawable(App.getAppResources().getDrawable(R.drawable.x));
        }
    }

    /* Push Woosh functions */

    //Registration receiver
    BroadcastReceiver mBroadcastReceiver = new BaseRegistrationReceiver() {
        @Override
        public void onRegisterActionReceive(Context context, Intent intent) {
            checkMessage(intent);
        }
    };

    //Push message receiver
    private BroadcastReceiver mReceiver = new BasePushMessageReceiver() {
        @Override
        protected void onMessageReceive(Intent intent) {
            //JSON_DATA_KEY contains JSON payload of push notification.
            showMessage(intent.getExtras().getString(JSON_DATA_KEY));
        }
    };

    //Registration of the receivers
    public void registerReceivers() {
        IntentFilter intentFilter = new IntentFilter(getPackageName() + ".action.PUSH_MESSAGE_RECEIVE");

        registerReceiver(mReceiver, intentFilter, getPackageName() + ".permission.C2D_MESSAGE", null);

        registerReceiver(mBroadcastReceiver, new IntentFilter(getPackageName() + "." + PushManager.REGISTER_BROAD_CAST_ACTION));
    }

    public void unregisterReceivers() {
        //Unregister receivers on pause
        try {
            unregisterReceiver(mReceiver);
        } catch (Exception e) {
            Log.e(general.CV_MATCHER_APP_TAG,  e.toString());
        }

        try {
            unregisterReceiver(mBroadcastReceiver);
        } catch (Exception e) {
            Log.e(general.CV_MATCHER_APP_TAG,  e.toString());
        }
    }

    @Override
    public void onResume() {
        super.onResume();

        //Re-register receivers on resume
        registerReceivers();
    }

    @Override
    public void onPause() {
        super.onPause();

        //Unregister receivers on pause
        unregisterReceivers();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);

        checkMessage(intent);
    }


    private void checkMessage(Intent intent) {
        if (null != intent) {
            if (intent.hasExtra(PushManager.PUSH_RECEIVE_EVENT)) {
                showMessage(intent.getExtras().getString(PushManager.PUSH_RECEIVE_EVENT));
            } else if (intent.hasExtra(PushManager.REGISTER_EVENT)) {
                //showMessage("register");
            } else if (intent.hasExtra(PushManager.UNREGISTER_EVENT)) {
                //showMessage("unregister");
            } else if (intent.hasExtra(PushManager.REGISTER_ERROR_EVENT)) {
                //showMessage("register error");
            } else if (intent.hasExtra(PushManager.UNREGISTER_ERROR_EVENT)) {
                ///showMessage("unregister error");
            }

            resetIntentValues();
        }
    }

    /**
     * Will check main Activity intent and if it contains any PushWoosh data, will clear it
     */
    private void resetIntentValues() {
        Intent mainAppIntent = getIntent();

        if (mainAppIntent.hasExtra(PushManager.PUSH_RECEIVE_EVENT)) {
            mainAppIntent.removeExtra(PushManager.PUSH_RECEIVE_EVENT);
        } else if (mainAppIntent.hasExtra(PushManager.REGISTER_EVENT)) {
            mainAppIntent.removeExtra(PushManager.REGISTER_EVENT);
        } else if (mainAppIntent.hasExtra(PushManager.UNREGISTER_EVENT)) {
            mainAppIntent.removeExtra(PushManager.UNREGISTER_EVENT);
        } else if (mainAppIntent.hasExtra(PushManager.REGISTER_ERROR_EVENT)) {
            mainAppIntent.removeExtra(PushManager.REGISTER_ERROR_EVENT);
        } else if (mainAppIntent.hasExtra(PushManager.UNREGISTER_ERROR_EVENT)) {
            mainAppIntent.removeExtra(PushManager.UNREGISTER_ERROR_EVENT);
        }

        setIntent(mainAppIntent);
    }

    private void showMessage(String message) {


        String notification = App.getGsonInstance().fromJson(message, JsonObject.class).get("title").getAsString();
        //mBuilder.setContentText(notification);
        mBuilder.setStyle(new Notification.BigTextStyle()
                .bigText(notification));
        // Sets an ID for the notification
        int mNotificationId = counter.getAndIncrement();

        // Builds the notification and issues it.
        mNotifyMgr.notify(mNotificationId, mBuilder.build());

    }

    /* End Push Woosh functions */

}
