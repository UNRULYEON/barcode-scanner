import {
  ReactNode,
  useEffect,
  useState,
  ButtonHTMLAttributes,
  FC,
} from "react";
import uaParser from "ua-parser-js";

type Log = { type: "DEBUG" | "INFO" | "WARN" | "ERROR"; message: any[] };

const originalConsoleDebug = console.debug;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const logArr: Log[] = [];

console.debug = (...args) => {
  logArr.push({ type: "DEBUG", message: args });
  originalConsoleDebug(...args);
};

console.log = (...args) => {
  logArr.push({ type: "INFO", message: args });
  originalConsoleLog(...args);
};

console.warn = (...args) => {
  logArr.push({ type: "WARN", message: args });
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  logArr.push({ type: "ERROR", message: args });
  originalConsoleError(...args);
};

const parser = new uaParser();
const { name: browserName, version: browserVersion } = parser.getBrowser();

function App() {
  const [hidCompatible] = useState("hid" in navigator);
  const [devicesHasChanged, setDevicesHasChanged] = useState(0);
  const [devices, setDevices] = useState<HIDDevice[]>([]);

  const inputReport = (ev: HIDInputReportEvent) => {
    console.debug("input report", ev);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    console.debug("Got if HID is available", hidCompatible);
  }, []);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.hid.getDevices();
      setDevices(devices);

      await Promise.all(
        devices.map(async (device) => {
          await device.open();
          console.debug(`device opened - ${device.productName}`);

          device.addEventListener("inputreport", inputReport);
        })
      );
    };

    getDevices();
  }, [devicesHasChanged]);

  const requestDevices = async () => {
    if (!hidCompatible) return;

    const [device] = await navigator.hid.requestDevice({ filters: [] });
    console.debug("device requested", device);

    setDevicesHasChanged((prev) => prev + 1);
  };

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-3 bg-stone-900 text-white">
      <div className="row-start-1 row-end-3 flex h-full max-h-[500px] w-full max-w-[400px] flex-col gap-4 self-center justify-self-center rounded-lg  bg-stone-700 p-4">
        <span className="text-center font-['Source_Code_Pro'] text-sm font-bold">
          {browserName} {browserVersion}
        </span>
        <Row>{hidCompatible && <Checkmark />} HID compatible</Row>
        <Button onClick={requestDevices} disabled={!hidCompatible}>
          Connect Device
        </Button>
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
      <div className="row-start-3 overflow-y-auto p-4 font-['Source_Code_Pro'] text-stone-300">
        {logArr.map((args, i) => (
          <div
            key={i}
            className="mb-2 grid items-center"
            style={{
              gridTemplateColumns: "65px 30px 1fr",
            }}
          >
            {args.type === "DEBUG" ? (
              <pre className="text-blue-600">[{args.type}]</pre>
            ) : args.type === "INFO" ? (
              <pre>[{args.type}]</pre>
            ) : args.type === "WARN" ? (
              <pre className="text-yellow-600">[{args.type}]</pre>
            ) : args.type === "ERROR" ? (
              <pre className="text-red-600">[{args.type}]</pre>
            ) : (
              <pre>[{args.type}]</pre>
            )}
            <pre className="justify-self-center">-</pre>
            <pre>{JSON.stringify(args.message[0], null, 2)}</pre>
            {args.message.length > 1 &&
              args.message.slice(1).map((m, i) => (
                <pre key={i} className="col-start-3">
                  {JSON.stringify(m, null, 2)}
                </pre>
              ))}
          </div>
        ))}
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
      className="rounded-full bg-stone-800 p-3 font-bold transition-all hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-400 disabled:text-stone-500"
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
