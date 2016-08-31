package il.ac.shenkar.cvmatcherapplication.utils;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;

import il.ac.shenkar.cvmatcherapplication.R;
import il.ac.shenkar.cvmatcherapplication.activities.UsersActivity;
import il.ac.shenkar.cvmatcherapplication.resources.App;

/**
 * Created by Tomer on 6/9/2016.
 * <p>
 * This class build the notification while app is running
 */
public class PushNotification {

    private Context context;

    public PushNotification(Context context) {
        this.context = context;
    }

    public Notification.Builder initNotification() {

        Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        Intent resultIntent = new Intent(context, UsersActivity.class);
        PendingIntent resultPendingIntent =
                PendingIntent.getActivity(
                        context,
                        0,
                        resultIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT
                );

/*        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context)
                        .setSmallIcon(R.drawable.cv_matcher_logo)
                        .setContentTitle("CV Matcher")
                        .setSound(uri)
                        .setContentIntent(resultPendingIntent);*/


        Notification.Builder mBuilder = new Notification.Builder(context)
                .setSmallIcon(R.drawable.cv_matcher_logo)
                .setContentTitle("CV Matcher")
                .setSound(uri)
                .setContentIntent(resultPendingIntent);

        return mBuilder;
    }

}