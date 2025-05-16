
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
  });

  useEffect(() => {
    // Handle gamepad connection
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad.id);
    };

    // Handle gamepad disconnection
    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Poll gamepads at 60fps
    let animationFrameId: number;

    const updateGamepadState = () => {
      // Get gamepads
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0]; // Use the first gamepad

      if (gamepad) {
        setGamepadState({
          connected: true,
          buttons: {
            a: gamepad.buttons[0].pressed,
            b: gamepad.buttons[1].pressed,
            x: gamepad.buttons[2].pressed,
            y: gamepad.buttons[3].pressed,
            leftBumper: gamepad.buttons[4].pressed,
            rightBumper: gamepad.buttons[5].pressed,
            leftTrigger: gamepad.buttons[6].value,
            rightTrigger: gamepad.buttons[7].value,
            back: gamepad.buttons[8].pressed,
            start: gamepad.buttons[9].pressed,
            dpadUp: gamepad.buttons[12].pressed,
            dpadDown: gamepad.buttons[13].pressed,
            dpadLeft: gamepad.buttons[14].pressed,
            dpadRight: gamepad.buttons[15].pressed,
          },
          axes: {
            leftStickX: gamepad.axes[0],
            leftStickY: gamepad.axes[1],
            rightStickX: gamepad.axes[2],
            rightStickY: gamepad.axes[3],
          },
        });
      } else {
        setGamepadState(prev => ({...prev, connected: false}));
      }

      animationFrameId = requestAnimationFrame(updateGamepadState);
    };

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
