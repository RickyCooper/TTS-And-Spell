export const useModeController = () => {
  const handleStartGame = () => {
    console.log("Start Game action triggered");
  };

  const handleSettings = () => {
    console.log("Settings action triggered");
  };

  return {
    handleStartGame,
    handleSettings,
  };
};