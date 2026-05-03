// Login Form Handler
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic credential check (replace with real auth in production)
  if (username === 'admin' && password === 'admin') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
  } else {
    alert('Invalid credentials. Use admin / admin.');
  }
});

// Drone Action Handler
function droneAction(action) {
  const statusEl = document.getElementById('status');

  switch (action) {
    case 'start':
      statusEl.textContent = 'Flying';
      addAlert('Drone started.');
      break;
    case 'stop':
      statusEl.textContent = 'Idle';
      addAlert('Drone stopped.');
      break;
    case 'forward':
      addAlert('Moving forward.');
      break;
    case 'backward':
      addAlert('Moving backward.');
      break;
    case 'left':
      addAlert('Turning left.');
      break;
    case 'right':
      addAlert('Turning right.');
      break;
    default:
      console.warn('Unknown action:', action);
  }
}

// Add alert entry to the alerts list
function addAlert(message) {
  const list = document.getElementById('alerts-list');
  const item = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  item.textContent = `[${time}] ${message}`;

  // Remove placeholder text if present
  if (list.children.length === 1 && list.children[0].textContent === 'No alerts yet.') {
    list.innerHTML = '';
  }

  list.prepend(item);
}
