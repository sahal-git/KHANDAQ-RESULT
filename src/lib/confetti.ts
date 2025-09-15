import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 1 },
    colors: ['#FF69B4', '#FF8C00', '#FFD700', '#FFFFFF', '#F08080'],
    gravity: 0.9,
    scalar: 1.2, // Scalar for default shapes
    ticks: 300,
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      // Use only standard shapes
      shapes: ['square', 'circle'],
    });
  };

  // Initial burst from corners
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    origin: { x: 0, y: 1 },
    angle: 60,
  });
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    origin: { x: 1, y: 1 },
    angle: 120,
  });

  // Second wave, slightly delayed and more central
  setTimeout(() => {
    fire(0.2, {
      spread: 60,
      startVelocity: 60,
      origin: { x: 0.2, y: 1 },
      angle: 70,
    });
    fire(0.2, {
      spread: 60,
      startVelocity: 60,
      origin: { x: 0.8, y: 1 },
      angle: 110,
    });
  }, 100);

  // Center finale burst
  setTimeout(() => {
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.5, y: 1 },
      angle: 90,
      startVelocity: 70,
    });
  }, 200);

  // A little extra sprinkle
  setTimeout(() => {
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 1 },
      angle: 90,
    });
  }, 350);
};
