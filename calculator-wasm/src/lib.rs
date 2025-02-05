use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn calculate(input: &str) -> Result<String, String> {
    meval::eval_str(input)
        .map(|out| out.to_string())
        .map_err(|e| e.to_string())
}
