package org.jitsi.meet.sdk;

import android.os.*;

import java.net.*;
import java.util.*;

public class JitsiMeetConferenceOptions
{
    private final static String PROP_AUDIO_ONLY = "audioOnly";

    private final static String PROP_AUDIO_MUTED = "audioMuted";

    private final static String PROP_COLOR_SCHEME = "colorScheme";

    private final static String PROP_SERVER_URL = "serverURL";

    private final static String PROP_PICTURE_IN_PICTURE_ENABLED
        = "pictureInPictureEnabled";

    private final static String PROP_ROOM = "room";

    private final static String PROP_VIDEO_MUTED = "videoMuted";

    private final static String PROP_WELCOME_PAGE_ENABLED
        = "welcomePageEnabled";

    private final Bundle bundle;

    public JitsiMeetConferenceOptions() {
        this((Bundle) null);
    }

    public JitsiMeetConferenceOptions(JitsiMeetConferenceOptions defaultOptions) {
        this(defaultOptions != null ? defaultOptions.bundle : null);
    }

    private JitsiMeetConferenceOptions(Bundle defaults) {
        this.bundle = new Bundle();

        if (defaults != null) {
            this.bundle.putAll(defaults);
        }
    }

    public Boolean getAudioMuted() {
        return bundle.getBoolean(PROP_AUDIO_MUTED);
    }

    public Boolean getAudioOnly() {
        return bundle.getBoolean(PROP_AUDIO_ONLY);
    }

    public Bundle getColorScheme() {
        return bundle.getBundle(PROP_COLOR_SCHEME);
    }

    public String getRoom() {
        return bundle.getString(PROP_ROOM);
    }

    public String getServerURL() {
        return bundle.getString(PROP_SERVER_URL);
    }

    public Boolean getVideoMuted() {
        return bundle.getBoolean(PROP_VIDEO_MUTED);
    }

    public Boolean isPictureInPictureEnabled() {
        return bundle.getBoolean(PROP_PICTURE_IN_PICTURE_ENABLED, true);
    }

    public boolean isWelcomePageEnabled() {
        return bundle.getBoolean(PROP_WELCOME_PAGE_ENABLED, false);
    }

    public JitsiMeetConferenceOptions setAudioMuted(Boolean audioMuted) {
        return setBoolean(PROP_AUDIO_MUTED, audioMuted);
    }

    public JitsiMeetConferenceOptions setAudioOnly(Boolean audioOnly) {
        return setBoolean(PROP_AUDIO_ONLY, audioOnly);
    }

    protected JitsiMeetConferenceOptions setBoolean(String propertyName, Boolean value) {
        if (value != null) {
            bundle.putBoolean(propertyName, value);
        } else {
            bundle.remove(propertyName);
        }

        return this;
    }

    public JitsiMeetConferenceOptions setColorScheme(Bundle colorScheme) {
        bundle.putBundle(PROP_COLOR_SCHEME, colorScheme);

        return this;
    }

    public JitsiMeetConferenceOptions setServerURL(String serverURL) {
        return setString(PROP_SERVER_URL, serverURL);
    }

    protected JitsiMeetConferenceOptions setString(String propertyName, String value) {
        if (value != null) {
            bundle.putString(propertyName, value);
        } else {
            bundle.remove(propertyName);
        }

        return this;
    }

    public JitsiMeetConferenceOptions setPictureInPictureEnabled(Boolean pictureInPictureEnabled) {
        return setBoolean(
                PROP_PICTURE_IN_PICTURE_ENABLED,
                pictureInPictureEnabled);
    }

    public JitsiMeetConferenceOptions setRoom(String room) {
        return setString(PROP_ROOM, room);
    }

    public JitsiMeetConferenceOptions setVideoMuted(Boolean videoMuted) {
        return setBoolean(PROP_VIDEO_MUTED, videoMuted);
    }

    public JitsiMeetConferenceOptions setWelcomePageEnabled(boolean isWelcomePageEnabled) {
        return setBoolean(PROP_WELCOME_PAGE_ENABLED, isWelcomePageEnabled);
    }

    Bundle toProps() throws MalformedURLException {
        Bundle props = new Bundle();

        props.putBundle("colorScheme", getColorScheme());

        // serverURL
        if (getServerURL() != null) {
            props.putString("defaultURL", getServerURL());
        }

        // pictureInPictureEnabled
        props.putBoolean(
                "pictureInPictureEnabled",
                isPictureInPictureEnabled());

        // welcomePageEnabled
        props.putBoolean("welcomePageEnabled", isWelcomePageEnabled());

        // The url bundle section
        // FIXME The url bundle thing feels weird
        Bundle urlBundle = new Bundle();

        URL url = new URL(Objects.requireNonNull(getServerURL(), "serverURL"));
        String room = getRoom();

        if (room != null) {
            url = new URL(url, room);
        }

        urlBundle.putString("url", url.toString());

        // FIXME check if null checks are necessary ?
        if (getAudioMuted() != null) {
            urlBundle.putBoolean("startWithAudioMuted", getAudioMuted());
        }
        if (getAudioOnly() != null) {
            urlBundle.putBoolean("startAudioOnly", getAudioOnly());
        }
        if (getVideoMuted() != null) {
            urlBundle.putBoolean("startWithVideoMuted", getVideoMuted());
        }

        props.putBundle("url", urlBundle);

        return props;
    }
}
