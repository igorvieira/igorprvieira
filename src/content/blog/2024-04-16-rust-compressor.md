---
title: Rust compressor
pubDate: "Apr 16 2024"
description: "Building a rust compressor"
category: youtube, rust
---

<iframe width="100%" height="375" src="https://www.youtube.com/embed/0kKJUoY_ePs?si=7NPmx1XJaeggZdzA" frameborder="0" allowfullscreen></iframe>

# Rust Compressor

This is my second application in Rust, it's quite simple, it's a tool for compressing files and saving them locally. There's not much mystery to it, but I hope it can be very useful. The video above is in Portuguese, but if you're considering helping me grow my work, please consider subscribing to my channel. In the near future, I hope to create audiovisual content in English as well.

Well, let's start with the import of our libraries, walkdir and zip:

```rust
[package]
name = "rust-zip"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
zip = "0.5.11"
walkdir = "2"
```

Then let's move on to the part of our imports:

```rust
use std::fs::File;
use std::io::{self};
use std::path::Path;
use zip::{CompressionMethod, ZipWriter};
use walkdir::WalkDir;
```

Since we're dealing with I/O, let's make a small change to our `main` function to clearly define the return type:

```rust
fn main() -> io::Result<()> {
```

After that, let's define all the input data: one for the name we'll give to our directory and the path to where we want to direct it:

```rust
println!("Enter the name of the output ZIP file (you don't need to type .zip):");
let mut output_zip_file = String::new();
io::stdin().read_line(&mut output_zip_file)?;

println!("Enter the path to the directory to be zipped:");
let mut input_directory = String::new();
io::stdin().read_line(&mut input_directory)?;

let output_zip_file = format!("{}.zip", output_zip_file.trim());
let input_directory = input_directory.trim();

let file = File::create(output_zip_file.clone())?;
let mut zip = ZipWriter::new(file);
```

Before we continue, I'll create another function responsible for receiving the files, setting access permissions, and preparing to copy the files to be received:

```rust
fn add_file_to_zip(
    relative_path: &Path,
    absolute_path: &Path,
    zip: &mut ZipWriter<File>,
) -> io::Result<()> {
    let options = zip::write::FileOptions::default()
        .compression_method(CompressionMethod::Stored)
        .unix_permissions(0o755);

    let mut file = File::open(absolute_path)?;
    zip.start_file(relative_path.to_string_lossy().into_owned(), options)?;
    io::copy(&mut file, zip)?;

    Ok(())
}
```

The complete file:

```rust
use std::fs::File;
use std::io::{self};
use std::path::Path;
use zip::{CompressionMethod, ZipWriter};
use walkdir::WalkDir;

fn main() -> io::Result<()> {
    println!("Enter the name of the output ZIP file (you don't need to type .zip):");
    let mut output_zip_file = String::new();
    io::stdin().read_line(&mut output_zip_file)?;

    println!("Enter the path to the directory to be zipped:");
    let mut input_directory = String::new();
    io::stdin().read_line(&mut input_directory)?;

    let output_zip_file = format!("{}.zip", output_zip_file.trim());
    let input_directory = input_directory.trim();

    let file = File::create(output_zip_file.clone())?;
    let mut zip = ZipWriter::new(file);
}


fn add_file_to_zip(
    relative_path: &Path,
    absolute_path: &Path,
    zip: &mut ZipWriter<File>,
) -> io::Result<()> {
    let options = zip::write::FileOptions::default()
        .compression_method(CompressionMethod::Stored)
        .unix_permissions(0o755);

    let mut file = File::open(absolute_path)?;
    zip.start_file(relative_path.to_string_lossy().into_owned(), options)?;
    io::copy(&mut file, zip)?;

    Ok(())
}
```

Then we'll loop through the directory to ensure reading the files and pass each of them to our function:

```rust
for entry in WalkDir::new(input_directory).into_iter().filter_map(|e| e.ok()) {
    let path = entry.path();
    if path.is_file() {
        let relative_path = path.strip_prefix(input_directory).unwrap();
        add_file_to_zip(relative_path, path, &mut zip)?;
    }
}
```

Finally, we just need to call `finish()` to complete the copying of our zip value, the same one that was passed into the function and returned, and provide a final return to our Result:

```rust
zip.finish()?;
println!("Zip file created successfully: {}", output_zip_file);
Ok(())
```

The final code looks like this:

```rust
use std::fs::File;
use std::io::{self};
use std::path::Path;
use zip::{CompressionMethod, ZipWriter};
use walkdir::WalkDir;

fn main() -> io::Result<()> {
    println!("Enter the name of the output ZIP file (you don't need to type .zip):");
    let mut output_zip_file = String::new();
    io::stdin().read_line(&mut output_zip_file)?;

    println!("Enter the path to the directory to be zipped:");
    let mut input_directory = String::new();
    io::stdin().read_line(&mut input_directory)?;

    let output_zip_file = format!("{}.zip", output_zip_file.trim());
    let input_directory = input_directory.trim();

    let file = File::create(output_zip_file.clone())?;
    let mut zip = ZipWriter::new(file);

    for entry in WalkDir::new(input_directory).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if path.is_file() {
            let relative_path = path.strip_prefix(input_directory).unwrap();
            add_file_to_zip(relative_path, path, &mut zip)?;
        }
    }

    zip.finish()?;
    println!("Zip file created successfully: {}", output_zip_file);
    Ok(())
}

fn add_file_to_zip(
    relative_path: &Path,
    absolute_path: &Path,
    zip: &mut ZipWriter<File>,
) -> io::Result<()> {
    let options = zip::write::FileOptions::default()
        .compression_method(CompressionMethod::Stored)
        .unix_permissions(0o755);

    let mut file = File::open(absolute_path)?;
    zip.start_file(relative_path.to_string_lossy().into_owned(), options)?;
    io::copy(&mut file, zip)?;

    Ok(())
}
```

Well, that's it. I hope you liked it, and I'll leave the repository link below. Success!

Github: <a href="https://github.com/igorvieira/rust-zip/tree/main" target="_blank"> `Rust Zip`</a>
