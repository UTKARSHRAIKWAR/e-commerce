
import winston from "winston";

console.log("LOGGER SERVICE:", process.env.SERVICE_NAME);

const isProduction  = process.env.NODE_ENV  === "production" ;
const service = process.env.SERVICE_NAME || "unknown-service";



const istTimestamp = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());


const logger = winston.createLogger({
    level: isProduction ? "info" : "debug",
    format:winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({format:istTimestamp}),
        winston.format.json()
    ),
    transports:[
        new winston.transports.File({
            filename: "logs/error.log",
            level:"error"
        }),
        new winston.transports.File({
            filename: "logs/combined.log",
        }),
    ]
})


if(!isProduction) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({format:istTimestamp}),
                winston.format.printf(
                    ({level , message, timestamp}) => 
                        `${timestamp} [${service}] ${level}: ${message}`,
                )
            )
        })
    )
}


export default logger