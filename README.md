![intel-mcu-icon](./src/intel_mcu.png)

Create high-performance, reliable, and scalable real-time communication solutions.<br>
Server and client tools to deliver RTC experiences with video conferencing capabilities.<br>
Optimized for Intel® Architecture to take full advantage of Intel hardware-acceleration with H.264 and HEVC encode/decode.<br>


# Auto

* Version 0.0.1 Nightly.
* Node.JS Version >= 8.1.
* This service need MongoDB and Redis.
* The service can be run independently, **Intel WebRTC MCU** needs to connect to this service, managed by this service.
* This service provides a remote call API.
* This service requires runtime injection of **Intel WebRTC MCU**.

## Install

You neead install npm package.

```console
npm install
```

You need to create a new configuration file.

```console
vim ./configure.toml
```

```console
# http configure
[http]
host = "localhost" # you web host
port = 80 # you need listen port
origin = "http://localhost" # http origin
views = "./page/html" # html view files
public = "./page/public" # html static public files
```