const ADMIN_PASSWORD = "lordpremo";

let channels = [];

async function loadChannelsAdmin() {
  try {
    const res = await fetch("channels.json");
    channels = await res.json();
  } catch {
    channels = [];
  }
  renderAdminList();
}

function adminLogin() {
  const input = document.getElementById("adminPassword").value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    loadChannelsAdmin();
  } else {
    alert("Wrong password");
  }
}

function renderAdminList() {
  const box = document.getElementById("adminChannelsList");
  box.innerHTML = "";
  channels.forEach((ch) => {
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <span>${ch.name} (${ch.category})</span>
      <button onclick="editChannel('${ch.id}')">Edit</button>
      <button onclick="deleteChannel('${ch.id}')">Delete</button>
    `;
    box.appendChild(row);
  });
}

function saveChannel() {
  const idInput = document.getElementById("chId").value.trim();
  const name = document.getElementById("chName").value.trim();
  const category = document.getElementById("chCategory").value.trim();
  const thumb = document.getElementById("chThumb").value.trim();
  const stream = document.getElementById("chStream").value.trim();

  if (!name || !category || !thumb || !stream) {
    alert("Fill all fields");
    return;
  }

  if (idInput) {
    const idx = channels.findIndex((c) => c.id === idInput);
    if (idx !== -1) {
      channels[idx] = {
        id: idInput,
        name,
        category,
        thumbnail: thumb,
        stream_url: stream
      };
    }
  } else {
    const newId = name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    channels.push({
      id: newId,
      name,
      category,
      thumbnail: thumb,
      stream_url: stream
    });
  }

  clearForm();
  renderAdminList();
  alert("Channel saved in memory. Use 'Download channels.json' to export.");
}

function editChannel(id) {
  const ch = channels.find((c) => c.id === id);
  if (!ch) return;
  document.getElementById("chId").value = ch.id;
  document.getElementById("chName").value = ch.name;
  document.getElementById("chCategory").value = ch.category;
  document.getElementById("chThumb").value = ch.thumbnail;
  document.getElementById("chStream").value = ch.stream_url;
}

function deleteChannel(id) {
  if (!confirm("Delete this channel?")) return;
  channels = channels.filter((c) => c.id !== id);
  renderAdminList();
}

function clearForm() {
  document.getElementById("chId").value = "";
  document.getElementById("chName").value = "";
  document.getElementById("chCategory").value = "";
  document.getElementById("chThumb").value = "";
  document.getElementById("chStream").value = "";
}

function downloadChannels() {
  const blob = new Blob([JSON.stringify(channels, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "channels.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  // waits for login
});
