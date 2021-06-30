import {
  useState,
  useRerender,
  useTimeline,
  useEffect,
  useContext
} from "./hooks";
import { apiForImageColor } from "./images";
import { OrgNameContext } from "./App";

export const images = [
  "https://cdn10.bigcommerce.com/s-1lmbfjdoxi/templates/__custom/img/Heavy-Duty-Steel-Wall-Mounted-6-Coat-Hooks-Short-Rail-152-400.png?t=1597003361",
  "https://www.seekpng.com/png/full/134-1343096_fire-tiger-fish-hook.png",
  "https://i.pinimg.com/originals/6a/18/f6/6a18f6dbe9aae1ab3d270ce16507a4d6.png"
];

function useColorForImage(imageUrl: string) {
  const [color, setColor] = useState("white");
  useEffect(() => {
    async function getColorFromImage() {
      setColor(await apiForImageColor(imageUrl));
    }
    getColorFromImage();
  }, [imageUrl]);
  return color;
}

export function Nudge() {
  const orgName = useContext(OrgNameContext);
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = images[imageIndex];
  const color = useColorForImage(imageUrl);
  return (
    <div className="nudge-wrapper" style={{ backgroundColor: color }}>
      <div id="nudge-container">
        <div id="nudge" className="nudge">
          <div className="nudge-image">
            <img src={imageUrl} alt="img" />
            <button
              onClick={() => {
                setImageIndex((imageIndex + 1) % images.length);
              }}
            >
              Next ({imageIndex + 1} of {images.length})
            </button>
          </div>
          <div className="nudge-content">
            <h2>Learn to love hooks</h2>
            <p className="nudge-text">
              Research shows that understanding React hooks makes you a happier
              humun at {orgName}.
            </p>
          </div>
        </div>
      </div>
      {useTimeline("Nudge")}
    </div>
  );
}
