package il.ac.shenkar.cvmatcherapplication.common;

import android.provider.BaseColumns;

/**
 * Created by Tomer on 23/02/2016.
 */
public interface IConstants {

    final class general {
        public static final String UTF_8 = "UTF-8";
        public static final String JS_HANDLER_OB = "jsHandlerOb";
        public static final String MAIN_JS_HANDLER_OB = "mainJsHandlerOb";
        public static final String JOB_SEEKER_JS_HANDLER_OB = "jobSeekerJsHandlerOb";
        public static final String TEST_JS_HANDLER_OB = "testJsHandlerOb";
        public static final String CV_MATCHER_APP_TAG = "CV_MATCHER_APP_TAG";
        public static final String EMPTY_STRING = "";
        public static final String PROFILE_ABSOLUTE_PATH = "profileAbsolutePath";
        public static final String PAGE_SELECTION = "pageSelection";
        public static final String USER_TYPE = "userType";
        public static final String JOB_SEEKER = "jobSeeker";
        public static final String EMPLOYER = "employer";
        public static final String FIRST_LOGIN = "firstLogin";
        public static final String TRUE = "true";
        public static final String FALSE = "false";
    }

    final class pref {
        public static final String CV_MATCHER_APPLICATION = "CVMatcherApplication";
        public static final String FULL_NAME_KEY = "FULL_NAME_KEY";
        public static final String IMAGE_URL_KEY = "IMAGE_URL_KEY";
        public static final String EMAIL_KEY = "EMAIL_KEY";
        public static final String GOOGLE_USER_ID_KEY = "GOOGLE_USER_ID_KEY";
    }

    final class network {
        public static final String POST_REQUEST = "POST";
        public static final String CONTENT_TYPE_APPLICATION_JSON = "application/json";

        public static final class urls {
            public static final String CV_MATCHER_SERVER_URL = "https://cvmatcher.herokuapp.com/";
            public static final String UPDATE_HWID_URL = "updateHWID";
            public static final String SEND_NOTIFICATION_URL = "sendNotification";

        }

        public static final class params {
            public static final String PARAM_GOOGLE_USER_ID = "google_user_id";
            public static final String PARAM_HWID = "hwid";
            public static final String PARAM_USER_ID = "user_id";
            public static final String PARAM_MESSAGE = "message";
        }
    }

    final class googleDetails {
        public static final String FULL_NAME = "FULL_NAME";
        public static final String IMAGE_URL = "IMAGE_URL";
        public static final String EMAIL = "EMAIL";
        public static final String GOOGLE_USER_ID = "GOOGLE_USER_ID";
    }

    final class drawerMenuNames {

        public static final class employer {
            public static final String MY_JOBS = "My Jobs";
            public static final String DELETED_JOBS = "Deleted Jobs";
            public static final String COMPANY_PROFILE = "Profile";
            public static final String SETTINGS = "Settings";
            public static final String HOME_PAGE = "Homepage";
            public static final String ADD_JOB = "Add Job";
            public static final String HIRED_JOBS = "Hired Jobs";
        }

        public static final class jobSeeker {
            public static final String PROFILE = "Profile";
            public static final String SEARCH_JOBS = "Search Jobs";
            public static final String MY_JOBS = "My Jobs";
            public static final String FAVORITE_JOBS = "Favorite Jobs";
            public static final String DELETED_JOBS = "Deleted Jobs";
            public static final String SETTINGS = "Settings";
            public static final String HOME_PAGE = "Homepage";
        }

    }

}
