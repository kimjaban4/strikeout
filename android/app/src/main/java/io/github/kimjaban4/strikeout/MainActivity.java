package io.github.kimjaban4.strikeout;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onBackPressed() {
        getBridge().getWebView().evaluateJavascript(
            "Boolean(window.MountPsycho?.handleAndroidBack?.())",
            handled -> {
                if (!"true".equals(handled)) MainActivity.super.onBackPressed();
            }
        );
    }
}
