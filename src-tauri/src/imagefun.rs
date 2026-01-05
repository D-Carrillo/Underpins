use std::fs;
use std::path::Path;
use rfd::FileDialog;

#[tauri::command]
pub fn image_setter(destination_folder: String) -> Result<String, String> {
    let file = FileDialog::new().add_filter("image", &["png", "jpg", "jpeg"]).set_directory("/").pick_file();

    match file {
        Some(source_path) => {
            let file_name = source_path.file_name().ok_or("Could not extract filename")?;

            let dest_path = Path::new(&destination_folder).join(file_name);

            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }

            fs::copy(&source_path, &dest_path).map_err(|e| format!("Failed to copy file: {}", e))?;

            let result_path = dest_path.to_str().ok_or("Invalid UTF-8 in destination path")?;
            
            Ok(result_path.to_string())
        }
        
        None => Err("User cancelled the selection".into()),
    }
}
