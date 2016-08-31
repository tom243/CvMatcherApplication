package il.ac.shenkar.cvmatcherapplication.resources;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Resources;

import com.google.gson.Gson;

/**
 * Created by Tomer on 23/02/2016.
 */
public class App extends Application {

    private static Context context;
    private static Gson gsonInstance;

    @Override
    public void onCreate() {
        super.onCreate();
        context = this;
        gsonInstance = new Gson();
    }

    /**
     * get the application's context
     *
     * @return
     */
    public static Context getContext() {
        return context;
    }

    /**
     * get the applications' Resources object
     *
     * @return
     */
    public static Resources getAppResources() {
        return context.getResources();
    }

    /**
     * get the applications' SharedPreferences object
     *
     * @return
     */
    public static SharedPreferences getAppSharedPreferences(String name, int mode) {
        return context.getSharedPreferences(name, mode);
    }

/*    *//**
     * this method retrieves IContactUsDAO instance for db operations
     *
     * @return IContactUsDAO instance
     *//*
    public static IContactUsDAO getContactUsDAO(DAOFactory.DBType dbType) {
        return DAOFactory.getDAOFactory(dbType).getContactUsDAO();
    }*/

    public static Gson getGsonInstance() {
        return gsonInstance;
    }

}
