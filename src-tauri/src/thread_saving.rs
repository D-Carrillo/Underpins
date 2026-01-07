use tauri::Manager;

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Thread {
    color: String,
    thread_id: String,
}

#[tauri::command]
pub fn save_threads_to_json(handle: tauri::AppHandle, data: Vec<Thread>) {
}