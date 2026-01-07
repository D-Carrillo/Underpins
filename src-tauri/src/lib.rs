use std::fs;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod image_setter;
mod note_json_functions;
mod thread_json_functions;
mod save_and_load_functions;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .register_uri_scheme_protocol("gallery", |_, request| {
        let path = request.uri().path();
        let path = percent_encoding::percent_decode(path.as_bytes())
            .decode_utf8_lossy()
            .to_string();

        let content = fs::read(&path);

        match content {
            Ok(data) => tauri::http::Response::builder()
                .header("Access-Control-Allow-Origin", "*")
                .body(data)
                .unwrap(),
            Err(_) => tauri::http::Response::builder()
                .status(404)
                .body(Vec::new())
                .unwrap(),
        }
    })
        .invoke_handler(tauri::generate_handler![
            image_setter::image_setter,
            note_json_functions::save_notes_to_json,
            note_json_functions::load_notes_from_json,
            thread_json_functions::save_threads_to_json,
            thread_json_functions::load_threads_from_json,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
