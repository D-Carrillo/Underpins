use std::fs;
use tauri::Manager;

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Coordinates {
    x: i16,
    y: i16
}

#[derive(serde::Serialize, serde:: Deserialize)]
pub struct Size {
    height: i16,
    width: i16
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
pub fn save_notes_to_json(handle: tauri:: AppHandle, data: Vec<Notes>) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().map_err(|_| "Could not find the App data folder")?;

    let note_data_folder = app_dir.join("note_data_folder");

    if !note_data_folder.exists() {
        fs::create_dir_all(&note_data_folder).map_err(|e| e.to_string())?;
    }

    let file_path = note_data_folder.join("saved_notes.json");
    let contents = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;

    fs::write(file_path, contents).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn load_notes_from_json(handle: tauri::AppHandle) -> Result<Vec<Notes>, String> {
    let app_dir = handle.path().app_data_dir().map_err(|_| "Could not find the App data folder")?;

    let note_data_folder = app_dir.join("note_data_folder");

    if !note_data_folder.exists() {
        return Ok(Vec::new());
    }

    let contents = fs::read_to_string(note_data_folder).map_err(|e| e.to_string())?;

    let data: Vec<Notes> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;

    Ok(data)
}
