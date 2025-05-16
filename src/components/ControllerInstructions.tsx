
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Joystick, Gamepad, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface ControllerInstructionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ControllerInstructions: React.FC<ControllerInstructionsProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-r from-blue-900 to-indigo-900 border-2 border-blue-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-blue-300">Game Controls</DialogTitle>
          <DialogDescription className="text-gray-300">
            You can play this game using keyboard, mouse, or an Xbox controller.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-300 flex items-center gap-2">
              <Gamepad className="h-5 w-5" /> Controller
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Joystick className="h-5 w-5 mr-2 text-blue-300" />
                <span>Left Stick</span>
              </div>
              <span>Aim the ball</span>
              
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center text-xs">A</div>
                <span>Button A</span>
              </div>
              <span>Launch ball</span>
              
              <div className="flex items-center">
                <div className="w-5 h-5 bg-yellow-500 rounded-full mr-2 flex items-center justify-center text-xs">Y</div>
                <span>Button Y</span>
              </div>
              <span>Activate ability</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-300">Mouse & Keyboard</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span>Mouse Movement</span>
              </div>
              <span>Aim the ball</span>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
                <span>Left Click</span>
              </div>
              <span>Launch ball</span>
              
              <div className="flex items-center">
                <div className="px-2 border rounded mr-2">Space</div>
              </div>
              <span>Activate ability</span>
              
              <div className="flex items-center">
                <div className="flex gap-1">
                  <ArrowLeft className="h-5 w-5" />
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
              <span>Horizontal aim</span>
              
              <div className="flex items-center">
                <ArrowUp className="h-5 w-5" />
              </div>
              <span>Launch ball</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-blue-300 text-sm">
            Press any button to close this instructions panel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControllerInstructions;
