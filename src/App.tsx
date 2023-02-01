import {
  ReactNode,
  useEffect,
  useState,
  ButtonHTMLAttributes,
  FC,
} from "react";
import uaParser from "ua-parser-js";

const parser = new uaParser();
const { name: browserName, version: browserVersion } = parser.getBrowser();

function App() {
  const [hidCompatible] = useState("hid" in navigator);

  const requestDevices = async () => {
    // const device = await navigator.hid.requestDevice({ filters: [] });
    // console.log(device);
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-stone-800 text-white">
      <div className="flex h-full max-h-[400px] w-full max-w-[300px] flex-col gap-4 rounded-xl  bg-stone-700 p-4">
        <span className="text-center text-sm">
          {browserName} {browserVersion}
        </span>
        <Row>{hidCompatible && <Checkmark />} HID compatible</Row>
        <Button onClick={requestDevices}>Request Devices</Button>
      </div>
    </div>
  );
}

export default App;

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      className="rounded-full bg-stone-800 p-3 font-bold transition-all hover:bg-stone-900"
      {...rest}
    >
      {children}
    </button>
  );
};

const Row = ({ children }: { children: ReactNode }) => (
  <span
    className="grid items-center gap-2 text-lg font-bold"
    style={{
      gridTemplateColumns: "24px 1fr",
    }}
  >
    {children}
  </span>
);

const Checkmark = () => (
  <span className="material-symbols-rounded text-green-500">check_circle</span>
);
