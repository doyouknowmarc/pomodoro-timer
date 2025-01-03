export const gradients = [
  'from-purple-600 via-blue-500 to-cyan-400',
  'from-rose-500 via-red-400 to-orange-300',
  'from-emerald-500 via-green-400 to-teal-400',
  'from-indigo-600 via-purple-500 to-pink-400',
  'from-amber-500 via-orange-400 to-yellow-300',
];

export const getRandomGradient = (currentGradient: string): string => {
  const availableGradients = gradients.filter(g => g !== currentGradient);
  const randomIndex = Math.floor(Math.random() * availableGradients.length);
  return availableGradients[randomIndex];
};