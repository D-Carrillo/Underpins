use std::fs;
use tauri::Manager;
use crate::save_and_load_functions::save_to_json;

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Coordinates {
    x: i16,
    y: i16
}

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Size {
    height: u16,
    width: u16
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Notes {
    #[serde(rename = "ImageNote")]
    Image {
        create_at: u64,
        content: String,
        id: String,
        position: Coordinates,
        sizes: Size
    },

    #[serde(rename = "TextNote")]
    Text {
        create_at: u64,
        content: String,
        id: String,
        position: Coordinates,
        sizes: Size
    }
}

#[tauri::command]
pub fn save_notes_to_json(handle: tauri::AppHandle, data: Vec<Notes>) -> Result<(), String> {
    save_to_json(handle, "note_data_folder".into(), "saved_notes.json".into(), data)
}

#[tauri::command]
pub fn load_notes_from_json(handle: tauri::AppHandle) -> Result<Vec<Notes>, String> {
    let app_dir = handle.path().app_data_dir().map_err(|_| "Could not find the App data folder")?;

    let note_data_folder = app_dir.join("note_data_folder");
    let saved_file = note_data_folder.join("saved_notes.json");

    if !saved_file.exists() {
        return Ok(Vec::new());
    }

    let contents = fs::read_to_string(saved_file).map_err(|e| e.to_string())?;

    let data: Vec<Notes> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;

    Ok(data)
}
