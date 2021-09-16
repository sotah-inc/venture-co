/* eslint-disable no-console */
import fs from "fs";
import process from "process";

import { Command } from "commander";

const program = new Command();
program.option("-t, --target <target>", "Target dir for modification");
program.parse(process.argv);

const { target } = program.opts<{ target: string }>();

if (!fs.existsSync(target)) {
  console.error("target does not exist", { target });

  process.exit(1);
}

function resolveEpisodeName(
  seasonNumber: string,
  episodeNumber: number,
  episodeFilename: string,
): string | null {
  const dashPrefix = episodeFilename
    .split("-")
    .map(v => v.trim())
    .shift();
  const spacePrefix = episodeFilename.split(" ").slice(0, 2).join(" ");
  const incorrectSeasonCode = `S${seasonNumber.padStart(2, "0")}E${(episodeNumber)
    .toString()
    .padStart(2, "0")}`;

  if (episodeFilename.includes(incorrectSeasonCode)) {
    return episodeFilename.split("-").map(v => v.trim()).pop() ?? null;
  }

  if (dashPrefix === "Dragonball Z Remastered") {
    return episodeFilename
      .split("-")
      .map(v => v.trim())
      .slice(2)
      .join("");
  }

  return null;
}

const title = target.split("/").pop();

for (const seasonFolderName of fs.readdirSync(target)) {
  const seasonFolderPath = `${target}/${seasonFolderName}`;
  if (!fs.statSync(seasonFolderPath).isDirectory()) {
    continue;
  }

  const seasonNumber = seasonFolderName.split(" ").pop();
  if (seasonNumber === undefined) {
    continue;
  }

  const episodeFilenames = fs.readdirSync(seasonFolderPath);
  for (let i = 0; i < episodeFilenames.length; i += 1) {
    const episodeFilename = episodeFilenames[i];

    const src = `${seasonFolderPath}/${episodeFilename}`;
    const fileExtension = episodeFilename.split(".").pop();
    if (fileExtension === "txt") {
      continue;
    }

    const episodeName = resolveEpisodeName(seasonNumber, i, episodeFilename);
    if (episodeName === null) {
      continue;
    }

    const seasonCode = `S${seasonNumber.padStart(2, "0")}E${(i + 1).toString().padStart(2, "0")}`;
    if (episodeName.includes(seasonCode)) {
      continue;
    }

    const nextEpisodeFilename = [title, seasonCode, episodeName].join(" - ");

    const dst = `${seasonFolderPath}/${nextEpisodeFilename}`;
    fs.renameSync(src, dst);
  }
}
