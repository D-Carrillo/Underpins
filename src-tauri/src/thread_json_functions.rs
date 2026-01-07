use crate::save_and_load_functions::{load_from_json, save_to_json};

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Thread {
    color: String,
    id: String,
}

#[tauri::command]
pub fn save_threads_to_json(handle: tauri::AppHandle, data: Vec<Thread>) -> Result<(), String> {
    save_to_json(handle, "thread_data_folder".into(), "saved_threads.json".into(), data)
}

#[tauri::command]
pub fn load_threads_from_json(handle: tauri::AppHandle) -> Result<Vec<Thread>, String> {
    load_from_json(handle, "thread_data_folder".into(), "saved_threads.json".into())
}