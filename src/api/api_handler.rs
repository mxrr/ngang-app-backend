use std::fs;


pub fn testcontent() -> serde_json::Value {
  let data = fs::read_to_string("./assets/testcontent.json").expect("Unable to read file");
  let json: serde_json::Value = 
    serde_json::from_str(&data).expect("JSON was badly formatted");

  json
}
