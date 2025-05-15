
export const animationVariants = {
  peg: {
    hit: {
      scale: [1, 1.5, 0],
      opacity: [1, 0.8, 0],
      transition: { duration: 0.5 }
    },
    glow: {
      boxShadow: [
        '0 0 5px 2px rgba(255,255,255,0.3)',
        '0 0 15px 5px rgba(255,255,255,0.7)',
        '0 0 5px 2px rgba(255,255,255,0.3)'
      ],
      transition: { duration: 1.5, repeat: Infinity }
    }
  },
  ball: {
    trail: {
      opacity: [1, 0],
      scale: [1, 0.5],
      transition: { duration: 0.3 }
    }
  },
  master: {
    activate: {
      scale: [1, 1.2, 1],
      filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
      transition: { duration: 0.8 }
    }
  }
};

export const createTrailEffect = (x: number, y: number, radius: number) => {
  const trailElement = document.createElement('div');
  trailElement.className = 'absolute rounded-full bg-white/30 animate-fade-out';
  trailElement.style.width = `${radius * 2}px`;
  trailElement.style.height = `${radius * 2}px`;
  trailElement.style.left = `${x - radius}px`;
  trailElement.style.top = `${y - radius}px`;
  
  return trailElement;
};
