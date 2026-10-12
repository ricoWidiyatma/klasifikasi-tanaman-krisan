import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Camera,
  Clock,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

import { getPredictions } from "../services/predictionService";
import { API_BASE_URL } from "../services/api";
import type { Prediction } from "../types/prediction";

const Dashboard = () => {
  const [latestPrediction, setLatestPrediction] =
    useState<Prediction | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";

    const filename = imagePath.split(/[/\\]/).pop();

    if (!filename) return "";

    return `${API_BASE_URL}/uploads/${filename}`;
  };

  // =====================================================
  // GET DATA MONITORING
  // =====================================================

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPredictions();

        // API sudah mengurutkan data dari yang terbaru
        // sehingga data[0] adalah hasil monitoring terbaru
        if (data.length > 0) {
          setLatestPrediction(data[0]);
        } else {
          setLatestPrediction(null);
        }
      } catch (err) {
        console.error(
          "Gagal mengambil data monitoring:",
          err
        );

        setError("Gagal mengambil data monitoring");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  // =====================================================
  // STATUS DETEKSI
  // =====================================================

  const isHama =
    latestPrediction?.prediction === "hama";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <Sidebar />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Header />

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          <div className="mx-auto max-w-7xl">

            {/* ================================================= */}
            {/* SYSTEM STATUS */}
            {/* ================================================= */}

            <div
              className={`mb-6 rounded-2xl border p-4 ${error
                  ? "border-red-100 bg-red-50"
                  : "border-green-100 bg-green-50"
                }`}
            >
              <div className="flex items-center gap-3">

                {/* Status Icon */}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${error
                      ? "bg-red-100"
                      : "bg-green-100"
                    }`}
                >
                  {error ? (
                    <AlertTriangle
                      className="h-5 w-5 text-red-600"
                    />
                  ) : (
                    <ShieldCheck
                      className="h-5 w-5 text-green-600"
                    />
                  )}
                </div>

                {/* Status Text */}

                <div>

                  <p
                    className={`text-sm font-semibold ${error
                        ? "text-red-800"
                        : "text-green-800"
                      }`}
                  >
                    {error
                      ? "Koneksi API bermasalah"
                      : "Sistem berjalan normal"}
                  </p>

                  <p
                    className={`text-xs ${error
                        ? "text-red-600"
                        : "text-green-600"
                      }`}
                  >
                    {error
                      ? error
                      : "ESP32 terhubung dan siap melakukan monitoring"}
                  </p>

                </div>

              </div>
            </div>

            {/* ================================================= */}
            {/* MONITORING TERBARU */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

              {/* ================================================= */}
              {/* CARD HEADER */}
              {/* ================================================= */}

              <div className="mb-6">

                <h3 className="text-lg font-bold text-gray-900">
                  Monitoring Terbaru
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Hasil capture terakhir dari kamera ESP32
                </p>

              </div>

              {/* ================================================= */}
              {/* IMAGE + RESULT */}
              {/* ================================================= */}

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                <div className="overflow-hidden rounded-2xl bg-gray-100">

                  {/* Loading */}

                  {loading ? (

                    <div className="flex aspect-video items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />

                        <p className="mt-3 text-sm text-gray-400">
                          Memuat gambar...
                        </p>

                      </div>

                    </div>

                  ) : latestPrediction ? (

                    /* Image */

                    <img
                      src={getImageUrl(
                        latestPrediction.image_path
                      )}
                      alt="Hasil capture ESP32"
                      className="aspect-video h-full w-full object-cover"
                    />

                  ) : (

                    /* Empty State */

                    <div className="flex aspect-video items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">

                          <Camera
                            className="h-8 w-8 text-gray-300"
                          />

                        </div>

                        <p className="mt-3 text-sm font-medium text-gray-400">
                          Belum ada hasil monitoring
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Foto dari ESP32 akan muncul di sini
                        </p>

                      </div>

                    </div>

                  )}

                </div>

                {/* ================================================= */}
                {/* RESULT */}
                {/* ================================================= */}

                <div className="flex flex-col justify-center">

                  <p className="mb-3 text-sm font-medium text-gray-500">
                    Hasil Deteksi
                  </p>

                  {latestPrediction ? (

                    <>

                      {/* ================================================= */}
                      {/* DETECTION RESULT */}
                      {/* ================================================= */}

                      <div className="flex items-center gap-3">

                        {/* Icon */}

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isHama
                              ? "bg-red-100"
                              : "bg-green-100"
                            }`}
                        >

                          {isHama ? (

                            <AlertTriangle
                              className="h-6 w-6 text-red-600"
                            />

                          ) : (

                            <ShieldCheck
                              className="h-6 w-6 text-green-600"
                            />

                          )}

                        </div>

                        {/* Text */}

                        <div>

                          <h4
                            className={`text-xl font-bold ${isHama
                                ? "text-red-600"
                                : "text-green-600"
                              }`}
                          >
                            {latestPrediction.prediction.toUpperCase()}
                          </h4>

                          <p className="text-sm text-gray-500">
                            {isHama
                              ? "Hama terdeteksi pada tanaman"
                              : "Tidak terdeteksi hama"}
                          </p>

                        </div>

                      </div>

                      {/* ================================================= */}
                      {/* CONFIDENCE */}
                      {/* ================================================= */}

                      <div className="mt-8">

                        <div className="mb-2 flex items-center justify-between">

                          <span className="text-sm text-gray-500">
                            Confidence
                          </span>

                          <span className="text-sm font-bold text-gray-900">
                            {latestPrediction.confidence.toFixed(2)}%
                          </span>

                        </div>

                        {/* Progress Bar */}

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                          <div
                            className={`h-full rounded-full ${isHama
                                ? "bg-red-500"
                                : "bg-green-500"
                              }`}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  latestPrediction.confidence,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* ================================================= */}
                      {/* DETECTION TIME */}
                      {/* ================================================= */}

                      <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">

                        <Clock size={16} />

                        <span>
                          {new Date(
                            latestPrediction.created_at
                          ).toLocaleString("id-ID")}
                        </span>

                      </div>

                    </>

                  ) : (

                    <p className="text-sm text-gray-400">
                      Belum ada data deteksi.
                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;