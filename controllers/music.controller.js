import musicModel from "../models/music.js";
import jwt from "jsonwebtoken";
import { uploadFile } from "../service/imageKit.js";
import albumModel from "../models/album.js";

export async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a music file",
      });
    }

    const result = await uploadFile(
      file.buffer.toString("base64"),
      file.originalname,
    );

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Music created successfully!",
      music: {
        id: music._id,
        title: music.title,
        uri: music.uri,
        artist: music.artist,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

export async function createAlbum(req, res) {
  try {
    const { title, musicIds } = req.body;

    const album = await albumModel.create({
      title,
      artist: req.user._id,
      musics: musicIds,
    });

    res.status(201).json({
      message: "Album created Successfully!",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        music: album.musics,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
}
