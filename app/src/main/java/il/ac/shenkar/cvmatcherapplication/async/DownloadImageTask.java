package il.ac.shenkar.cvmatcherapplication.async;

import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import java.io.InputStream;

import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.resources.App;
import il.ac.shenkar.cvmatcherapplication.utils.Utils;

/**
 * Created by Tomer on 5/30/2016.
 */
public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {

    ImageView bmImage;
    final SharedPreferences preferences = App.getAppSharedPreferences(IConstants.pref.CV_MATCHER_APPLICATION, App.MODE_PRIVATE);

    public DownloadImageTask(ImageView bmImage) {
        this.bmImage = bmImage;
    }

    protected Bitmap doInBackground(String... urls) {
        String urldisplay = urls[0];
        Bitmap mIcon11 = null;
        try {
            InputStream in = new java.net.URL(urldisplay).openStream();
            mIcon11 = BitmapFactory.decodeStream(in);
        } catch (Exception e) {
            Log.e("Error", e.getMessage());
            e.printStackTrace();
        }
        return mIcon11;
    }

    protected void onPostExecute(Bitmap result) {

        final SharedPreferences.Editor editor = preferences.edit();

        editor.putString(IConstants.general.PROFILE_ABSOLUTE_PATH, Utils.saveToInternalStorage(result));
        editor.apply(); // if not working so need to use commit
        bmImage.setImageBitmap(Utils.getCircleBitmap(result));
        Toast.makeText(App.getContext(), "Profile picture updated", Toast.LENGTH_LONG).show();
    }
}
