fetch('https://gdkuboard-2123.restdb.io/rest/players', {
    headers: {
        "content-type": "application/json",
        "x-apikey": "64879b0eacb4d41a963449ab",
        "cache-control": "no-cache"
    }
}).then(jsonRes => jsonRes.json()).then(res => {
    res.sort((a, b) => b.points - a.points || a.spins - b.spins).forEach(player => addTableRow(player))
})

const addTableRow = (player) => {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    const points = document.createElement('td');
    const spins = document.createElement('td');

    name.innerText = player.playerName
    points.innerText = player.points
    spins.innerText = player.spins

    tr.append(name, points, spins)

    document.querySelector('tbody').append(tr)
}
