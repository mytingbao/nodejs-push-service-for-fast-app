import router from "./router";
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else if (!sessionStorage.getItem("token")) {
    next("/login");
  } else {
    next();
  }
});
