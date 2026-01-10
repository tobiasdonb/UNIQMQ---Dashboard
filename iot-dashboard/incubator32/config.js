// config.js

const mqttConfig = {
    // Konfigurasi Broker
    host: "test.mosquitto.org",
    port: 8080,
    username: "",
    password: "",
    useSSL: false,

    // Konfigurasi Topik
    topics: {
        // Topic untuk Subscribe (Menerima Data JSON)
        subscribe: {
            data: "incubator32/data" // Topik tunggal untuk data JSON (temp & humi)
        },

        // Topic untuk Publish
        publish: {
            control: "incubator32/con",
        }
    }
};

// --- PRESET DATA HEWAN ---
const batchPresets = {
    chicken: { temp: 37.5, hum: 55, infoTemp: "Optimal: 37.2°C - 37.8°C", infoHum: "Optimal: 50% - 60%" },
    duck: { temp: 37.5, hum: 60, infoTemp: "Optimal: 37.2°C - 37.8°C", infoHum: "Optimal: 55% - 65%" },
    quail: { temp: 37.7, hum: 50, infoTemp: "Optimal: 37.5°C - 38.0°C", infoHum: "Optimal: 45% - 55%" }
};