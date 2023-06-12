const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/albums", require("./control/AlbumAPI"));
app.use("/artists", require("./control/ArtistAPI"));
app.use("/songs", require("./control/MusicAPI"));
app.use("/install", require("./control/InstallAPI"));
app.use("/user", require("./control/UserAPI.js"));

app.listen(3000, () => {
  console.log("Listenning...");
});
