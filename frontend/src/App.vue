
<template>
  <div class="app">
    <h1>Student Management System</h1>

    <nav>
      <RouterLink to="/">Students</RouterLink>
      <RouterLink to="/courses">Courses</RouterLink>
      <RouterLink to="/enrollments">Enrollments</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  max-width: 1000px;
  min-width: 0;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

main {
  min-width: 0;
  width: 100%;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

nav a {
  color: #42b883;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .app {
    padding: 15px;
  }

  nav {
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
  }
}
</style>