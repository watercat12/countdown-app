use tauri_plugin_notification::NotificationExt;

// macOS system alert sound (NSBeep from AppKit) via FFI - zero extra dependency.
#[cfg(target_os = "macos")]
#[link(name = "AppKit", kind = "framework")]
extern "C" {
    fn NSBeep();
}

#[cfg(target_os = "macos")]
fn system_beep() {
    unsafe { NSBeep() };
}

#[cfg(not(target_os = "macos"))]
fn system_beep() {}

#[tauri::command]
fn notify_timer_done(app: tauri::AppHandle) {
    // Play system beep first so the alert is audible even if notifications
    // are disabled.
    system_beep();

    // Send a macOS notification. Errors are swallowed on purpose: the app must
    // keep working when notification permission is denied.
    if let Err(e) = app
        .notification()
        .builder()
        .title("Countdown")
        .body("Hết giờ!")
        .show()
    {
        eprintln!("notification failed: {e}");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![notify_timer_done])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
