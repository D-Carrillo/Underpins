#[derive(serde::Serialize, serde:: Deserialize)]
pub struct coordinates {

}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum Notes {
    #[serde(rename = "ImageNote")]
    Image {
        id: u32
    },
    #[serde(rename = "TextNote")]
    Text {
        id: u32
    }
}

#[tauri::command]
pub fn save_note_to_json(data: Vec<Notes>) {

}