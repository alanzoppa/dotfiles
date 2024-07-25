#!/bin/bash

# Get the current output audio device
export PATH="$PATH:/opt/homebrew/bin/"
current_device=$(SwitchAudioSource -c)

# Define the target device name
target_device="USB SPDIF Adapter"

if [ "$current_device" == "$target_device" ]; then
    # Send CMD+F12
    osascript -e 'tell application "System Events" to key code 111 using {command down}'
else
    # Send volume increment
    osascript -e 'set volume output volume ((output volume of (get volume settings)) + 10) --100%'
    
    # Display the volume change UI
    osascript -e 'tell application \"System Events\" to key code 72'
fi
