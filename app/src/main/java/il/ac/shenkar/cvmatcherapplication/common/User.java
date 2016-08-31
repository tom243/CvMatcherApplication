package il.ac.shenkar.cvmatcherapplication.common;

/**
 * Created by Tomer on 5/30/2016.
 */
public class User {

    private String name;
    private String id;
    private String emails;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmails() {
        return emails;
    }

    public void setEmails(String emails) {
        this.emails = emails;
    }

    public User(String name, String id, String emails) {
        this.name = name;
        this.id = id;
        this.emails = emails;
    }

    public User(){}

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", id='" + id + '\'' +
                ", emails='" + emails + '\'' +
                '}';
    }
}
