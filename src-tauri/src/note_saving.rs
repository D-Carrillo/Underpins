use std::fs;

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
        create_at: u16,
        content: String,
        id: String,
        position: Coordinates,
        sizes: Size
    },

    #[serde(rename = "TextNote")]
    Text {
        create_at: u16,
        content: String,
        id: String,
        position: Coordinates,
        sizes: Size
    }
}

#[tauri::command]
pub fn save_note_to_json(data: Vec<Notes>) -> Result<(), String> {
    let json = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    fs::write("save_notes.json", json).map_err(|e| e.to_string())?;
    Ok(())
}