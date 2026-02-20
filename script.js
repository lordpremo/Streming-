async function loadChannels() {
  try {
    const res = await fetch("channels.json");
    const channels = await res.json();

    const grid = document.getElementById("channelsGrid");
    if (grid) {
      grid.innerHTML = "";
      channels.forEach((ch) => {
        const card = document.createElement("div");
        card.className = "channel-card";
        card.onclick = () => {
          window.location.href = `channel.html?id=${encodeURIComponent(ch.id)}`;
        };
        card.innerHTML = `
          <img src="${ch.thumbnail}" class="channel-thumb" alt="${ch.name}">
          <div class="channel-body">
            <div class="channel-name">${ch.name}</div>
            <div class="channel-category">${ch.category}</div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id) {
      const ch = channels.find((c) => c.id === id);
      if (!ch) return;
      const video = document.getElementById("playerVideo");
      const nameEl = document.getElementById("channelName");
      const catEl = document.getElementById("channelCategory");
      if (video && nameEl && catEl) {
        video.src = ch.stream_url;
        nameEl.textContent = ch.name;
        catEl.textContent = ch.category;
      }
    }
  } catch (e) {
    console.error("Failed to load channels:", e);
  }
}

document.addEventListener("DOMContentLoaded", loadChannels);
