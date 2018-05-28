use std::process::Command;

fn main() {
    let mut output = Command::new("netstat")
        .arg("-l")
        .output()
        .expect("Failed to execute command");
}
