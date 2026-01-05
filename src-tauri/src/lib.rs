// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn image_setter(image: String) -> String  {
    format!("Need to get an {} from Rust", image)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![image_setter])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
