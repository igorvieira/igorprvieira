---
title: QRCode Generator in Rust
pubDate: "Apr 02 2024"
description: "Personal project"
category: youtube
---

<iframe width="100%" height="375" src="https://www.youtube.com/embed/XJ1Hvxuqg8g" frameborder="0" allowfullscreen></iframe>

# New Series in Rust 🦀

Today I posted a new video on YouTube `(PLEASE SUBSCRIBE 🙌)` in Portuguese talking about how to develop a QR Code generator and here I'll leave the step by step in case you're interested in seeing how I did it, but the instructions should be in English:

First, I started by choosing a very simple library that provides everything we need <b>[qrcode](https://docs.rs/qrcode/latest/qrcode/)</b>, the name is quite self-explanatory, and the rest of the code isn't very complicated. I started by creating my new package:

```
cargo new rust-qrcode-generator
```

Inside it, I added the new lib to Cargo.toml:

```
[package]
name = "rust-qrcode-generator"
version = "0.1.0"``
edition = "2021"

[dependencies]
qrcode = "0.13"
```

Then I ran `cargo build` to install our library.

After that, I started with the imports we need in our main.rs:

```rust
use qrcode::QrCode;
use qrcode::render::unicode;
use std::io;
```

After that, I started with the input part, and it's important to note that we need `std::io` to be able to use the `read_line` function and actually get the data and confirmation of what we want to generate:

```rust
fn main() {
    println!("Enter the string to generate QR code:");

    let mut input = String::new();

    io::stdin().read_line(&mut input).expect("Failed to read line");

    let input = input.trim();

    println!("Do you want to generate a QR code for the following input? (y/n)");

    let mut confirmation = String::new();

    io::stdin()
        .read_line(&mut confirmation)
        .expect("Failed to read line");
}
```

After that, I started with the logic we'll use, which is to check if we really want to create a new QR Code and draw it using the qrcode lib, note that we start by defining a unicode to segment the dots and then we start tracing the separations between dark and light, after that we build it and actually return the new image:

```rust
if confirmation.trim().to_lowercase() == "y" {
    let code = QrCode::new(input).unwrap();
    let image = code
        .render::<unicode::Dense1x2>()
        .dark_color(unicode::Dense1x2::Light)
        .light_color(unicode::Dense1x2::Dark)
        .build();

    println!("{}", image);
} else {
    println!("QR code generation canceled.");
}
```

The entire code looks like this:

```rust
use qrcode::QrCode;
use qrcode::render::unicode;
use std::io;

fn main() {
    println!("Enter the string to generate QR code:");

    let mut input = String::new();

    io::stdin().read_line(&mut input).expect("Failed to read line");

    let input = input.trim();

    println!("Do you want to generate a QR code for the following input? (y/n)");

    let mut confirmation = String::new();

    io::stdin()
        .read_line(&mut confirmation)
        .expect("Failed to read line");

    if confirmation.trim().to_lowercase() == "y" {
        let code = QrCode::new(input).unwrap();
        let image = code
            .render::<unicode::Dense1x2>()
            .dark_color(unicode::Dense1x2::Light)
            .light_color(unicode::Dense1x2::Dark)
            .build();

        println!("{}", image);
    } else {
        println!("QR code generation canceled.");
    }
}
```

And below is the desired output:

![rust generator](/rust-qrcode-generator.png)

Well, that's it! See ya! 🙃
