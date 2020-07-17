#![feature(proc_macro_hygiene, decl_macro)]

use rocket_contrib::json::{JsonValue};
use serde::Serialize;

use std::io;
use std::path::{Path, PathBuf};
use rocket::response::NamedFile;

mod api;

#[macro_use] extern crate rocket;

#[derive(Serialize)]
struct Test {
    yes: String,
    no: i32
}

#[get("/api")]
fn api() -> JsonValue {
    JsonValue(api::api_handler::testcontent())
}

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("./dist/index.html")
}

#[get("/static/<file..>")]
fn file(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("dist/static/").join(file)).ok()
}


fn app() -> rocket::Rocket {
    rocket::ignite()
        .mount("/", routes![index, file, api])
}
fn main() {
    app().launch();
}

