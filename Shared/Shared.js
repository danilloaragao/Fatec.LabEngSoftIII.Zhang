function criarMenu(){
    fetch("./../Shared/Menu.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("menu").innerHTML = data;
  });
}