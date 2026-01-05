#[tauri::command]
pub fn image_setter(image: String) -> String {
    format!("Need to get an {} from Rust", image)
}
