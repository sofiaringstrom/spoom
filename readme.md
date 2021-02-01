# Spoom


## Notes

Currently the focus management is not working properly due to outdated packages. Going forward the react-native package needs to be replaced with [react-native-tvos](https://github.com/react-native-tvos/react-native-tvos) for better support and functionality.


As a temporaly solution a sign out can be performed by pressing space.


## Using

* [spoom-api](https://github.com/sofiaringstrom/spoom-api)
* React Native 0.58.6

## Install

```
$ yarn install
```

## Run dev

Open xcode project. **spoom/ios/SPOOM.xcodeproj**

Select Spoom-tvOS and run in a tvOS simulator or on a physical device.

![note](https://imgur.com/rXMzJzp)


Click run (⌘R).

## Pairing an Apple TV with Xcode

Ensure your Mac and Apple TV are connected to the same network.

Open Xcode and go to Window > Devices and Simulators.

On the Apple TV, go to Settings > Remotes and Devices > Remote App and Devices.

Select the Apple TV in the Discovered area in Xcode and enter the verification code displayed on the Apple TV.

Click the Connect button. When it's successfully paired, a network connection icon appears beside the Apple TV.

## Cheatsheet

In case of

```
error: Build input file cannot be found: '{project_path}/spoom/node_modules/react-native/third-party/double-conversion-1.1.6/src/fast-dtoa.cc'
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