import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";

import type { Prediction } from "../types/prediction";

const Monitoring = () => {

    const [latestPrediction, setLatestPrediction] =
        useState<Prediction | null>(null);

    const [connected, setConnected] =
        useState(false);


    useEffect(() => {

        const wsUrl =
            API_BASE_URL.replace(/^http/, "ws") +
            "/ws/monitoring";

        const socket = new WebSocket(wsUrl);


        // =====================================================
        // CONNECTED
        // =====================================================

        socket.onopen = () => {

            console.log("WebSocket monitoring connected");

            setConnected(true);

            // Backend menggunakan receive_text(),
            // jadi kirim heartbeat sederhana.
            socket.send("monitoring-connected");
        };


        // =====================================================
        // DATA DARI FASTAPI
        // =====================================================

        socket.onmessage = (event) => {

            try {

                const data = JSON.parse(event.data);

                console.log(
                    "Monitoring realtime:",
                    data
                );

                setLatestPrediction(data);

            } catch (error) {

                console.error(
                    "Gagal membaca data WebSocket:",
                    error
                );

            }

        };


        // =====================================================
        // ERROR
        // =====================================================

        socket.onerror = (error) => {

            console.error(
                "WebSocket error:",
                error
            );

            setConnected(false);

        };


        // =====================================================
        // DISCONNECTED
        // =====================================================

        socket.onclose = () => {

            console.log(
                "WebSocket monitoring disconnected"
            );

            setConnected(false);

        };


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {

            socket.close();

        };

    }, []);


    return (
        <div>

            <h1>Monitoring</h1>

            <p>
                Status:

                {connected
                    ? " 🟢 Realtime Connected"
                    : " 🔴 Disconnected"
                }
            </p>


            {latestPrediction && (

                <div>

                    <img
                        src={
                            latestPrediction.image_url
                                ? `${API_BASE_URL}${latestPrediction.image_url}`
                                : `${API_BASE_URL}/uploads/${latestPrediction.image_path
                                    .split(/[/\\]/)
                                    .pop()
                                }`
                        }
                        alt="Monitoring"
                        width={500}
                    />

                    <h2>
                        {latestPrediction.prediction.toUpperCase()}
                    </h2>

                    <p>
                        Confidence:
                        {" "}
                        {latestPrediction.confidence.toFixed(2)}%
                    </p>

                    <p>
                        {new Date(
                            latestPrediction.created_at
                        ).toLocaleString("id-ID")}
                    </p>

                </div>

            )}

        </div>
    );
};

export default Monitoring;