import { images } from "./Nudge";

const colors = ["gray", "darkgreen", "magenta"];

export async function apiForImageColor(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = images.indexOf(imageSrc);
      resolve(colors[idx]);
    }, 1000);
  });
}
