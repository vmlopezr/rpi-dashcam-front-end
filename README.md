# DEMO BRANCH
**Note:** This branch is used to build the demo used for github pages. Use the master branch to 
build the raspberry pi application.
 
# RPI Webcam Front End

The project uses USB Webcams with Raspberry Pi 3b+
and Raspberry Pi 4 to record and stream over a Raspberry Pi access point. The repository contains the front-end for the application built using ionic 4.

The application serves a static website that allows control of the USB Webcam. The Raspberry Pi is configured as an Access Point, so devices must be connected to the network.
Recorded videos can be watched as well as downloaded onto your devices.

There is support for updating camera settings, such as brightness, saturation, etc. There is initial support for Logitech C920 and Microsoft LifeCam HD3000. The application should be able to record with UVC, v4l2 [compatible devices](https://www.ideasonboard.org/uvc/).

The live video streaming with camera settings is only supported for the Logitect C920 and Microsoft LifeCam HD3000. The camera settings are disabled for other cameras, although the stream will be available.

The Application establishes the Raspberry Pi as a wireless Access Point.

- Network SSID: **_RPI_Webcam_View_**
- Password: **_rpiCamView_**

## Prerequisites

The project is developed with the following tools.

- Ionic 4 Framework
- REST Api developed in the back-end repository

For this repository the following are needed:

- Node Package Manager - yarn or npm
- Nodejs

It is recommended,but not required, to install Ionic CLI to develop on the front end.

```
npm install -g @ionic/cli

```

## Installing / Getting Started

See the [rpidashcam repository]() for instruction on running the full application. Clone the repository.

To install for development install node_modules with the following:

```bash
$ yarn install

$ npm install
```

## Building

The project static files can be build with the following commands:

```shell
Using Ionic CLI:
  $ ionic build --prod

Using npm:
  $ npm run build
```

The build files are located in the www/ folder in the repository. 

## Running the Application

### Running as developtment server


## Accessing the Application Website

The Application establishes the Raspberry Pi as a wireless Access Point. To run the application use the start
script. **Note:** To access te application, the device needs to connect to the Raspberry Pi Access Point.

The application website can be reached on any browser using the following addresses:

- http://rpidashcam.pi
- Any http address with a domain of "pi", e.g:
  - http://testcam.pi
  - http://anyaddress.pi
  - http://a.pi, etc.
- Any IP address, e.g:
  - 192.168.10.2
  - 1.1.1.1
  - 2.2.2.2, etc.

Any IP address entered into the browser is redirected to the local application website.
Any http address using domain "pi" is redirected to the local application website.

The access Point information is shown below:

- Network SSID: **_RPI-Webcam-Viewer_**
- Password: **_rpiCamView_**

To change the network SSID and password, update the following settings near the end of the script ["AP-install.sh"](./install-scripts/AP-install.sh).

```
ssid=RPI-Webcam-Viewer
wpa_passphrase=rpiCamView
```

## Developing

The project is written in Typescript. The static files for the website are located in the www/ folder after running the build command.

The Back-End repository can be found at https://github.com/vmlopezr/rpi-dashcam.  

To start the server in development run either of the following:

```
Using Ionic CLI:
  $ ionic serve    

Using npm: 
  $ npm run start
```
Using ionic serve will start a development server at port localhost:8100.  
Using npm run start will start a development server at port localhost:4200.  

**Note:**  The application needs the back-end server to retrieve data saved on the sqlite db. Both the front-end and back-end development servers need to run concurrently.
When running on development, the frontend initiates the data retrieval via GET request to localhost.  
When running on production, it is expected for the application to run on a Raspberry Pi. As built on the repository, the initial data retrieval is made via GET request to 192.168.10.1, which is the address of the Raspberry Pi wlan0 interface after the Access Point install.

To change the IP address of the wlan0 interface for the application, there are two main modification that must be made:

1. Modify the chosen IP address found in [AP-install.sh](https://github.com/vmlopezr/rpi-dashcam/blob/master/install-scripts/AP-install.sh) under the ***dhcpcd.conf*** moditifications.
```
# DHCPCD update
# Set wlan0 interface: static IP and subnet
WAN_INTERFACE="
interface wlan0
    static ip_address=192.168.10.1/24
    nohook wpa_supplicant"
```

2. On the [back-end server](https://github.com/vmlopezr/rpi-dashcam), the python script [dh-update.py](https://github.com/vmlopezr/rpi-dashcam/blob/master/python/db-update.py) can be used to update certain application settings. The following is the help message for the script:
```
 usage: db-update.py [-h] [-cam CAMERA] [-dev DEVICE] [-nport NODEPORT] [-ipaddr IPADDRESS] [-streamport TCPSTREAMPORT]
                    [-LiveStreamPort LIVESTREAMPORT] [-view]

optional arguments:
  -h, --help            This script is used to update the rpidashcam sqlite database. Enter the argument with the desired value to update it.

  -cam CAMERA, --camera CAMERA
                        The webcam model to be used with the application

  -dev DEVICE, --Device DEVICE
                        The linux device denoting the USB camera. Can be found in /dev/.  
                        For webcams, this is usually listed as /dev/video*

  -nport NODEPORT, --NodePort NODEPORT
                        The port at which the back-end server will listen to.

  -ipaddr IPADDRESS, --IPAddress IPADDRESS
                        The IP Address of the host running the application.

  -streamport TCPSTREAMPORT, --TCPStreamPort TCPSTREAMPORT
                        The Port at which node listen to the TCP video feed from gstreamer.

  -LiveStreamPort LIVESTREAMPORT, --LiveStreamPort LIVESTREAMPORT
                        The Port at which socket.io listens to stream live camera feed to a webrowser.

  -view, --view         "View the current values of the application settings
```


Update the server IP address to the new address with the following:
```
python3 app-ipaddr-update.py -ipaddr "IP_ADDRESS"
```
where IP_ADDRESS is the intended address of the development host.


### Uninstalling

To remove the application, delete the "rpicam-front-end first". To remove the back-end repository run the [uninstall.sh](https://github.com/vmlopezr/rpi-dashcam/blob/master/install-scripts/uninstall.sh) in the install-scripts folder.

```
sh uninstall.sh
```

After the script completes, erase the repository.

## License

Nest is [MIT licensed](LICENSE).  
Gstreamer is [LGPL licensed](./python/LICENSE)
