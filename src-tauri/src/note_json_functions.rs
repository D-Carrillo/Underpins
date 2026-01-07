use crate::save_and_load_functions::{load_from_json, save_to_json};

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
    load_from_json(handle, "note_data_folder".into(), "saved_notes.json".into())
}
