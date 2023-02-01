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
  const [devicesHasChanged, setDevicesHasChanged] = useState(0);
  const [devices, setDevices] = useState<HIDDevice[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.hid.getDevices();
      setDevices(devices);
    };

    getDevices();
  }, [devicesHasChanged]);

  const requestDevices = async () => {
    await navigator.hid.requestDevice({ filters: [] });
    setDevicesHasChanged((prev) => prev + 1);
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-stone-900 text-white">
      <div className="flex h-full max-h-[500px] w-full max-w-[400px] flex-col gap-4 rounded-lg  bg-stone-700 p-4">
        <span className="text-center font-['Source_Code_Pro'] text-sm font-bold">
          {browserName} {browserVersion}
        </span>
        <Row>{hidCompatible && <Checkmark />} HID compatible</Row>
        <Button onClick={requestDevices}>Connect Device</Button>
        <div className="flex flex-col gap-1">
          <span className="font-['Source_Code_Pro'] text-sm font-bold">
            DEVICES
          </span>
          <div className="min-h-[48px] rounded-lg bg-stone-800 p-3">
            {devices.map((device, i) => (
              <div key={`${i}-${device.productId}`}>{device.productName}</div>
            ))}
          </div>
        </div>
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
