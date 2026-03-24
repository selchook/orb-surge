declare global {
  interface Window {
    CrazyGames: {
      SDK: {
        init: () => Promise<void>;
        game: {
          gameplayStart: () => void;
          gameplayStop: () => void;
          happyTime: () => void;
        };
        ad: {
          requestAd: (type: string) => Promise<void>;
        };
        user: {
          getUser: () => Promise<any>;
        };
      };
    };
  }
}

export class CrazyGamesSDK {
  private static initialized = false;

  static async init(): Promise<void> {
    if (this.initialized || !window.CrazyGames?.SDK) {
      return;
    }

    try {
      await window.CrazyGames.SDK.init();
      this.initialized = true;
      console.log('CrazyGames SDK initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize CrazyGames SDK:', error);
    }
  }

  static gameplayStart(): void {
    if (this.initialized && window.CrazyGames?.SDK?.game?.gameplayStart) {
      try {
        window.CrazyGames.SDK.game.gameplayStart();
      } catch (error) {
        console.warn('Failed to call gameplayStart:', error);
      }
    }
  }

  static gameplayStop(): void {
    if (this.initialized && window.CrazyGames?.SDK?.game?.gameplayStop) {
      try {
        window.CrazyGames.SDK.game.gameplayStop();
      } catch (error) {
        console.warn('Failed to call gameplayStop:', error);
      }
    }
  }

  static happyTime(): void {
    if (this.initialized && window.CrazyGames?.SDK?.game?.happyTime) {
      try {
        window.CrazyGames.SDK.game.happyTime();
      } catch (error) {
        console.warn('Failed to call happyTime:', error);
      }
    }
  }

  static async showAd(): Promise<void> {
    if (this.initialized && window.CrazyGames?.SDK?.ad?.requestAd) {
      try {
        await window.CrazyGames.SDK.ad.requestAd('midgame');
      } catch (error) {
        console.warn('Failed to show ad:', error);
      }
    }
  }
}