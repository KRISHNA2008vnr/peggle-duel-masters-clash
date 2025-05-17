
import { useState, useEffect } from 'react';

interface GamepadState {
  connected: boolean;
  buttons: {
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
    leftBumper: boolean;
    rightBumper: boolean;
    leftTrigger: number;
    rightTrigger: number;
    dpadUp: boolean;
    dpadDown: boolean;
    dpadLeft: boolean;
    dpadRight: boolean;
    start: boolean;
    back: boolean;
  };
  axes: {
    leftStickX: number;
    leftStickY: number;
    rightStickX: number;
    rightStickY: number;
  };
  controllerName: string;
}

export function useGamepad() {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    connected: false,
    buttons: {
      a: false,
      b: false,
      x: false,
      y: false,
      leftBumper: false,
      rightBumper: false,
      leftTrigger: 0,
      rightTrigger: 0,
      dpadUp: false,
      dpadDown: false,
      dpadLeft: false,
      dpadRight: false,
      start: false,
      back: false,
    },
    axes: {
      leftStickX: 0,
      leftStickY: 0,
      rightStickX: 0,
      rightStickY: 0,
    },
    controllerName: '',
  });

  useEffect(() => {
    // Handle gamepad connection
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad.id);
      setGamepadState(prev => ({
        ...prev,
        connected: true,
        controllerName: e.gamepad.id
      }));
    };

    // Handle gamepad disconnection
    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      setGamepadState(prev => ({
        ...prev,
        connected: false,
        controllerName: ''
      }));
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Poll gamepads at 60fps
    let animationFrameId: number;

    const updateGamepadState = () => {
      try {
        // Get gamepads - navigator.getGamepads() can return null elements in the array
        const gamepads = navigator.getGamepads();
        
        // Find the first non-null gamepad
        let gamepad: Gamepad | null = null;
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            gamepad = gamepads[i];
            break;
          }
        }

        if (gamepad) {
          // Debug info
          if (!gamepadState.connected) {
            console.log(`Controller detected: ${gamepad.id}`);
            console.log(`Buttons count: ${gamepad.buttons.length}`);
            console.log(`Axes count: ${gamepad.axes.length}`);
          }
          
          // Ensure we have enough buttons and axes
          if (gamepad.buttons.length >= 16 && gamepad.axes.length >= 4) {
            setGamepadState({
              connected: true,
              controllerName: gamepad.id,
              buttons: {
                a: gamepad.buttons[0]?.pressed || false,
                b: gamepad.buttons[1]?.pressed || false,
                x: gamepad.buttons[2]?.pressed || false,
                y: gamepad.buttons[3]?.pressed || false,
                leftBumper: gamepad.buttons[4]?.pressed || false,
                rightBumper: gamepad.buttons[5]?.pressed || false,
                leftTrigger: gamepad.buttons[6]?.value || 0,
                rightTrigger: gamepad.buttons[7]?.value || 0,
                back: gamepad.buttons[8]?.pressed || false,
                start: gamepad.buttons[9]?.pressed || false,
                dpadUp: gamepad.buttons[12]?.pressed || false,
                dpadDown: gamepad.buttons[13]?.pressed || false,
                dpadLeft: gamepad.buttons[14]?.pressed || false,
                dpadRight: gamepad.buttons[15]?.pressed || false,
              },
              axes: {
                leftStickX: gamepad.axes[0] || 0,
                leftStickY: gamepad.axes[1] || 0,
                rightStickX: gamepad.axes[2] || 0,
                rightStickY: gamepad.axes[3] || 0,
              },
            });
          } else {
            console.warn('Controller has non-standard button/axis layout:', gamepad.id);
            
            // Try to map a non-standard controller as best we can
            setGamepadState({
              connected: true,
              controllerName: gamepad.id,
              buttons: {
                // Map buttons based on what's available
                a: gamepad.buttons[0]?.pressed || false,
                b: gamepad.buttons[1]?.pressed || false,
                x: gamepad.buttons.length > 2 ? gamepad.buttons[2]?.pressed || false : false,
                y: gamepad.buttons.length > 3 ? gamepad.buttons[3]?.pressed || false : false,
                leftBumper: gamepad.buttons.length > 4 ? gamepad.buttons[4]?.pressed || false : false,
                rightBumper: gamepad.buttons.length > 5 ? gamepad.buttons[5]?.pressed || false : false,
                leftTrigger: gamepad.buttons.length > 6 ? gamepad.buttons[6]?.value || 0 : 0,
                rightTrigger: gamepad.buttons.length > 7 ? gamepad.buttons[7]?.value || 0 : 0,
                back: gamepad.buttons.length > 8 ? gamepad.buttons[8]?.pressed || false : false,
                start: gamepad.buttons.length > 9 ? gamepad.buttons[9]?.pressed || false : false,
                dpadUp: gamepad.buttons.length > 12 ? gamepad.buttons[12]?.pressed || false : false,
                dpadDown: gamepad.buttons.length > 13 ? gamepad.buttons[13]?.pressed || false : false,
                dpadLeft: gamepad.buttons.length > 14 ? gamepad.buttons[14]?.pressed || false : false,
                dpadRight: gamepad.buttons.length > 15 ? gamepad.buttons[15]?.pressed || false : false,
              },
              axes: {
                leftStickX: gamepad.axes.length > 0 ? gamepad.axes[0] || 0 : 0,
                leftStickY: gamepad.axes.length > 1 ? gamepad.axes[1] || 0 : 0,
                rightStickX: gamepad.axes.length > 2 ? gamepad.axes[2] || 0 : 0,
                rightStickY: gamepad.axes.length > 3 ? gamepad.axes[3] || 0 : 0,
              },
            });
          }
        } else {
          setGamepadState(prev => ({...prev, connected: false, controllerName: ''}));
        }
      } catch (err) {
        console.error('Error reading gamepad:', err);
      }

      animationFrameId = requestAnimationFrame(updateGamepadState);
    };

    // Check for already connected gamepads
    const checkForConnectedGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          console.log(`Found already connected gamepad: ${gamepads[i]?.id}`);
          setGamepadState(prev => ({
            ...prev,
            connected: true,
            controllerName: gamepads[i]?.id || ''
          }));
          break;
        }
      }
    };

    // Check for already connected gamepads on mount
    checkForConnectedGamepads();

    // Start polling
    animationFrameId = requestAnimationFrame(updateGamepadState);

    // Clean up
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return gamepadState;
}
