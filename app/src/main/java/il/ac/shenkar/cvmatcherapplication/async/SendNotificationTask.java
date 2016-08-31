package il.ac.shenkar.cvmatcherapplication.async;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import il.ac.shenkar.cvmatcherapplication.common.IConstants;

/**
 * Created by Tomer on 6/5/2016.
 */
public class SendNotificationTask extends AsyncTask<String, Void, String> implements IConstants {

    @Override
    protected String doInBackground(String... params) {
        String userId = params[0];
        String message = params[1];

        String response = sendNotification(userId, message);
        return response;
    }

    @Override
    protected void onPostExecute(String response) {
        Log.i("response from backend", response);
    }

    @Override
    protected void onCancelled() {

        Log.e("send notification", "error while trying to send notification to backend");
    }

    private String sendNotification(String userId, String message) {

        URL urlToConnectTo = null;
        HttpsURLConnection httpsConnection = null;
        InputStream responseInputStream = null;
        BufferedReader bufferedReader = null;
        StringBuffer responseStringBuffer = null;
        String responseString = null;

        try {
            urlToConnectTo = new URL(network.urls.CV_MATCHER_SERVER_URL + network.urls.SEND_NOTIFICATION_URL);
            httpsConnection = (HttpsURLConnection) urlToConnectTo.openConnection();
            httpsConnection.setRequestMethod(network.POST_REQUEST);
            httpsConnection.setDoInput(true);
            httpsConnection.setDoOutput(true);
            //httpsConnection.setRequestProperty("charset", general.UTF_8);
            httpsConnection.setRequestProperty("Content-Type", network.CONTENT_TYPE_APPLICATION_JSON);

            // when POST params are needed

            JSONObject json = new JSONObject();
            json.put(network.params.PARAM_USER_ID, userId);
            json.put(network.params.PARAM_MESSAGE, message);

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
