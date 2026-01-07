use std::fs;
use serde::Serialize;
use serde::de::DeserializeOwned;
use tauri::Manager;

pub fn save_to_json<T: Serialize>(handle: tauri::AppHandle, folder: String, file: String, data: Vec<T>) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().map_err(|_| "Could not find the App data folder")?;

    let data_folder = app_dir.join(folder);

    if !data_folder.exists() {
        fs::create_dir_all(&data_folder).map_err(|e| e.to_string())?;
    }

    let file_path = data_folder.join(file);

    let contents = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;

    fs::write(file_path, contents).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn load_from_json<T: DeserializeOwned>(handle: tauri::AppHandle, folder: String, file: String) -> Result<Vec<T>, String> {
    let app_dir = handle.path().app_data_dir().map_err(|_| "Could not find the App data folder")?;

    let note_data_folder = app_dir.join(folder);
    let saved_file = note_data_folder.join(file);

    if !saved_file.exists() {
        return Ok(Vec::new());
    }

    let contents = fs::read_to_string(saved_file).map_err(|e| e.to_string())?;

    let data: Vec<T> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    
    Ok(data)
}
