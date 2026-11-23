// Keyboard input for TIDECALL DUEL.
// 1-7 select a card, Enter plays it, Esc goes to menu, R restarts, M mutes.

export function bindKeyboard(getState, actions) {
  document.addEventListener('keydown', (e) => {
    const state = getState();
    if (e.key >= '1' && e.key <= '7') {
      const i = Number(e.key) - 1;
      if (state.screen === 'table' && i < state.player.hand.length) actions.selectCard(i);
    } else if (e.key === 'Enter') {
      if (state.screen === 'table') actions.confirmSelected();
      else if (state.screen === 'title') actions.start();
    } else if (e.key === 'Escape') {
      const overlay = document.getElementById('overlay');
      if (overlay && !overlay.hidden) { overlay.hidden = true; overlay.innerHTML = ''; return; }
      actions.toMenu();
    } else if (e.key === 'r' || e.key === 'R') {
      if (state.screen !== 'title') actions.restart();
    } else if (e.key === 'm' || e.key === 'M') {
      actions.toggleMute();
    }
  });
}
