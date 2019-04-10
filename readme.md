# Spoom

### Install

```
$ yarn install
```

### Run dev

Open xcode project.

Select Swotify-tvOS -> Apple TV

Run

### Pairing an Apple TV with Xcode

Ensure your Mac and Apple TV are connected to the same network.

Open Xcode and go to Window > Devices and Simulators.

On the Apple TV, go to Settings > Remotes and Devices > Remote App and Devices.

Select the Apple TV in the Discovered area in Xcode and enter the verification code displayed on the Apple TV.

Click the Connect button. When it's successfully paired, a network connection icon appears beside the Apple TV.

### Cheatsheet

In case of

```
error: Build input file cannot be found: '/Users/sofiaringstrom/Documents/Project tvOS/swotify/node_modules/react-native/third-party/double-conversion-1.1.6/src/fast-dtoa.cc'
```
run

```
$ cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
```

```
$ cd node_modules/react-native/third-party/glog-0.3.5/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
```

Clear cache

```
react-native {start/test} --reset-cache
```