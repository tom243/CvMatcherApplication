package il.ac.shenkar.cvmatcherapplication.async;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.provider.Settings;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import il.ac.shenkar.cvmatcherapplication.common.IConstants;
import il.ac.shenkar.cvmatcherapplication.resources.App;

/**
 * Created by Tomer on 6/5/2016.
 */
public class SendHwidToBackEndTask extends AsyncTask<Void, Void, String> implements IConstants {

    final SharedPreferences preferences = App.getAppSharedPreferences(pref.CV_MATCHER_APPLICATION, App.MODE_PRIVATE);

    @Override
    protected String doInBackground(Void... params) {
        String hwid = Settings.Secure.getString(App.getContext().getContentResolver(),
                Settings.Secure.ANDROID_ID);

        Log.i("device hwid", hwid);

        String googleUserID = preferences.getString(pref.GOOGLE_USER_ID_KEY, "");

        String response = sendHWID(googleUserID, hwid);
        return response;
    }

    @Override
    protected void onPostExecute(String response) {
        Log.i("response from backend", response);
    }

    @Override
    protected void onCancelled() {

        Log.e("hwid async", "error while trying to send hwid to backend");
    }

    private String sendHWID(String googleUserID, String hwid) {

        URL urlToConnectTo = null;
        HttpsURLConnection httpsConnection = null;
        InputStream responseInputStream = null;
        BufferedReader bufferedReader = null;
        StringBuffer responseStringBuffer = null;
        String responseString = null;

        try {
            urlToConnectTo = new URL(network.urls.CV_MATCHER_SERVER_URL + network.urls.UPDATE_HWID_URL );
            httpsConnection = (HttpsURLConnection) urlToConnectTo.openConnection();
            httpsConnection.setRequestMethod(network.POST_REQUEST);
            httpsConnection.setDoInput(true);
            httpsConnection.setDoOutput(true);
            //httpsConnection.setRequestProperty("charset", general.UTF_8);
            httpsConnection.setRequestProperty("Content-Type", network.CONTENT_TYPE_APPLICATION_JSON);

            // when POST params are needed

            JSONObject json = new JSONObject();
            json.put(network.params.PARAM_GOOGLE_USER_ID, googleUserID);
            json.put(network.params.PARAM_HWID, hwid);

            String postParams = json.toString();

            DataOutputStream dataOutputStream = new DataOutputStream(httpsConnection.getOutputStream());
            dataOutputStream.writeBytes(postParams);
            dataOutputStream.flush();
            dataOutputStream.close();

            httpsConnection.connect();
            responseInputStream = httpsConnection.getInputStream();

            // convert the input stream to string
            bufferedReader = new BufferedReader(new InputStreamReader(responseInputStream));
            responseStringBuffer = new StringBuffer();

            String line = null;
            while ((line = bufferedReader.readLine()) != null) {
                responseStringBuffer.append(line);
            }

            // response as string
            responseString = responseStringBuffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
            this.cancel(true);
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (responseInputStream != null) {
                try {
                    responseInputStream.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (httpsConnection != null) {
                httpsConnection.disconnect();
            }
        }

        return responseString;
    }

}
