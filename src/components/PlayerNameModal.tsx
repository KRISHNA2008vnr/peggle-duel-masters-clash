
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PlayerNameModalProps {
  open: boolean;
  onSubmit: (player1Name: string, player2Name: string) => void;
}

const PlayerNameModal: React.FC<PlayerNameModalProps> = ({ open, onSubmit }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (player1Name.trim() === '' || player2Name.trim() === '') {
      toast({
        title: "Names required",
        description: "Please enter names for both players",
        variant: "destructive"
      });
      return;
    }
    
    if (player1Name === player2Name) {
      toast({
        title: "Different names needed",
        description: "Players must have different names",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(player1Name, player2Name);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-gradient-to-br from-purple-700 to-blue-900 border-2 border-purple-300 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-300 drop-shadow-md">
            Welcome to Peggle 2: Duel Mode!
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200">
            Enter your names to begin your Peggle adventure
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="player1" className="text-sm font-medium text-purple-200">
              Player 1 Name
            </label>
            <Input
              id="player1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="bg-purple-900/60 border-purple-500 text-white"
              placeholder="Enter name..."
              maxLength={20}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="player2" className="text-sm font-medium text-purple-200">
              Player 2 Name
            </label>
            <Input
              id="player2"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="bg-purple-900/60 border-purple-500 text-white"
              placeholder="Enter name..."
              maxLength={20}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3"
          >
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNameModal;
