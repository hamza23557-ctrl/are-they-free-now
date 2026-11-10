package app.lovable.quranreader;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;

public class MainActivity extends BridgeActivity {
    private final Handler startupHandler = new Handler(Looper.getMainLooper());
    private FrameLayout startupOverlay;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startupOverlay = new FrameLayout(this);
        startupOverlay.setBackgroundColor(getColor(R.color.ic_launcher_background));
        ImageView artwork = new ImageView(this);
        artwork.setImageResource(R.drawable.splash);
        artwork.setScaleType(ImageView.ScaleType.FIT_CENTER);
        startupOverlay.addView(artwork, new FrameLayout.LayoutParams(-1, -1));
        ProgressBar spinner = new ProgressBar(this);
        spinner.setIndeterminate(true);
        spinner.setIndeterminateTintList(ColorStateList.valueOf(Color.rgb(231, 205, 124)));
        int size = Math.round(32 * getResources().getDisplayMetrics().density);
        FrameLayout.LayoutParams position = new FrameLayout.LayoutParams(size, size, Gravity.TOP | Gravity.CENTER_HORIZONTAL);
        startupOverlay.addView(spinner, position);
        startupOverlay.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> {
            float artHeight = Math.min(v.getHeight(), v.getWidth() * 7f / 4f);
            position.topMargin = Math.round((v.getHeight() - artHeight) / 2f + artHeight * .90f);
            spinner.setLayoutParams(position);
        });
        addContentView(startupOverlay, new ViewGroup.LayoutParams(-1, -1));
        startupHandler.post(checkStartupReady);
    }

    private final Runnable checkStartupReady = new Runnable() {
        @Override public void run() {
            if (isFinishing() || isDestroyed() || startupOverlay == null) return;
            getBridge().getWebView().evaluateJavascript(
                "document.documentElement.dataset.appReady === 'true'",
                result -> {
                    if ("true".equals(result)) {
                        if (startupOverlay != null) {
                            ((ViewGroup) startupOverlay.getParent()).removeView(startupOverlay);
                            startupOverlay = null;
                        }
                    } else {
                        startupHandler.postDelayed(this, 100);
                    }
                });
        }
    };

    @Override public void onDestroy() {
        startupHandler.removeCallbacksAndMessages(null);
        super.onDestroy();
    }
}
