//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;

use wasm_bindgen_test::*;

use calculator_wasm::calculate;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn it_adds() {
    assert_eq!(calculate(&"200 + 220".to_string()), Ok("420".to_string()));
}

#[wasm_bindgen_test]
fn it_subtracts() {
    assert_eq!(calculate(&"440 - 20".to_string()), Ok("420".to_string()));
}

#[wasm_bindgen_test]
fn it_multiplies() {
    assert_eq!(calculate(&"210 * 2".to_string()), Ok("420".to_string()));
}

#[wasm_bindgen_test]
fn it_divides() {
    assert_eq!(calculate(&"840 / 2".to_string()), Ok("420".to_string()));
}

#[wasm_bindgen_test]
fn it_simpilfies() {
    assert_eq!(
        calculate(&"2 * (3 * 70) - 100 + 100".to_string()),
        Ok("420".to_string())
    );
}

#[wasm_bindgen_test]
fn it_returns_inf_for_divide_by_zero() {
    assert_eq!(calculate(&"1/0".to_string()), Ok("inf".to_string()));
}

#[wasm_bindgen_test]
fn it_fails_for_empty_string() {
    assert_eq!(calculate(""), Err("Parse error: Missing argument at the end of expression.".to_string()));
}

#[wasm_bindgen_test]
fn invalid_expression() {
    assert_eq!(calculate("bruh"), Err("Evaluation error: unknown variable `bruh`.".to_string()));
}
