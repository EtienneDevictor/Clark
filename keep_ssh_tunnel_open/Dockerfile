FROM rust:1-buster

WORKDIR /app
COPY . .

RUN cargo install --path .

ENTRYPOINT [ "keep_ssh_tunnel_open", "--host-names", "http://host.docker.internal:11000/api/health-check,http://host.docker.internal:14000/healthcheck/printer"]

