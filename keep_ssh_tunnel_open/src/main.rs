#[macro_use] extern crate log;

use clap::Parser;
use std::{thread, time};
use reqwest::blocking::Client;
use reqwest::StatusCode;
use log::{info, error, trace};

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(short, long, value_parser)]
    host_names: String,

    #[clap(short, long, value_parser, default_value_t = 5)]
    timeout_value: u64,
}

fn main() {
    env_logger::init();
    info!("Starting log");

    let args = Args::parse();
    let mut hosts = Vec::<String>::new();
    for host in args.host_names.split(',') {
        hosts.push(host.to_string());
    }
    let client = Client::new();

    loop {
        for host in &hosts {
            let resp = ping(&client, host);
            if let Err(err) = resp {
                error!("Failed to connect to {}: {:?}", host, err);
            } else if let Ok(resp) = resp {
                info!("Success connecting to {}: {:?}", host, resp);
            }
        }
        thread::sleep(time::Duration::from_secs(args.timeout_value));
    }
}


fn ping(client: &Client, host: &String) -> Result<reqwest::blocking::Response, reqwest::Error>  {
    client.get(host.to_string())
        .header("User-Agent", "SCE_HEALTHCHECK")
        .send()
}

