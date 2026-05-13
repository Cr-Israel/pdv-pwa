/*
   Navigation
────────────────────────────────────────────────────────── */
function navigate(screenId) {

  $$('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const target =
    document.getElementById(screenId);

  if (target) {
    target.classList.add('active');
    state.currentScreen = screenId;
  }

  updateNav();
}

function updateNav() {

  $$('.nav-item').forEach(item => {

    item.classList.remove('active');

    if (item.dataset.screen === state.currentScreen) {
      item.classList.add('active');
    }
  });
}

$$('.nav-item').forEach(item => {

  item.addEventListener('click', () => {
    navigate(item.dataset.screen);
  });
});

