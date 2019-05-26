import * as net from "net";

// misc
const netConnect = (port: number, host: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const client = net.connect(
            port,
            host,
            resolve,
        );
        client.on("error", reject);
    });
};

const main = async () => {
    // validating that env vars are available
    const envVarNames = ["NATS_HOST", "NATS_PORT"];
    const envVarPairs = envVarNames.map(v => [v, process.env[v] as string]);
    const missingEnvVarPairs = envVarPairs.filter(([, v]) => typeof v === "undefined" || v.length === 0);
    if (missingEnvVarPairs.length > 0) {
        throw new Error(missingEnvVarPairs.map(([key]) => `${key} was missing`).join("\n"));
    }

    const envVars = envVarPairs.reduce((out: { [key: string]: string }, value) => {
        out[value[0]] = value[1];
        return out;
    }, {});

    const natsHost = envVars["NATS_HOST"];
    const natsPort = Number(envVars["NATS_PORT"]);
    try {
        await netConnect(natsPort, natsHost);
    } catch (err) {
        switch (err["code"]) {
            case "ENOTFOUND":
                throw new Error(`Host ${natsHost} could not be found`);
            case "EHOSTUNREACH":
                throw new Error(`Host ${natsHost} could not be reached`);
            case "ECONNREFUSED":
                throw new Error(`Host ${natsHost} was not accessible at ${natsPort}`);
            default:
                throw err;
        }
    }
};

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err.message);
        process.exit(1);
    });
