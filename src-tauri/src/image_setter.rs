use std::fs;
use tauri::{AppHandle, Manager};
use rfd::FileDialog;

#[tauri::command]
pub fn image_setter(handle: AppHandle) -> Result<String, String> {
    let file = FileDialog::new()
        .add_filter("image", &["png", "jpg", "jpeg"])
        .pick_file();

    match file {
        Some(source_path) => {
            let app_dir = handle.path().app_data_dir()
                .map_err(|_| "Could not find app data directory")?;

            let images_dir = app_dir.join("notes_assets");
            fs::create_dir_all(&images_dir).map_err(|e| e.to_string())?;

            let file_name = source_path.file_name().ok_or("No filename")?;
            let dest_path = images_dir.join(file_name);

            fs::copy(&source_path, &dest_path).map_err(|e| e.to_string())?;

            Ok(dest_path.to_str().unwrap().to_string())
        }
        None => Err("Cancelled".into()),
    }
}