const titleChanger = () => {
  if (window.location.pathname === '/campgrounds') {
    document.getElementById('camp').classList.toggle('active');
  } else if (window.location.pathname == '/campgrounds/new') {
    document.title = 'Add Campground';
    document.getElementById('new').classList.toggle('active');
  } else if (window.location.pathname === '/login') {
    document.title = 'Login';
    document.getElementById('login').classList.toggle('active');
  } else if (window.location.pathname === '/register') {
    document.title = 'Sign Up';
    document.getElementById('signUp').classList.toggle('active');
  }
};

titleChanger();
